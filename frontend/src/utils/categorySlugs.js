/** SEO slug ↔ category id (matches backend category names). */
export const CATEGORY_SLUGS = {
  1: 'camping-rental',
  2: 'home-appliances-rental',
  3: 'event-rental',
  4: 'backdrop-rental',
  5: 'birthday-rental',
  6: 'baby-props-rental',
  7: 'kids-toys-on-rent',
  8: 'games-rental',
};

const SLUG_TO_ID = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([id, slug]) => [slug, Number(id)])
);

export const CATEGORY_SLUG_LIST = Object.values(CATEGORY_SLUGS);

export function categoryIdFromSlug(slug) {
  return SLUG_TO_ID[String(slug || '').toLowerCase()] ?? null;
}

export function categorySlugFromId(id) {
  return CATEGORY_SLUGS[Number(id)] ?? null;
}

export function isCategorySlug(value) {
  return CATEGORY_SLUG_LIST.includes(String(value || '').toLowerCase());
}
