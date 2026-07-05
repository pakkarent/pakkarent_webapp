import { getCategoryPath } from '../utils/productUrls';

const DEFAULT_CITY = 'Chennai';

/** Internal catalog URLs for blog backlinks and CTAs (Chennai paths; city pages use getCategoryPath directly). */
export const CATALOG_LINKS = {
  all: '/products',
  event: getCategoryPath(3, DEFAULT_CITY),
  cradle: `${getCategoryPath(3, DEFAULT_CITY)}?subcategory_id=10`,
  swings: `${getCategoryPath(3, DEFAULT_CITY)}?subcategory_id=13`,
  chairs: `${getCategoryPath(3, DEFAULT_CITY)}?subcategory_id=11`,
  decor: `${getCategoryPath(3, DEFAULT_CITY)}?subcategory_id=9`,
  props: `${getCategoryPath(3, DEFAULT_CITY)}?subcategory_id=12`,
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
