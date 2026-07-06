/** Self-hosted marketing images (see scripts/fetch-site-images.js). */
const H = '/images/home';
const C = '/images/cities';

export const HERO_IMAGE = `${H}/hero.webp`;

/** Parent category ids from schema — preferred for home tiles (avoids fuzzy name matches). */
export const CATEGORY_ID_IMAGES = {
  1: `${H}/camping.webp`,
  2: `${H}/home-appliance.webp`,
  3: `${H}/event.webp`,
  4: `${H}/backdrop.webp`,
  5: `${H}/birthday.webp`,
  6: `${H}/baby.webp`,
  7: `${H}/kids.webp`,
  8: `${H}/games.webp`,
};

export const CATEGORY_IMAGES = {
  camping: `${H}/camping.webp`,
  appliance: `${H}/appliance.webp`,
  home: `${H}/home-appliance.webp`,
  event: `${H}/event.webp`,
  backdrop: `${H}/backdrop.webp`,
  birthday: `${H}/birthday.webp`,
  cradle: `${H}/baby.webp`,
  swing: `${H}/baby.webp`,
  oonjal: `${H}/baby.webp`,
  chair: `${H}/furniture.webp`,
  furniture: `${H}/furniture.webp`,
  decor: `${H}/event.webp`,
  urli: `${H}/event.webp`,
  baby: `${H}/baby.webp`,
  kids: `${H}/kids.webp`,
  toy: `${H}/kids.webp`,
  game: `${H}/games.webp`,
};

export const CATEGORY_FALLBACKS = [
  `${H}/home-appliance.webp`,
  `${H}/event.webp`,
  `${H}/camping.webp`,
  `${H}/birthday.webp`,
];

export const PROMO_BANNERS = [
  {
    tag: 'Most Popular',
    heading: 'Birthday &',
    headingAccent: 'Party Rentals',
    sub: 'Decorations, props, backdrops & more',
    cta: 'Explore now',
    link: '/products?category_id=5',
    img: `${H}/promo-birthday.webp`,
    bg: '#FFF3E0',
  },
  {
    tag: 'Top Rated',
    heading: 'Baby &',
    headingAccent: 'Kids Essentials',
    sub: 'Strollers, cribs, toys & gear on rent',
    cta: 'Rent now',
    link: '/products?category_id=6',
    img: `${H}/promo-baby.webp`,
    bg: '#E8F5E9',
  },
];

export const CITY_IMAGES = {
  Chennai: `${C}/chennai.webp`,
  Bangalore: `${C}/bangalore.webp`,
  Hyderabad: `${C}/hyderabad.webp`,
};

export function getCategoryImage(category, idx = 0) {
  const id = typeof category === 'object' ? category?.id : null;
  const name = (typeof category === 'string' ? category : category?.name || '').toLowerCase();

  if (id && CATEGORY_ID_IMAGES[id]) return CATEGORY_ID_IMAGES[id];

  for (const [key, url] of Object.entries(CATEGORY_IMAGES)) {
    if (name.includes(key)) return url;
  }
  return CATEGORY_FALLBACKS[idx % CATEGORY_FALLBACKS.length];
}
