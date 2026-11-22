import { getCategoryPath, getSubcategoryPath } from '../utils/productUrls';

const DEFAULT_CITY = 'Chennai';

/** Internal catalog URLs for blog backlinks and CTAs (Chennai paths; city pages use getCategoryPath directly). */
export const CATALOG_LINKS = {
  all: '/products',
  event: getCategoryPath(3, DEFAULT_CITY),
  cradle: getSubcategoryPath(3, 10, DEFAULT_CITY),
  swings: getSubcategoryPath(3, 13, DEFAULT_CITY),
  chairs: getSubcategoryPath(3, 11, DEFAULT_CITY),
  decor: getSubcategoryPath(3, 9, DEFAULT_CITY),
  props: getSubcategoryPath(3, 12, DEFAULT_CITY),
  backdrop: getCategoryPath(4, DEFAULT_CITY),
  birthday: getCategoryPath(5, DEFAULT_CITY),
  babyProps: getCategoryPath(6, DEFAULT_CITY),
  kidsToys: getCategoryPath(7, DEFAULT_CITY),
  games: getCategoryPath(8, DEFAULT_CITY),
  camping: getCategoryPath(1, DEFAULT_CITY),
  appliances: getCategoryPath(2, DEFAULT_CITY),
  howItWorks: '/how-it-works',
  delivery: '/delivery-info',
  faq: '/faq',
  contact: '/contact',
};

/** Product page URL for blog backlinks: /rent/{city}/{slug}. */
export const rentLink = (city, slug) => `/rent/${String(city).toLowerCase()}/${slug}`;

/** Category URLs for one city — used by location-specific blog posts. */
export function cityCatalogLinks(city) {
  const event = getCategoryPath(3, city);
  return {
    city: `/${String(city).toLowerCase()}`,
    event,
    cradle: getSubcategoryPath(3, 10, city),
    swings: getSubcategoryPath(3, 13, city),
    decor: getSubcategoryPath(3, 9, city),
    props: getSubcategoryPath(3, 12, city),
    backdrop: getCategoryPath(4, city),
    birthday: getCategoryPath(5, city),
    babyProps: getCategoryPath(6, city),
    kidsToys: getCategoryPath(7, city),
    games: getCategoryPath(8, city),
  };
}
