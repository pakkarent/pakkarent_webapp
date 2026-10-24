/** Shared helpers for sitemap, prerender, and redirect generation. */
const fs = require('fs');
const path = require('path');

const SITE_URL = (process.env.SITE_URL || 'https://pakkarent.com').replace(/\/$/, '');
const API_URL = (process.env.REACT_APP_API_URL || process.env.API_URL || 'https://pakkarent-api.onrender.com').replace(/\/$/, '');
const PRODUCT_CACHE_FILE = path.join(__dirname, '..', '.build-cache', 'products.json');

const CITY_SEGMENTS = ['chennai', 'bangalore', 'hyderabad'];

const CATEGORY_SLUGS = [
  'camping-rental',
  'home-appliances-rental',
  'event-rental',
  'backdrop-rental',
  'birthday-rental',
  'baby-props-rental',
  'kids-toys-on-rent',
  'games-rental',
];

const CATEGORY_NAMES = {
  'camping-rental': 'Camping Rental',
  'home-appliances-rental': 'Home Appliances Rental',
  'event-rental': 'Event Rental',
  'backdrop-rental': 'Backdrop Rental',
  'birthday-rental': 'Birthday Rental',
  'baby-props-rental': 'Baby Props Rental',
  'kids-toys-on-rent': 'Kids Toys on Rent',
  'games-rental': 'Games Rental',
};

const STATIC_ROUTES = [
  { path: '/', title: 'PakkaRent — Rent Appliances, Furniture & Event Items in Chennai, Bangalore, Hyderabad', description: 'PakkaRent makes it easy to rent home appliances, furniture, baby gear, camping kits and event rentals across Chennai, Bangalore and Hyderabad.' },
  { path: '/products', title: 'All Rentals | PakkaRent', description: 'Browse all rental products — appliances, event items, baby gear, camping kits and more in Chennai, Bangalore and Hyderabad.' },
  { path: '/blog', title: 'Rental Guides & Tips | PakkaRent Blog', description: 'Expert guides on event rentals, baby props, appliances and camping gear in Chennai, Bangalore and Hyderabad.' },
  { path: '/festive/haldi', title: 'Haldi Rentals | PakkaRent', description: 'Browse haldi rentals including lotus urli, Rolu Rokali, mangala snanam sets and haldi backdrops on PakkaRent.' },
  { path: '/festive/naming-ceremony', title: 'Naming Ceremony Rentals | PakkaRent', description: 'Rent naming ceremony cradles, backdrops and welcome stands for Naamkaran functions on PakkaRent.' },
  { path: '/festive/baby-shower', title: 'Baby Shower Rentals | PakkaRent', description: 'Plan a baby shower or seemandham with swings, floral backdrops and event decor on PakkaRent.' },
  { path: '/festive/birthday-decoration', title: 'Birthday Decoration Rentals | PakkaRent', description: 'Explore cake stands, birthday backdrops and decor add-ons for birthday functions on PakkaRent.' },
  { path: '/about', title: 'About Us | PakkaRent', description: 'Learn about PakkaRent — trusted rental platform for appliances, camping gear, event items and baby props since 2014.' },
  { path: '/how-it-works', title: 'How It Works | PakkaRent', description: 'How PakkaRent works — browse, book and get doorstep delivery in Chennai, Bangalore or Hyderabad.' },
  { path: '/contact', title: 'Contact Us | PakkaRent', description: 'Contact PakkaRent — call +91 94038 90901 or WhatsApp for rentals in Chennai, Bangalore and Hyderabad.' },
  { path: '/faq', title: 'FAQs | PakkaRent', description: 'PakkaRent FAQs — booking, payments, delivery, cancellation and returns.' },
  { path: '/delivery-info', title: 'Delivery Info | PakkaRent', description: 'PakkaRent delivery information — transport charges and installation across South India.' },
];

