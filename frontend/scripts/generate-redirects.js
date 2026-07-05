#!/usr/bin/env node
/**
 * Generate 301 redirects in serve.json for numeric product IDs → /rent/:slug/:city
 */
const fs = require('fs');
const path = require('path');
const { fetchAllProducts, productPath } = require('./seo-utils');

async function main() {
  const products = await fetchAllProducts();
  const productRedirects = products
    .filter((p) => p.id && p.slug && productPath(p)?.startsWith('/rent/'))
    .map((p) => ({
      source: `/products/${p.id}`,
      destination: productPath(p),
      type: 301,
    }));

  const targets = [
    path.join(__dirname, '..', 'build', 'serve.json'),
  ];

  for (const file of targets) {
    if (!fs.existsSync(file)) continue;
    const config = JSON.parse(fs.readFileSync(file, 'utf8'));
    const existing = (config.redirects || []).filter((r) => !/^\/products\/\d+$/.test(r.source));
    const seen = new Set(existing.map((r) => r.source));
    const htmlStripped = [];
    for (const rule of existing) {
      if (rule.source.endsWith('.html')) {
        const bare = rule.source.slice(0, -5);
        if (!seen.has(bare)) {
          htmlStripped.push({ source: bare, destination: rule.destination, type: rule.type || 301 });
          seen.add(bare);
        }
      }
    }
    config.redirects = [...existing, ...htmlStripped, ...productRedirects];
    config.cleanUrls = config.cleanUrls ?? true;
    config.renderSingle = config.renderSingle ?? true;
    fs.writeFileSync(file, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
    console.log(
      `Redirects: ${productRedirects.length} product ID, ${htmlStripped.length} html-stripped legacy rules in ${file}`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
