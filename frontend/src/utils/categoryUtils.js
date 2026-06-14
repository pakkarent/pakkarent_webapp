/** Top-level categories only (no parent), nav order. */
export function getParentCategories(categories) {
  return (categories || [])
    .filter((c) => !c.parent_id)
    .sort(
      (a, b) =>
        Number(a.sort_order || 0) - Number(b.sort_order || 0) ||
        a.name.localeCompare(b.name)
    );
}

/** Subcategories for a given parent category id. */
export function getSubcategories(categories, parentId) {
  if (!parentId) return [];
  const pid = Number(parentId);
  return (categories || []).filter((c) => Number(c.parent_id) === pid);
}

export function hasSubcategories(categories, parentId) {
  return getSubcategories(categories, parentId).length > 0;
}

/** Products page URL for a category or subcategory row from the API. */
export function getCategoryProductsPath(cat) {
  if (!cat?.id) return '/products';
  if (cat.parent_id) {
    return `/products?category_id=${cat.parent_id}&subcategory_id=${cat.id}`;
  }
  return `/products?category_id=${cat.id}`;
}

export function formatCategoryLabel(product) {
  if (product?.subcategory_name) {
    return `${product.category_name} › ${product.subcategory_name}`;
  }
  return product?.category_name || '';
}