const CITY_META = {
  chennai: {
    title: 'Rent Appliances, Event Items & Baby Gear in Chennai | PakkaRent',
    description: 'PakkaRent Chennai — rent washing machines, AC, cradles, backdrops, baby strollers and camping gear with doorstep delivery.',
  },
  bangalore: {
    title: 'Rent Appliances, Event Items & Baby Gear in Bangalore | PakkaRent',
    description: 'PakkaRent Bangalore — rent home appliances, baby strollers, event backdrops and games with flexible rental plans.',
  },
  hyderabad: {
    title: 'Rent Appliances, Event Items & Baby Gear in Hyderabad | PakkaRent',
    description: 'PakkaRent Hyderabad — rent appliances, baby gear, backdrops and party props with delivery across the city.',
  },
};

const FALLBACK_BLOG_SLUGS = [
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
  'washing-machine-on-rent-bangalore-guide',
  'baby-stroller-rent-hyderabad-guide',
  'ac-on-rent-chennai-summer-guide',
  'backdrop-rental-bangalore-ideas',
  'wedding-event-rental-checklist-hyderabad',
];

/**
 * Load BLOG_POSTS from src/content/blogPosts.js (ES modules) at build time by
 * transpiling src files to CommonJS with Babel, so prerendered blog HTML has the
 * real title, description and article body.
 */
function loadBlogPosts() {
  const babel = require('@babel/core');
  const srcDir = path.join(__dirname, '..', 'src');
  const defaultLoader = require.extensions['.js'];
  require.extensions['.js'] = function loadSrcModule(mod, filename) {
    if (!filename.startsWith(srcDir)) return defaultLoader(mod, filename);
    const { code } = babel.transformSync(fs.readFileSync(filename, 'utf8'), {
      filename,
      babelrc: false,
      configFile: false,
      plugins: ['@babel/plugin-transform-modules-commonjs'],
    });
    return mod._compile(code, filename);
  };
  try {
    return require(path.join(srcDir, 'content', 'blogPosts.js')).BLOG_POSTS || [];
  } finally {
    require.extensions['.js'] = defaultLoader;
  }
}

let BLOG_POSTS = [];
try {
  BLOG_POSTS = loadBlogPosts();
} catch (err) {
  console.warn(`Blog: could not load src/content/blogPosts.js (${err.message}) — using slug list`);
}

const BLOG_SLUGS = BLOG_POSTS.length ? BLOG_POSTS.map((p) => p.slug) : FALLBACK_BLOG_SLUGS;

function renderBlogParts(parts) {
  return (parts || []).map((part) => (part.type === 'link'
    ? `<a href="${escapeAttr(part.to)}">${escapeHtml(part.label)}</a>`
    : escapeHtml(part.value))).join('');
}

/** Server-rendered article HTML from blogPosts.js blocks (h3 / ul / p). */
function renderBlogBlocks(blocks) {
  return (blocks || []).map((block) => {
    if (block.type === 'h3') return `<h2>${escapeHtml(block.text)}</h2>`;
    if (block.type === 'ul') {
      const items = block.items.map((item) => `<li>${typeof item === 'string' ? escapeHtml(item) : renderBlogParts(item.parts)}</li>`);
      return `<ul>${items.join('')}</ul>`;
    }
    if (block.type === 'p') return `<p>${renderBlogParts(block.parts)}</p>`;
    return '';
  }).join('');
}

function blogPostBody(post) {
  const related = (post.relatedSlugs || [])
    .map((slug) => BLOG_POSTS.find((p) => p.slug === slug))
    .filter(Boolean);
  const catalog = (post.catalogLinks || [])
    .map((l) => `<li><a href="${escapeAttr(l.to)}">${escapeHtml(l.label)}</a></li>`)
    .join('');
  return [
    `<nav aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/blog">Blog</a> › ${escapeHtml(post.title)}</nav>`,
    '<article>',
    `<h1>${escapeHtml(post.title)}</h1>`,
    `<p><time datetime="${escapeAttr(post.publishedAt)}">${escapeHtml(post.publishedAt)}</time> · ${Number(post.readMinutes) || 5} min read</p>`,
    `<p>${escapeHtml(post.excerpt)}</p>`,
    renderBlogBlocks(post.blocks),
    '</article>',
    catalog ? `<h2>Browse rentals</h2><ul>${catalog}</ul>` : '',
    related.length
      ? `<h2>Related guides</h2><ul>${related.map((p) => `<li><a href="/blog/${escapeAttr(p.slug)}">${escapeHtml(p.title)}</a></li>`).join('')}</ul>`
      : '',
  ].join('');
}

