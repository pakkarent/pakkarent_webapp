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
      'Monthly appliance rentals with free doorstep delivery',
    ],
  },
  bangalore: {
    city: 'Bangalore',
    title: 'Rent Appliances, Event Items & Baby Gear in Bangalore',
    seoDescription:
      'PakkaRent Bangalore — rent home appliances, baby strollers, event backdrops, games and camping gear with flexible rental plans and delivery across Bangalore.',
    keywords:
      'rent appliances Bangalore, baby stroller rent Bangalore, event rental Bangalore, washing machine on rent Bangalore, furniture rental Bangalore, PakkaRent',
    heroHeading: 'Rent smarter in Bangalore',
    heroSub:
      'From home appliances to baby gear, event décor and team-building games — browse Bangalore rentals with doorstep delivery.',
    highlights: [
      'Full catalogue available for Bangalore delivery',
      'Baby props, appliances & event rentals in one place',
      'Flexible monthly and event-based rental plans',
    ],
  },
  hyderabad: {
    city: 'Hyderabad',
    title: 'Rent Appliances, Event Items & Baby Gear in Hyderabad',
    seoDescription:
      'PakkaRent Hyderabad — rent appliances, baby gear, backdrops, birthday props and games with delivery across Hyderabad. Book online or WhatsApp us.',
    keywords:
      'rent appliances Hyderabad, event rental Hyderabad, baby props Hyderabad, backdrop rental Hyderabad, washing machine on rent Hyderabad, PakkaRent',
    heroHeading: 'Rent smarter in Hyderabad',
    heroSub:
      'Appliances, baby gear, event backdrops and party rentals — available for delivery across Hyderabad.',
    highlights: [
      'Hyderabad delivery hub for the full PakkaRent catalogue',
      'Event, backdrop & birthday rentals for functions',
      'Transparent pricing with WhatsApp booking support',
    ],
  },
};

export const CITY_CATEGORY_IDS = [1, 2, 3, 4, 5, 6, 7, 8];

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
  return CITY_CATEGORY_IDS.map((id) => ({
    id,
    name: names[id],
    path: getCategoryPath(id, city),
  }));
}
