/** Customer testimonials used on homepage and in Review schema. */
export const PAKKARENT_REVIEWS = [
  {
    name: 'Priya S.',
    location: 'Chennai',
    rating: 5,
    text: 'Rented party decorations and they were delivered on time. Everything was perfect — saved us so much money!',
    date: '2025-11-12',
  },
  {
    name: 'Rahul V.',
    location: 'Bangalore',
    rating: 5,
    text: 'The baby crib and stroller were in great condition. Exactly what we needed for 3 months. Highly recommend.',
    date: '2025-10-08',
  },
  {
    name: 'Anjali P.',
    location: 'Hyderabad',
    rating: 5,
    text: 'Camping gear was clean and well-maintained. Setup was quick. Will definitely rent from PakkaRent again!',
    date: '2025-09-21',
  },
  {
    name: 'Karthik M.',
    location: 'Chennai',
    rating: 5,
    text: 'Silver cradle for our naming ceremony looked stunning. Team was professional and pickup was hassle-free.',
    date: '2025-08-15',
  },
  {
    name: 'Deepa R.',
    location: 'Bangalore',
    rating: 4,
    text: 'Rented washing machine and fridge for our new apartment. Good condition and prompt delivery.',
    date: '2025-07-03',
  },
];

export function buildReviewsSchema(origin = '') {
  const base = origin || (typeof window !== 'undefined' ? window.location.origin : 'https://pakkarent.com');
  const avg = PAKKARENT_REVIEWS.reduce((s, r) => s + r.rating, 0) / PAKKARENT_REVIEWS.length;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PakkaRent',
    url: `${base}/`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avg.toFixed(1),
      reviewCount: String(PAKKARENT_REVIEWS.length),
      bestRating: '5',
      worstRating: '1',
    },
    review: PAKKARENT_REVIEWS.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.name },
      reviewRating: { '@type': 'Rating', ratingValue: String(r.rating), bestRating: '5' },
      reviewBody: r.text,
      datePublished: r.date,
    })),
  };
}
