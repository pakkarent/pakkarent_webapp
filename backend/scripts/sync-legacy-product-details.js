#!/usr/bin/env node
/**
 * Crawl pakkarent.com product pages and sync description + specs.details
 * to all matching active products in the database.
 *
 * Usage:
 *   node scripts/sync-legacy-product-details.js          # dry-run
 *   node scripts/sync-legacy-product-details.js --apply  # write to DB
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const pool = require('../src/models/db');

const APPLY = process.argv.includes('--apply');
const SITEMAP = 'https://pakkarent.com/sitemap.xml';
const STORE_PAGES = [
  'https://pakkarent.com/store/camping/index.html',
  'https://pakkarent.com/store/home_appliances/index.html',
  'https://pakkarent.com/store/event/index.html',
  'https://pakkarent.com/store/backdrop/index.html',
  'https://pakkarent.com/store/propstore/index.html',
  'https://pakkarent.com/store/baby/baby.html',
  'https://pakkarent.com/store/games/games_list.html',
];

const MIN_MATCH_SCORE = 0.58;
const FETCH_DELAY_MS = 150;

/** New catalog name → legacy page title (normalized keys) */
const NAME_ALIASES = {
  'camping tents double layer': 'camping tent double layer',
  'camping tents single layer': 'camping tent single layer',
  'sleeping bags': 'sleeping bag',
  'life jackets': 'life jacket',
  'barbeque grill': 'barbeque grill',
  'outdoor barbeque': 'outdoor barbeque',
  'camping stove': 'gas stove',
  'party speaker': 'party speaker',
  'cooler box': 'cooler box',
  'dress changing tent': 'dress changing tent',
  'washing machine': 'washing machine',
  'fridge': 'fridge',
  'air conditioner': 'air conditioner',
  'led tv': 'led tv',
  'silver grand cradle': 'silver grand cradle',
  'peacock silver cradle': 'silver peacock cradle',
  'classic crown cradle': 'crown baby cradle',
  'ivory oonjal royal swing': 'ivory swing',
  'lotus urli': 'lotus urli for haldi half saree function',
  'gangalam mangala snanam set': 'gangalam set for haldi',
  'gangalam set for haldi': 'gangalam set for haldi',
  'rolu rokali ural for wedding': 'rolu rokali',
  'silver rolu rokali': 'silver rolu rokali',
  'wooden manai palagai puja manakatti': 'wooden manai palagai',
  'cylindrical cake table': 'cylinder cake stands pedestal cake tables',
  'irish cake table combo': 'irish cake stand',
  'golden cake stand combo': 'golden cake stand',
  'wooden cake stands': 'wooden cake stand',
  'baby car for birthday': 'baby car',
  'baby jeep rental': 'baby jeep',
  'kids jeep rental': 'kids jeep',
  'kids car rental': 'kids car',
  'kids slide and swing rental': 'kids slide and swing',
  'camping lantern': 'lanterns',
  'marquee letters': 'marquee letters',
  'moon walk game': 'moon walk',
  'compact cradle': 'compact cradle',
  'teak wood oonjal swing jhula': 'teak jhula swing',
  'teak jhula swing': 'teak jhula swing',
  'golden jhula swing': 'golden oonjal',
  'golden oonjal jhula': 'golden oonjal jhula',
  'flower wall backdrop': 'flower wall backdrop',
  'dreamy ring birthday backdrop': 'dreamy ring backdrop',
  'banana leaf backdrop': 'banana leaf backdrop',
  'pink rani backdrop': 'pink rani backdrop',
  'elegant greenish backdrop': 'elegant greenish backdrop rental',
  'yellow lily blossom backdrop setup': 'lotus urli and lily blossom setup',
};

