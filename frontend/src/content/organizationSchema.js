import { PAKKARENT_LOCATIONS } from './locations';

export const PAKKARENT_SAME_AS = [
  'https://www.instagram.com/pakkarent/',
  'https://www.facebook.com/pakkarent/',
  'https://twitter.com/pakka_rent',
  'https://pakkarent.com/',
];

export function buildOrganizationSchema(origin = 'https://pakkarent.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PakkaRent',
    url: `${origin}/`,
    logo: `${origin}/og-image.png`,
    image: `${origin}/og-image.png`,
    description:
      'Rental marketplace for appliances, furniture, baby gear, camping kits and event items across Chennai, Bangalore and Hyderabad.',
    telephone: '+91-94038-90901',
    areaServed: [
      { '@type': 'City', name: 'Chennai' },
      { '@type': 'City', name: 'Bangalore' },
      { '@type': 'City', name: 'Hyderabad' },
    ],
    contactPoint: [{
      '@type': 'ContactPoint',
      telephone: '+91-94038-90901',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Tamil', 'Hindi', 'Telugu', 'Kannada'],
    }],
    sameAs: PAKKARENT_SAME_AS,
  };
}

export function buildLocalBusinessSchemas(origin = 'https://pakkarent.com') {
  const schemas = [];
  for (const loc of PAKKARENT_LOCATIONS) {
    for (const branch of loc.branches) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: `PakkaRent ${loc.city} — ${branch.name}`,
        description: `PakkaRent rental showroom and delivery hub in ${loc.city}. Appliances, event rentals, baby props and more.`,
        url: `${origin}/${loc.id}`,
        telephone: '+91-94038-90901',
        address: {
          '@type': 'PostalAddress',
          addressLocality: loc.city,
          addressRegion: loc.city === 'Chennai' ? 'Tamil Nadu' : loc.city === 'Bangalore' ? 'Karnataka' : 'Telangana',
          addressCountry: 'IN',
        },
        areaServed: { '@type': 'City', name: loc.city },
        parentOrganization: { '@type': 'Organization', name: 'PakkaRent', url: `${origin}/` },
        ...(branch.mapUrl ? { hasMap: branch.mapUrl } : {}),
      });
    }
  }
  return schemas;
}

export function buildWebSiteSchema(origin = 'https://pakkarent.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PakkaRent',
    url: `${origin}/`,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${origin}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