function cityUrlSegment(city) {
  if (!city || city === 'all') return 'india';
  return String(city).toLowerCase();
}

/** Canonical: /rent/{city}/{slug}. city=all → /rent/india/{slug}. */
function productPath(product) {
  if (product?.slug) return `/rent/${cityUrlSegment(product.city)}/${product.slug}`;
  if (product?.id) return `/products/${product.id}`;
  return null;
}

/** Old format /rent/{slug}/{city} — for 301 redirects only. */
function legacySlugCityProductPath(product) {
  if (!product?.slug) return null;
  return `/rent/${product.slug}/${cityUrlSegment(product.city)}`;
}

function escapeAttr(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getPricingTypeForProduct(product) {
  const specs = product?.specs && typeof product.specs === 'object' ? product.specs : {};
  const stored = specs.pricing_type;
  if (stored === 'per_day_or_week') return 'per_day';
  if (stored) return stored;
  if (Number(product?.category_id) === 2) return 'per_month';
  if (Number(product?.category_id) === 1) return 'per_day';
  return 'per_event';
}

function priceUnitWord(product) {
  const pt = getPricingTypeForProduct(product);
  if (pt === 'per_month') return 'month';
  if (pt === 'per_event') return 'event';
  return 'day';
}

function productImageUrls(product) {
  const images = Array.isArray(product?.images) ? product.images : [];
  const urls = images
    .map((src) => {
      if (!src) return null;
      const s = String(src).split('?')[0];
      if (s.startsWith('http')) return s;
      if (s.startsWith('/')) return `${SITE_URL}${s}`;
      return null;
    })
    .filter(Boolean);
  return urls.length ? urls.slice(0, 6) : [`${SITE_URL}/og-image.png`];
}

/** Category IDs 1–8 map to CATEGORY_SLUGS in order (stable seed IDs). */
function categoryPath(product) {
  const slug = CATEGORY_SLUGS[Number(product?.category_id) - 1];
  if (!slug || product.city === 'all') return '/products';
  return `/products/${slug}/${cityUrlSegment(product.city)}`;
}

function formatInr(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value || '');
  return n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function productDetailItems(product) {
  const specs = product?.specs && typeof product.specs === 'object' ? product.specs : {};
  const raw = Array.isArray(specs.details) ? specs.details : String(specs.details || '').split(',');
  return raw.map((s) => String(s).trim()).filter(Boolean).slice(0, 10);
}

/** Server-rendered product page body — visible to crawlers without JS. */
function productBody(product, images) {
  const name = escapeHtml(product.name);
  const cityLabel = product.city === 'all' ? 'India' : product.city;
  const city = escapeHtml(cityLabel);
  const unit = priceUnitWord(product);
  const category = escapeHtml(product.category_name || 'Rentals');
  const cityHref = product.city === 'all' ? '/products' : `/${cityUrlSegment(product.city)}`;
  const description = product.description
    ? `<p>${escapeHtml(product.description)}</p>`
    : `<p>Rent ${name} in ${city} from PakkaRent with doorstep delivery and pickup.</p>`;
  const details = productDetailItems(product);
  const deposit = Number(product.security_deposit) > 0
    ? `<p>Refundable security deposit: ₹${formatInr(product.security_deposit)}</p>`
    : '';
  const tiers = [
    ['3 months', product.price_3month],
    ['6 months', product.price_6month],
    ['12 months', product.price_12month],
  ].filter(([, v]) => Number(v) > 0);
  const tierList = tiers.length
    ? `<ul>${tiers.map(([label, v]) => `<li>${label}: ₹${formatInr(v)}/month</li>`).join('')}</ul>`
    : '';
  const gallery = images
    .filter((src) => !src.endsWith('/og-image.png'))
    .slice(0, 4)
    .map((src, i) => `<img src="${escapeAttr(src)}" alt="${escapeAttr(`${product.name} on rent in ${cityLabel}${i ? ` — photo ${i + 1}` : ''}`)}" width="400" height="400" style="width:100%;max-width:400px;height:auto;object-fit:cover;border-radius:8px"${i ? ' loading="lazy"' : ''}>`)
    .join('');

  return [
    `<nav aria-label="Breadcrumb"><a href="/">Home</a> › <a href="${cityHref}">${city}</a> › <a href="${categoryPath(product)}">${category}</a> › ${name}</nav>`,
    `<h1>${name} on Rent in ${city}</h1>`,
    gallery ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px">${gallery}</div>` : '',
    `<p><strong>₹${formatInr(product.monthly_price)} per ${unit}</strong></p>`,
    tierList,
    deposit,
    description,
    details.length ? `<h2>What's included</h2><ul>${details.map((d) => `<li>${escapeHtml(d)}</li>`).join('')}</ul>` : '',
    `<p>Book on WhatsApp or call <a href="tel:+919403890901">+91 94038 90901</a>. Delivery across ${city}.</p>`,
    `<p><a href="${categoryPath(product)}">More ${category} in ${city}</a> · <a href="/products">All rentals</a></p>`,
  ].filter(Boolean).join('');
}

function productMeta(product) {
  const cityLabel = product.city === 'all' ? 'India' : product.city;
  const unit = priceUnitWord(product);
  const images = productImageUrls(product);
  return {
    title: `${product.name} on Rent in ${cityLabel} | PakkaRent`,
    description: `Rent ${product.name} in ${cityLabel} from ₹${product.monthly_price}/${unit}. Flexible rental on PakkaRent.`,
    path: productPath(product),
    body: productBody(product, images),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description || `Rent ${product.name} in ${cityLabel} on PakkaRent.`,
      sku: `PAKKA-${product.id}`,
      brand: { '@type': 'Brand', name: 'PakkaRent' },
      category: product.category_name || 'Rental',
      image: images,
      offers: {
        '@type': 'Offer',
        url: `${SITE_URL}${productPath(product)}`,
        priceCurrency: 'INR',
        price: String(product.monthly_price),
        availability: 'https://schema.org/InStock',
      },
    },
  };
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJsonWithRetry(url, attempt = 0) {
  const maxAttempts = 6;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(30000),
  });

  if (res.ok) return res.json();

  if ((res.status === 429 || res.status === 502 || res.status === 503) && attempt < maxAttempts) {
    const retryAfterSec = Number(res.headers.get('retry-after'));
    const waitMs = Number.isFinite(retryAfterSec) && retryAfterSec > 0
      ? retryAfterSec * 1000
      : Math.min(30000, 1500 * 2 ** attempt);
    console.warn(`API ${res.status} for ${url} — retry ${attempt + 1}/${maxAttempts} in ${waitMs}ms`);
    await sleep(waitMs);
    return fetchJsonWithRetry(url, attempt + 1);
  }

  throw new Error(`HTTP ${res.status}`);
}