/** Exact catalog name → legacy page URL (for pages missing from sitemap) */
const LEGACY_URL_OVERRIDES = {
  'Banana Leaf Backdrop': 'https://pakkarent.com/products/backdrop/BananaLeaf_Backdrop.html',
  'Dreamy Ring Birthday Backdrop': 'https://pakkarent.com/products/backdrop/Dreamy_Ring_Backdrop.html',
  'Elegant Greenish Backdrop': 'https://pakkarent.com/Hyderabad/products/backdrop/Elegant_Greenish_backdrop_rental.html',
  'Flower Wall Backdrop': 'https://pakkarent.com/products/backdrop/Flowerwall_Backdrop.html',
  'Golden Jhula / Swing': 'https://pakkarent.com/products/event/golden_oonjal.html',
  'Pink Rani Backdrop': 'https://pakkarent.com/products/backdrop/Pink_Rani_Backdrop.html',
  'Yellow Lily Blossom Backdrop Setup':
    'https://pakkarent.com/products/backdrop/Haldi_urli_with_Backdrop_Decoration_Rental.html',
  'Baby Car for Birthday': 'https://pakkarent.com/products/baby/Kids_Car_Rental.html',
  'Baby Jeep Rental': 'https://pakkarent.com/products/baby/Baby_Jeep_Rent.html',
  'Kids Slide and Swing Rental': 'https://pakkarent.com/products/baby/Kids_Car_Rental.html',
  'Silver Rolu Rokali': 'https://pakkarent.com/products/event/Rolu_Rokali.html',
  'Rolu Rokali / Ural for Wedding': 'https://pakkarent.com/products/event/Rolu_Rokali.html',
  'Teak Jhula / Swing': 'https://pakkarent.com/products/event/oonjal.html',
  'Teak Wood Oonjal / Swing / Jhula': 'https://pakkarent.com/products/event/oonjal.html',
  'Royal Golden Sofa': 'https://pakkarent.com/products/event/Royal_golden_sofa.html',
  'Armless Chairs': 'https://pakkarent.com/products/event/Chair_rent.html',
  'Red Carpet': 'https://pakkarent.com/products/event/Red_Carpet_Rental.html',
  'LED Lights': 'https://pakkarent.com/products/event/balloondecor.html',
  'Electric Balloon Blower': 'https://pakkarent.com/products/event/balloondecor.html',
  'Wooden Cake Stands': 'https://pakkarent.com/products/event/Wooden_Cake_Stand_Combo.html',
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function resolveStoreHref(href, storeUrl) {
  if (!href || href.startsWith('#') || href.startsWith('javascript:')) return null;
  if (href.startsWith('http')) return href;
  if (href.startsWith('/')) return `https://pakkarent.com${href}`;
  if (href.startsWith('../../')) {
    const base = new URL(storeUrl);
    const parts = base.pathname.split('/').filter(Boolean);
    parts.pop(); // store folder
    parts.pop(); // category folder e.g. backdrop
    const root = parts.join('/');
    const rel = href.replace(/^(\.\.\/)+/, '');
    return `https://pakkarent.com/${root ? `${root}/` : ''}${rel}`;
  }
  return null;
}

async function fetchOverridePages(byNorm) {
  for (const [name, url] of Object.entries(LEGACY_URL_OVERRIDES)) {
    try {
      const html = await fetchText(url);
      const parsed = parseLegacyPage(html, url);
      const key = normalizeName(parsed.name || name);
      if (!byNorm.has(key) || parsed.details.length > (byNorm.get(key).details?.length || 0)) {
        byNorm.set(key, { ...parsed, name: parsed.name || name });
      }
      byNorm.set(normalizeName(name), byNorm.get(key));
      await sleep(FETCH_DELAY_MS);
    } catch (err) {
      console.warn(`  override skip ${name}: ${err.message}`);
    }
  }
}

function normalizeName(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function similarity(a, b) {
  const x = normalizeName(a);
  const y = normalizeName(b);
  if (!x || !y) return 0;
  if (x === y) return 1;
  if (x.includes(y) || y.includes(x)) return 0.85;
  const ax = new Set(x.split(' ').filter(Boolean));
  const by = new Set(y.split(' ').filter(Boolean));
  let inter = 0;
  for (const w of ax) if (by.has(w)) inter += 1;
  return (2 * inter) / (ax.size + by.size);
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseLegacyPage(html, url) {
  let name = '';
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) name = stripHtml(h1[1]);

  if (!name) {
    const title = html.match(/<title>([^<|]+)/i);
    if (title) name = title[1].replace(/\s*[-|].*$/, '').trim();
  }
  if (!name) {
    name = url.split('/').pop().replace('.html', '').replace(/_/g, ' ');
  }

  let tagline = '';
  const h4 = html.match(/<h1[^>]*>[\s\S]*?<\/h1>\s*<h4[^>]*>([\s\S]*?)<\/h4>/i);
  if (h4) tagline = stripHtml(h4[1]);

  const details = [];
  const detailsIdx = html.search(/>\s*Details\s*</i);
  const detailsPane = html.match(/id="details"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i);
  const chunks = [];
  if (detailsIdx !== -1) chunks.push(html.slice(detailsIdx, detailsIdx + 6000));
  if (detailsPane) chunks.push(detailsPane[1]);

  for (const chunk of chunks) {
    const liMatches = chunk.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
    for (const li of liMatches) {
      const text = stripHtml(li);
      if (
        text.length > 8 &&
        text.length < 320 &&
        !/^details$/i.test(text) &&
        !/^reviews$/i.test(text)
      ) {
        details.push(rephrase(text));
      }
      if (details.length >= 8) break;
    }
    if (details.length >= 8) break;

    const pMatches = chunk.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
    for (const p of pMatches) {
      const text = stripHtml(p);
      if (
        text.length > 15 &&
        text.length < 320 &&
        !/₹|Launch Offer|Transportation|Instagram|Backdrop Package|Facebook|Check us out/i.test(text)
      ) {
        details.push(rephrase(text));
      }
      if (details.length >= 6) break;
    }
    if (details.length) break;
  }

  const description = buildDescription(tagline, details, name);
  return { name, url, tagline, details, description };
}

function rephrase(line) {
  return line
    .replace(/\bUpto\b/gi, 'Up to')
    .replace(/\bKM\b/g, 'km')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildDescription(tagline, details, name) {
  const parts = [];
  if (tagline) parts.push(rephrase(tagline));
  if (details.length) parts.push(...details.slice(0, 3));
  if (!parts.length) return null;
  const text = parts.join(' ').trim();
  if (text.length < 20) return `${name} available on rent from PakkaRent in Chennai, Bangalore and Hyderabad.`;
  return text.charAt(0).toUpperCase() + text.slice(1) + (text.endsWith('.') ? '' : '.');
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'PakkaRentCatalogSync/1.0' },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function discoverLegacyCatalog() {
  console.log('Fetching sitemap…');
  const sitemapXml = await fetchText(SITEMAP);
  const urls = [...sitemapXml.matchAll(/<loc>(https:\/\/pakkarent\.com\/products\/[^<]+)<\/loc>/gi)].map(
    (m) => m[1]
  );
  console.log(`Found ${urls.length} product URLs in sitemap`);

  /** @type {Map<string, object>} */
  const byNorm = new Map();

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      const html = await fetchText(url);
      const parsed = parseLegacyPage(html, url);
      const key = normalizeName(parsed.name);
      if (!key) continue;
      if (!byNorm.has(key) || parsed.details.length > (byNorm.get(key).details?.length || 0)) {
        byNorm.set(key, parsed);
      }
    } catch (err) {
      console.warn(`  skip ${url}: ${err.message}`);
    }
    if (i % 10 === 0) process.stdout.write('.');
    await sleep(FETCH_DELAY_MS);
  }
  console.log(`\nParsed ${byNorm.size} legacy products from sitemap`);

  for (const storeUrl of STORE_PAGES) {
    try {
      const html = await fetchText(storeUrl);
      const links = [
        ...html.matchAll(/href="([^"]+\.html)"/gi),
      ].map((m) => resolveStoreHref(m[1], storeUrl)).filter(Boolean);
      for (const url of [...new Set(links)]) {
        if (!url.includes('/products/')) continue;
        try {
          const pageHtml = await fetchText(url);
          const parsed = parseLegacyPage(pageHtml, url);
          const nk = normalizeName(parsed.name);
          if (!nk) continue;
          if (!byNorm.has(nk) || parsed.details.length > (byNorm.get(nk).details?.length || 0)) {
            byNorm.set(nk, parsed);
          }
          await sleep(FETCH_DELAY_MS);
        } catch {
          /* ignore individual store links */
        }
      }
    } catch (err) {
      console.warn(`  skip store ${storeUrl}: ${err.message}`);
    }
  }

  await fetchOverridePages(byNorm);
  console.log(`Catalog total after store + overrides: ${byNorm.size}`);

  return [...byNorm.values()];
}

