import { useEffect } from 'react';

const DEFAULT_TITLE = 'PakkaRent — Rent Smarter, Live Better';
const DEFAULT_DESC = 'Rent appliances, furniture, baby gear, camping kits and event items in Chennai, Bangalore & Hyderabad. Free delivery, flexible monthly tenures and 24x7 support.';
const DEFAULT_OG_IMAGE = '/og-image.svg';
const SITE_NAME = 'PakkaRent';

function setMetaByName(name, content) {
  if (content == null) return;
  let el = document.head.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setMetaByProperty(property, content) {
  if (content == null) return;
  let el = document.head.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * useSEO — declarative SEO updates per route.
 *
 * Options:
 *   title       — full page title (will be set as-is)
 *   titleSuffix — append " | PakkaRent" automatically (default true)
 *   description — meta description
 *   keywords    — meta keywords
 *   image       — OG/Twitter image (absolute URL or path)
 *   canonical   — canonical path or absolute URL (defaults to current URL)
 *   noindex     — emit "noindex, nofollow" robots meta
 *   type        — og:type (default "website")
 */
export default function useSEO({
  title,
  titleSuffix = true,
  description,
  keywords,
  image,
  canonical,
  noindex = false,
  type = 'website',
} = {}) {
  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    const fullTitle = title
      ? (titleSuffix ? `${title} | ${SITE_NAME}` : title)
      : DEFAULT_TITLE;
    const desc = description || DEFAULT_DESC;
    const imgPath = image || DEFAULT_OG_IMAGE;
    const fullImage = imgPath.startsWith('http') ? imgPath : `${origin}${imgPath}`;
    const canonicalUrl = canonical
      ? (canonical.startsWith('http') ? canonical : `${origin}${canonical}`)
      : currentUrl;

    document.title = fullTitle;

    setMetaByName('description', desc);
    if (keywords) setMetaByName('keywords', keywords);
    setMetaByName('robots',
      noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );

    setMetaByProperty('og:type', type);
    setMetaByProperty('og:title', fullTitle);
    setMetaByProperty('og:description', desc);
    setMetaByProperty('og:image', fullImage);
    setMetaByProperty('og:url', canonicalUrl);
    setMetaByProperty('og:site_name', SITE_NAME);

    setMetaByName('twitter:card', 'summary_large_image');
    setMetaByName('twitter:title', fullTitle);
    setMetaByName('twitter:description', desc);
    setMetaByName('twitter:image', fullImage);

    setLink('canonical', canonicalUrl);
  }, [title, titleSuffix, description, keywords, image, canonical, noindex, type]);
}
