#!/usr/bin/env node
/**
 * Find and deactivate duplicate products (same name + city).
 * Keeps the best row per group: images > featured > subcategory > lowest id.
 *
 * Usage:
 *   node scripts/dedupe-products.js          # dry-run (default)
 *   node scripts/dedupe-products.js --apply  # deactivate duplicates
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const pool = require('../src/models/db');

const APPLY = process.argv.includes('--apply');

function imageCount(images) {
  if (!images) return 0;
  const arr = Array.isArray(images) ? images : (() => {
    try { return JSON.parse(images); } catch { return []; }
  })();
  return Array.isArray(arr) ? arr.length : 0;
}

function score(row) {
  return [
    row.is_active ? 1 : 0,
    imageCount(row.images) > 0 ? 1 : 0,
    imageCount(row.images),
    row.is_featured ? 1 : 0,
    row.subcategory_id ? 1 : 0,
    -(row.id),
  ];
}

function compareRows(a, b) {
  const sa = score(a);
  const sb = score(b);
  for (let i = 0; i < sa.length; i++) {
    if (sa[i] !== sb[i]) return sb[i] - sa[i];
  }
  return 0;
}

async function main() {
  const { rows: products } = await pool.query(`
    SELECT id, name, city, category_id, subcategory_id, is_active, is_featured, images, created_at
    FROM products
    ORDER BY name, city, id
  `);

  /** @type {Map<string, typeof products>} */
  const groups = new Map();
  for (const row of products) {
    const key = `${row.name.trim().toLowerCase()}|${row.city.trim().toLowerCase()}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }

  const toDeactivate = [];
  const report = [];

  for (const [key, rows] of groups) {
    if (rows.length < 2) continue;
    const sorted = [...rows].sort(compareRows);
    const keep = sorted[0];
    const remove = sorted.slice(1);
    for (const dup of remove) {
      if (dup.is_active) toDeactivate.push(dup.id);
    }
    report.push({
      type: 'exact',
      name: keep.name,
      city: keep.city,
      keepId: keep.id,
      removeIds: remove.map((r) => r.id),
    });
  }

  // Near-duplicates: same city, one name contained in the other (e.g. "Lotus Urli" vs "Lotus Urli for Haldi")
  const active = products.filter((p) => p.is_active && !toDeactivate.includes(p.id));
  const byCity = new Map();
  for (const row of active) {
    const ck = row.city.trim().toLowerCase();
    if (!byCity.has(ck)) byCity.set(ck, []);
    byCity.get(ck).push(row);
  }
  for (const [, cityRows] of byCity) {
    for (let i = 0; i < cityRows.length; i++) {
      for (let j = i + 1; j < cityRows.length; j++) {
        const a = cityRows[i];
        const b = cityRows[j];
        const an = a.name.trim().toLowerCase();
        const bn = b.name.trim().toLowerCase();
        if (an === bn || (!an.includes(bn) && !bn.includes(an))) continue;
        const sorted = compareRows(a, b) >= 0 ? [a, b] : [b, a];
        const keep = sorted[0];
        const remove = sorted[1];
        if (!toDeactivate.includes(remove.id) && remove.is_active) {
          toDeactivate.push(remove.id);
          report.push({
            type: 'near',
            name: `${keep.name} / ${remove.name}`,
            city: keep.city,
            keepId: keep.id,
            removeIds: [remove.id],
          });
        }
      }
    }
  }

  console.log(`Duplicate groups: ${report.length}`);
  for (const r of report) {
    console.log(`  [${r.type}] ${r.city} | ${r.name}`);
    console.log(`    keep #${r.keepId}, remove [${r.removeIds.join(', ')}]`);
  }

  if (!toDeactivate.length) {
    console.log('\nNo active duplicates to remove.');
    process.exit(0);
  }

  console.log(`\nActive duplicates to deactivate: ${toDeactivate.length} → [${toDeactivate.join(', ')}]`);

  if (!APPLY) {
    console.log('\nDry run only. Re-run with --apply to deactivate duplicates.');
    process.exit(0);
  }

  const orderRefs = await pool.query(
    `SELECT product_id, COUNT(*)::int AS cnt
     FROM order_items WHERE product_id = ANY($1)
     GROUP BY product_id`,
    [toDeactivate]
  );
  if (orderRefs.rows.length) {
    console.error('Cannot remove: order_items reference duplicate products:', orderRefs.rows);
    process.exit(1);
  }

  await pool.query(
    `UPDATE products SET is_active = false, updated_at = NOW() WHERE id = ANY($1)`,
    [toDeactivate]
  );
  console.log(`\nDeactivated ${toDeactivate.length} duplicate products.`);

  const { rows: remaining } = await pool.query(`
    SELECT name, city, COUNT(*)::int AS cnt
    FROM products WHERE is_active = true
    GROUP BY name, city HAVING COUNT(*) > 1
  `);
  console.log(`Remaining active duplicates: ${remaining.length}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