function buildCatalogIndex(catalog) {
  const catalogByNorm = new Map();
  for (const item of catalog) {
    catalogByNorm.set(normalizeName(item.name), item);
    const slug = item.url.split('/').pop().replace('.html', '').replace(/_/g, ' ');
    catalogByNorm.set(normalizeName(slug), item);
  }
  return catalogByNorm;
}

function bestLegacyMatch(productName, catalog, catalogByNorm) {
  const norm = normalizeName(productName);
  const aliasKey = NAME_ALIASES[norm];
  if (aliasKey && catalogByNorm.has(aliasKey)) {
    return { item: catalogByNorm.get(aliasKey), score: 1 };
  }
  if (catalogByNorm.has(norm)) {
    return { item: catalogByNorm.get(norm), score: 1 };
  }

  const overrideUrl = LEGACY_URL_OVERRIDES[productName];
  if (overrideUrl) {
    for (const item of catalog) {
      if (item.url === overrideUrl) return { item, score: 1 };
    }
  }

  let best = null;
  let bestScore = 0;
  for (const item of catalog) {
    const score = similarity(productName, item.name);
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }
  return bestScore >= MIN_MATCH_SCORE ? { item: best, score: bestScore } : null;
}

function specsFromExisting(product) {
  let specs = product.specs;
  if (typeof specs === 'string') {
    try { specs = JSON.parse(specs); } catch { specs = {}; }
  }
  if (!specs || typeof specs !== 'object') specs = {};
  if (Array.isArray(specs.details) && specs.details.length) return null;

  const bullets = [];
  const push = (text) => {
    const t = String(text || '').trim();
    if (t && t.length > 5) bullets.push(rephrase(t));
  };

  if (specs.material) push(`Material: ${specs.material}`);
  if (specs.dimensions) push(`Dimensions: ${specs.dimensions}`);
  if (specs.transport || specs.includes) push(String(specs.transport || specs.includes));
  if (Array.isArray(specs.features)) specs.features.forEach((f) => push(f));
  if (specs.style) push(`${specs.style} design`);
  if (specs.type) push(String(specs.type));
  if (specs.design) push(`Design: ${specs.design}`);
  if (specs.colour || specs.color) push(`Colour: ${specs.colour || specs.color}`);
  if (Array.isArray(specs.occasions) && specs.occasions.length) {
    push(`Ideal for ${specs.occasions.join(', ')}`);
  }
  if (product.description && bullets.length < 4) {
    const desc = String(product.description).trim();
    if (desc.length > 20) push(desc);
  }

  return bullets.length ? bullets.slice(0, 6) : null;
}

