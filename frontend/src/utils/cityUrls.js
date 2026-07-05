/** URL city segments for SEO routes. */
export const CITY_URL_SEGMENTS = ['chennai', 'bangalore', 'hyderabad'];

const SEGMENT_TO_CITY = {
  chennai: 'Chennai',
  bangalore: 'Bangalore',
  hyderabad: 'Hyderabad',
  india: 'all',
};

const CITY_TO_SEGMENT = {
  Chennai: 'chennai',
  Bangalore: 'bangalore',
  Hyderabad: 'hyderabad',
  all: 'india',
};

export function cityUrlSegment(city) {
  if (!city || city === 'all') return 'india';
  return CITY_TO_SEGMENT[city] || String(city).toLowerCase();
}

export function cityFromUrlSegment(segment) {
  if (!segment) return null;
  return SEGMENT_TO_CITY[String(segment).toLowerCase()] ?? null;
}

export function isCityUrlSegment(segment) {
  return CITY_URL_SEGMENTS.includes(String(segment || '').toLowerCase());
}

export function getCityLandingPath(city) {
  return `/${cityUrlSegment(city)}`;
}
