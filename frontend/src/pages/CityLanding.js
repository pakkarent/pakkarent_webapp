import React, { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCity } from '../context/CityContext';
import ProductCard from '../components/common/ProductCard';
import useSEO from '../hooks/useSEO';
import JsonLd from '../components/common/JsonLd';
import Breadcrumb from '../components/common/Breadcrumb';
import {
  CITY_LANDING,
  getCityCategoryLinks,
  getCityLocation,
} from '../content/cityLanding';
import { cityFromUrlSegment } from '../utils/cityUrls';
import { getCategoryPath } from '../utils/productUrls';
import './CityLanding.css';

export default function CityLanding() {
  const citySegment = useLocation().pathname.replace(/^\//, '').toLowerCase();
  const dbCity = cityFromUrlSegment(citySegment);
  const content = CITY_LANDING[citySegment];
  const { syncCityFromRoute, confirmCityForCatalog } = useCity();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dbCity) return;
    syncCityFromRoute(dbCity);
    confirmCityForCatalog();
  }, [dbCity, syncCityFromRoute, confirmCityForCatalog]);

  useEffect(() => {
    if (!dbCity) return;
    productAPI
      .getAll({ city: dbCity, featured: true, limit: 8 })
      .then((res) => setFeatured(res.data.products || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, [dbCity]);

  const canonical = content ? `/${citySegment}` : '/';
  const location = content ? getCityLocation(citySegment) : null;
  const categoryLinks = content && dbCity ? getCityCategoryLinks(dbCity) : [];

  useSEO({
    title: content?.title || 'PakkaRent',
    titleSuffix: false,
    description: content?.seoDescription,
    keywords: content?.keywords,
    canonical,
  });

  if (!content || !dbCity) {
    return <Navigate to="/" replace />;
  }

  const localBusinessLd = location?.branches.map((branch) => ({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `PakkaRent ${content.city} — ${branch.name}`,
    url: typeof window !== 'undefined' ? `${window.location.origin}${canonical}` : canonical,
    telephone: '+91-94038-90901',
    address: {
      '@type': 'PostalAddress',
      addressLocality: content.city,
      addressCountry: 'IN',
    },
    ...(branch.mapUrl ? { hasMap: branch.mapUrl } : {}),
  }));

  return (
    <div className="city-landing">
      {localBusinessLd?.map((schema, i) => (
        <JsonLd key={i} data={schema} id={`ld-local-${citySegment}-${i}`} />
      ))}

      <div className="city-landing-hero">
        <div className="container">
          <Breadcrumb items={[
            { label: 'Home', to: '/' },
            { label: content.city },
          ]} />
          <h1>{content.heroHeading}</h1>
          <p className="city-landing-sub">{content.heroSub}</p>
          <ul className="city-landing-highlights">
            {content.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <div className="city-landing-cta">
            <Link to="/products" className="btn btn-primary">Browse all rentals</Link>
            <Link to="/contact" className="btn btn-outline">Contact us</Link>
          </div>
        </div>
      </div>

      <div className="container city-landing-body">
        <section className="city-categories">
          <h2>Popular categories in {content.city}</h2>
          <div className="city-cat-grid">
            {categoryLinks.map((cat) => (
              <Link key={cat.id} to={cat.path} className="city-cat-card">
                {cat.name}
              </Link>
            ))}
          </div>
        </section>

        {location && (
          <section className="city-stores">
            <h2>Our {content.city} locations</h2>
            <div className="city-store-grid">
              {location.branches.map((branch) => (
                <a
                  key={branch.name}
                  href={branch.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="city-store-card"
                >
                  <strong>{branch.name}</strong>
                  <span>{branch.hint}</span>
                  <span className="city-store-link">View on map →</span>
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="city-featured">
          <div className="city-featured-header">
            <h2>Featured in {content.city}</h2>
            <Link to={getCategoryPath(3, dbCity)}>View event rentals →</Link>
          </div>
          {loading ? (
            <div className="loading">Loading…</div>
          ) : (
            <div className="products-grid">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
