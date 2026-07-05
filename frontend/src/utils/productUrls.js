/** City segment for SEO product URLs (/rent/:slug/:city). */
export function cityUrlSegment(city) {
  if (!city || city === 'all') return 'india';
  return city.toLowerCase();
}

/** Canonical product page path. Falls back to numeric id when slug missing. */
export function getProductPath(product) {
  if (!product) return '/products';
  if (product.slug) {
    return `/rent/${product.slug}/${cityUrlSegment(product.city)}`;
  }
  if (product.id) return `/products/${product.id}`;
  return '/products';
}

/** Absolute product URL for schema / sharing. */
export function getProductUrl(product, origin = '') {
  const base = origin || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base.replace(/\/$/, '')}${getProductPath(product)}`;
}
