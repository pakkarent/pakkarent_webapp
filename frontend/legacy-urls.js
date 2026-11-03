/**
 * Old static-site URLs → new catalog URLs, used by server.js for one-hop 301s.
 *
 * Old pages looked like /{City}/products/{folder}/{file}.html and
 * /{City}/store/{folder}/{file}.html; with no city prefix they were the Chennai pages.
 * List compiled from Search Console's page report (16 months of .html URLs).
 *
 * A product only redirects to its page if that city still stocks it; otherwise the visitor
 * goes to the closest non-empty listing in the same city. `catalog` comes from
 * build/legacy-catalog.json, written by scripts/generate-redirects.js.
 */

const FOLDER_CATEGORY = {
  baby: 'baby-props-rental',
  toys: 'kids-toys-on-rent',
  event: 'event-rental',
  prop: 'event-rental',
  propstore: 'event-rental',
  backdrop: 'backdrop-rental',
  camping: 'camping-rental',
  home_appliances: 'home-appliances-rental',
  game_rental: 'games-rental',
  games: 'games-rental',
};

/** Event subcategory IDs (stable seed IDs). */
const SUBCATEGORY = { cradle: 10, swing: 13, props: 12 };

/** Old file name → product slug. Files shared across folders behave the same in each. */
const FILE_SLUG = {
  stroller: 'baby-stroller',
  carseat: 'baby-car-seat',
  high_chair: 'high-chair',
  baby_crib: 'baby-crib-with-mattress',
  kids_car_rental: 'kids-car-rental',
  baby_jeep_rent: 'kids-jeep-rental',
  kids_swing_slide_rental: 'kids-slide-and-swing-rental',

  urli_rental: 'lotus-urli-for-haldi',
  rolu_rokali: 'silver-rolu-rokali',
  compact_cradle: 'compact-cradle',
  welcome_board_stand: 'welcome-board-stand',
  cylindercakestand: 'cylindrical-cake-table',
  silver_cradle: 'silver-cradle',
  red_carpet_rental: 'red-carpet',
  mangalasnanam: 'gangalam-mangala-snanam-set',
  round_backdrop_stand_rental: 'round-backdrop-stand',
  chair_rent: 'armless-chairs-10-nos',
  oonjal: 'teak-wood-oonjal-swing-jhula',
  golden_oonjal: 'golden-jhula-swing',
  manai: 'wooden-manai-palagai-puja-manakatti',
  royal_golden_sofa: 'royal-golden-sofa',
  grand_moon_cradle_rental: 'grand-moon-cradle',
  royal_chair: 'royal-teak-wood-chair',
  golden_babycradle_rent: 'golden-baby-cradle',
  crown_cradle: 'crown-baby-cradle',
  crown: 'crown-baby-cradle',
  peacock_silver_cradle: 'silver-peacock-cradle',
  classiccradle: 'classic-teak-cradle',
  lotus_cradle: 'royal-chain-lotus-cradle',
  chalkboardstand: 'chalk-board-stand',
  balloondecor: 'led-lights',
  wooden_cake_stand_combo: 'wooden-cake-stands',
  marquee_letters: 'marquee-letters',
  one_letter: 'marquee-letters',

  barbeque: 'barbeque-grill',
  gas_stove: 'camping-stove',
  cooler_box: 'cooler-box',
  camping_tent: 'camping-tents-double-layer',
  outdoorbarbeque: 'outdoor-barbeque',
  dress_changing: 'dress-changing-tent',
  life_jacket: 'life-jackets',
  party_speaker: 'party-speaker',
  sleeping_bag: 'sleeping-bags',
  lantern: 'camping-lantern',

  ac: 'air-conditioner',
  tv: 'led-tv',
  washing_machine: 'washing-machine',
  fridge: 'fridge',

  tug_of_war_rope: 'tug-of-war-rope',
  bouncyhouse: 'grand-bouncy-castle-rental-for-event',
  moon_walk_game: 'moon-walk-game',

  white_floral_backdrop: 'white-floral-backdrop',
  elegant_greenish_backdrop_rental: 'elegant-greenish-backdrop',
  haldi_urli_with_backdrop_decoration_rental: 'yellow-lily-blossom-backdrop-setup',
  charmpeach_backdrop: 'charming-peach-backdrop',
  garland_grass_backdrop: 'garland-grass-backdrop',
  bananaleaf_backdrop: 'banana-leaf-backdrop',
  heritage_grass_backdrop: 'heritage-grass-backdrop',
  dreamy_ring_backdrop: 'dreamy-ring-birthday-backdrop',
  pink_rani_backdrop: 'pink-rani-backdrop',
};

function subcategoryFor(folder, file) {
  if (folder === 'prop' || folder === 'propstore') return SUBCATEGORY.props;
  if (folder !== 'event') return null;
  if (/cradle/.test(file)) return SUBCATEGORY.cradle;
  if (/swing|oonjal|jhula/.test(file)) return SUBCATEGORY.swing;
  return null;
}

function listingTarget(city, folder, file, catalog) {
  const entry = catalog?.[city];
  const category = FOLDER_CATEGORY[folder];
  if (!entry || !entry.categories.includes(category)) return `/${city}`;
  const base = `/products/${category}/${city}`;
  const sub = subcategoryFor(folder, file);
  return sub && entry.subcategories.includes(sub) ? `${base}?subcategory_id=${sub}` : base;
}

/** Returns the new path for an old-site pathname, or null if it isn't one. */
function legacyPathTarget(pathname, catalog) {
  const clean = String(pathname || '').toLowerCase().replace(/\/+$/, '');

  const m = clean.match(/^(?:\/(chennai|bangalore|hyderabad))?\/(products|store)\/([^/]+)(?:\/([^/]+))?$/);
  if (m) {
    const [, cityPrefix, section, folder, rawFile = ''] = m;
    if (!FOLDER_CATEGORY[folder]) return null;
    if (section === 'products' && !rawFile) return null;
    const city = cityPrefix || 'chennai';
    const file = rawFile.replace(/\.html$/, '');

    const slug = section === 'products' ? FILE_SLUG[file] : null;
    if (slug && catalog?.[city]?.slugs.includes(slug)) return `/rent/${city}/${slug}`;
    return listingTarget(city, folder, file, catalog);
  }

  const other = clean.match(/^(?:\/(chennai|bangalore|hyderabad))?\/(gallery|cradlegallery|photography)(?:\/.*)?$/);
  if (other) return other[1] ? `/${other[1]}` : '/';
  if (/^\/policy(\.html)?$/.test(clean)) return '/terms';

  return null;
}

module.exports = { legacyPathTarget };
