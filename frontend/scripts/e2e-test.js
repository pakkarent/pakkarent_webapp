#!/usr/bin/env node
/**
 * End-to-end SEO & routing smoke tests.
 * Usage:
 *   REACT_APP_API_URL=https://pakkarent-api.onrender.com ./scripts/render-build.sh
 *   ./node_modules/.bin/serve build -l 3456   # do NOT use -s (breaks prerender)
 */
const BASE_URL = (process.env.BASE_URL || 'http://localhost:3456').replace(/\/$/, '');
const API_URL = (process.env.API_URL || 'https://pakkarent-api.onrender.com').replace(/\/$/, '');

const results = [];
let failed = 0;

function pass(name, detail = '') {
  results.push({ name, ok: true, detail });
  console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ''}`);
}

function fail(name, detail = '') {
  results.push({ name, ok: false, detail });
  failed += 1;
  console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
}

async function fetchText(url, opts = {}) {
  const res = await fetch(url, { redirect: 'manual', ...opts, signal: AbortSignal.timeout(15000) });
  const text = opts.method === 'HEAD' ? '' : await res.text().catch(() => '');
  return { res, text };
}

function extractMeta(html, pattern) {
  const m = html.match(pattern);
  return m ? m[1] : null;
}

async function testApi() {
  console.log('\n── API ──');

  try {
    const { res } = await fetchText(`${API_URL}/api/health`);
    res.status === 200 ? pass('API health', `${res.status}`) : fail('API health', `${res.status}`);
  } catch (e) {
    fail('API health', e.message);
  }

  try {
    const { res, text } = await fetchText(`${API_URL}/api/products/slug/baby-stroller/bangalore`);
    const data = JSON.parse(text);
    if (res.status === 200 && data.product?.slug === 'baby-stroller') {
      pass('Product by slug', `id=${data.product.id}`);
    } else {
      fail('Product by slug', `status=${res.status}`);
    }
  } catch (e) {
    fail('Product by slug', e.message);
  }

  try {
    const { res, text } = await fetchText(`${API_URL}/api/products/122`);
    const data = JSON.parse(text);
    if (res.status === 200 && data.product?.slug) {
      pass('Product by numeric ID', `slug=${data.product.slug}`);
    } else {
      fail('Product by numeric ID', `status=${res.status}`);
    }
  } catch (e) {
    fail('Product by numeric ID', e.message);
  }

  try {
    const { res, text } = await fetchText(`${API_URL}/api/products/legacy-redirect?path=products/event/golden_oonjal.html`);
    const data = JSON.parse(text);
    if (res.status === 200 && data.url?.includes('/rent/')) {
      pass('Legacy redirect API', data.url);
    } else {
      fail('Legacy redirect API', text.slice(0, 80));
    }
  } catch (e) {
    fail('Legacy redirect API', e.message);
  }

  try {
    const { res, text } = await fetchText(`${API_URL}/api/products?limit=5&city=Bangalore`);
    const data = JSON.parse(text);
    const withSlug = (data.products || []).filter((p) => p.slug).length;
    if (res.status === 200 && withSlug === (data.products || []).length) {
      pass('Products list includes slugs', `${withSlug}/5`);
    } else {
      fail('Products list includes slugs', `slugs=${withSlug}`);
    }
  } catch (e) {
    fail('Products list includes slugs', e.message);
  }
}

async function testStaticServer() {
  console.log('\n── Static server (build) ──');

  const pages = [
    { path: '/', expectTitle: /PakkaRent/i },
    { path: '/chennai', expectTitle: /Chennai/i },
    { path: '/bangalore', expectTitle: /Bangalore/i },
    { path: '/products/baby-props-rental/bangalore', expectTitle: /Baby Props/i },
    { path: '/rent/baby-stroller/bangalore', expectTitle: /Baby Stroller/i },
    { path: '/blog/washing-machine-on-rent-bangalore-guide', expectTitle: /Washing Machine/i },
    { path: '/faq', expectTitle: /FAQ/i },
  ];

  for (const page of pages) {
    try {
      const { res, text } = await fetchText(`${BASE_URL}${page.path}`);
      const title = extractMeta(text, /<title>([^<]*)<\/title>/i);
      if (res.status === 200 && title && page.expectTitle.test(title)) {
        pass(`Page ${page.path}`, title.slice(0, 60));
      } else {
        fail(`Page ${page.path}`, `status=${res.status} title=${title}`);
      }
    } catch (e) {
      fail(`Page ${page.path}`, e.message);
    }
  }

  // Prerender meta on product page
  try {
    const { text } = await fetchText(`${BASE_URL}/rent/baby-stroller/bangalore`);
    const canonical = extractMeta(text, /rel="canonical" href="([^"]+)"/i);
    const hasProductLd = text.includes('"@type":"Product"') || text.includes('"@type": "Product"');
    const hasNoscript = text.includes('prerender-content') || text.includes('Baby Stroller');
    if (canonical?.includes('/rent/baby-stroller/bangalore') && hasNoscript) {
      pass('Prerender product meta', canonical);
    } else {
      fail('Prerender product meta', `canonical=${canonical}`);
    }
    hasProductLd ? pass('Prerender Product JSON-LD') : fail('Prerender Product JSON-LD');
  } catch (e) {
    fail('Prerender product meta', e.message);
  }

  // 301 redirect numeric product ID
  try {
    const { res } = await fetchText(`${BASE_URL}/products/122`);
    const loc = res.headers.get('location');
    if ((res.status === 301 || res.status === 302) && loc?.includes('/rent/baby-stroller/bangalore')) {
      pass('301 /products/122 → slug URL', loc);
    } else {
      fail('301 /products/122 → slug URL', `status=${res.status} loc=${loc}`);
    }
  } catch (e) {
    fail('301 /products/122 → slug URL', e.message);
  }

  // Legacy HTML redirect via serve.json (may strip .html first, then hit bare-path rule)
  try {
    let url = `${BASE_URL}/products/event/golden_oonjal.html`;
    let hops = 0;
    let finalLoc = null;
    while (hops < 5) {
      const { res } = await fetchText(url);
      const loc = res.headers.get('location');
      if ((res.status === 301 || res.status === 302) && loc) {
        finalLoc = loc;
        url = loc.startsWith('http') ? loc : `${BASE_URL}${loc}`;
        hops += 1;
        if (loc.includes('/rent/')) break;
        continue;
      }
      break;
    }
    if (finalLoc?.includes('/rent/golden-jhula-swing/chennai')) {
      pass('301 legacy HTML redirect', `${hops} hop(s) → ${finalLoc}`);
    } else {
      fail('301 legacy HTML redirect', `loc=${finalLoc}`);
    }
  } catch (e) {
    fail('301 legacy HTML redirect', e.message);
  }

  // SPA fallback for client routes
  try {
    const { res, text } = await fetchText(`${BASE_URL}/cart`);
    if (res.status === 200 && text.includes('id="root"')) {
      pass('SPA fallback /cart', 'index.html served');
    } else {
      fail('SPA fallback /cart', `status=${res.status}`);
    }
  } catch (e) {
    fail('SPA fallback /cart', e.message);
  }

  // Sitemap
  try {
    const { res, text } = await fetchText(`${BASE_URL}/sitemap.xml`);
    const rentCount = (text.match(/\/rent\//g) || []).length;
    const cityCount = (text.match(/\/chennai<\//g) || []).length;
    if (res.status === 200 && rentCount > 50 && cityCount >= 1) {
      pass('Sitemap.xml', `${rentCount} rent URLs`);
    } else {
      fail('Sitemap.xml', `rent=${rentCount}`);
    }
  } catch (e) {
    fail('Sitemap.xml', e.message);
  }

  // robots.txt
  try {
    const { res, text } = await fetchText(`${BASE_URL}/robots.txt`);
    if (res.status === 200 && text.includes('Sitemap:') && text.includes('Disallow: /admin')) {
      pass('robots.txt');
    } else {
      fail('robots.txt');
    }
  } catch (e) {
    fail('robots.txt', e.message);
  }

  // og-image.png
  try {
    const { res } = await fetchText(`${BASE_URL}/og-image.png`, { method: 'HEAD' });
    res.status === 200 ? pass('og-image.png') : fail('og-image.png', `${res.status}`);
  } catch (e) {
    fail('og-image.png', e.message);
  }
}

async function testRedirectChain() {
  console.log('\n── Redirect chains ──');
  const cases = [
    '/products/90',
    '/products/122',
    '/products/123',
  ];
  for (const path of cases) {
    try {
      let url = `${BASE_URL}${path}`;
      let hops = 0;
      let finalUrl = url;
      while (hops < 5) {
        const res = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(10000) });
        if (res.status >= 300 && res.status < 400) {
          const loc = res.headers.get('location');
          url = loc.startsWith('http') ? loc : `${BASE_URL}${loc}`;
          hops += 1;
          finalUrl = url;
          continue;
        }
        break;
      }
      if (finalUrl.includes('/rent/') && hops >= 1) {
        pass(`Redirect chain ${path}`, `${hops} hop → ${finalUrl.replace(BASE_URL, '')}`);
      } else {
        fail(`Redirect chain ${path}`, finalUrl);
      }
    } catch (e) {
      fail(`Redirect chain ${path}`, e.message);
    }
  }
}

async function main() {
  console.log(`E2E tests`);
  console.log(`  BASE_URL=${BASE_URL}`);
  console.log(`  API_URL=${API_URL}`);

  await testApi();
  await testStaticServer();
  await testRedirectChain();

  console.log('\n── Summary ──');
  const passed = results.filter((r) => r.ok).length;
  console.log(`  ${passed}/${results.length} passed, ${failed} failed`);

  if (failed > 0) {
    console.log('\nFailed tests:');
    results.filter((r) => !r.ok).forEach((r) => console.log(`  - ${r.name}: ${r.detail}`));
    process.exit(1);
  }
  console.log('\nAll E2E tests passed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
