#!/usr/bin/env node
/**
 * Inject route-specific meta tags into static index.html copies for crawlers.
 * Writes build/<route>/index.html so `serve -s` serves prerendered HTML.
 */
const fs = require('fs');
const path = require('path');
const {
  SITE_URL,
  fetchAllProducts,
  collectPrerenderRoutes,
  escapeAttr,
  escapeHtml,
} = require('./seo-utils');

function injectPageMeta(template, { title, description, canonical, body, jsonLd }) {
  let html = template;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${escapeAttr(description)}"`
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*"/,
    `<link rel="canonical" href="${escapeAttr(canonical)}"`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${escapeAttr(title)}"`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${escapeAttr(description)}"`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"/,
    `<meta property="og:url" content="${escapeAttr(canonical)}"`
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${escapeAttr(title)}"`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${escapeAttr(description)}"`
  );

  const ldBlock = jsonLd
    ? `\n  <script type="application/ld+json" id="prerender-ld">${JSON.stringify(jsonLd)}</script>`
    : '';

  html = html.replace('</head>', `${ldBlock}\n</head>`);

  html = html.replace(
    '<noscript>',
    `<noscript><main id="prerender-content" style="max-width:720px;margin:2rem auto;padding:0 1rem;font-family:sans-serif">${body}</main>`
  );

  return html;
}

function writeRouteHtml(buildDir, routePath, html) {
  const normalized = routePath.replace(/\/$/, '') || '/';
  const file = normalized === '/'
    ? path.join(buildDir, 'index.html')
    : path.join(buildDir, normalized.slice(1), 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html, 'utf8');
  return file;
}

async function main() {
  const buildDir = path.join(__dirname, '..', 'build');
  const templatePath = path.join(buildDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('Prerender: build/index.html not found — run npm run build first');
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, 'utf8');
  const products = await fetchAllProducts().catch((err) => {
    console.warn(`Prerender: product fetch failed (${err.message})`);
    return [];
  });

  const routes = collectPrerenderRoutes(products);
  let written = 0;

  for (const route of routes) {
    if (!route.path) continue;
    const canonical = `${SITE_URL}${route.path === '/' ? '/' : route.path}`;
    const html = injectPageMeta(template, {
      title: route.title,
      description: route.description,
      canonical,
      body: route.body || '',
      jsonLd: route.jsonLd,
    });
    writeRouteHtml(buildDir, route.path, html);
    written += 1;
  }

  console.log(`Prerender: wrote ${written} static HTML pages (${products.length} products)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
