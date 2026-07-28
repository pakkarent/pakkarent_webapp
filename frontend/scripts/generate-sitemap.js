#!/usr/bin/env node
/**
 * Generate sitemaps for Google Search Console.
 *
 * Outputs:
 *   sitemap.xml              — sitemap index
 *   sitemap-pages.xml        — static pages + blog
 *   sitemap-chennai.xml      — Chennai city / category / product URLs
 *   sitemap-bangalore.xml    — Bangalore city / category / product URLs
 *   sitemap-hyderabad.xml    — Hyderabad city / category / product URLs
 *
 * Env:
 *   SITE_URL            — default https://pakkarent.com
 *   REACT_APP_API_URL   — API base for product URLs (optional)
 */
const fs = require('fs');
const path = require('path');
const {
  SITE_URL,
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
  { path: '/festive/haldi', changefreq: 'weekly', priority: '0.8' },
  { path: '/festive/naming-ceremony', changefreq: 'weekly', priority: '0.8' },
  { path: '/festive/baby-shower', changefreq: 'weekly', priority: '0.8' },
  { path: '/festive/birthday-decoration', changefreq: 'weekly', priority: '0.8' },
  { path: '/about', changefreq: 'monthly', priority: '0.6' },
  { path: '/how-it-works', changefreq: 'monthly', priority: '0.65' },
  { path: '/contact', changefreq: 'monthly', priority: '0.6' },
  { path: '/faq', changefreq: 'monthly', priority: '0.6' },
  { path: '/delivery-info', changefreq: 'monthly', priority: '0.6' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
];

const EVENT_SUBCATEGORY_IDS = [10, 13, 11, 9, 12];

const CITY_BLOG_SLUGS = {
  chennai: [
    'naming-ceremony-cradle-rental-guide-chennai',
    'camping-gear-rental-checklist-chennai',
    'rent-vs-buy-home-appliances-chennai',
    'ac-on-rent-chennai-summer-guide',
  ],
  bangalore: [
    'washing-machine-on-rent-bangalore-guide',
    'backdrop-rental-bangalore-ideas',
  ],
  hyderabad: [
    'baby-stroller-rent-hyderabad-guide',
    'wedding-event-rental-checklist-hyderabad',
  ],
};

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

function urlsetXml(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;
}

function sitemapIndexXml(files) {
  const entries = files.map((file) => `  <sitemap>
    <loc>${escapeXml(`${SITE_URL}/${file}`)}</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>`);
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</sitemapindex>
`;
}

function buildCityEntries(city, products) {
  const entries = [];
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

  for (const slug of CITY_BLOG_SLUGS[city] || []) {
    entries.push(urlEntry(`/blog/${slug}`, { changefreq: 'monthly', priority: '0.75' }));
  }

  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  const productPaths = [...new Set(
    products
      .filter((p) => {
        const segment = cityUrlSegment(p.city);
        return segment === city || p.city === cityName || p.city === 'all';
      })
      .map(productPath)
      .filter(Boolean)
  )].sort();

  for (const productUrl of productPaths) {
    entries.push(urlEntry(productUrl, { changefreq: 'weekly', priority: '0.7' }));
  }

  return entries;
}

function buildPagesEntries() {
  const entries = [];
  for (const page of STATIC_PAGES) {
    entries.push(urlEntry(page.path, page));
  }

  const citySpecific = new Set(Object.values(CITY_BLOG_SLUGS).flat());
  for (const slug of BLOG_SLUGS) {
    if (citySpecific.has(slug)) continue;
    entries.push(urlEntry(`/blog/${slug}`, { changefreq: 'monthly', priority: '0.75' }));
  }
  return entries;
}

function writeOutputs(filename, content) {
  const root = path.join(__dirname, '..');
  const targets = [
    path.join(root, 'build', filename),
    path.join(root, 'public', filename),
  ];
  for (const file of targets) {
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) continue;
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Wrote ${file}`);
  }
}

async function main() {
  const products = await fetchAllProducts().catch((err) => {
    console.warn(`Sitemap: product fetch failed (${err.message})`);
    return [];
  });
  console.log(`Sitemap: ${products.length} products from API`);

  const pagesEntries = buildPagesEntries();
  writeOutputs('sitemap-pages.xml', urlsetXml(pagesEntries));
  console.log(`  pages: ${pagesEntries.length} URLs`);

  const cityFiles = [];
  for (const city of CITY_SEGMENTS) {
    const entries = buildCityEntries(city, products);
    const filename = `sitemap-${city}.xml`;
    writeOutputs(filename, urlsetXml(entries));
    cityFiles.push(filename);
    console.log(`  ${city}: ${entries.length} URLs`);
  }

  const indexFiles = ['sitemap-pages.xml', ...cityFiles];
  writeOutputs('sitemap.xml', sitemapIndexXml(indexFiles));
  console.log(`Sitemap index → ${indexFiles.join(', ')}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
