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
const {
  SITE_URL,
  API_URL,
  CITY_SEGMENTS,
  CATEGORY_SLUGS,
  BLOG_SLUGS,
  cityUrlSegment,
  productPath,
  fetchAllProducts,
} = require('./seo-utils');

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


const EVENT_SUBCATEGORY_IDS = [10, 13, 11, 9, 12];

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

async function fetchAllProductPaths() {
  const products = await fetchAllProducts().catch((err) => {
    console.warn(`Sitemap: product fetch failed (${err.message})`);
    return [];
  });
  return [...new Set(products.map(productPath).filter(Boolean))].sort();
}

async function main() {
  const entries = [];

  for (const page of STATIC_PAGES) {
    entries.push(urlEntry(page.path, page));
  }

  for (const city of CITY_SEGMENTS) {
    entries.push(urlEntry(`/${city}`, { changefreq: 'weekly', priority: '0.9' }));
    for (const slug of CATEGORY_SLUGS) {
      entries.push(urlEntry(`/products/${slug}/${city}`, { changefreq: 'weekly', priority: '0.8' }));
    }
    for (const subId of EVENT_SUBCATEGORY_IDS) {
      entries.push(urlEntry(`/products/event-rental/${city}?subcategory_id=${subId}`, {
        changefreq: 'weekly',
        priority: '0.75',
      }));
    }
  }

  for (const slug of BLOG_SLUGS) {
    entries.push(urlEntry(`/blog/${slug}`, { changefreq: 'monthly', priority: '0.75' }));
  }

  try {
    const productPaths = await fetchAllProductPaths();
    for (const path of productPaths) {
      entries.push(urlEntry(path, { changefreq: 'weekly', priority: '0.7' }));
    }
    console.log(`Sitemap: ${productPaths.length} product URLs`);
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
