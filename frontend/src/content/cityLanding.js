import { PAKKARENT_LOCATIONS } from './locations';
import { getCategoryPath } from '../utils/productUrls';

export const CITY_LANDING = {
  chennai: {
    city: 'Chennai',
    title: 'Rent Appliances, Event Items & Baby Gear in Chennai',
    seoDescription:
      'PakkaRent Chennai — rent washing machines, AC, cradles, backdrops, baby strollers, camping gear and party props with doorstep delivery across Chennai.',
    keywords:
      'rent appliances Chennai, event rental Chennai, baby cradle rental Chennai, washing machine on rent Chennai, backdrop rental Velachery, PakkaRent Chennai',
    heroHeading: 'Rent smarter in Chennai',
    heroSub:
      'Appliances, event rentals, baby props, camping gear and party essentials — delivered across Chennai from our Velachery & Kelambakkam hubs.',
    highlights: [
      'Trusted since 2014 with showrooms in Velachery & Kelambakkam',
      'Naming ceremony cradles, oonjal, backdrops & birthday props',
      'Monthly appliance rentals with flexible tenure plans',
    ],
  },
  bangalore: {
    city: 'Bangalore',
    title: 'Rent Cradles, Event Items & Baby Gear in Bangalore',
    seoDescription:
      'PakkaRent Bangalore — rent cradles, baby strollers, car seats, event backdrops and games with delivery across Bangalore.',
    keywords:
      'cradle rental Bangalore, baby stroller rent Bangalore, car seat rent Bangalore, event rental Bangalore, backdrop rental Bangalore, PakkaRent',
    heroHeading: 'Rent smarter in Bangalore',
    heroSub:
      'From cradles and baby gear to event décor and games — browse Bangalore rentals with doorstep delivery.',
    highlights: [
      'Naming ceremony cradles, swings & backdrops for Bangalore functions',
      'Baby strollers, car seats & high chairs for short stays',
      'Flexible day, week and event-based rental plans',
    ],
  },
  hyderabad: {
    city: 'Hyderabad',
    title: 'Rent Cradles, Event Items & Baby Gear in Hyderabad',
    seoDescription:
      'PakkaRent Hyderabad — rent cradles, baby gear, backdrops, birthday props and games with delivery across Hyderabad. Book online or WhatsApp us.',
    keywords:
      'cradle rental Hyderabad, event rental Hyderabad, baby props Hyderabad, backdrop rental Hyderabad, baby stroller rent Hyderabad, PakkaRent',
    heroHeading: 'Rent smarter in Hyderabad',
    heroSub:
      'Cradles, baby gear, event backdrops and party rentals — available for delivery across Hyderabad.',
    highlights: [
      'Barasala cradles, swings & haldi décor for Hyderabad functions',
      'Event, backdrop & birthday rentals for functions',
      'Transparent pricing with WhatsApp booking support',
    ],
  },
};

/** Categories with products in each city; add an ID here when a city gets its first product in it. */
export const CITY_CATEGORY_IDS = {
  Chennai: [1, 2, 3, 4, 5, 6, 7, 8],
  Bangalore: [3, 4, 5, 6, 8],
  Hyderabad: [1, 3, 4, 5, 6, 8],
};

export function getCityLocation(citySegment) {
  return PAKKARENT_LOCATIONS.find((l) => l.id === citySegment) || null;
}

export function getCityCategoryLinks(city) {
  const names = {
    1: 'Camping Rental',
    2: 'Home Appliances',
    3: 'Event Rental',
    4: 'Backdrop Rental',
    5: 'Birthday Rental',
    6: 'Baby Props',
    7: 'Kids Toys',
    8: 'Games Rental',
  };
  return (CITY_CATEGORY_IDS[city] || []).map((id) => ({
    id,
    name: names[id],
    path: getCategoryPath(id, city),
  }));
}