function readProductCache() {
  try {
    if (!fs.existsSync(PRODUCT_CACHE_FILE)) return null;
    const data = JSON.parse(fs.readFileSync(PRODUCT_CACHE_FILE, 'utf8'));
    if (Array.isArray(data.products) && data.products.length > 0) return data.products;
  } catch {
    // ignore corrupt cache
  }
  return null;
}

function writeProductCache(products) {
  if (!products.length) return;
  fs.mkdirSync(path.dirname(PRODUCT_CACHE_FILE), { recursive: true });
  fs.writeFileSync(
    PRODUCT_CACHE_FILE,
    JSON.stringify({ fetchedAt: new Date().toISOString(), products }),
    'utf8'
  );
}

async function fetchAllProductsFromApi() {
  const products = [];
  let page = 1;
  const limit = 200;
  while (page <= 50) {
    const data = await fetchJsonWithRetry(`${API_URL}/api/products?limit=${limit}&page=${page}`);
    const batch = data.products || [];
    products.push(...batch);
    const total = Number(data.total) || 0;
    if (batch.length < limit || products.length >= total) break;
    page += 1;
    await sleep(400);
  }
  return products;
}

async function fetchAllProducts() {
  if (!API_URL) return [];

  const cached = readProductCache();
  if (cached) {
    console.log(`Products: using build cache (${cached.length} items)`);
    return cached;
  }

  const products = await fetchAllProductsFromApi();
  writeProductCache(products);
  console.log(`Products: fetched ${products.length} items from API`);
  return products;
}

