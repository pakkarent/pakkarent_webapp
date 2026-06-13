#!/usr/bin/env node
/**
 * Re-link each product.images array to the correct Supabase Storage folder
 * (products/{category_slug}/{product_slug}/) from admin/scraped uploads.
 *
 * Usage: node scripts/relink-product-images-from-storage.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const pool = require('../src/models/db');
const { BUCKET, getPublicUrl } = require('../src/utils/storage');
const { getSupabase } = require('../src/utils/supabase');

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

async function listAllFiles(prefix = '') {
  const sb = getSupabase();
  const out = [];
  const { data, error } = await sb.storage.from(BUCKET).list(prefix, { limit: 1000 });
  if (error) throw error;
  for (const item of data || []) {
    const path = prefix ? `${prefix}/${item.name}` : item.name;
    if (item.id) {
      out.push(path);
    } else {
      out.push(...(await listAllFiles(path)));
    }
  }
  return out;
}

function groupByProduct(files) {
  /** @type {Map<string, string[]>} */
  const map = new Map();
  for (const file of files) {
    const parts = file.split('/');
    if (parts.length < 4 || parts[0] !== 'products') continue;
    const key = `${parts[1]}/${parts[2]}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(getPublicUrl(file));
  }
  for (const urls of map.values()) urls.sort();
  return map;
}

async function main() {
  console.log(`Listing bucket "${BUCKET}"…`);
  const files = await listAllFiles('');
  const byProduct = groupByProduct(files.filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f)));
  console.log(`Found ${files.length} storage objects, ${byProduct.size} product folders`);

  const { rows: products } = await pool.query(`
    SELECT p.id, p.name, p.city, c.name AS category_name
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE p.is_active = true
    ORDER BY p.id
  `);

  let updated = 0;
  let matched = 0;
  let unmatched = 0;

  for (const product of products) {
    const key = `${slugify(product.category_name)}/${slugify(product.name)}`;
    const urls = byProduct.get(key);
    if (!urls?.length) {
      unmatched += 1;
      continue;
    }
    matched += 1;

    const { rows } = await pool.query('SELECT images FROM products WHERE id = $1', [product.id]);
    const current = rows[0]?.images;
    const currentJson = JSON.stringify(current || []);
    const nextJson = JSON.stringify(urls);
    if (currentJson === nextJson) continue;

    await pool.query(
      'UPDATE products SET images = $1, updated_at = NOW() WHERE id = $2',
      [nextJson, product.id]
    );
    updated += 1;
    console.log(`  ✓ ${product.name} (${product.city}) → ${urls.length} image(s)`);
  }

  console.log(`\nDone: ${matched} matched, ${updated} updated, ${unmatched} without storage folder`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
