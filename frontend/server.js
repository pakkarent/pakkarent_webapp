#!/usr/bin/env node
/**
 * Production static server.
 *
 * Priority:
 *  1) Redirects (serve.json) — old /rent/{slug}/{city} → /rent/{city}/{slug}
 *  2) Prerendered HTML under build/<path>/index.html (correct title/canonical for SEO)
 *  3) SPA fallback to index.html for known app routes missing a prerender file
 *     (new products added after the last deploy still open via React)
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
const lstat = promisify(fs.lstat);

/** Paths that should load the React app when no prerendered file exists. */
const SPA_FALLBACK = [
  /^\/rent(\/|$)/,
  /^\/products(\/|$)/,
  /^\/blog(\/|$)/,
  /^\/festive(\/|$)/,
  /^\/(chennai|bangalore|hyderabad)(\/|$)/,
  /^\/(about|how-it-works|contact|faq|delivery-info|terms|privacy)(\/|$)/,
  /^\/store(\/|$)/,
];

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

const server = http.createServer((request, response) => {
  handler(request, response, config, {
    async sendError(absolutePath, res, acceptsJSON, current, handlers, cfg, spec) {
      if (spec.statusCode === 404 && !acceptsJSON) {
        const pathname = requestPathname(request);
        if (shouldSpaFallback(pathname)) {
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
