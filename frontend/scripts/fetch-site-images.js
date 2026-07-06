#!/usr/bin/env node
/**
 * Download optimized site images into public/images/ (run before CRA build).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'public', 'images');

const IMAGES = [
  { file: 'home/hero.webp', url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=560&h=600&fit=crop&q=75&auto=format' },
  { file: 'home/camping.webp', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=220&h=180&fit=crop&q=75&auto=format' },
  { file: 'home/appliance.webp', url: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=220&h=180&fit=crop&q=75&auto=format' },
  { file: 'home/home-appliance.webp', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=220&h=180&fit=crop&q=75&auto=format' },
  { file: 'home/event.webp', url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=220&h=180&fit=crop&q=75&auto=format' },
  { file: 'home/backdrop.webp', url: 'https://images.unsplash.com/photo-1478147427282-58a87a433049?w=220&h=180&fit=crop&q=75&auto=format', fallback: 'home/event.webp' },
  { file: 'home/birthday.webp', url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=220&h=180&fit=crop&q=75&auto=format' },
  { file: 'home/baby.webp', url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=220&h=180&fit=crop&q=75&auto=format' },
  { file: 'home/furniture.webp', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=220&h=180&fit=crop&q=75&auto=format' },
  { file: 'home/kids.webp', url: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=220&h=180&fit=crop&q=75&auto=format' },
  { file: 'home/games.webp', url: 'https://images.unsplash.com/photo-1612404730960-5c71577fca11?w=220&h=180&fit=crop&q=75&auto=format' },
  { file: 'home/promo-birthday.webp', url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&h=340&fit=crop&q=75&auto=format' },
  { file: 'home/promo-baby.webp', url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=340&fit=crop&q=75&auto=format' },
  { file: 'cities/chennai.webp', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=320&h=200&fit=crop&q=75&auto=format' },
  { file: 'cities/bangalore.webp', url: 'https://images.unsplash.com/photo-1685392348279-34fe7a2ea624?w=320&h=200&fit=crop&q=75&auto=format' },
  { file: 'cities/hyderabad.webp', url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=320&h=200&fit=crop&q=75&auto=format', fallback: 'cities/bangalore.webp' },
];

async function downloadOne({ file, url, fallback }) {
  const dest = path.join(ROOT, file);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 500) return 'skip';
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    return 'ok';
  } catch (err) {
    if (fallback) {
      const src = path.join(ROOT, fallback);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.warn(`Image fallback ${file} ← ${fallback}`);
        return 'fallback';
      }
    }
    throw err;
  }
}

async function main() {
  let ok = 0;
  let skipped = 0;
  for (const item of IMAGES) {
    try {
      const status = await downloadOne(item);
      if (status === 'skip') skipped += 1;
      else ok += 1;
    } catch (err) {
      console.warn(`Image skip ${item.file}: ${err.message}`);
    }
  }
  console.log(`Site images: ${ok} downloaded, ${skipped} cached`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
