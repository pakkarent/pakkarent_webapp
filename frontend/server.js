#!/usr/bin/env node
/**
 * Production static server with global 404 → homepage redirect.
 * Uses serve-handler + build/serve.json (prerender-safe; no -s catch-all rewrite).
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

function loadConfig() {
  const configPath = path.join(BUILD_DIR, 'serve.json');
  const config = fs.existsSync(configPath)
    ? JSON.parse(fs.readFileSync(configPath, 'utf8'))
    : {};
  config.public = BUILD_DIR;
  return config;
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
    stream.pipe(response);
    return;
  }

  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.end(errorTemplate({ statusCode, message }));
}

const config = loadConfig();

const server = http.createServer((request, response) => {
  handler(request, response, config, {
    sendError(absolutePath, res, acceptsJSON, current, handlers, cfg, spec) {
      if (spec.statusCode === 404 && !acceptsJSON) {
        res.writeHead(301, { Location: '/' });
        res.end();
        return;
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
