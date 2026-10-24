#!/usr/bin/env node
/**
 * Production static server.
 *
 * Priority:
 *  0) Legacy site redirects (/index.html?city=x, /Bangalore/index.html …) in one 301 hop
 *  1) Redirects (serve.json) — old /rent/{slug}/{city} → /rent/{city}/{slug}
 *  2) Prerendered HTML under build/<path>/index.html (correct title/canonical for SEO)
 *  3) SPA fallback to index.html for known app routes missing a prerender file.
 *     /rent/{city}/{slug} is only served when the API confirms the product exists
 *     (new products added after the last deploy still open via React).
 *  4) Real HTTP 404 for everything else (no soft-404 homepage redirect)
 */
const http = require('http');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const handler = require('serve-handler');
const errorTemplate = require('serve-handler/src/error');

const BUILD_DIR = path.join(__dirname, 'build');
const PORT = Number(process.env.PORT) || 3000;
const API_URL = (process.env.REACT_APP_API_URL || process.env.API_URL || 'https://pakkarent-api.onrender.com').replace(/\/$/, '');
const lstat = promisify(fs.lstat);

const CITIES = ['chennai', 'bangalore', 'hyderabad'];
const RENT_CITY_SEGMENTS = new Set([...CITIES, 'india']);

/** Paths that should load the React app when no prerendered file exists. */
const SPA_FALLBACK = [
  /^\/products(\/|$)/,
  /^\/blog(\/|$)/,
  /^\/festive(\/|$)/,
  /^\/(chennai|bangalore|hyderabad)\/?$/,
  /^\/(about|how-it-works|contact|faq|delivery-info|terms|privacy)(\/|$)/,
];

/**
 * Old static-site URLs that still get search traffic, e.g.
 *   /index.html?city=chennai      → /chennai
 *   /Bangalore/index.html?city=…  → /bangalore
 *   /Hyderabad, /Chennai/         → /hyderabad, /chennai
 */
function legacyRedirectTarget(req) {
  let url;
  try {
    url = new URL(req.url || '/', 'http://localhost');
  } catch {
    return null;
  }
  const { pathname, searchParams } = url;
  const queryCity = String(searchParams.get('city') || '').toLowerCase();

  if (/^\/index(\.html)?$/i.test(pathname) || (pathname === '/' && searchParams.has('city'))) {
    return CITIES.includes(queryCity) ? `/${queryCity}` : '/';
  }

  const m = pathname.match(/^\/(chennai|bangalore|hyderabad)(\/index(\.html)?)?\/?$/i);
  if (m) {
    const target = `/${m[1].toLowerCase()}`;
    if (pathname !== target || url.search) return target;
  }
  return null;
}

/** Cache of API existence checks for /rent URLs with no prerendered file. */
const productLookupCache = new Map();
const LOOKUP_TTL_MS = 10 * 60 * 1000;

/** Returns true / false, or null when the API could not answer (fail open). */
async function productExists(slug, citySegment) {
  const key = `${citySegment}/${slug}`;
  const hit = productLookupCache.get(key);
  if (hit && Date.now() - hit.at < LOOKUP_TTL_MS) return hit.exists;

  try {
    const res = await fetch(
      `${API_URL}/api/products/slug/${encodeURIComponent(slug)}/${encodeURIComponent(citySegment)}`,
      { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(8000) }
    );
    if (res.status === 404 || res.status === 400) {
      productLookupCache.set(key, { exists: false, at: Date.now() });
      return false;
    }
    if (!res.ok) return null;
    productLookupCache.set(key, { exists: true, at: Date.now() });
    return true;
  } catch (err) {
    console.error(`Product lookup failed for ${key}:`, err.message);
    return null;
  }
}

/**
 * Decide what to do with /rent/{a}/{b} when no prerendered page exists:
 *  { spa: true } | { redirect: '/rent/city/slug' } | { notFound: true }
 */
