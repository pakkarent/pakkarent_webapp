import { CATALOG_LINKS as L } from './catalogLinks';

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
    relatedSlugs: ['silver-vs-golden-cradle-which-to-rent', 'oonjal-jhula-swing-rental-guide', 'haldi-ceremony-decoration-rental-ideas'],
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
        { type: 'text', value: 'Event cradles are priced per function. Silver cradles typically range from ₹5,500–₹7,000, golden cradles from ₹2,500–₹3,500, and teak wood cradles from ₹2,200–₹3,800 depending on city. Many items include free transport up to 10 km from Velachery, Chennai. Check individual product pages and ' },
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
    relatedSlugs: ['event-backdrop-rental-guide', 'naming-ceremony-cradle-rental-guide-chennai'],
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
    relatedSlugs: ['event-backdrop-rental-guide', 'baby-props-rental-travel-guide'],
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
    relatedSlugs: ['birthday-party-rental-ideas-budget', 'naming-ceremony-cradle-rental-guide-chennai'],
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
