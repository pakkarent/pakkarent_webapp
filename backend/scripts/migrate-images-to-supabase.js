#!/usr/bin/env node
/**
 * Upload local product images to Supabase Storage (pakkarent_images)
 * and update products.images in the database to public URLs.
 *
 * Usage: node scripts/migrate-images-to-supabase.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const fs = require('fs');
const path = require('path');
const pool = require('../src/models/db');
const {
  BUCKET,
  uploadFile,
  localPathToPublicUrl,
  localPathToStorageKey,
} = require('../src/utils/storage');

const UPLOADS_ROOT = path.join(__dirname, '../../frontend/public/uploads');

function walkFiles(dir, base = dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(full, base));
    } else if (/\.(jpe?g|png|webp|gif)$/i.test(entry.name)) {
      files.push(path.relative(base, full).replace(/\\/g, '/'));
    }
  }
  return files;
}

function mapImageRef(ref, urlByKey) {
  const normalized = String(ref).replace(/\\/g, '/');
  if (normalized.startsWith('http')) return normalized;

  const key = localPathToStorageKey(normalized);
  if (urlByKey[key]) return urlByKey[key];
  if (key) return localPathToPublicUrl(normalized);
  return ref;
}

async function main() {
  if (!fs.existsSync(UPLOADS_ROOT)) {
    console.error('Uploads folder not found:', UPLOADS_ROOT);
    process.exit(1);
  }

  const relativeFiles = walkFiles(UPLOADS_ROOT);
  console.log(`Found ${relativeFiles.length} local image files`);

  const urlByKey = {};
  let uploaded = 0;
  let skipped = 0;

  for (const rel of relativeFiles) {
    const storageKey = rel.replace(/^\/+/, '');
    const filePath = path.join(UPLOADS_ROOT, rel);
    try {
      const { publicUrl } = await uploadFile(storageKey, filePath);
      urlByKey[storageKey] = publicUrl;
      uploaded += 1;
      process.stdout.write('.');
    } catch (err) {
      skipped += 1;
      console.warn(`\nSkip ${rel}: ${err.message}`);
    }
  }
  console.log(`\nUploaded ${uploaded}, skipped ${skipped} → bucket "${BUCKET}"`);

  const { rows: products } = await pool.query('SELECT id, images FROM products');
  let updatedProducts = 0;

  for (const product of products) {
    let images;
    try {
      images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
    } catch {
      continue;
    }
    if (!Array.isArray(images) || !images.length) continue;

    const mapped = images.map(ref => mapImageRef(ref, urlByKey));
    if (JSON.stringify(mapped) === JSON.stringify(images)) continue;

    await pool.query(
      'UPDATE products SET images = $1, updated_at = NOW() WHERE id = $2',
      [JSON.stringify(mapped), product.id]
    );
    updatedProducts += 1;
  }

  console.log(`Updated ${updatedProducts} products with Supabase image URLs`);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
