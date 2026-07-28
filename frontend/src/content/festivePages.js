import { getCategoryPath } from '../utils/productUrls';

const EVENT_CTA = { label: 'Browse event rentals', categoryId: 3 };
const BACKDROP_CTA = { label: 'Browse backdrops', categoryId: 4 };
const BIRTHDAY_CTA = { label: 'Browse birthday rentals', categoryId: 5 };

export const FESTIVE_PAGES = {
  haldi: {
    slug: 'haldi',
    title: 'Haldi Rentals',
    shortTitle: 'Haldi',
    seoDescription:
      'Plan a beautiful haldi setup with lotus urli, Rolu Rokali, mangala snanam sets and haldi backdrops from PakkaRent.',
    keywords:
      'haldi rental, haldi backdrop rental, lotus urli rent, rolu rokali rental, mangala snanam set rental, PakkaRent',
    heroTitle: 'Haldi setup rentals in one place',
    heroSub:
      'From urli and Gangalam to Rolu Rokali and grass backdrops, build a complete haldi setup for home, hall or studio functions.',
    highlights: [
      'Curated ritual decor and backdrop combinations',
      'City-aware selection for Chennai, Bangalore and Hyderabad',
      'Easy WhatsApp enquiry after browsing the shortlist',
    ],
    comboIdeas: [
      'Simple home haldi: Lotus Urli + Gangalam + Haldi Grass Backdrop',
      'Premium stage haldi: Yellow Lily Blossom Backdrop + Rolu Rokali + floral add-ons',
      'Traditional Telugu setup: Mangala Snanam set + Lotus Urli + backdrop stand',
    ],
    sections: [
      {
        title: 'Ritual essentials',
        blurb: 'Core ceremony items that customers usually ask for first.',
        slugs: ['lotus-urli-for-haldi', 'gangalam-set-for-haldi', 'gangalam-mangala-snanam-set', 'silver-rolu-rokali', 'rolu-rokali-ural-for-wedding'],
      },
      {
        title: 'Backdrop & stage decor',
        blurb: 'Background decor to complete the haldi photo setup.',
        slugs: ['haldi-grass-backdrop', 'yellow-lily-blossom-backdrop-setup', 'traditional-grass-backdrop', 'banana-leaf-backdrop', 'white-floral-backdrop', 'round-backdrop-stand'],
      },
      {
        title: 'Popular add-ons',
        blurb: 'Extra pieces customers often combine with their haldi décor.',
        slugs: ['welcome-board-stand', 'led-lights', 'red-carpet', 'royal-golden-sofa'],
      },
    ],
    ctas: [EVENT_CTA, BACKDROP_CTA],
  },
  'naming-ceremony': {
    slug: 'naming-ceremony',
    title: 'Naming Ceremony Rentals',
    shortTitle: 'Naming Ceremony',
    seoDescription:
      'Rent naming ceremony cradles, cradle backdrops, welcome stands and event decor for Naamkaran functions on PakkaRent.',
    keywords:
      'naming ceremony rental, cradle rental, naamkaran cradle, welcome stand rent, cradle backdrop rental',
    heroTitle: 'Naming ceremony setup planner',
    heroSub:
      'Choose your cradle first, then complete the setup with backdrops, welcome stands and lighting for a polished Naamkaran function.',
    highlights: [
      'Silver, teak and golden cradle options',
      'Backdrop ideas for home and mini-hall functions',
      'Curated add-ons for naming ceremony enquiries',
    ],
    comboIdeas: [
      'Classic setup: Silver cradle + Welcome Board Stand + White Floral Backdrop',
      'Traditional setup: Teak cradle + Traditional Lotus Backdrop + LED Lights',
      'Premium setup: Peacock cradle + ring decoration + photo backdrop',
    ],
    sections: [
      {
        title: 'Centerpiece cradles',
        blurb: 'Cradles that anchor the full function setup.',
        slugs: ['silver-grand-cradle', 'silver-peacock-cradle', 'silver-cradle', 'traditional-teak-cradle', 'classic-teak-cradle', 'golden-baby-cradle', 'royal-chain-cradle', 'royal-chain-lotus-cradle', 'compact-cradle', 'crown-baby-cradle', 'cultural-cradle', 'grand-moon-cradle'],
      },
      {
        title: 'Backdrop & photo stage',
        blurb: 'Popular backdrops used around cradle stages.',
        slugs: ['white-floral-backdrop', 'white-swan-backdrop', 'traditional-lotus-backdrop', 'pink-rani-backdrop', 'crown-cradle-ring-decoration', 'round-backdrop-stand'],
      },
      {
        title: 'Useful add-ons',
        blurb: 'Simple extras to finish the ceremony setup cleanly.',
        slugs: ['welcome-board-stand', 'led-lights', 'red-carpet'],
      },
    ],
    ctas: [EVENT_CTA, BACKDROP_CTA],
  },
  'baby-shower': {
    slug: 'baby-shower',
    title: 'Baby Shower Rentals',
    shortTitle: 'Baby Shower',
    seoDescription:
      'Browse baby shower and seemandham rentals including jhula swings, floral backdrops, urli decor and stage props on PakkaRent.',
    keywords:
      'baby shower rental, seemandham rental, jhula rent, floral backdrop rent, urli rental, PakkaRent',
    heroTitle: 'Baby shower and seemandham ideas',
    heroSub:
      'Plan an elegant baby shower setup with swings, floral backdrops, urli décor and stage add-ons matched to your city.',
    highlights: [
      'Best for baby shower, seemandham and home functions',
      'Mix swings, backdrops and ritual decor on one page',
      'Helpful for customers who enquire by occasion instead of category',
    ],
    comboIdeas: [
      'Elegant floral setup: Golden Jhula + White Floral Backdrop + Welcome Board Stand',
      'Traditional seemandham: Lotus Urli + sofa seating + floral stage backdrop',
      'Compact home setup: backdrop stand + lights + stage décor',
    ],
    sections: [
      {
        title: 'Main setup pieces',
        blurb: 'Center-stage pieces for the ceremony.',
        slugs: ['golden-jhula-swing', 'teak-jhula-swing', 'teak-wood-oonjal-swing-jhula', 'royal-golden-sofa'],
      },
      {
        title: 'Floral & theme backdrops',
        blurb: 'Decor options that work especially well for baby showers.',
        slugs: ['white-floral-backdrop', 'white-swan-backdrop', 'charming-peach-backdrop', 'birthday-flowerwall-backdrop', 'flower-wall-backdrop', 'pink-rani-backdrop', 'elegant-greenish-backdrop', 'baby-blue-backdrop'],
      },
      {
        title: 'Decor add-ons',
        blurb: 'Extra decor and support pieces for a fuller stage.',
        slugs: ['lotus-urli-for-haldi', 'welcome-board-stand', 'led-lights', 'round-backdrop-stand', 'red-carpet'],
      },
    ],
    ctas: [EVENT_CTA, BACKDROP_CTA],
  },
  'birthday-decoration': {
    slug: 'birthday-decoration',
    title: 'Birthday Decoration Rentals',
    shortTitle: 'Birthday Decoration',
    seoDescription:
      'Find birthday decoration rentals including cake stands, cylindrical tables, marquee letters and birthday backdrops on PakkaRent.',
    keywords:
      'birthday decoration rental, cake stand rental, marquee letters rent, birthday backdrop rental, PakkaRent',
    heroTitle: 'Birthday decor made easy',
    heroSub:
      'Shortlist cake tables, stands, backdrop decor and party props together instead of searching each category one by one.',
    highlights: [
      'Great for home birthdays and small party halls',
      'Cake table, backdrop and prop combinations in one place',
      'Works well for enquiry-led conversion on WhatsApp',
    ],
    comboIdeas: [
      'Simple birthday combo: Irish Cake Table Combo + Backdrop Stand + LED Lights',
      'Premium décor combo: Golden Cake Stand Combo + Flowerwall Backdrop + Marquee Letters',
      'Kids party combo: Cake table + backdrop + moonwalk add-on',
    ],
    sections: [
      {
        title: 'Cake tables & stands',
        blurb: 'Must-have pieces for the main cake-cutting setup.',
        slugs: ['irish-cake-table-combo', 'golden-cake-stand-combo', 'wooden-cake-stands', 'cylindrical-cake-table'],
      },
      {
        title: 'Backdrop decor',
        blurb: 'Birthday-friendly backdrops and photo corners.',
        slugs: ['dreamy-ring-birthday-backdrop', 'birthday-flowerwall-backdrop', 'flower-wall-backdrop', 'round-backdrop-stand', 'theme-decoration-setup', 'charming-peach-backdrop', 'baby-blue-backdrop'],
      },
      {
        title: 'Fun add-ons',
        blurb: 'Extras that make a simple party feel complete.',
        slugs: ['marquee-letters', 'moon-walk-game', 'led-lights', 'electric-balloon-blower', 'welcome-board-stand'],
      },
    ],
    ctas: [BIRTHDAY_CTA, BACKDROP_CTA],
  },
};

export function getFestivePage(slug) {
  return FESTIVE_PAGES[slug] || null;
}

export function getFestiveLinks(city) {
  return [
    { label: 'Haldi', path: '/festive/haldi' },
    { label: 'Naming Ceremony', path: '/festive/naming-ceremony' },
    { label: 'Baby Shower', path: '/festive/baby-shower' },
    { label: 'Birthday Decoration', path: '/festive/birthday-decoration' },
    { label: 'Event Rental', path: getCategoryPath(3, city || 'Chennai') },
  ];
}
