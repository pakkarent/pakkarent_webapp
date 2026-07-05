import { categorySlugFromId } from './categorySlugs';
import { cityUrlSegment } from './cityUrls';

/** Canonical product page path. Falls back to numeric id when slug missing. */
export function getProductPath(product) {
  if (!product) return '/products';
  if (product.slug) {
    return `/rent/${product.slug}/${cityUrlSegment(product.city)}`;
  }
  if (product.id) return `/products/${product.id}`;
  return '/products';
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
