#!/usr/bin/env node
/**
 * Generate sitemap.xml for Google Search Console.
 * Run after `npm run build` — writes to build/sitemap.xml (and public/ for local).
 *
 * Env:
 *   SITE_URL            — default https://pakkarent.com
 *   REACT_APP_API_URL   — API base for product URLs (optional)
 */
const fs = require('fs');
const path = require('path');

const SITE_URL = (process.env.SITE_URL || 'https://pakkarent.com').replace(/\/$/, '');
const API_URL = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');
const TODAY = new Date().toISOString().slice(0, 10);

const STATIC_PAGES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/products', changefreq: 'daily', priority: '0.9' },
  { path: '/blog', changefreq: 'weekly', priority: '0.85' },
  { path: '/about', changefreq: 'monthly', priority: '0.6' },
  { path: '/how-it-works', changefreq: 'monthly', priority: '0.65' },
  { path: '/contact', changefreq: 'monthly', priority: '0.6' },
  { path: '/faq', changefreq: 'monthly', priority: '0.6' },
  { path: '/delivery-info', changefreq: 'monthly', priority: '0.6' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
];

const CATALOG_PATHS = [
  '/products?category_id=1',
  '/products?category_id=2',
  '/products?category_id=3',
  '/products?category_id=4',
  '/products?category_id=5',
  '/products?category_id=6',
  '/products?category_id=7',
  '/products?category_id=8',
  '/products?category_id=3&subcategory_id=10',
  '/products?category_id=3&subcategory_id=13',
  '/products?category_id=3&subcategory_id=11',
  '/products?category_id=3&subcategory_id=9',
  '/products?category_id=3&subcategory_id=12',
];

const BLOG_SLUGS = [
  'naming-ceremony-cradle-rental-guide-chennai',
  'silver-vs-golden-cradle-which-to-rent',
  'haldi-ceremony-decoration-rental-ideas',
  'oonjal-jhula-swing-rental-guide',
  'event-backdrop-rental-guide',
  'birthday-party-rental-ideas-budget',
  'camping-gear-rental-checklist-chennai',
  'rent-vs-buy-home-appliances-chennai',
  'baby-props-rental-travel-guide',
  'corporate-event-games-rental-team-building',
];

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function loc(pathname) {
  return `${SITE_URL}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
}

function urlEntry(pathname, { changefreq = 'weekly', priority = '0.5', lastmod = TODAY } = {}) {
  return `  <url>
    <loc>${escapeXml(loc(pathname))}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function fetchAllProductIds() {
  if (!API_URL) {
    console.warn('Sitemap: REACT_APP_API_URL not set — skipping product URLs');
    return [];
  }

  const ids = new Set();
  let page = 1;
  const limit = 100;

  while (page <= 50) {
    const res = await fetch(`${API_URL}/api/products?limit=${limit}&page=${page}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const batch = data.products || [];
    for (const p of batch) {
      if (p?.id) ids.add(p.id);
    }
    const total = Number(data.total) || 0;
    if (batch.length < limit || ids.size >= total) break;
    page += 1;
  }

  return [...ids].sort((a, b) => a - b);
}

async function main() {
  const entries = [];

  for (const page of STATIC_PAGES) {
    entries.push(urlEntry(page.path, page));
  }

  for (const path of CATALOG_PATHS) {
    entries.push(urlEntry(path, { changefreq: 'weekly', priority: '0.8' }));
  }

  for (const slug of BLOG_SLUGS) {
    entries.push(urlEntry(`/blog/${slug}`, { changefreq: 'monthly', priority: '0.75' }));
  }

  try {
    const productIds = await fetchAllProductIds();
    for (const id of productIds) {
      entries.push(urlEntry(`/products/${id}`, { changefreq: 'weekly', priority: '0.7' }));
    }
    console.log(`Sitemap: ${productIds.length} product URLs`);
  } catch (err) {
    console.warn(`Sitemap: product fetch failed (${err.message}) — static URLs only`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

  const root = path.join(__dirname, '..');
  const targets = [
    path.join(root, 'build', 'sitemap.xml'),
    path.join(root, 'public', 'sitemap.xml'),
  ];

  for (const file of targets) {
    const dir = path.dirname(file);
    if (fs.existsSync(dir)) {
      fs.writeFileSync(file, xml, 'utf8');
      console.log(`Wrote ${file} (${entries.length} URLs)`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
