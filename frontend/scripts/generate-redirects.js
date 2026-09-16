#!/usr/bin/env node
/**
 * Generate 301 redirects in serve.json:
 *  - /products/:id → /rent/{city}/{slug}
 *  - /rent/{slug}/{city} → /rent/{city}/{slug}  (URL migration)
 *  - bare-path copies of legacy .html rules
 */
const fs = require('fs');
const path = require('path');
const { fetchAllProducts, productPath, legacySlugCityProductPath } = require('./seo-utils');

const CITY_SEGMENTS = new Set(['chennai', 'bangalore', 'hyderabad', 'india']);

function isOldRentPath(source) {
  const m = String(source || '').match(/^\/rent\/([^/]+)\/([^/]+)\/?$/);
  if (!m) return false;
  const [, a, b] = m;
  return !CITY_SEGMENTS.has(a) && CITY_SEGMENTS.has(b);
}

function rewriteRentDestination(dest) {
  const m = String(dest || '').match(/^(\/rent\/)([^/]+)\/([^/]+)\/?$/);
  if (!m) return dest;
  const [, prefix, a, b] = m;
  if (!CITY_SEGMENTS.has(a) && CITY_SEGMENTS.has(b)) {
    return `${prefix}${b}/${a}`;
  }
  return dest;
}

async function main() {
  const products = await fetchAllProducts().catch((err) => {
    console.warn(`Redirects: product fetch failed (${err.message}) — keeping existing rules`);
    return [];
  });

  const productIdRedirects = products
    .filter((p) => p.id && p.slug && productPath(p)?.startsWith('/rent/'))
    .map((p) => ({
      source: `/products/${p.id}`,
      destination: productPath(p),
      type: 301,
    }));

  const slugCityRedirects = products
    .filter((p) => p.slug && legacySlugCityProductPath(p) && productPath(p))
    .map((p) => ({
      source: legacySlugCityProductPath(p),
      destination: productPath(p),
      type: 301,
    }))
    .filter((r) => r.source !== r.destination);

  const file = path.join(__dirname, '..', 'build', 'serve.json');
  if (!fs.existsSync(file)) {
    console.warn('Redirects: build/serve.json missing — skip');
    return;
  }

  const config = JSON.parse(fs.readFileSync(file, 'utf8'));

  // Keep hand-written rules; drop previously generated id / old-rent rules.
  const base = (config.redirects || [])
    .filter((r) => !/^\/products\/\d+$/.test(r.source))
    .filter((r) => !isOldRentPath(r.source))
    .map((r) => ({ ...r, destination: rewriteRentDestination(r.destination) }));

  const seen = new Set(base.map((r) => r.source));
  const htmlStripped = [];
  for (const rule of base) {
    if (!rule.source.endsWith('.html')) continue;
    const bare = rule.source.slice(0, -5);
    if (seen.has(bare)) continue;
    htmlStripped.push({
      source: bare,
      destination: rewriteRentDestination(rule.destination),
      type: rule.type || 301,
    });
    seen.add(bare);
  }

  const generated = [...slugCityRedirects, ...productIdRedirects].filter((r) => {
    if (seen.has(r.source)) return false;
    seen.add(r.source);
    return true;
  });

  config.redirects = [...base, ...htmlStripped, ...generated];
  config.cleanUrls = config.cleanUrls ?? true;
  config.renderSingle = config.renderSingle ?? true;
  fs.writeFileSync(file, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
  console.log(
    `Redirects: ${slugCityRedirects.length} old→new rent, ${productIdRedirects.length} product ID, ${htmlStripped.length} html-stripped in ${file}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
