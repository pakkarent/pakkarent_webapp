#!/usr/bin/env node
/**
 * Production static server.
 *
 * Priority:
 *  0) Legacy site redirects (/index.html?city=x, /Bangalore/index.html,
 *     /Bangalore/products/baby/stroller.html …) in one 301 hop
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
const { legacyPathTarget, GONE } = require('./legacy-urls');

const BUILD_DIR = path.join(__dirname, 'build');
const PORT = Number(process.env.PORT) || 3000;
const API_URL = (process.env.REACT_APP_API_URL || process.env.API_URL || 'https://pakkarent-api.onrender.com').replace(/\/$/, '');
const lstat = promisify(fs.lstat);

const CITIES = ['chennai', 'bangalore', 'hyderabad'];

/** Event subcategory pages — keep in sync with SUBCATEGORY_SLUGS in scripts/seo-utils.js. */
const SUBCATEGORY_SLUGS = { 10: 'cradle', 13: 'swings-oonjal', 11: 'chairs-furniture', 9: 'decor-urli', 12: 'props-stands' };
const RENT_CITY_SEGMENTS = new Set([...CITIES, 'india']);

/**
 * Products that were renamed or dropped, from Search Console's 404 / soft-404 reports.
 * Keyed by /rent/{city}/{old-slug}; the /rent/{old-slug}/{city} form is matched too.
 * Point each at the same product under its new slug, or at the closest listing.
 */
const RETIRED_PRODUCTS = {
  '/rent/chennai/armless-chairs': '/rent/chennai/armless-chairs-10-nos',
  '/rent/chennai/steel-tables-rental-6-feet': '/rent/chennai/function-tables-rental-6-feet',
  '/rent/chennai/baby-car-for-birthday': '/rent/chennai/kids-car-rental',
  '/rent/chennai/baby-jeep-rental': '/rent/chennai/kids-jeep-rental',
  '/rent/chennai/bouncy-castle-rental-for-event': '/rent/chennai/grand-bouncy-castle-rental-for-event',
  '/rent/chennai/teak-jhula-swing': '/products/event-rental/chennai/swings-oonjal',
  '/rent/chennai/crown-cradle-ring-decoration': '/products/event-rental/chennai/cradle',
  '/rent/hyderabad/compact-cradle': '/products/event-rental/hyderabad/cradle',
  '/rent/chennai/flower-wall-backdrop': '/products/backdrop-rental/chennai',
  '/rent/chennai/birthday-flowerwall-backdrop': '/products/backdrop-rental/chennai',
  '/rent/chennai/baby-blue-backdrop': '/products/backdrop-rental/chennai',
  '/rent/chennai/theme-decoration-setup': '/products/backdrop-rental/chennai',
  '/rent/chennai/moon-walk-game': '/products/games-rental/chennai',
};

/** Old top-level folders with no single equivalent page. */
const RETIRED_PATHS = {
  '/decoration': '/products/backdrop-rental/chennai',
};

function retiredTarget(pathname) {
  const clean = pathname.toLowerCase().replace(/\/+$/, '');
  if (RETIRED_PATHS[clean]) return RETIRED_PATHS[clean];
  const m = clean.match(/^\/rent\/([^/]+)\/([^/]+)$/);
  if (!m) return null;
  return RETIRED_PRODUCTS[clean] || RETIRED_PRODUCTS[`/rent/${m[2]}/${m[1]}`] || null;
}

/** Paths that should load the React app when no prerendered file exists. */
const SPA_FALLBACK = [
  // Category and subcategory pages are all prerendered; anything else under /products/
  // (e.g. /products/back) gets a real 404, except /products/{id} for products added
  // after the last deploy.
  /^\/products\/?$/,
  /^\/products\/\d+\/?$/,
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
  const rawCity = String(searchParams.get('city') || '').toLowerCase();
  const queryCity = rawCity === 'bengaluru' ? 'bangalore' : rawCity;

  if (/^\/index(\.html)?$/i.test(pathname) || (pathname === '/' && searchParams.has('city'))) {
    return CITIES.includes(queryCity) ? `/${queryCity}` : '/';
  }

  // /products/event-rental/bangalore?subcategory_id=10 → /products/event-rental/bangalore/cradle
  const sub = pathname.match(/^\/products\/event-rental\/(chennai|bangalore|hyderabad)\/?$/);
  const subId = Number(searchParams.get('subcategory_id'));
  if (sub && SUBCATEGORY_SLUGS[subId]) {
    // Only to a subcategory page the city actually stocks; otherwise the event listing.
    const stocked = !legacyCatalog || legacyCatalog[sub[1]]?.subcategories.includes(subId);
    return stocked
      ? `/products/event-rental/${sub[1]}/${SUBCATEGORY_SLUGS[subId]}`
      : `/products/event-rental/${sub[1]}`;
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

function loadLegacyCatalog() {
  try {
    return JSON.parse(fs.readFileSync(path.join(BUILD_DIR, 'legacy-catalog.json'), 'utf8'));
  } catch {
    return null;
  }
}

const legacyCatalog = loadLegacyCatalog();

/** Exact-path serve.json redirects, applied before cleanUrls strips ".html" (avoids a 2-hop chain). */
const exactRedirects = new Map(
  (config.redirects || [])
    .filter((r) => r.source && !/[*:(]/.test(r.source))
    .map((r) => [r.source, r.destination])
);

function sendGone(res) {
  // 410 tells Google the old page is gone for good; it drops out of the index faster
  // than a 404 and is never reported as a soft 404.
  res.statusCode = 410;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.end('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex">'
    + '<meta name="viewport" content="width=device-width,initial-scale=1"><title>No longer available | PakkaRent</title></head>'
    + '<body style="font-family:system-ui,sans-serif;max-width:640px;margin:3rem auto;padding:0 1rem">'
    + '<h1>This item is no longer available</h1><p>Browse what we rent today in '
    + '<a href="/chennai">Chennai</a>, <a href="/bangalore">Bangalore</a> or <a href="/hyderabad">Hyderabad</a>.</p></body></html>');
}

const server = http.createServer((request, response) => {
  const pathname = requestPathname(request);
  const legacyTarget = legacyRedirectTarget(request)
    || retiredTarget(pathname)
    || legacyPathTarget(pathname, legacyCatalog)
    || exactRedirects.get(pathname);
  if (legacyTarget === GONE) {
    sendGone(response);
    return;
  }
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
        } else if (/^\/products\/[^/]+\/(chennai|bangalore|hyderabad)\/[^/]+\/?$/.test(pathname)) {
          // Subcategory pages are all prerendered; one with no file is unknown or not
          // stocked in that city, so send it to the category page instead of a soft 404.
          sendRedirect(res, pathname.replace(/\/[^/]+\/?$/, ''));
          return;
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
