/** Top-level categories only (no parent). */
export function getParentCategories(categories) {
  return (categories || []).filter((c) => !c.parent_id);
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

export function formatCategoryLabel(product) {
  if (product?.subcategory_name) {
    return `${product.category_name} › ${product.subcategory_name}`;
  }
  return product?.category_name || '';
}
