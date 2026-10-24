import { CATALOG_LINKS as L, cityCatalogLinks, rentLink } from './catalogLinks';

const CHN = cityCatalogLinks('Chennai');
const BLR = cityCatalogLinks('Bangalore');
const HYD = cityCatalogLinks('Hyderabad');

export const BLOG_TOPICS = [
  { id: 'event', label: 'Event Rental', emoji: '🎉' },
  { id: 'backdrop', label: 'Backdrops', emoji: '🖼️' },
  { id: 'birthday', label: 'Birthday', emoji: '🎂' },
  { id: 'camping', label: 'Camping', emoji: '⛺' },
  { id: 'appliances', label: 'Appliances', emoji: '🏠' },
  { id: 'baby', label: 'Baby & Kids', emoji: '👶' },
  { id: 'tips', label: 'Rental Tips', emoji: '💡' },
];

export const BLOG_POSTS = [
  {
    slug: 'cradle-for-rent-chennai-price-guide',
    city: 'chennai',
    title: 'Cradle for Rent in Chennai — 2026 Price Guide for Naming Ceremonies',
    excerpt:
      'Compare every cradle you can rent in Chennai — silver, teak, golden and compact — with current per-event prices, sizes and booking tips for your naming ceremony.',
    seoDescription:
      'Cradle for rent in Chennai: compare silver, teak, golden and compact cradles with 2026 per-event prices. Delivery across Chennai for naming ceremonies — book on PakkaRent.',
    keywords:
      'cradle for rent Chennai, cradle on rent Chennai, naming ceremony cradle Chennai, silver cradle rent Chennai, teak cradle rental Chennai, cradle for rent near me',
    topic: 'event',
    publishedAt: '2026-10-24',
    readMinutes: 7,
    relatedSlugs: ['naming-ceremony-cradle-rental-guide-chennai', 'silver-vs-golden-cradle-which-to-rent', 'baby-stroller-on-rent-chennai'],
    catalogLinks: [
      { label: 'All cradles in Chennai', to: CHN.cradle },
      { label: 'Backdrops in Chennai', to: CHN.backdrop },
      { label: 'Delivery info', to: L.delivery },
    ],
    blocks: [
      { type: 'p', parts: [
        { type: 'text', value: 'The cradle is the first thing guests notice at a Chennai naming ceremony — whether it is a small home function in Mylapore or a hall booking in Anna Nagar. Buying a good silver or teak cradle for a single morning rarely makes sense, which is why most families now ' },
        { type: 'link', to: CHN.cradle, label: 'rent a cradle in Chennai' },
        { type: 'text', value: ' and have it delivered, set up and picked up after the function.' },
      ]},
      { type: 'p', parts: [
        { type: 'text', value: 'Below is every cradle currently available in our Chennai catalogue, grouped by style, with the per-event price at the time of writing. Click any cradle to see photos, dimensions and live availability.' },
      ]},
      { type: 'h3', text: 'Silver cradles — the premium centrepiece' },
      { type: 'ul', items: [
        { parts: [{ type: 'link', to: rentLink('chennai', 'silver-grand-cradle'), label: 'Silver Grand Cradle' }, { type: 'text', value: ' — ₹7,000 per event. Large, ornate and best suited to halls and banquet stages.' }] },
        { parts: [{ type: 'link', to: rentLink('chennai', 'silver-peacock-cradle'), label: 'Silver Peacock Cradle' }, { type: 'text', value: ' — ₹7,000 per event. Peacock motif that photographs beautifully under stage lights.' }] },
        { parts: [{ type: 'link', to: rentLink('chennai', 'grand-moon-cradle'), label: 'Grand Moon Cradle' }, { type: 'text', value: ' — ₹6,000 per event. Crescent-moon design, a popular choice for themed photo shoots.' }] },
      ]},
      { type: 'h3', text: 'Teak wood and traditional cradles' },
      { type: 'ul', items: [
        { parts: [{ type: 'link', to: rentLink('chennai', 'traditional-teak-cradle'), label: 'Traditional Teak Cradle' }, { type: 'text', value: ' — ₹3,800 per event. Warm, classic Chettinad-style look.' }] },
        { parts: [{ type: 'link', to: rentLink('chennai', 'cultural-cradle'), label: 'Cultural Cradle' }, { type: 'text', value: ' — ₹3,200 per event. Traditional carving that suits home functions.' }] },
        { parts: [{ type: 'link', to: rentLink('chennai', 'classic-teak-cradle'), label: 'Classic Teak Cradle' }, { type: 'text', value: ' — ₹3,000 per event. Simple, elegant and easy to fit into apartments.' }] },
      ]},
      { type: 'h3', text: 'Golden, royal and compact cradles' },
      { type: 'ul', items: [
        { parts: [{ type: 'link', to: rentLink('chennai', 'crown-baby-cradle'), label: 'Crown Baby Cradle' }, { type: 'text', value: ' — ₹3,600 per event. Crown motif, great for naming-plus-first-birthday combos.' }] },
        { parts: [{ type: 'link', to: rentLink('chennai', 'royal-chain-cradle'), label: 'Royal Chain Cradle' }, { type: 'text', value: ' — ₹3,500 per event. Chain-suspended swing cradle with a royal finish.' }] },
        { parts: [{ type: 'link', to: rentLink('chennai', 'ivory-royale-cradle'), label: 'Ivory Royale Cradle' }, { type: 'text', value: ' — ₹3,300 per event. Soft ivory tone for pastel and floral themes.' }] },
        { parts: [{ type: 'link', to: rentLink('chennai', 'golden-baby-cradle'), label: 'Golden Baby Cradle' }, { type: 'text', value: ' — ₹3,300 per event. Warm gold finish at a mid-range price.' }] },
        { parts: [{ type: 'link', to: rentLink('chennai', 'compact-cradle'), label: 'Compact Cradle' }, { type: 'text', value: ' — ₹3,000 per event. Smaller footprint for flats; rent includes 10 km transport.' }] },
      ]},
      { type: 'h3', text: 'How to choose the right cradle for your venue' },
      { type: 'ul', items: [
        'Home or apartment function: pick a compact or classic teak cradle — they fit through standard doors and lifts',
        'Community hall or kalyana mandapam: silver or grand cradles fill the stage and look best in photos',
        'Photo-shoot focused event: Grand Moon, Crown or Ivory Royale cradles give a themed look',
        'Measure ceiling height and stage width before booking — larger cradles need clear floor space around them',
      ]},
      { type: 'h3', text: 'Delivery across Chennai' },
      { type: 'p', parts: [
        { type: 'text', value: 'We deliver cradles across Chennai — central areas like T Nagar, Mylapore and Anna Nagar as well as Velachery, OMR, Porur, Tambaram and Chromepet. Transport is charged by distance, so share your venue location on WhatsApp for an exact quote. Read our ' },
        { type: 'link', to: L.delivery, label: 'delivery information' },
        { type: 'text', value: ' for timings and setup details.' },
      ]},
      { type: 'h3', text: 'Complete the naming ceremony stage' },
      { type: 'p', parts: [
        { type: 'text', value: 'Most Chennai families pair the cradle with a ' },
        { type: 'link', to: CHN.backdrop, label: 'floral or grass backdrop' },
        { type: 'text', value: ', a ' },
        { type: 'link', to: rentLink('chennai', 'welcome-board-stand'), label: 'welcome board stand' },
        { type: 'text', value: ' and a ' },
        { type: 'link', to: rentLink('chennai', 'name-revealing-shell'), label: 'name revealing shell' },
        { type: 'text', value: ' for the big reveal. Not sure between silver and gold? Read ' },
        { type: 'link', to: '/blog/silver-vs-golden-cradle-which-to-rent', label: 'silver vs golden cradle' },
        { type: 'text', value: '.' },
      ]},
      { type: 'h3', text: 'Booking tips' },
      { type: 'ul', items: [
        'Book 2–3 weeks ahead — auspicious muhurtham dates sell out first',
        'Confirm delivery and pickup times with your hall manager in advance',
        'Keep a soft mattress and cradle cloth ready; decorations are not included unless stated',
      ]},
      { type: 'p', parts: [
        { type: 'text', value: 'Ready to book? Add a cradle to your cart or ' },
        { type: 'link', to: L.contact, label: 'message us on WhatsApp' },
        { type: 'text', value: ' with your date and venue.' },
      ]},
    ],
  },
  {
    slug: 'baby-stroller-on-rent-chennai',
    city: 'chennai',
    title: 'Baby Stroller on Rent in Chennai — Prams, Car Seats & Cribs for Short Stays',
    excerpt:
      'Visiting Chennai with a baby or hosting grandchildren for the holidays? Rent a stroller, car seat, crib or high chair with doorstep delivery instead of flying with bulky gear.',
    seoDescription:
      'Baby stroller for rent in Chennai — rent prams, car seats, cribs and high chairs for holidays and short stays. Sanitised, delivered and picked up by PakkaRent.',
    keywords:
      'stroller for rent in Chennai, baby stroller for rent in Chennai, pram on rent Chennai, baby car seat rent Chennai, baby crib rental Chennai, baby gear rental Chennai',
    topic: 'baby',
    publishedAt: '2026-10-23',
    readMinutes: 5,
    relatedSlugs: ['baby-props-rental-travel-guide', 'baby-stroller-rent-hyderabad-guide', 'baby-stroller-car-seat-rent-bangalore'],
    catalogLinks: [
      { label: 'Baby props in Chennai', to: CHN.babyProps },
      { label: 'Chennai rentals', to: CHN.city },
      { label: 'How it works', to: L.howItWorks },
    ],
    blocks: [
      { type: 'p', parts: [
        { type: 'text', value: 'Every December and summer holiday, thousands of families fly into Chennai to visit grandparents. Carrying a stroller, car seat and travel cot through the airport is exhausting — and airline baggage fees add up. Renting ' },
        { type: 'link', to: CHN.babyProps, label: 'baby gear in Chennai' },
        { type: 'text', value: ' means it is waiting for you when you arrive and is picked up when you leave.' },
      ]},
      { type: 'h3', text: 'Baby gear you can rent in Chennai' },
      { type: 'ul', items: [
        { parts: [{ type: 'link', to: rentLink('chennai', 'baby-stroller'), label: 'Baby Stroller' }, { type: 'text', value: ' — for beach walks at Besant Nagar, mall trips and temple visits.' }] },
        { parts: [{ type: 'link', to: rentLink('chennai', 'baby-car-seat'), label: 'Baby Car Seat' }, { type: 'text', value: ' — essential for cab rides from the airport and day trips to Mahabalipuram.' }] },
        { parts: [{ type: 'link', to: rentLink('chennai', 'baby-crib-with-mattress'), label: 'Baby Crib with Mattress' }, { type: 'text', value: ' — a safe sleeping space when the grandparents’ home has no cot.' }] },
        { parts: [{ type: 'link', to: rentLink('chennai', 'high-chair'), label: 'High Chair' }, { type: 'text', value: ' — makes family meals easier for babies starting solids.' }] },
      ]},
      { type: 'h3', text: 'Why rent a stroller instead of buying one?' },
      { type: 'ul', items: [
        'A short visit of 1–4 weeks costs far less than a new branded stroller',
        'No airline excess baggage or damaged gear at the carousel',
        'Each item is cleaned and checked before delivery',
        'Try a model before you decide to buy one for home',
      ]},
      { type: 'h3', text: 'Chennai-specific tips' },
      { type: 'ul', items: [
        'Choose a stroller with a good canopy — Chennai sun is strong most of the year',
        'Book the car seat for the day you land so the airport cab ride is safe',
        'Older buildings in Mylapore and T Nagar may not have lifts; a lightweight stroller is easier on stairs',
        'Monsoon months (October–December) — keep a rain cover handy for evening walks',
      ]},
      { type: 'h3', text: 'How rental works' },
      { type: 'p', parts: [
        { type: 'text', value: 'Add the items to your cart, choose your dates and send the inquiry on WhatsApp. We confirm availability and deliver to homes across Chennai — from Adyar and Velachery to Anna Nagar and Tambaram. See ' },
        { type: 'link', to: L.howItWorks, label: 'how PakkaRent works' },
        { type: 'text', value: ' and our ' },
        { type: 'link', to: L.faq, label: 'FAQ on deposits and returns' },
        { type: 'text', value: '.' },
      ]},
      { type: 'p', parts: [
        { type: 'text', value: 'Planning a naming ceremony during the same trip? See our ' },
        { type: 'link', to: '/blog/cradle-for-rent-chennai-price-guide', label: 'Chennai cradle price guide' },
        { type: 'text', value: '. Travelling on to another city? We also rent ' },
        { type: 'link', to: rentLink('bangalore', 'baby-stroller'), label: 'strollers in Bangalore' },
        { type: 'text', value: ' and ' },
        { type: 'link', to: rentLink('hyderabad', 'baby-stroller'), label: 'strollers in Hyderabad' },
        { type: 'text', value: '.' },
      ]},
    ],
  },
  {
    slug: 'bouncy-castle-trampoline-games-rental-chennai',
    city: 'chennai',
    title: 'Bouncy Castle, Trampoline & Party Games on Rent in Chennai',
    excerpt:
      'Turn a Chennai birthday party or apartment get-together into a hit with bouncy castles, trampolines, ball pits and group games — prices and space requirements explained.',
    seoDescription:
      'Rent bouncy castles, trampolines, ball pits and party games in Chennai for birthdays and apartment events. Sizes, prices and space tips — book on PakkaRent.',
    keywords:
      'bouncy castle rent Chennai, trampoline rental Chennai, kids party games rental Chennai, ball pit rent Chennai, birthday games on rent Chennai',
    topic: 'birthday',
    publishedAt: '2026-10-22',
    readMinutes: 6,
    relatedSlugs: ['birthday-party-rental-ideas-budget', 'corporate-event-games-rental-team-building'],
    catalogLinks: [
      { label: 'Games in Chennai', to: CHN.games },
      { label: 'Kids toys in Chennai', to: CHN.kidsToys },
      { label: 'Birthday rentals', to: CHN.birthday },
    ],
    blocks: [
      { type: 'p', parts: [
        { type: 'text', value: 'Kids remember the bouncy castle long after they forget the cake. Whether you are hosting a birthday on your apartment terrace in OMR or a community event in Anna Nagar, ' },
        { type: 'link', to: CHN.games, label: 'party games on rent in Chennai' },
        { type: 'text', value: ' keep children busy for hours while adults enjoy the function.' },
      ]},
      { type: 'h3', text: 'Bouncy castles' },
      { type: 'ul', items: [
        { parts: [{ type: 'link', to: rentLink('chennai', 'grand-bouncy-castle-rental-for-event'), label: 'Grand Bouncy Castle' }, { type: 'text', value: ' — ₹8,000 per event. Best for large groups and community events.' }] },
        { parts: [{ type: 'link', to: rentLink('chennai', 'mickey-bouncy-castle'), label: 'Mickey Bouncy Castle' }, { type: 'text', value: ' — ₹8,000 per event. A favourite for themed birthday parties.' }] },
        { parts: [{ type: 'link', to: rentLink('chennai', 'pastel-birthday-bouncy-rental'), label: 'Pastel Birthday Bouncy' }, { type: 'text', value: ' — ₹7,000 per event. Soft colours that match pastel décor and photos.' }] },
      ]},
      { type: 'h3', text: 'Trampolines and play zones' },
      { type: 'ul', items: [
        { parts: [{ type: 'link', to: rentLink('chennai', 'trampoline-rental-12-feet'), label: '12 ft Trampoline' }, { type: 'text', value: ' — ₹6,500 per event, for bigger lawns and terraces.' }] },
        { parts: [{ type: 'link', to: rentLink('chennai', 'trampoline-rental-8-feet'), label: '8 ft Trampoline' }, { type: 'text', value: ' — ₹5,000 per event, fits most apartment clubhouses.' }] },
        { parts: [{ type: 'link', to: rentLink('chennai', 'ball-pit-with-slide'), label: 'Ball Pit with Slide' }, { type: 'text', value: ' and ' }, { type: 'link', to: rentLink('chennai', 'kids-slide-and-swing-rental'), label: 'Slide and Swing set' }, { type: 'text', value: ' — ₹3,000 each, ideal for toddlers.' }] },
      ]},
      { type: 'h3', text: 'Group games for older kids and adults' },
      { type: 'ul', items: [
        { parts: [{ type: 'link', to: rentLink('chennai', 'balloon-shooting'), label: 'Balloon Shooting' }, { type: 'text', value: ' — carnival-style stall that works for all ages.' }] },
        { parts: [{ type: 'link', to: rentLink('chennai', 'catch-the-stick-game'), label: 'Catch the Stick' }, { type: 'text', value: ' and ' }, { type: 'link', to: rentLink('chennai', 'grab-a-stick-game'), label: 'Grab a Stick' }, { type: 'text', value: ' — reflex games that draw a crowd.' }] },
        { parts: [{ type: 'link', to: rentLink('chennai', 'tug-of-war-rope'), label: 'Tug of War Rope' }, { type: 'text', value: ' — ₹1,200, perfect for school and office events.' }] },
      ]},
      { type: 'h3', text: 'Space and safety checklist' },
      { type: 'ul', items: [
        'Measure the area — bouncy castles need open, level ground with clearance on all sides',
        'Check for a power point nearby; inflatables run on a blower through the event',
        'Avoid placing inflatables under direct afternoon sun on Chennai terraces — evening slots are cooler',
        'Assign an adult to supervise and limit the number of kids inside at once',
        'Inform your apartment association in advance if using a common area',
      ]},
      { type: 'p', parts: [
        { type: 'text', value: 'Complete the party with a ' },
        { type: 'link', to: CHN.birthday, label: 'cake table and marquee letters' },
        { type: 'text', value: ' and a ' },
        { type: 'link', to: rentLink('chennai', 'dreamy-ring-birthday-backdrop'), label: 'birthday backdrop' },
        { type: 'text', value: '. More ideas in our ' },
        { type: 'link', to: '/blog/birthday-party-rental-ideas-budget', label: 'budget birthday rental guide' },
        { type: 'text', value: '.' },
      ]},
    ],
  },
  {
    slug: 'cradle-rental-bangalore-naming-ceremony',
    city: 'bangalore',
    title: 'Cradle Rental in Bangalore — Naming Ceremony Cradles from Whitefield to JP Nagar',
    excerpt:
      'Silver, teak, golden and royal chain cradles on rent in Bangalore for Namakarana ceremonies — prices, sizes and tips for apartment and hall functions.',
    seoDescription:
      'Cradle for rent in Bangalore for naming ceremonies (Namakarana). Silver peacock, teak, golden and royal chain cradles with delivery across Bangalore — PakkaRent.',
    keywords:
      'cradle for rent Bangalore, cradle on rent Bangalore, naming ceremony cradle Bangalore, Namakarana cradle rental, silver cradle rent Bangalore, cradle rental Whitefield',
    topic: 'event',
    publishedAt: '2026-10-21',
    readMinutes: 6,
    relatedSlugs: ['naming-ceremony-cradle-rental-guide-chennai', 'backdrop-rental-bangalore-ideas', 'oonjal-jhula-swing-rental-guide'],
    catalogLinks: [
      { label: 'Cradles in Bangalore', to: BLR.cradle },
      { label: 'Backdrops in Bangalore', to: BLR.backdrop },
      { label: 'Bangalore rentals', to: BLR.city },
    ],
    blocks: [
      { type: 'p', parts: [
        { type: 'text', value: 'Many Bangalore families live far from their hometowns, in gated apartments across Whitefield, Sarjapur Road and Electronic City. When the Namakarana comes around, there is no ancestral cradle to bring out — so ' },
        { type: 'link', to: BLR.cradle, label: 'renting a cradle in Bangalore' },
        { type: 'text', value: ' is the simplest way to get a beautiful, traditional centrepiece.' },
      ]},
      { type: 'h3', text: 'Cradles available in Bangalore' },
      { type: 'ul', items: [
        { parts: [{ type: 'link', to: rentLink('bangalore', 'silver-peacock-cradle'), label: 'Silver Peacock Cradle' }, { type: 'text', value: ' — ₹5,500 per event. The showpiece choice for clubhouse and hall functions.' }] },
        { parts: [{ type: 'link', to: rentLink('bangalore', 'silver-cradle'), label: 'Silver Cradle' }, { type: 'text', value: ' — ₹5,000 per event. Classic silver finish without the peacock detailing.' }] },
        { parts: [{ type: 'link', to: rentLink('bangalore', 'traditional-teak-cradle'), label: 'Traditional Teak Cradle' }, { type: 'text', value: ' — ₹2,500 per event. Warm wood tone for home poojas.' }] },
        { parts: [{ type: 'link', to: rentLink('bangalore', 'golden-baby-cradle'), label: 'Golden Baby Cradle' }, { type: 'text', value: ' — ₹2,300 per event. Bright and festive at a modest price.' }] },
        { parts: [{ type: 'link', to: rentLink('bangalore', 'royal-chain-cradle'), label: 'Royal Chain Cradle' }, { type: 'text', value: ' — ₹2,200 per event. Swing-style cradle on a decorative frame.' }] },
        { parts: [{ type: 'link', to: rentLink('bangalore', 'classic-teak-cradle'), label: 'Classic Teak Cradle' }, { type: 'text', value: ' — ₹2,200 per event. Compact enough for most apartments.' }] },
        { parts: [{ type: 'link', to: rentLink('bangalore', 'royal-chain-lotus-cradle'), label: 'Royal Chain Lotus Cradle' }, { type: 'text', value: ' — ₹2,000 per event. Lotus detailing that suits floral themes.' }] },
      ]},
      { type: 'h3', text: 'Apartment vs hall: what to pick' },
      { type: 'ul', items: [
        'Apartment living room: classic teak, golden or lotus cradles fit through lifts and standard doors',
        'Clubhouse or party hall in Marathahalli, HSR Layout or Hebbal: a silver cradle gives the stage presence you need',
        'Check with your apartment association about service-lift access and delivery timings',
        'Allow space around the cradle for elders to perform the naming rituals comfortably',
      ]},
      { type: 'h3', text: 'Add swings, urli and a backdrop' },
      { type: 'p', parts: [
        { type: 'text', value: 'Families often combine the cradle with a ' },
        { type: 'link', to: rentLink('bangalore', 'teak-wood-oonjal-swing-jhula'), label: 'teak wood oonjal' },
        { type: 'text', value: ' or ' },
        { type: 'link', to: rentLink('bangalore', 'golden-jhula-swing'), label: 'golden jhula' },
        { type: 'text', value: ' for the parents, a ' },
        { type: 'link', to: rentLink('bangalore', 'white-floral-backdrop'), label: 'white floral backdrop' },
        { type: 'text', value: ' and a ' },
        { type: 'link', to: rentLink('bangalore', 'welcome-board-stand'), label: 'welcome board stand' },
        { type: 'text', value: '. For décor ideas, see our ' },
        { type: 'link', to: '/blog/backdrop-rental-bangalore-ideas', label: 'Bangalore backdrop guide' },
        { type: 'text', value: '.' },
      ]},
      { type: 'h3', text: 'Delivery across Bangalore' },
      { type: 'p', parts: [
        { type: 'text', value: 'We deliver across Bangalore, including Whitefield, Marathahalli, Koramangala, HSR Layout, JP Nagar, Electronic City and Hebbal. Plan for traffic — book a morning delivery slot the day before your function. Transport is charged by distance; see ' },
        { type: 'link', to: L.delivery, label: 'delivery info' },
        { type: 'text', value: ' or ' },
        { type: 'link', to: L.contact, label: 'WhatsApp us' },
        { type: 'text', value: ' with your date and pin code.' },
      ]},
    ],
  },
  {
    slug: 'baby-stroller-car-seat-rent-bangalore',
    city: 'bangalore',
    title: 'Baby Stroller & Car Seat on Rent in Bangalore — Guide for Visiting Families',
    excerpt:
      'Flying into Bangalore with a little one? Rent a stroller, car seat and high chair delivered to your home or hotel — what to book and how to plan around airport travel.',
    seoDescription:
      'Baby stroller and car seat on rent in Bangalore. Rent prams, car seats and high chairs for visits and short stays, delivered across Bangalore by PakkaRent.',
    keywords:
      'stroller for rent Bangalore, baby stroller rent Bangalore, car seat rent Bangalore, baby high chair rental Bangalore, baby gear rental Bangalore',
    topic: 'baby',
    publishedAt: '2026-10-20',
    readMinutes: 5,
    relatedSlugs: ['baby-stroller-on-rent-chennai', 'baby-stroller-rent-hyderabad-guide', 'baby-props-rental-travel-guide'],
    catalogLinks: [
      { label: 'Baby props in Bangalore', to: BLR.babyProps },
      { label: 'Bangalore rentals', to: BLR.city },
      { label: 'FAQ', to: L.faq },
    ],
    blocks: [
      { type: 'p', parts: [
        { type: 'text', value: 'Bangalore’s airport is a long drive from most of the city, and a cab ride of an hour or more with a baby on your lap is neither safe nor comfortable. Renting ' },
        { type: 'link', to: BLR.babyProps, label: 'baby gear in Bangalore' },
        { type: 'text', value: ' lets you travel light and still have everything you need once you arrive.' },
      ]},
      { type: 'h3', text: 'What you can rent in Bangalore' },
      { type: 'ul', items: [
        { parts: [{ type: 'link', to: rentLink('bangalore', 'baby-stroller'), label: 'Baby Stroller' }, { type: 'text', value: ' — for Cubbon Park walks, malls and long apartment corridors.' }] },
        { parts: [{ type: 'link', to: rentLink('bangalore', 'baby-car-seat'), label: 'Baby Car Seat' }, { type: 'text', value: ' — for the airport transfer and weekend drives to Nandi Hills or Mysore.' }] },
        { parts: [{ type: 'link', to: rentLink('bangalore', 'high-chair'), label: 'High Chair' }, { type: 'text', value: ' — keeps mealtimes tidy at grandma’s place.' }] },
      ]},
      { type: 'h3', text: 'Planning tips for Bangalore' },
      { type: 'ul', items: [
        'Schedule car seat delivery before your airport pickup so the first ride is safe',
        'Bangalore evenings get cool — a stroller with a full canopy and a light blanket helps',
        'Footpaths can be uneven in older neighbourhoods; a stroller with sturdy wheels handles them better',
        'Book early around Diwali, Christmas and summer holidays when visiting families peak',
      ]},
      { type: 'h3', text: 'Rent vs buy for a short stay' },
      { type: 'p', parts: [
        { type: 'text', value: 'For a visit of a few weeks, renting costs a fraction of a new stroller and car seat, with no luggage hassle. Items are cleaned before each delivery and picked up when you are done. Read our ' },
        { type: 'link', to: '/blog/baby-props-rental-travel-guide', label: 'baby travel rental guide' },
        { type: 'text', value: ' for a full packing checklist.' },
      ]},
      { type: 'p', parts: [
        { type: 'text', value: 'Hosting a naming ceremony while you are in town? See our ' },
        { type: 'link', to: '/blog/cradle-rental-bangalore-naming-ceremony', label: 'Bangalore cradle rental guide' },
        { type: 'text', value: '. Also visiting Chennai? We rent ' },
        { type: 'link', to: rentLink('chennai', 'baby-stroller'), label: 'strollers in Chennai' },
        { type: 'text', value: ' too.' },
      ]},
    ],
  },
  {
    slug: 'barasala-cradle-rental-hyderabad',
    city: 'hyderabad',
    title: 'Barasala Cradle Rental in Hyderabad — Silver, Teak & Golden Cradles',
    excerpt:
      'Planning a Barasala (naming ceremony) in Hyderabad? Compare the cradles you can rent, the oonjal and décor that complete the setup, and how to book delivery.',
    seoDescription:
      'Cradle for rent in Hyderabad for Barasala naming ceremonies — silver peacock, teak, golden and royal chain cradles delivered across Hyderabad by PakkaRent.',
    keywords:
      'Barasala cradle rental Hyderabad, cradle for rent Hyderabad, naming ceremony cradle Hyderabad, silver cradle rent Hyderabad, uyyala rent Hyderabad',
    topic: 'event',
    publishedAt: '2026-10-19',
    readMinutes: 6,
    relatedSlugs: ['wedding-event-rental-checklist-hyderabad', 'pellikuthuru-haldi-decor-rental-hyderabad', 'baby-stroller-rent-hyderabad-guide'],
    catalogLinks: [
      { label: 'Cradles in Hyderabad', to: HYD.cradle },
      { label: 'Event rentals in Hyderabad', to: HYD.event },
      { label: 'Hyderabad rentals', to: HYD.city },
    ],
    blocks: [
      { type: 'p', parts: [
        { type: 'text', value: 'In Telugu families, the Barasala is traditionally held on the 21st day after a baby is born, when the child is named and placed in the cradle (uyyala) for the first time. The cradle is the heart of the ceremony — and with a ' },
        { type: 'link', to: HYD.cradle, label: 'cradle on rent in Hyderabad' },
        { type: 'text', value: ' you get a stunning piece without storing it for years afterwards.' },
      ]},
      { type: 'h3', text: 'Cradles available in Hyderabad' },
      { type: 'ul', items: [
        { parts: [{ type: 'link', to: rentLink('hyderabad', 'silver-peacock-cradle'), label: 'Silver Peacock Cradle' }, { type: 'text', value: ' — ₹5,500 per event. Grand and highly photogenic.' }] },
        { parts: [{ type: 'link', to: rentLink('hyderabad', 'silver-cradle'), label: 'Silver Cradle' }, { type: 'text', value: ' — ₹5,000 per event. Classic silver for hall functions.' }] },
        { parts: [{ type: 'link', to: rentLink('hyderabad', 'golden-baby-cradle'), label: 'Golden Baby Cradle' }, { type: 'text', value: ' — ₹2,500 per event. Festive gold finish.' }] },
        { parts: [{ type: 'link', to: rentLink('hyderabad', 'traditional-teak-cradle'), label: 'Traditional Teak Cradle' }, { type: 'text', value: ' — ₹2,500 per event. Classic carved wood.' }] },
        { parts: [{ type: 'link', to: rentLink('hyderabad', 'royal-chain-cradle'), label: 'Royal Chain Cradle' }, { type: 'text', value: ' — ₹2,500 per event. Swing-style cradle with chain suspension.' }] },
        { parts: [{ type: 'link', to: rentLink('hyderabad', 'classic-teak-cradle'), label: 'Classic Teak Cradle' }, { type: 'text', value: ' — ₹2,000 per event. Compact and budget-friendly.' }] },
      ]},
      { type: 'h3', text: 'Completing the Barasala setup' },
      { type: 'p', parts: [
        { type: 'text', value: 'Add a ' },
        { type: 'link', to: rentLink('hyderabad', 'teak-wood-oonjal-swing-jhula'), label: 'teak wood oonjal' },
        { type: 'text', value: ' for the parents, a ' },
        { type: 'link', to: rentLink('hyderabad', 'elegant-greenish-backdrop'), label: 'greenery backdrop' },
        { type: 'text', value: ', a ' },
        { type: 'link', to: rentLink('hyderabad', 'round-backdrop-stand'), label: 'round backdrop stand' },
        { type: 'text', value: ' for the baby’s name board, and a ' },
        { type: 'link', to: rentLink('hyderabad', 'welcome-board-stand'), label: 'welcome board' },
        { type: 'text', value: ' at the entrance.' },
      ]},
      { type: 'h3', text: 'Tips for Hyderabad families' },
      { type: 'ul', items: [
        'Barasala dates are fixed early — book the cradle as soon as the date is confirmed',
        'Gated communities in Gachibowli, Kondapur and Miyapur may restrict delivery hours; inform security in advance',
        'For a home function in an older house in Secunderabad or the Old City, check doorway widths for larger silver cradles',
        'Keep the cradle away from direct sun on terraces during summer afternoons',
      ]},
      { type: 'h3', text: 'Delivery across Hyderabad' },
      { type: 'p', parts: [
        { type: 'text', value: 'We deliver across Hyderabad and Secunderabad — Gachibowli, Madhapur, Kondapur, Kukatpally, Miyapur, Banjara Hills, Ameerpet and more. Share your location on ' },
        { type: 'link', to: L.contact, label: 'WhatsApp' },
        { type: 'text', value: ' for a transport quote. Hosting a wedding later in the year? Read our ' },
        { type: 'link', to: '/blog/wedding-event-rental-checklist-hyderabad', label: 'Hyderabad wedding rental checklist' },
        { type: 'text', value: '.' },
      ]},
    ],
  },
  {
    slug: 'pellikuthuru-haldi-decor-rental-hyderabad',
    city: 'hyderabad',
    title: 'Pellikuthuru & Haldi Décor on Rent in Hyderabad — Urli, Rolu Rokali & Backdrops',
    excerpt:
      'Everything you need for a Pellikuthuru, Mangala Snanam or haldi function in Hyderabad — lotus urli, gangalam set, rolu rokali, backdrops and seating — on rent.',
    seoDescription:
      'Pellikuthuru and haldi decoration rental in Hyderabad — lotus urli, gangalam mangala snanam set, silver rolu rokali, backdrops and swings on rent from PakkaRent.',
    keywords:
      'Pellikuthuru decoration rental Hyderabad, haldi decor rent Hyderabad, mangala snanam set rental Hyderabad, rolu rokali rent Hyderabad, lotus urli rent Hyderabad',
    topic: 'event',
    publishedAt: '2026-10-18',
    readMinutes: 5,
    relatedSlugs: ['haldi-ceremony-decoration-rental-ideas', 'wedding-event-rental-checklist-hyderabad', 'barasala-cradle-rental-hyderabad'],
    catalogLinks: [
      { label: 'Décor & urli in Hyderabad', to: HYD.decor },
      { label: 'Backdrops in Hyderabad', to: HYD.backdrop },
      { label: 'Event rentals in Hyderabad', to: HYD.event },
    ],
    blocks: [
      { type: 'p', parts: [
        { type: 'text', value: 'The Pellikuthuru ceremony — when the bride is bathed with turmeric and adorned before the wedding — is one of the most colourful functions in a Telugu wedding. With ' },
        { type: 'link', to: HYD.decor, label: 'décor rentals in Hyderabad' },
        { type: 'text', value: ', you can create a traditional, photo-ready setup at home without buying brass and silver items you will use once.' },
      ]},
      { type: 'h3', text: 'Essential rentals for Pellikuthuru and haldi' },
      { type: 'ul', items: [
        { parts: [{ type: 'link', to: rentLink('hyderabad', 'gangalam-mangala-snanam-set'), label: 'Gangalam / Mangala Snanam Set' }, { type: 'text', value: ' — ₹1,500. The brass vessels for the ritual bath.' }] },
        { parts: [{ type: 'link', to: rentLink('hyderabad', 'lotus-urli-for-haldi'), label: 'Lotus Urli for Haldi' }, { type: 'text', value: ' — ₹2,000. A floating-flower centrepiece for turmeric water.' }] },
        { parts: [{ type: 'link', to: rentLink('hyderabad', 'silver-rolu-rokali'), label: 'Silver Rolu Rokali' }, { type: 'text', value: ' — ₹3,000. The traditional mortar and pestle for pounding turmeric.' }] },
        { parts: [{ type: 'link', to: rentLink('hyderabad', 'elegant-greenish-backdrop'), label: 'Elegant Greenish Backdrop' }, { type: 'text', value: ' — ₹3,500. Fresh green tones that make yellow outfits stand out.' }] },
        { parts: [{ type: 'link', to: rentLink('hyderabad', 'teak-wood-oonjal-swing-jhula'), label: 'Teak Wood Oonjal' }, { type: 'text', value: ' — ₹4,500. A swing seat for the bride during the function.' }] },
      ]},
      { type: 'h3', text: 'Layout ideas' },
      { type: 'ul', items: [
        'Place the backdrop against the longest wall and the oonjal in front of it as the focal point',
        'Keep the urli and gangalam set to one side so the ritual area stays clear for photos',
        'Lay a waterproof sheet under the haldi area — turmeric stains are hard to remove from marble',
        'Use a welcome board stand at the entrance with the bride’s name and date',
      ]},
      { type: 'h3', text: 'Booking and delivery' },
      { type: 'p', parts: [
        { type: 'text', value: 'We deliver across Hyderabad — from Kukatpally and Miyapur to Banjara Hills, Jubilee Hills and Secunderabad. Wedding season dates book quickly, so reserve early. For a full wedding plan, see our ' },
        { type: 'link', to: '/blog/wedding-event-rental-checklist-hyderabad', label: 'Hyderabad wedding rental checklist' },
        { type: 'text', value: ' and the general ' },
        { type: 'link', to: '/blog/haldi-ceremony-decoration-rental-ideas', label: 'haldi decoration guide' },
        { type: 'text', value: '.' },
      ]},
    ],
  },
  {
    slug: 'naming-ceremony-cradle-rental-guide-chennai',
    title: 'Naming Ceremony Cradle Rental Guide — Chennai, Bangalore & Hyderabad',
    excerpt:
      'Everything you need to know about renting a silver, golden or teak cradle for your baby naming ceremony — types, pricing, transport and booking tips.',
    seoDescription:
      'Complete guide to naming ceremony cradle rental in Chennai, Bangalore and Hyderabad. Compare silver, golden and teak cradles, pricing, transport and how to book with PakkaRent.',
    keywords:
      'naming ceremony cradle rental Chennai, silver cradle rent, baby cradle on rent, naamakaran cradle, cradle rental Bangalore Hyderabad',
    topic: 'event',
    publishedAt: '2026-03-15',
    readMinutes: 7,
    featured: true,
    relatedSlugs: ['cradle-for-rent-chennai-price-guide', 'cradle-rental-bangalore-naming-ceremony', 'barasala-cradle-rental-hyderabad', 'silver-vs-golden-cradle-which-to-rent', 'oonjal-jhula-swing-rental-guide', 'haldi-ceremony-decoration-rental-ideas'],
    catalogLinks: [
      { label: 'Browse all cradles', to: L.cradle },
      { label: 'Event rental catalogue', to: L.event },
      { label: 'How booking works', to: L.howItWorks },
    ],
    blocks: [
      { type: 'p', parts: [
        { type: 'text', value: 'A naming ceremony (Naamakaran) is one of the most cherished moments for a South Indian family. The cradle is the centrepiece of the décor. Buying a premium silver or golden cradle can cost lakhs and is used only once or twice. ' },
        { type: 'link', to: L.cradle, label: 'Renting a cradle' },
        { type: 'text', value: ' from PakkaRent gives you a stunning setup at a fraction of the cost, with delivery and pickup handled for you.' },
      ]},
      { type: 'h3', text: 'Types of cradles available on rent' },
      { type: 'ul', items: [
        'Silver Peacock Cradle — ornate peacock motif in pure silver; ideal for premium naming ceremonies',
        'Golden Baby Cradle — gold-finish traditional design; popular for photo shoots and receptions',
        'Royal Chain Cradle — chain-suspension royal design; elegant and traditional',
        'Cultural & Classic Teak Cradle — handcrafted teak wood for a warm, traditional look',
        'Crown Baby Cradle — crown-motif design; a favourite for naming and first-birthday combos',
      ]},
      { type: 'p', parts: [
        { type: 'text', value: 'Browse our full ' },
        { type: 'link', to: L.cradle, label: 'cradle collection' },
        { type: 'text', value: ' filtered by city — we serve Chennai, Bangalore and Hyderabad with doorstep delivery on most items.' },
      ]},
      { type: 'h3', text: 'How much does cradle rental cost?' },
      { type: 'p', parts: [
        { type: 'text', value: 'Event cradles are priced per function. Silver cradles typically range from ₹5,500–₹7,000, golden cradles from ₹2,500–₹3,500, and teak wood cradles from ₹2,200–₹3,800 depending on city. Transport charges depend on location — check individual product pages and ' },
        { type: 'link', to: L.delivery, label: 'delivery details' },
        { type: 'text', value: '.' },
      ]},
      { type: 'h3', text: 'Booking tips for a stress-free ceremony' },
      { type: 'ul', items: [
        'Book at least 2–3 weeks before the ceremony date — peak season slots fill fast',
        'Confirm venue dimensions; some grand cradles need 6–7 ft height clearance',
        'Pair the cradle with a backdrop stand and welcome board for a complete stage setup',
        'Read our FAQ on advance payment, cancellation and deposit refunds before booking',
      ]},
      { type: 'p', parts: [
        { type: 'text', value: 'Ready to book? Add your chosen cradle to the cart and our team will confirm availability. See ' },
        { type: 'link', to: L.howItWorks, label: 'how PakkaRent works' },
        { type: 'text', value: ' or ' },
        { type: 'link', to: L.contact, label: 'contact us on WhatsApp' },
        { type: 'text', value: ' for a quick quote.' },
      ]},
    ],
  },
  {
    slug: 'silver-vs-golden-cradle-which-to-rent',
    title: 'Silver vs Golden Cradle — Which Should You Rent for Your Event?',
    excerpt:
      'Compare silver, golden and teak cradles by style, price and occasion so you pick the right centrepiece for your naming ceremony or baby shower.',
    seoDescription:
      'Silver vs golden cradle rental comparison for naming ceremonies and baby showers in Chennai. Prices, styles and when to choose each — book on PakkaRent.',
    keywords: 'silver cradle vs golden cradle, cradle rental comparison, peacock silver cradle rent, golden baby cradle Chennai',
    topic: 'event',
    publishedAt: '2026-03-10',
    readMinutes: 5,
    relatedSlugs: ['naming-ceremony-cradle-rental-guide-chennai', 'oonjal-jhula-swing-rental-guide'],
    catalogLinks: [
      { label: 'Silver & golden cradles', to: L.cradle },
      { label: 'Backdrop rentals', to: L.backdrop },
    ],
    blocks: [
      { type: 'p', parts: [{ type: 'text', value: 'Choosing between a silver and golden cradle is one of the first decisions families make when planning a naming ceremony. Both photograph beautifully, but they suit different budgets, venues and aesthetics.' }]},
      { type: 'h3', text: 'Silver cradle — when to choose it' },
      { type: 'p', parts: [
        { type: 'text', value: 'Silver cradles — especially the ' },
        { type: 'link', to: L.cradle, label: 'Silver Peacock Cradle' },
        { type: 'text', value: ' — are the premium choice for large halls and hotel banquets. Pure silver designs reflect light beautifully in photos and pair well with floral backdrops and urli arrangements.' },
      ]},
      { type: 'h3', text: 'Golden cradle — when to choose it' },
      { type: 'p', parts: [
        { type: 'text', value: 'Golden cradles offer a royal warm tone at a lower price point. They work well for home functions and baby showers. Combine with a ' },
        { type: 'link', to: L.backdrop, label: 'golden or floral backdrop' },
        { type: 'text', value: ' for a cohesive stage.' },
      ]},
      { type: 'h3', text: 'Quick comparison' },
      { type: 'ul', items: [
        'Silver: ₹5,500–₹7,000 per event — premium, photogenic, best for large venues',
        'Golden: ₹2,300–₹3,500 per event — warm tone, budget-friendly, great for home events',
        'Teak wood: ₹2,200–₹3,800 — traditional handcrafted feel, ideal for cultural ceremonies',
      ]},
      { type: 'p', parts: [
        { type: 'text', value: 'Still unsure? WhatsApp us a photo of your venue and we will recommend the best fit from our ' },
        { type: 'link', to: L.event, label: 'event rental catalogue' },
        { type: 'text', value: '.' },
      ]},
    ],
  },
  {
    slug: 'haldi-ceremony-decoration-rental-ideas',
    title: 'Haldi Ceremony Decoration on a Budget — Urli, Backdrop & Props to Rent',
    excerpt:
      'Plan a beautiful haldi or mangala snanam setup without buying décor. Rent lotus urli, gangalam sets, grass backdrops and props from PakkaRent.',
    seoDescription:
      'Haldi ceremony decoration rental ideas in Chennai — lotus urli, gangalam set, grass backdrops and props on rent. Budget-friendly décor from PakkaRent.',
    keywords: 'haldi decoration rental Chennai, lotus urli rent, gangalam set rental, haldi backdrop rent, mangala snanam décor',
    topic: 'event',
    publishedAt: '2026-03-08',
    readMinutes: 6,
    relatedSlugs: ['pellikuthuru-haldi-decor-rental-hyderabad', 'event-backdrop-rental-guide', 'naming-ceremony-cradle-rental-guide-chennai'],
    catalogLinks: [
      { label: 'Decor & urli items', to: L.decor },
      { label: 'Backdrop rentals', to: L.backdrop },
      { label: 'Props & stands', to: L.props },
    ],
    blocks: [
      { type: 'p', parts: [{ type: 'text', value: 'Haldi and mangala snanam ceremonies need lotus urli, brass gangalam sets, and a backdrop that photographs well in yellow and marigold tones. Renting is far more practical than buying for a single function.' }]},
      { type: 'h3', text: 'Must-have haldi rental items' },
      { type: 'ul', items: [
        'Lotus Urli for Haldi — centrepiece for turmeric water and flower arrangements',
        'Gangalam / Mangala Snanam Set — traditional brass pot arrangement',
        'Haldi Grass Backdrop or Garland Grass Backdrop — natural, photo-ready background',
        'Round Backdrop Stand — frame for custom drapes or rented backdrop panels',
        'Armless Chairs — cream seating for the bride/groom during the ritual',
      ]},
      { type: 'p', parts: [
        { type: 'text', value: 'Find these in our ' },
        { type: 'link', to: L.decor, label: 'Decor & Urli' },
        { type: 'text', value: ' and ' },
        { type: 'link', to: L.backdrop, label: 'Backdrop Rental' },
        { type: 'text', value: ' categories.' },
      ]},
      { type: 'h3', text: 'Budget planning tip' },
      { type: 'p', parts: [
        { type: 'text', value: 'A complete haldi setup can be assembled for under ₹5,000 in rental costs. Check ' },
        { type: 'link', to: L.delivery, label: 'delivery zones' },
        { type: 'text', value: ' for transport charges in your area.' },
      ]},
    ],
  },
  {
    slug: 'oonjal-jhula-swing-rental-guide',
    title: 'Oonjal & Jhula Swing Rental Guide for Weddings and Baby Showers',
    excerpt:
      'Rent a golden or teak oonjal swing for your wedding, baby shower or engagement. Sizes, pricing and pairing tips for South Indian functions.',
    seoDescription:
      'Oonjal and jhula swing rental in Chennai, Bangalore and Hyderabad. Golden and teak swings for weddings, baby showers and receptions — book on PakkaRent.',
    keywords: 'oonjal rental Chennai, jhula swing rent, wedding swing rental, baby shower oonjal, golden jhula rent Bangalore',
    topic: 'event',
    publishedAt: '2026-03-05',
    readMinutes: 5,
    relatedSlugs: ['naming-ceremony-cradle-rental-guide-chennai', 'haldi-ceremony-decoration-rental-ideas'],
    catalogLinks: [
      { label: 'Swings & oonjal', to: L.swings },
      { label: 'Chairs & furniture', to: L.chairs },
      { label: 'Event rentals', to: L.event },
    ],
    blocks: [
      { type: 'p', parts: [
        { type: 'text', value: 'The oonjal (jhula) is the showpiece at many South Indian weddings and baby showers. PakkaRent offers ' },
        { type: 'link', to: L.swings, label: 'golden and teak oonjal swings' },
        { type: 'text', value: ' with delivery across Chennai, Bangalore and Hyderabad.' },
      ]},
      { type: 'h3', text: 'Popular swing options' },
      { type: 'ul', items: [
        'Golden Oonjal / Jhula — premium gold finish; ideal for weddings and receptions',
        'Ivory Oonjal / Royal Swing — 6.5 ft height; statement piece for large halls',
        'Teak Jhula / Swing — traditional wood craftsmanship; warm, cultural aesthetic',
      ]},
      { type: 'h3', text: 'Venue and space requirements' },
      { type: 'p', parts: [
        { type: 'text', value: 'Measure ceiling or mandap height before booking. Pair the oonjal with ' },
        { type: 'link', to: L.chairs, label: 'royal chairs or sofas' },
        { type: 'text', value: ' and a ' },
        { type: 'link', to: L.backdrop, label: 'backdrop' },
        { type: 'text', value: ' for a complete stage.' },
      ]},
    ],
  },
  {
    slug: 'event-backdrop-rental-guide',
    title: 'Event Backdrop Rental Guide — Types, Sizes and Setup Tips',
    excerpt:
      'Choose the right backdrop for your naming ceremony, birthday or wedding reception. Floral walls, grass panels, ring setups and stands explained.',
    seoDescription:
      'Event backdrop rental guide for Chennai — floral walls, grass backdrops, ring setups and stands. Types, pricing and setup tips from PakkaRent.',
    keywords: 'backdrop rental Chennai, event backdrop rent, floral wall backdrop, birthday backdrop rental, naming ceremony backdrop',
    topic: 'backdrop',
    publishedAt: '2026-02-28',
    readMinutes: 6,
    featured: true,
    relatedSlugs: ['haldi-ceremony-decoration-rental-ideas', 'birthday-party-rental-ideas-budget'],
    catalogLinks: [
      { label: 'All backdrops', to: L.backdrop },
      { label: 'Backdrop stands', to: L.props },
      { label: 'Birthday rentals', to: L.birthday },
    ],
    blocks: [
      { type: 'p', parts: [
        { type: 'text', value: 'A backdrop transforms any venue into a photo-ready stage. PakkaRent offers dozens of ' },
        { type: 'link', to: L.backdrop, label: 'ready-made backdrop setups' },
        { type: 'text', value: ' for rent in Chennai, Bangalore and Hyderabad.' },
      ]},
      { type: 'h3', text: 'Backdrop types we rent' },
      { type: 'ul', items: [
        'Floral & flower wall backdrops — white floral, pink rani, yellow lily blossom',
        'Grass backdrops — haldi grass, heritage grass, tulip grass, garland grass',
        'Theme setups — banana leaf, traditional lotus, dreamy ring birthday',
        'Royal & elegant — royal gold, white swan, elegant greenish, charming peach',
      ]},
      { type: 'h3', text: 'Stands and frames' },
      { type: 'p', parts: [
        { type: 'text', value: 'Rent a ' },
        { type: 'link', to: L.props, label: 'round backdrop stand' },
        { type: 'text', value: ', welcome board stand or chalk board stand and drape your own fabric.' },
      ]},
      { type: 'h3', text: 'Setup tips' },
      { type: 'ul', items: [
        'Place the backdrop where stage light hits it — avoid harsh direct sunlight on grass panels',
        'Leave 4–5 ft depth behind the backdrop for cradle, cake table or seating',
        'Book backdrop + stand together to avoid last-minute frame mismatches',
      ]},
    ],
  },
  {
    slug: 'birthday-party-rental-ideas-budget',
    title: 'Birthday Party Rental Ideas on a Budget — Cake Stands, Backdrops & Kids Cars',
    excerpt:
      'Plan a memorable kids birthday without buying décor. Rent cake stands, backdrops, baby cars and party props in Chennai from PakkaRent.',
    seoDescription:
      'Birthday party rental ideas on a budget in Chennai — cake stand combos, backdrops, kids car and jeep rentals. Affordable party décor from PakkaRent.',
    keywords: 'birthday party rental Chennai, cake stand rent, kids car rental birthday, birthday backdrop rent, party props rental',
    topic: 'birthday',
    publishedAt: '2026-02-22',
    readMinutes: 5,
    relatedSlugs: ['bouncy-castle-trampoline-games-rental-chennai', 'event-backdrop-rental-guide', 'baby-props-rental-travel-guide'],
    catalogLinks: [
      { label: 'Birthday rentals', to: L.birthday },
      { label: 'Kids toys on rent', to: L.kidsToys },
      { label: 'Backdrop rentals', to: L.backdrop },
    ],
    blocks: [
      { type: 'p', parts: [
        { type: 'text', value: 'Kids birthday parties need cake displays, a photo backdrop and often a show-stopping entry prop. Our ' },
        { type: 'link', to: L.birthday, label: 'birthday rental category' },
        { type: 'text', value: ' covers everything from cake stands to kids ride-on cars.' },
      ]},
      { type: 'h3', text: 'Popular birthday rentals' },
      { type: 'ul', items: [
        'Irish Cake Table Combo — 4-piece stand set from ₹1,200',
        'Golden Cake Stand Combo — premium gold finish stands for larger parties',
        'Cylindrical Cake Table — modern tiered display for designer cakes',
        'Baby Car / Kids Jeep Rental — remote-operated entry prop; huge hit with kids',
        'Dreamy Ring Birthday Backdrop — ready-made photo booth setup',
      ]},
      { type: 'p', parts: [
        { type: 'text', value: 'Pair a cake stand with a ' },
        { type: 'link', to: L.backdrop, label: 'birthday backdrop' },
        { type: 'text', value: ' and add a ' },
        { type: 'link', to: L.kidsToys, label: 'kids slide or swing' },
        { type: 'text', value: '. See our ' },
        { type: 'link', to: L.howItWorks, label: 'booking process' },
        { type: 'text', value: ' to reserve your date.' },
      ]},
    ],
  },
  {
    slug: 'camping-gear-rental-checklist-chennai',
    title: 'Camping Gear Rental Checklist — Weekend Trips Near Chennai',
    excerpt:
      'Everything to rent for a camping weekend — tent, sleeping bag, barbeque, cooler and life jacket. A practical checklist for Tamil Nadu outdoor trips.',
    seoDescription:
      'Camping gear rental checklist for weekend trips near Chennai. Tents, sleeping bags, barbeque grills and life jackets on rent from PakkaRent.',
    keywords: 'camping gear rental Chennai, tent on rent Chennai, sleeping bag rental, barbeque grill rent, camping equipment rental Tamil Nadu',
    topic: 'camping',
    publishedAt: '2026-02-18',
    readMinutes: 5,
    relatedSlugs: ['rent-vs-buy-home-appliances-chennai'],
    catalogLinks: [
      { label: 'Camping rentals', to: L.camping },
      { label: 'Delivery info', to: L.delivery },
    ],
    blocks: [
      { type: 'p', parts: [
        { type: 'text', value: 'Weekend camping near Chennai is more affordable when you rent gear. PakkaRent\'s ' },
        { type: 'link', to: L.camping, label: 'camping rental collection' },
        { type: 'text', value: ' covers tents, sleeping bags, cooking equipment and safety gear.' },
      ]},
      { type: 'h3', text: 'Essential camping rental checklist' },
      { type: 'ul', items: [
        'Camping Tent (double or single layer) — choose based on group size and weather',
        'Sleeping Bags — one per person; compact and warm for hill stations',
        'Barbeque Grill or Outdoor Barbeque — coal-based; great for beach and forest camps',
        'Camping Stove — backup cooking for trekking trips',
        'Cooler Box — keep drinks and perishables cold',
        'Life Jackets — essential for water activities at Pulicat or backwaters',
      ]},
      { type: 'p', parts: [
        { type: 'text', value: 'Select trip dates in the cart. Read ' },
        { type: 'link', to: L.delivery, label: 'delivery information' },
        { type: 'text', value: ' and ' },
        { type: 'link', to: L.faq, label: 'FAQs' },
        { type: 'text', value: ' on deposits and returns.' },
      ]},
    ],
  },
  {
    slug: 'rent-vs-buy-home-appliances-chennai',
    title: 'Rent vs Buy Home Appliances in Chennai — When Rental Saves More',
    excerpt:
      'Compare monthly rent for washing machine, fridge, AC and TV against purchase cost. See when appliance rental makes financial sense in Chennai.',
    seoDescription:
      'Rent vs buy home appliances in Chennai — washing machine, fridge, AC and TV monthly rental comparison. Save up to 70% with PakkaRent appliance rental.',
    keywords: 'appliance rental Chennai, washing machine on rent, fridge rent Chennai, AC on rent monthly, rent vs buy appliances India',
    topic: 'appliances',
    publishedAt: '2026-02-12',
    readMinutes: 6,
    featured: true,
    relatedSlugs: ['camping-gear-rental-checklist-chennai'],
    catalogLinks: [
      { label: 'Home appliances', to: L.appliances },
      { label: 'How it works', to: L.howItWorks },
      { label: 'FAQs', to: L.faq },
    ],
    blocks: [
      { type: 'p', parts: [
        { type: 'text', value: 'If you are in Chennai temporarily or want to avoid a large upfront purchase, renting appliances is often smarter. PakkaRent offers ' },
        { type: 'link', to: L.appliances, label: 'monthly appliance rental' },
        { type: 'text', value: ' with free maintenance and doorstep delivery.' },
      ]},
      { type: 'h3', text: 'What you can rent monthly' },
      { type: 'ul', items: [
        'Washing Machine — from ₹800–₹2,500/month depending on tenure',
        'Refrigerator — branded units with flexible 3, 6 and 12-month plans',
        'Air Conditioner — includes installation support; ideal for summer months',
        'LED TV — for temporary setups, guest rooms or new apartments',
      ]},
      { type: 'h3', text: 'When rental wins over buying' },
      { type: 'ul', items: [
        'Short-term stays (6–18 months) — rental cost is far below purchase + resale hassle',
        'Students and bachelors — no lock-in on owning depreciating assets',
        'Trial before buy — rent an AC or fridge model before committing to purchase',
        'Maintenance included — PakkaRent handles repairs; no service centre visits',
      ]},
      { type: 'p', parts: [
        { type: 'text', value: 'Browse ' },
        { type: 'link', to: L.appliances, label: 'appliance plans' },
        { type: 'text', value: ' and read ' },
        { type: 'link', to: L.faq, label: 'FAQs on deposits and refunds' },
        { type: 'text', value: ' before booking.' },
      ]},
    ],
  },
  {
    slug: 'baby-props-rental-travel-guide',
    title: 'Baby Props Rental for Travel — Stroller, Car Seat, Crib & High Chair',
    excerpt:
      'Travelling with a baby to Chennai? Rent a stroller, car seat, crib and high chair instead of carrying bulky gear.',
    seoDescription:
      'Baby props rental in Chennai — stroller, car seat, crib and high chair on rent for travel and temporary stays. Book baby gear on PakkaRent.',
    keywords: 'baby stroller rental Chennai, baby car seat rent, crib rental Chennai, high chair on rent, baby gear rental travel',
    topic: 'baby',
    publishedAt: '2026-02-08',
    readMinutes: 4,
    relatedSlugs: ['baby-stroller-on-rent-chennai', 'baby-stroller-car-seat-rent-bangalore', 'birthday-party-rental-ideas-budget', 'naming-ceremony-cradle-rental-guide-chennai'],
    catalogLinks: [
      { label: 'Baby props rental', to: L.babyProps },
      { label: 'Kids toys on rent', to: L.kidsToys },
    ],
    blocks: [
      { type: 'p', parts: [
        { type: 'text', value: 'Visiting family in Chennai, Bangalore or Hyderabad with a little one? Rent clean, safety-checked baby gear from our ' },
        { type: 'link', to: L.babyProps, label: 'Baby Props Rental' },
        { type: 'text', value: ' category for the duration of your stay.' },
      ]},
      { type: 'h3', text: 'Most rented baby items' },
      { type: 'ul', items: [
        'Baby Stroller — easy-fold models for city outings and airport transfers',
        'Baby Car Seat — infant and toddler sizes for safe cab and car travel',
        'Baby Crib with Mattress — for hotel stays or relatives\' homes without a crib',
        'High Chair — essential for dining during long visits',
      ]},
      { type: 'p', parts: [
        { type: 'text', value: 'For birthday parties, also check ' },
        { type: 'link', to: L.kidsToys, label: 'kids cars and slides' },
        { type: 'text', value: ' in our kids toys category.' },
      ]},
    ],
  },
  {
    slug: 'corporate-event-games-rental-team-building',
    title: 'Corporate Event Games Rental — Team Building Ideas for Companies',
    excerpt:
      'Organise tug of war, moonwalk bouncy castle and outdoor games for corporate offsites and annual days. Rent team-building games in Chennai.',
    seoDescription:
      'Corporate event games rental in Chennai — tug of war rope, moonwalk, bouncy castle and team building games on rent from PakkaRent.',
    keywords: 'corporate event games rental Chennai, tug of war rope rent, moonwalk rental, team building games rent, company outing games Chennai',
    topic: 'tips',
    publishedAt: '2026-02-01',
    readMinutes: 4,
    relatedSlugs: ['camping-gear-rental-checklist-chennai', 'birthday-party-rental-ideas-budget'],
    catalogLinks: [
      { label: 'Games rental', to: L.games },
      { label: 'Camping gear', to: L.camping },
      { label: 'Contact for bulk orders', to: L.contact },
    ],
    blocks: [
      { type: 'p', parts: [
        { type: 'text', value: 'Corporate offsites and annual family days need activities that bring teams together. Rent professional-grade gear from PakkaRent\'s ' },
        { type: 'link', to: L.games, label: 'Games Rental' },
        { type: 'text', value: ' category instead of buying for once-a-year use.' },
      ]},
      { type: 'h3', text: 'Popular corporate game rentals' },
      { type: 'ul', items: [
        'Tug of War Rope — classic team competition; available in multiple lengths',
        'Moon Walk / Bouncy Castle — highlight attraction for family days with kids',
        'Combine with camping tents and barbeque for full outdoor offsite packages',
      ]},
      { type: 'p', parts: [
        { type: 'text', value: 'Pair ' },
        { type: 'link', to: L.camping, label: 'camping equipment' },
        { type: 'text', value: ' with games for a complete outdoor package. ' },
        { type: 'link', to: L.contact, label: 'Contact our team' },
        { type: 'text', value: ' for multi-item quotes.' },
      ]},
    ],
  },
  {
    slug: 'washing-machine-on-rent-bangalore-guide',
    title: 'Washing Machine on Rent in Bangalore — Plans, Brands & Delivery',
    excerpt:
      'Moving to Bangalore? Compare fully automatic washing machine rental plans, monthly pricing and doorstep delivery options before you book.',
    seoDescription:
      'Washing machine on rent in Bangalore — monthly plans, top-load fully automatic models, delivery and maintenance included. Book on PakkaRent.',
    keywords: 'washing machine on rent Bangalore, rent washing machine Bangalore, laundry machine rental Bangalore, appliance rental Bangalore',
    topic: 'appliances',
    publishedAt: '2026-04-01',
    readMinutes: 5,
    featured: true,
    relatedSlugs: ['rent-vs-buy-home-appliances-chennai', 'baby-props-rental-travel-guide'],
    catalogLinks: [
      { label: 'Home appliances', to: L.appliances },
      { label: 'Bangalore rentals', to: '/bangalore' },
      { label: 'How it works', to: L.howItWorks },
    ],
    blocks: [
      { type: 'p', parts: [
        { type: 'text', value: 'Relocating to Bangalore for work or studies? Buying a washing machine ties up capital and creates a resale headache when you move. ' },
        { type: 'link', to: L.appliances, label: 'Renting a washing machine' },
        { type: 'text', value: ' gives you a fully automatic top-load model with maintenance included — ideal for 3–12 month stays.' },
      ]},
      { type: 'h3', text: 'What to expect from Bangalore appliance rental' },
      { type: 'ul', items: [
        'Top-load fully automatic 6–6.5 kg models from branded manufacturers',
        'Monthly plans with lower per-month rates on longer tenures (3, 6 or 12 months)',
        'Doorstep delivery and pickup across Bangalore',
        'Maintenance handled by PakkaRent during the rental period',
      ]},
      { type: 'p', parts: [
        { type: 'text', value: 'Browse ' },
        { type: 'link', to: '/products/home-appliances-rental/bangalore', label: 'home appliances in Bangalore' },
        { type: 'text', value: ' or read our ' },
        { type: 'link', to: '/blog/rent-vs-buy-home-appliances-chennai', label: 'rent vs buy guide' },
        { type: 'text', value: ' before deciding.' },
      ]},
    ],
  },
  {
    slug: 'baby-stroller-rent-hyderabad-guide',
    title: 'Baby Stroller on Rent in Hyderabad — Travel & Short-Term Guide',
    excerpt:
      'Visiting family in Hyderabad or need a stroller for a few weeks? How to rent a safe, comfortable baby stroller with doorstep delivery.',
    seoDescription:
      'Baby stroller on rent in Hyderabad — premium strollers for travel and short stays. Safe, comfortable and delivered to your door by PakkaRent.',
    keywords: 'baby stroller rent Hyderabad, stroller on rent Hyderabad, baby gear rental Hyderabad, baby props rent Hyderabad',
    topic: 'baby',
    publishedAt: '2026-04-05',
    readMinutes: 4,
    featured: true,
    relatedSlugs: ['baby-stroller-on-rent-chennai', 'baby-stroller-car-seat-rent-bangalore', 'baby-props-rental-travel-guide', 'birthday-party-rental-ideas-budget'],
    catalogLinks: [
      { label: 'Baby props', to: L.babyProps },
      { label: 'Hyderabad rentals', to: '/hyderabad' },
      { label: 'Delivery info', to: L.delivery },
    ],
    blocks: [
      { type: 'p', parts: [
        { type: 'text', value: 'Travelling to Hyderabad with a baby or hosting visiting grandparents? A rented stroller is far easier than hauling yours on a flight. PakkaRent offers ' },
        { type: 'link', to: L.babyProps, label: 'baby strollers and car seats' },
        { type: 'text', value: ' for short-term rental with delivery across Hyderabad.' },
      ]},
      { type: 'h3', text: 'Why rent instead of buy?' },
      { type: 'ul', items: [
        'Ideal for 1–4 week visits or trial before buying',
        'Premium brands maintained and safety-checked before each delivery',
        'Pair with a high chair or car seat for a complete travel kit',
        'Pickup arranged when your rental period ends',
      ]},
      { type: 'p', parts: [
        { type: 'text', value: 'See all ' },
        { type: 'link', to: '/products/baby-props-rental/hyderabad', label: 'baby props in Hyderabad' },
        { type: 'text', value: ' including strollers, cribs and high chairs.' },
      ]},
    ],
  },
  {
    slug: 'ac-on-rent-chennai-summer-guide',
    title: 'AC on Rent in Chennai — Beat the Heat Without Buying',
    excerpt:
      'Chennai summers demand good cooling. Compare split and window AC rental plans, installation and monthly pricing for your home.',
    seoDescription:
      'AC on rent in Chennai — split and window air conditioners with installation. Flexible monthly rental plans from PakkaRent.',
    keywords: 'AC on rent Chennai, air conditioner rental Chennai, split AC rent Chennai, appliance rental Chennai summer',
    topic: 'appliances',
    publishedAt: '2026-04-08',
    readMinutes: 5,
    relatedSlugs: ['rent-vs-buy-home-appliances-chennai', 'washing-machine-on-rent-bangalore-guide'],
    catalogLinks: [
      { label: 'Home appliances', to: L.appliances },
      { label: 'Chennai rentals', to: '/chennai' },
      { label: 'Contact us', to: L.contact },
    ],
    blocks: [
      { type: 'p', parts: [
        { type: 'text', value: 'Chennai\'s heat and humidity make air conditioning essential for comfortable living. If you are in the city for a limited period, ' },
        { type: 'link', to: L.appliances, label: 'renting an AC' },
        { type: 'text', value: ' avoids the upfront cost of purchase and installation that you cannot take with you when you leave.' },
      ]},
      { type: 'h3', text: 'AC rental basics' },
      { type: 'ul', items: [
        'Branded split and window AC units with professional installation',
        'Monthly rental with lower rates on 6 and 12-month tenures',
        'Maintenance support during the rental period',
        'Available for delivery across Chennai',
      ]},
      { type: 'p', parts: [
        { type: 'text', value: 'Browse ' },
        { type: 'link', to: '/products/home-appliances-rental/chennai', label: 'appliances in Chennai' },
        { type: 'text', value: ' or WhatsApp us for availability on your preferred move-in date.' },
      ]},
    ],
  },
  {
    slug: 'backdrop-rental-bangalore-ideas',
    title: 'Backdrop Rental Ideas in Bangalore — Birthdays, Haldi & Corporate Events',
    excerpt:
      'From floral walls to ring backdrops — trending backdrop rental ideas in Bangalore for birthdays, haldi ceremonies and office events.',
    seoDescription:
      'Backdrop rental Bangalore — floral walls, ring backdrops and haldi setups for birthdays and functions. Rent on PakkaRent with delivery.',
    keywords: 'backdrop rental Bangalore, birthday backdrop rent Bangalore, haldi backdrop Bangalore, event decoration rental Bangalore',
    topic: 'backdrop',
    publishedAt: '2026-04-10',
    readMinutes: 6,
    relatedSlugs: ['cradle-rental-bangalore-naming-ceremony', 'event-backdrop-rental-guide', 'birthday-party-rental-ideas-budget'],
    catalogLinks: [
      { label: 'Backdrop rentals', to: L.backdrop },
      { label: 'Birthday rentals', to: L.birthday },
      { label: 'Bangalore catalogue', to: '/bangalore' },
    ],
    blocks: [
      { type: 'p', parts: [
        { type: 'text', value: 'Bangalore hosts countless birthdays, haldi functions and corporate celebrations every weekend. A statement ' },
        { type: 'link', to: L.backdrop, label: 'backdrop' },
        { type: 'text', value: ' transforms any venue into an Instagram-ready stage without the cost of custom fabrication.' },
      ]},
      { type: 'h3', text: 'Popular backdrop styles' },
      { type: 'ul', items: [
        'Floral wall backdrops for weddings and receptions',
        'Ring and arch backdrops for milestone birthdays',
        'Banana leaf and traditional setups for haldi and seemantham',
        'Corporate step-and-repeat panels for office events',
      ]},
      { type: 'p', parts: [
        { type: 'text', value: 'Explore ' },
        { type: 'link', to: '/products/backdrop-rental/bangalore', label: 'backdrops in Bangalore' },
        { type: 'text', value: ' and pair with props from our ' },
        { type: 'link', to: L.birthday, label: 'birthday rental' },
        { type: 'text', value: ' category.' },
      ]},
    ],
  },
  {
    slug: 'wedding-event-rental-checklist-hyderabad',
    title: 'Wedding & Event Rental Checklist for Hyderabad Functions',
    excerpt:
      'Planning a wedding or reception in Hyderabad? A complete checklist of cradles, oonjal, chairs, urli and décor items to rent.',
    seoDescription:
      'Wedding event rental checklist Hyderabad — cradles, oonjal swings, chairs, urli and décor on rent. Plan your function with PakkaRent.',
    keywords: 'wedding rental Hyderabad, event rental Hyderabad, oonjal rent Hyderabad, cradle rental Hyderabad, function decoration rent',
    topic: 'event',
    publishedAt: '2026-04-12',
    readMinutes: 7,
    featured: true,
    relatedSlugs: ['barasala-cradle-rental-hyderabad', 'pellikuthuru-haldi-decor-rental-hyderabad', 'oonjal-jhula-swing-rental-guide', 'haldi-ceremony-decoration-rental-ideas'],
    catalogLinks: [
      { label: 'Event rentals', to: L.event },
      { label: 'Cradle collection', to: L.cradle },
      { label: 'Hyderabad rentals', to: '/hyderabad' },
    ],
    blocks: [
      { type: 'p', parts: [
        { type: 'text', value: 'Hyderabad weddings blend tradition with grandeur — and the rental list can be long. Use this checklist to plan your ' },
        { type: 'link', to: L.event, label: 'event rentals' },
        { type: 'text', value: ' and book early for peak season dates.' },
      ]},
      { type: 'h3', text: 'Essential items to rent' },
      { type: 'ul', items: [
        'Silver or golden cradle for naming ceremony (Naamakaran)',
        'Teak or golden oonjal / jhula for baby shower or engagement',
        'Lotus urli and haldi décor props',
        'Royal chairs, sofa and red carpet for stage seating',
        'Backdrop stand with floral or traditional panel',
      ]},
      { type: 'p', parts: [
        { type: 'text', value: 'Browse the full ' },
        { type: 'link', to: '/products/event-rental/hyderabad', label: 'event catalogue in Hyderabad' },
        { type: 'text', value: ' or read our ' },
        { type: 'link', to: '/blog/oonjal-jhula-swing-rental-guide', label: 'oonjal rental guide' },
        { type: 'text', value: ' for swing options.' },
      ]},
    ],
  },
];

export function getBlogPost(slug) {
  return BLOG_POSTS.find((p) => p.slug === slug) || null;
}

export function getRelatedPosts(slug, limit = 3) {
  const post = getBlogPost(slug);
  if (!post) return [];
  const related = (post.relatedSlugs || []).map(getBlogPost).filter(Boolean);
  if (related.length >= limit) return related.slice(0, limit);
  const sameTopic = BLOG_POSTS.filter((p) => p.slug !== slug && p.topic === post.topic && !related.includes(p));
  return [...related, ...sameTopic].slice(0, limit);
}

export function getFeaturedPosts(limit = 2) {
  return BLOG_POSTS.filter((p) => p.featured).slice(0, limit);
}

export function getPostsByTopic(topicId) {
  if (!topicId) return BLOG_POSTS;
  return BLOG_POSTS.filter((p) => p.topic === topicId);
}