async function resolveRentPath(pathname) {
  const m = pathname.match(/^\/rent\/([^/]+)\/([^/]+)\/?$/);
  if (!m) return { notFound: true };
  let a;
  let b;
  try {
    a = decodeURIComponent(m[1]).toLowerCase();
    b = decodeURIComponent(m[2]).toLowerCase();
  } catch {
    return { notFound: true };
  }

  if (RENT_CITY_SEGMENTS.has(a)) {
    const exists = await productExists(b, a);
    if (exists === false) return { notFound: true };
    return { spa: true };
  }

  // Old /rent/{slug}/{city} not covered by generated serve.json redirects.
  if (RENT_CITY_SEGMENTS.has(b)) {
    const exists = await productExists(a, b);
    if (exists === false) return { notFound: true };
    return { redirect: `/rent/${b}/${a}` };
  }

  return { notFound: true };
}

function sendRedirect(res, location) {
  res.statusCode = 301;
  res.setHeader('Location', location);
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.end();
}

function loadConfig() {
  const configPath = path.join(BUILD_DIR, 'serve.json');
  const config = fs.existsSync(configPath)
    ? JSON.parse(fs.readFileSync(configPath, 'utf8'))
    : {};
  config.public = BUILD_DIR;
  return config;
}

function requestPathname(req) {
  try {
    return new URL(req.url || '/', 'http://localhost').pathname;
  } catch {
    return '/';
  }
}

function shouldSpaFallback(pathname) {
  return SPA_FALLBACK.some((re) => re.test(pathname));
}

async function serveIndexHtml(response, handlers, current) {
  const indexPath = path.join(current, 'index.html');
  const stream = await handlers.createReadStream(indexPath);
  response.statusCode = 200;
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  stream.pipe(response);
}

async function defaultSendError(absolutePath, response, acceptsJSON, current, handlers, config, spec) {
  const { err: original, message, code, statusCode } = spec;

  if (original && process.env.NODE_ENV !== 'test') {
    console.error(original);
  }

  response.statusCode = statusCode;

  if (acceptsJSON) {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.end(JSON.stringify({ error: { code, message } }));
    return;
  }

  let stats = null;
  const errorPage = path.join(current, `${statusCode}.html`);

  try {
    stats = await handlers.lstat(errorPage);
  } catch (err) {
    if (err.code !== 'ENOENT') console.error(err);
  }

  if (stats) {
    const stream = await handlers.createReadStream(errorPage);
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.statusCode = statusCode;
    stream.pipe(response);
    return;
  }

  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.end(errorTemplate({ statusCode, message }));
}

const config = loadConfig();

/** Exact-path serve.json redirects, applied before cleanUrls strips ".html" (avoids a 2-hop chain). */
const exactRedirects = new Map(
  (config.redirects || [])
    .filter((r) => r.source && !/[*:(]/.test(r.source))
    .map((r) => [r.source, r.destination])
);

const server = http.createServer((request, response) => {
  const legacyTarget = legacyRedirectTarget(request)
    || exactRedirects.get(requestPathname(request));
  if (legacyTarget) {
    sendRedirect(response, legacyTarget);
    return;
  }

  handler(request, response, config, {
    async sendError(absolutePath, res, acceptsJSON, current, handlers, cfg, spec) {
      if (spec.statusCode === 404 && !acceptsJSON) {
        const pathname = requestPathname(request);
        if (/^\/rent\//.test(pathname)) {
          const outcome = await resolveRentPath(pathname);
          if (outcome.redirect) {
            sendRedirect(res, outcome.redirect);
            return;
          }
          if (outcome.spa) {
            try {
              await serveIndexHtml(res, handlers, current);
              return;
            } catch (err) {
              console.error('SPA fallback failed:', err.message);
            }
          }
        } else if (shouldSpaFallback(pathname)) {
          try {
            await serveIndexHtml(res, handlers, current);
            return;
          } catch (err) {
            console.error('SPA fallback failed:', err.message);
          }
        }
      }
      return defaultSendError(absolutePath, res, acceptsJSON, current, handlers, cfg, spec);
    },
  }).catch((err) => {
    console.error(err);
    if (!response.headersSent) {
      response.statusCode = 500;
      response.end('Internal Server Error');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Accepting connections at http://localhost:${PORT}`);
});
