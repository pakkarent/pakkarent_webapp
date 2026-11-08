import { getDayWeekTiers, getPricingType } from '../utils/productPricing';

/**
 * Search wording for category and product pages, shared by the React pages and the
 * build-time prerender (scripts/seo-utils.js). Terms come from Search Console queries
 * that used to send traffic (e.g. "cake cutting table for rent", "backdrop stand for
 * rent", "thottil for rent") and the local names competitors rank with
 * (uyyala / barasala in Hyderabad, rolu rokallu, German silver cradles).
 */

/** Keyword-led page titles per category ID, kept under ~52 chars before " | PakkaRent". */
const CATEGORY_TITLES = {
  1: 'Camping Tents & Gear on Rent',
  2: 'Washing Machine, Fridge & AC on Rent',
  3: 'Cradle, Oonjal & Event Items on Rent',
  4: 'Backdrops & Backdrop Stands on Rent',
  5: 'Cake Table & Birthday Decor on Rent',
  6: 'Stroller, Car Seat & High Chair on Rent',
  7: 'Kids Toys, Slides & Ride-on Cars on Rent',
  8: 'Tug of War & Bouncy Castle on Rent',
};

const CATEGORY_INTROS = {
  1: 'Rent camping tents, sleeping bags, barbeque grills and camping stoves for weekend trips',
  2: 'Rent a washing machine, fridge, AC or LED TV on a monthly plan',
  3: 'Rent baby cradles for naming ceremonies, oonjal swings, rolu rokali, urli, chairs and event props',
  4: 'Rent backdrops, backdrop stands and welcome board stands for haldi, birthdays and baby showers',
  5: 'Rent cake cutting tables, cake stands, birthday backdrops and kids ride-on cars for birthday parties',
  6: 'Rent a baby stroller (pram), baby car seat, high chair or crib for short stays and visiting family',
  7: 'Rent kids slides, swings, ball pits and ride-on cars and jeeps for parties and play',
  8: 'Rent tug of war rope, bouncy castles, trampolines and team games for school, office and birthday events',
};

/** Local words for a cradle, swing and naming ceremony in each city. */
const LOCAL_TERMS = {
  Chennai: { cradle: 'thottil', swing: 'oonjal', naming: 'naming ceremony (namakaranam)' },
  Bangalore: { cradle: 'thottilu', swing: 'uyyale', naming: 'naming ceremony (namakarana)' },
  Hyderabad: { cradle: 'uyyala', swing: 'uyyala / jhula', naming: 'barasala (naming ceremony)' },
};

export function categorySeoTitle(categoryId, city) {
  const base = CATEGORY_TITLES[Number(categoryId)];
  return base ? `${base} in ${city}` : null;
}

export function categoryIntro(categoryId, city) {
  const intro = CATEGORY_INTROS[Number(categoryId)];
  return intro ? `${intro} in ${city}, with doorstep delivery.` : '';
}

function productKind(product) {
  const text = `${product?.slug || ''} ${product?.name || ''}`.toLowerCase();
  const sub = Number(product?.subcategory_id);
  if (sub === 10 || (Number(product?.category_id) === 3 && /cradle/.test(text))) return 'cradle';
  if (sub === 13 || (Number(product?.category_id) === 3 && /oonjal|jhula|swing/.test(text))) return 'swing';
  if (/rolu|rokali/.test(text)) return 'rolu';
  if (/urli/.test(text)) return 'urli';
  if (/gangalam|snanam|kalasam/.test(text)) return 'ritual';
  if (/cake/.test(text)) return 'cake';
  if (/backdrop-stand|welcome-board|chalk-board/.test(text)) return 'stand';
  if (Number(product?.category_id) === 4 || /backdrop/.test(text)) return 'backdrop';
  if (/stroller/.test(text)) return 'stroller';
  if (/car-seat/.test(text)) return 'carseat';
  if (/high-chair/.test(text)) return 'highchair';
  if (/crib/.test(text)) return 'crib';
  if (/tug-of-war/.test(text)) return 'tugofwar';
  if (/bouncy|trampoline/.test(text)) return 'bouncy';
  return null;
}

/** One natural sentence with the terms people search for this kind of product. */
export function productSearchCopy(product) {
  const city = product?.city === 'all' ? null : product?.city;
  const where = city ? ` in ${city}` : '';
  const local = LOCAL_TERMS[city] || { cradle: 'thottil / uyyala', swing: 'oonjal / jhula', naming: 'naming ceremony' };
  switch (productKind(product)) {
    case 'cradle':
      return `Looking for a baby cradle or ${local.cradle} for rent${where}? This cradle is rented per event for the ${local.naming}, cradle ceremony and photo shoots, delivered and picked up by our team.`;
    case 'swing':
      return `An ${local.swing} swing for rent${where} for weddings, seemantham, valaikappu and baby showers — rented per event with delivery and pickup.`;
    case 'rolu':
      return `Rolu rokali (rolu rokallu) for rent${where} for haldi, mangala snanam and pellikuthuru rituals — rented per event.`;
    case 'urli':
      return `Haldi urli / lotus tub for rent${where} for haldi and mangala snanam ceremonies — rented per event with delivery.`;
    case 'ritual':
      return `Haldi and mangala snanam ritual items for rent${where}, rented per event with delivery and pickup.`;
    case 'cake':
      return `Cake cutting table and cake stand for rent${where} for birthday parties and baby showers — a ready cake table setup, rented per event.`;
    case 'stand':
      return `Backdrop stand, decoration stand and welcome board stand for rent${where} for weddings, birthdays and haldi — rented per event.`;
    case 'backdrop':
      return `Backdrop decoration for rent${where} with stand, for haldi, birthdays, baby showers and home functions — rented per event.`;
    case 'stroller':
      return `Baby stroller / pram for rent${where} for short stays, airport trips and visiting family — rent for a couple of days or by the week.`;
    case 'carseat':
      return `Baby car seat for rent${where} for newborns and toddlers — rent for a day or by the week for trips and visiting family.`;
    case 'highchair':
      return `Baby high chair for rent${where} for family visits and short stays — rent for a day or by the week.`;
    case 'crib':
      return `Baby crib / cot with mattress for rent${where} for visiting families and short stays.`;
    case 'tugofwar':
      return `Tug of war rope for rent${where} for school sports days, office team building and family events.`;
    case 'bouncy':
      return `Bouncy castle and trampoline for rent${where} for kids birthday parties and events, delivered and set up by our team.`;
    default:
      return '';
  }
}

/** Product page title, with the starting price when it still fits in a search result. */
export function productSeoTitle(product) {
  const city = product?.city === 'all' ? 'India' : product?.city;
  const base = `${product?.name} on Rent in ${city}`;
  const tiers = getDayWeekTiers(product);
  const price = tiers ? tiers.shortPrice : Number(product?.monthly_price);
  const unit = tiers ? '' : { per_month: '/mo', per_event: '', per_day: '/day' }[getPricingType(product)] || '';
  const withPrice = `${base} – ₹${Number(price).toLocaleString('en-IN')}${unit}`;
  // " | PakkaRent" adds 12 characters; Google cuts titles after ~65.
  return price > 0 && withPrice.length <= 53 ? withPrice : base;
}