async function main() {
  const catalog = await discoverLegacyCatalog();
  const catalogByNorm = buildCatalogIndex(catalog);
  const { rows: products } = await pool.query(
    'SELECT id, name, city, description, specs FROM products WHERE is_active = true ORDER BY name, city'
  );

  /** @type {Map<string, typeof products>} */
  const byName = new Map();
  for (const p of products) {
    if (!byName.has(p.name)) byName.set(p.name, []);
    byName.get(p.name).push(p);
  }

  let matched = 0;
  let updated = 0;
  let skipped = 0;
  const unmatched = [];

  for (const [name, group] of byName) {
    const match = bestLegacyMatch(name, catalog, catalogByNorm);
    if (!match) {
      unmatched.push(name);
      // Fallback: build details from existing specs JSON
      for (const product of group) {
        const fallbackDetails = specsFromExisting(product);
        if (!fallbackDetails) {
          skipped += 1;
          continue;
        }
        let specs = product.specs;
        if (typeof specs === 'string') {
          try { specs = JSON.parse(specs); } catch { specs = {}; }
        }
        specs = specs && typeof specs === 'object' ? { ...specs } : {};
        if (JSON.stringify(specs.details) === JSON.stringify(fallbackDetails)) continue;
        specs.details = fallbackDetails;
        delete specs.price_per_event;
        console.log(`  ~ ${product.name} (${product.city}) ← generated from specs`);
        if (APPLY) {
          await pool.query(
            'UPDATE products SET specs = $1, updated_at = NOW() WHERE id = $2',
            [JSON.stringify(specs), product.id]
          );
        }
        updated += 1;
      }
      continue;
    }
    matched += group.length;

    const { item, score } = match;
    const description = item.description || buildDescription(item.tagline, item.details, name);
    const details = item.details?.length ? item.details : null;

    if (!description && !details) {
      skipped += group.length;
      continue;
    }

    for (const product of group) {
      let specs = product.specs;
      if (typeof specs === 'string') {
        try { specs = JSON.parse(specs); } catch { specs = {}; }
      }
      specs = specs && typeof specs === 'object' ? { ...specs } : {};

      let changed = false;
      if (details?.length) {
        if (JSON.stringify(specs.details) !== JSON.stringify(details)) {
          specs.details = details;
          delete specs.price_per_event;
          changed = true;
        }
      }
      if (description && product.description !== description) {
        changed = true;
      }

      if (!changed) continue;

      console.log(
        `  ✓ ${product.name} (${product.city}) ← ${item.name} [${(score * 100).toFixed(0)}%]`
      );

      if (APPLY) {
        await pool.query(
          `UPDATE products SET
             description = COALESCE($1, description),
             specs = $2,
             updated_at = NOW()
           WHERE id = $3`,
          [description, JSON.stringify(specs), product.id]
        );
      }
      updated += 1;
    }
  }

  console.log(`\nMatched ${matched} product rows across ${byName.size - unmatched.length} names`);
  console.log(`${APPLY ? 'Updated' : 'Would update'} ${updated} rows`);
  console.log(`Unmatched names (${unmatched.length}): ${unmatched.slice(0, 15).join(', ')}${unmatched.length > 15 ? '…' : ''}`);
  if (!APPLY) console.log('\nRe-run with --apply to save changes.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