function collectPrerenderRoutes(products) {
  const routes = [];

  const blogIndex = BLOG_POSTS.length
    ? `<ul>${BLOG_POSTS.map((p) => `<li><a href="/blog/${escapeAttr(p.slug)}">${escapeHtml(p.title)}</a> — ${escapeHtml(p.excerpt)}</li>`).join('')}</ul>`
    : '';

  for (const page of STATIC_ROUTES) {
    const heading = `<h1>${escapeHtml(page.title.split('|')[0].trim())}</h1>`;
    routes.push({
      path: page.path,
      title: page.title,
      description: page.description,
      body: page.path === '/blog' ? `${heading}${blogIndex}` : heading,
    });
  }

  const productLinks = (list) => (list.length
    ? `<ul>${list.map((p) => `<li><a href="${productPath(p)}">${escapeHtml(p.name)}</a> — ₹${formatInr(p.monthly_price)}/${priceUnitWord(p)}</li>`).join('')}</ul>`
    : '');

  for (const city of CITY_SEGMENTS) {
    const meta = CITY_META[city];
    const cityName = city.charAt(0).toUpperCase() + city.slice(1);
    const inCity = products.filter((p) => p.slug && cityUrlSegment(p.city) === city);
    const categoryLinks = CATEGORY_SLUGS
      .map((slug) => `<li><a href="/products/${slug}/${city}">${escapeHtml(CATEGORY_NAMES[slug])} in ${cityName}</a></li>`)
      .join('');
    routes.push({
      path: `/${city}`,
      title: meta.title,
      description: meta.description,
      body: `<h1>${escapeHtml(meta.title.split('|')[0].trim())}</h1><p>${escapeHtml(meta.description)}</p><ul>${categoryLinks}</ul>`,
    });
    CATEGORY_SLUGS.forEach((slug, index) => {
      const name = CATEGORY_NAMES[slug];
      const inCategory = inCity.filter((p) => Number(p.category_id) === index + 1);
      routes.push({
        path: `/products/${slug}/${city}`,
        title: `${name} on Rent in ${cityName} | PakkaRent`,
        description: `Browse ${name} products available on rent in ${cityName}. Flexible rental plans on PakkaRent.`,
        body: `<h1>${escapeHtml(name)} on Rent in ${escapeHtml(cityName)}</h1>${productLinks(inCategory)}<p><a href="/${city}">All rentals in ${cityName}</a></p>`,
      });
    });
  }

  for (const post of BLOG_POSTS) {
    routes.push({
      path: `/blog/${post.slug}`,
      title: `${post.title} | PakkaRent`,
      description: post.seoDescription || post.excerpt,
      body: blogPostBody(post),
    });
  }

  for (const slug of BLOG_POSTS.length ? [] : BLOG_SLUGS) {
    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    routes.push({
      path: `/blog/${slug}`,
      title: `${title} | PakkaRent Blog`,
      description: `Read ${title} on the PakkaRent blog — rental guides for Chennai, Bangalore and Hyderabad.`,
      body: `<h1>${escapeHtml(title)}</h1>`,
    });
  }

  for (const p of products) {
    if (!p.slug) continue;
    const meta = productMeta(p);
    routes.push({ path: meta.path, title: meta.title, description: meta.description, body: meta.body, jsonLd: meta.jsonLd });
  }

  return routes;
}

module.exports = {
  SITE_URL,
  API_URL,
  CITY_SEGMENTS,
  CATEGORY_SLUGS,
  BLOG_SLUGS,
  BLOG_POSTS,
  cityUrlSegment,
  productPath,
  legacySlugCityProductPath,
  escapeAttr,
  escapeHtml,
  fetchAllProducts,
  collectPrerenderRoutes,
  productMeta,
  priceUnitWord,
  productImageUrls,
  productDetailItems,
};
