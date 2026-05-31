/** City options for location picker and navbar. */
export const CITIES = ['Chennai', 'Bangalore', 'Hyderabad'];

export const CITY_OPTIONS = [
  {
    name: 'Chennai',
    tagline: 'Marina & more',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=320&h=200&fit=crop&q=80',
  },
  {
    name: 'Bangalore',
    tagline: 'Garden City',
    image: 'https://images.unsplash.com/photo-1685392348279-34fe7a2ea624?w=320&h=200&fit=crop&q=80',
  },
  {
    name: 'Hyderabad',
    tagline: 'City of Pearls',
    image: 'https://images.unsplash.com/photo-1741545979534-02f59c742730?w=320&h=200&fit=crop&q=80',
  },
];

const CONFIRMED_KEY = 'pakkarent_city_confirmed';
const CITY_KEY = 'pakkarent_city';

/** True only after the user explicitly picked a city (or continued once). */
export function hasConfirmedCity() {
  try {
    return localStorage.getItem(CONFIRMED_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markCityConfirmed(cityName) {
  localStorage.setItem(CITY_KEY, cityName);
  localStorage.setItem(CONFIRMED_KEY, 'true');
}

export function getStoredCity() {
  try {
    return localStorage.getItem(CITY_KEY) || 'Chennai';
  } catch {
    return 'Chennai';
  }
}
