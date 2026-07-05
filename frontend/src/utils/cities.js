/** City options for location picker and navbar. */
import { CITY_IMAGES } from '../content/siteImages';

export const CITIES = ['Chennai', 'Bangalore', 'Hyderabad'];

export const CITY_OPTIONS = [
  {
    name: 'Chennai',
    tagline: 'Marina & more',
    image: CITY_IMAGES.Chennai,
  },
  {
    name: 'Bangalore',
    tagline: 'Garden City',
    image: CITY_IMAGES.Bangalore,
  },
  {
    name: 'Hyderabad',
    tagline: 'City of Pearls',
    image: CITY_IMAGES.Hyderabad,
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
