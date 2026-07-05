const { slugifyProductName, cityUrlSegment } = require('./slug');

/** Legacy HTML paths from the old pakkarent.com site → catalog product name + city. */
const LEGACY_ENTRIES = [
  { path: 'products/backdrop/bananaleaf_backdrop.html', name: 'Banana Leaf Backdrop', city: 'Chennai' },
  { path: 'products/backdrop/dreamy_ring_backdrop.html', name: 'Dreamy Ring Birthday Backdrop', city: 'Chennai' },
  { path: 'hyderabad/products/backdrop/elegant_greenish_backdrop_rental.html', name: 'Elegant Greenish Backdrop', city: 'Hyderabad' },
  { path: 'products/backdrop/flowerwall_backdrop.html', name: 'Flower Wall Backdrop', city: 'Chennai' },
  { path: 'products/event/golden_oonjal.html', name: 'Golden Jhula / Swing', city: 'Chennai' },
  { path: 'products/backdrop/pink_rani_backdrop.html', name: 'Pink Rani Backdrop', city: 'Chennai' },
  { path: 'products/backdrop/haldi_urli_with_backdrop_decoration_rental.html', name: 'Yellow Lily Blossom Backdrop Setup', city: 'Chennai' },
  { path: 'products/baby/kids_car_rental.html', name: 'Baby Car for Birthday', city: 'Chennai' },
  { path: 'products/baby/baby_jeep_rent.html', name: 'Baby Jeep Rental', city: 'Chennai' },
  { path: 'products/event/rolu_rokali.html', name: 'Silver Rolu Rokali', city: 'Chennai' },
  { path: 'products/event/oonjal.html', name: 'Teak Jhula / Swing', city: 'Chennai' },
  { path: 'products/event/royal_golden_sofa.html', name: 'Royal Golden Sofa', city: 'Chennai' },
  { path: 'products/event/chair_rent.html', name: 'Armless Chairs', city: 'Chennai' },
  { path: 'products/event/red_carpet_rental.html', name: 'Red Carpet', city: 'Chennai' },
  { path: 'products/event/balloondecor.html', name: 'LED Lights', city: 'Chennai' },
  { path: 'products/event/wooden_cake_stand_combo.html', name: 'Wooden Cake Stands', city: 'Chennai' },
  { path: 'products/event/silver_cradle.html', name: 'Silver Grand Cradle', city: 'Chennai' },
  { path: 'products/event/crown.html', name: 'Classic Crown Cradle', city: 'Chennai' },
  { path: 'products/event/grand_moon_cradle_rental.html', name: 'Grand Moon Cradle', city: 'Chennai' },
  { path: 'products/home_appliances/washing_machine.html', name: 'Washing Machine', city: 'Chennai' },
  { path: 'products/home_appliances/fridge.html', name: 'Fridge', city: 'Chennai' },
  { path: 'products/home_appliances/ac.html', name: 'Air Conditioner', city: 'Chennai' },
  { path: 'products/camping/camping_tent.html', name: 'Camping Tents - Double Layer', city: 'Chennai' },
  { path: 'products/baby/stroller.html', name: 'Baby Stroller', city: 'Chennai' },
  { path: 'store/event/index.html', name: 'Event Rental', city: 'Chennai' },
  { path: 'store/baby/baby.html', name: 'Baby Props Rental', city: 'Chennai' },
];

function normalizeLegacyPath(rawPath) {
  return String(rawPath || '')
    .toLowerCase()
    .replace(/^https?:\/\/[^/]+/i, '')
    .replace(/^\//, '')
    .replace(/\\/g, '/');
}

function resolveLegacyRedirect(rawPath) {
  const normalized = normalizeLegacyPath(rawPath);
  if (!normalized) return null;

  const exact = LEGACY_ENTRIES.find((e) => e.path === normalized);
  if (exact) {
    return { slug: slugifyProductName(exact.name), city: exact.city };
  }

  const filename = normalized.split('/').pop().replace(/\.html$/i, '');
  if (!filename) return null;

  const byFile = LEGACY_ENTRIES.find((e) => {
    const legacyFile = e.path.split('/').pop().replace(/\.html$/i, '');
    return legacyFile === filename;
  });
  if (byFile) {
    return { slug: slugifyProductName(byFile.name), city: byFile.city };
  }

  return null;
}

function legacyRedirectUrl(rawPath, origin = '') {
  const target = resolveLegacyRedirect(rawPath);
  if (!target) return null;
  const path = `/rent/${target.slug}/${cityUrlSegment(target.city)}`;
  return origin ? `${origin.replace(/\/$/, '')}${path}` : path;
}

module.exports = {
  LEGACY_ENTRIES,
  normalizeLegacyPath,
  resolveLegacyRedirect,
  legacyRedirectUrl,
};
