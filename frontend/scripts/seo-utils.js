/** Shared helpers for sitemap, prerender, and redirect generation. */
const SITE_URL = (process.env.SITE_URL || 'https://pakkarent.com').replace(/\/$/, '');
const API_URL = (process.env.REACT_APP_API_URL || process.env.API_URL || 'https://pakkarent-api.onrender.com').replace(/\/$/, '');

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
  { path: '/about', title: 'About Us | PakkaRent', description: 'Learn about PakkaRent — trusted rental platform for appliances, camping gear, event items and baby props since 2014.' },
  { path: '/how-it-works', title: 'How It Works | PakkaRent', description: 'How PakkaRent works — browse, book and get doorstep delivery in Chennai, Bangalore or Hyderabad.' },
  { path: '/contact', title: 'Contact Us | PakkaRent', description: 'Contact PakkaRent — call +91 94038 90901 or WhatsApp for rentals in Chennai, Bangalore and Hyderabad.' },
  { path: '/faq', title: 'FAQs | PakkaRent', description: 'PakkaRent FAQs — booking, payments, delivery, cancellation and returns.' },
  { path: '/delivery-info', title: 'Delivery Info | PakkaRent', description: 'PakkaRent delivery information — free delivery zones and transport charges across South India.' },
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
  'washing-machine-on-rent-bangalore-guide',
  'baby-stroller-rent-hyderabad-guide',
  'ac-on-rent-chennai-summer-guide',
  'backdrop-rental-bangalore-ideas',
  'wedding-event-rental-checklist-hyderabad',
];

function cityUrlSegment(city) {
  if (!city || city === 'all') return 'india';
  return String(city).toLowerCase();
}

function productPath(product) {
  if (product?.slug) return `/rent/${product.slug}/${cityUrlSegment(product.city)}`;
  if (product?.id) return `/products/${product.id}`;
  return null;
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

function productMeta(product) {
  const cityLabel = product.city === 'all' ? 'India' : product.city;
  return {
    title: `${product.name} on Rent in ${cityLabel} | PakkaRent`,
    description: `Rent ${product.name} in ${cityLabel} from ₹${product.monthly_price}/day or month. Free delivery and flexible rental on PakkaRent.`,
    path: productPath(product),
    body: `<h1>${escapeHtml(product.name)} on Rent in ${escapeHtml(cityLabel)}</h1><p>Rent ${escapeHtml(product.name)} in ${escapeHtml(cityLabel)} from PakkaRent. Category: ${escapeHtml(product.category_name || 'Rental')}.</p>`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: `Rent ${product.name} in ${cityLabel} on PakkaRent.`,
      sku: `PAKKA-${product.id}`,
      brand: { '@type': 'Brand', name: 'PakkaRent' },
      category: product.category_name || 'Rental',
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

async function fetchAllProducts() {
  if (!API_URL) return [];
  const products = [];
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
    products.push(...batch);
    const total = Number(data.total) || 0;
    if (batch.length < limit || products.length >= total) break;
    page += 1;
  }
  return products;
}

function collectPrerenderRoutes(products) {
  const routes = [];

  for (const page of STATIC_ROUTES) {
    routes.push({ path: page.path, title: page.title, description: page.description, body: `<h1>${escapeHtml(page.title.split('|')[0].trim())}</h1>` });
  }

  for (const city of CITY_SEGMENTS) {
    const meta = CITY_META[city];
    routes.push({ path: `/${city}`, title: meta.title, description: meta.description, body: `<h1>${escapeHtml(meta.title.split('|')[0].trim())}</h1>` });
    for (const slug of CATEGORY_SLUGS) {
      const name = CATEGORY_NAMES[slug];
      const cityName = city.charAt(0).toUpperCase() + city.slice(1);
      routes.push({
        path: `/products/${slug}/${city}`,
        title: `${name} on Rent in ${cityName} | PakkaRent`,
        description: `Browse ${name} products available on rent in ${cityName}. Free delivery and flexible plans on PakkaRent.`,
        body: `<h1>${escapeHtml(name)} on Rent in ${escapeHtml(cityName)}</h1>`,
      });
    }
  }

  for (const slug of BLOG_SLUGS) {
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
  cityUrlSegment,
  productPath,
  escapeAttr,
  escapeHtml,
  fetchAllProducts,
  collectPrerenderRoutes,
  productMeta,
};
