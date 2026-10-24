#!/usr/bin/env node
/**
 * Google Merchant Center product feed (RSS 2.0 + g: namespace).
 * Writes build/merchant-feed.xml → https://pakkarent.com/merchant-feed.xml
 *
 * IDs are unique per city ({city}-{slug}); the same slug exists in several
 * cities, and a slug-only ID would collapse them into one Merchant listing.
 */
const fs = require('fs');
const path = require('path');
const {
  SITE_URL,
  fetchAllProducts,
  cityUrlSegment,
  productPath,
  priceUnitWord,
  productImageUrls,
  productDetailItems,
} = require('./seo-utils');

const MAX_TITLE = 150;
const MAX_DESCRIPTION = 5000;

function xml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function price(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? `${n.toFixed(2)} INR` : null;
}

function cityLabel(product) {
  return product.city === 'all' ? 'India' : product.city;
}

function feedId(product) {
  return `${cityUrlSegment(product.city)}-${product.slug}`;
}

function feedDescription(product) {
  const city = cityLabel(product);
  const unit = priceUnitWord(product);
  const details = productDetailItems(product);
  const parts = [
    `Rent ${product.name} in ${city} from PakkaRent. Price is per ${unit}.`,
    details.length ? `${details.join('. ').replace(/\.\./g, '.')}.` : '',
    Number(product.security_deposit) > 0
      ? `Refundable security deposit: Rs. ${Number(product.security_deposit).toFixed(0)}.`
      : '',
    `Doorstep delivery and pickup across ${city}.`,
  ];
  return parts.filter(Boolean).join(' ').slice(0, MAX_DESCRIPTION);
}

function feedItem(product) {
  const images = productImageUrls(product).filter((src) => !src.endsWith('/og-image.png'));
  const regular = price(product.monthly_price);
  if (!product.slug || !regular || !images.length) return null;

  const sale = Number(product.offer_discount_percent) > 0 ? price(product.offer_monthly_price) : null;
  const productType = [product.category_name, product.subcategory_name].filter(Boolean).join(' > ');
  const inStock = (product.stock ?? 1) > 0;

  const fields = [
    ['g:id', feedId(product)],
    ['g:title', `${product.name} on Rent in ${cityLabel(product)}`.slice(0, MAX_TITLE)],
    ['g:description', feedDescription(product)],
    ['g:link', `${SITE_URL}${productPath(product)}`],
    ['g:image_link', images[0]],
    ...images.slice(1, 10).map((src) => ['g:additional_image_link', src]),
    ['g:availability', inStock ? 'in_stock' : 'out_of_stock'],
    ['g:price', regular],
    sale && sale !== regular ? ['g:sale_price', sale] : null,
    ['g:condition', 'used'],
    ['g:brand', 'PakkaRent'],
    ['g:identifier_exists', 'no'],
    productType ? ['g:product_type', productType] : null,
    ['g:custom_label_0', cityLabel(product)],
    ['g:custom_label_1', `per ${priceUnitWord(product)}`],
  ].filter(Boolean);

  return `    <item>\n${fields.map(([tag, value]) => `      <${tag}>${xml(value)}</${tag}>`).join('\n')}\n    </item>`;
}

async function main() {
  const products = await fetchAllProducts().catch((err) => {
    console.warn(`Merchant feed: product fetch failed (${err.message})`);
    return [];
  });

  const seen = new Set();
  const items = [];
  const skipped = [];
  for (const p of products) {
    const id = p.slug ? feedId(p) : null;
    if (id && seen.has(id)) continue;
    const item = feedItem(p);
    if (!item) {
      skipped.push(p.name);
      continue;
    }
    seen.add(id);
    items.push(item);
  }

  const out = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>PakkaRent Rentals</title>
    <link>${SITE_URL}/</link>
    <description>Rental products in Chennai, Bangalore and Hyderabad</description>
${items.join('\n')}
  </channel>
</rss>
`;

  const buildDir = path.join(__dirname, '..', 'build');
  if (!fs.existsSync(buildDir)) {
    console.error('Merchant feed: build/ not found — run npm run build first');
    process.exit(1);
  }
  fs.writeFileSync(path.join(buildDir, 'merchant-feed.xml'), out, 'utf8');
  console.log(`Merchant feed: ${items.length} items → build/merchant-feed.xml`);
  if (skipped.length) console.log(`  skipped (no slug, price or image): ${skipped.join(', ')}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
