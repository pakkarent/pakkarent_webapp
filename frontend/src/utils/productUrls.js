import { categorySlugFromId } from './categorySlugs';
import { cityUrlSegment } from './cityUrls';

/**
 * Canonical product page path: /rent/{city}/{slug}
 * city=all → /rent/india/{slug} (single canonical; do not invent per-city duplicates).
 */
export function getProductPath(product) {
  if (!product) return '/products';
  if (product.slug) {
    return `/rent/${cityUrlSegment(product.city)}/${product.slug}`;
  }
  if (product.id) return `/products/${product.id}`;
  return '/products';
}

/** Pre-migration path /rent/{slug}/{city} — used only for 301 generation. */
export function getLegacySlugCityProductPath(product) {
  if (!product?.slug) return null;
  return `/rent/${product.slug}/${cityUrlSegment(product.city)}`;
}

/** SEO category listing path: /products/baby-props-rental/bangalore */
export function getCategoryPath(categoryId, city) {
  const slug = categorySlugFromId(categoryId);
  if (!slug || !city) return `/products?category_id=${categoryId}`;
  return `/products/${slug}/${cityUrlSegment(city)}`;
}

/** Absolute product URL for schema / sharing. */
export function getProductUrl(product, origin = '') {
  const base = origin || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base.replace(/\/$/, '')}${getProductPath(product)}`;
}

/** Absolute category URL for schema / sharing. */
export function getCategoryUrl(categoryId, city, origin = '') {
  const base = origin || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base.replace(/\/$/, '')}${getCategoryPath(categoryId, city)}`;
}
