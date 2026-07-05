import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import { useCity } from '../context/CityContext';
import ProductCard from '../components/common/ProductCard';
import useSEO from '../hooks/useSEO';
import JsonLd from '../components/common/JsonLd';
import { PAKKARENT_REVIEWS, buildReviewsSchema } from '../content/reviews';
import { getCategoryProductsPath } from '../utils/categoryUtils';
import { trustedServiceLabel } from '../utils/company';
import {
  HERO_IMAGE,
  PROMO_BANNERS,
  CATEGORY_FALLBACKS,
  getCategoryImage,
} from '../content/siteImages';
import './Home.css';

/* ── Testimonials (also used in Review schema — see content/reviews.js) ── */
const TESTIMONIALS = PAKKARENT_REVIEWS.map((r) => ({
  name: r.name,
  loc: r.location,
  init: r.name.charAt(0),
  color: r.location === 'Chennai' ? '#E64A19' : r.location === 'Bangalore' ? '#1565C0' : '#2E7D32',
  text: r.text,
  rating: r.rating,
}));

/* ── HOW IT WORKS ── */
const STEPS = [
  { n: '1', emoji: '🔍', title: 'Browse & Select', desc: 'Choose from thousands of verified rental items in your city' },
  { n: '2', emoji: '🛒', title: 'Book Online',     desc: 'Select your rental period and complete secure checkout' },
  { n: '3', emoji: '🚚', title: 'Get Delivered',   desc: 'Items arrive at your doorstep on your chosen date'     },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllCats, setShowAllCats] = useState(false);
  const { city } = useCity();

  const reviewsLd = useMemo(() => buildReviewsSchema(), []);

  useSEO({
    title: `Rent Appliances, Furniture & Event Items in ${city}`,
    titleSuffix: false,
    description: `PakkaRent makes it easy to rent home appliances, furniture, baby gear, camping kits and event items in ${city}. Free delivery, flexible monthly tenures, 24x7 support.`,
    keywords: `rent appliances ${city}, washing machine on rent ${city}, AC on rent ${city}, baby cradle rental, event rentals, furniture on rent ${city}, refrigerator rental, monthly rental, PakkaRent`,
    canonical: '/',
  });

  useEffect(() => {
    (async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          productAPI.getAll({ featured: true, limit: 12, city }),
          categoryAPI.getAll({ parents_only: true }),
        ]);
        setFeatured(prodRes.data.products || []);
        setCategories(catRes.data.categories || []);
      } catch (e) {
        console.error('Home fetch error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [city]);

  const visibleCats = showAllCats ? categories : categories.slice(0, 12);
  const yearsLabel = trustedServiceLabel();

  return (
    <div className="home">
      <JsonLd data={reviewsLd} id="ld-reviews" />

      {/* ════════════════════════════════════════════════
          HERO — split layout: lifestyle image | category grid
      ════════════════════════════════════════════════ */}
      <section className="hero-split">
        <div className="container hero-split-inner">

          {/* LEFT — featured image panel */}
          <div className="hero-panel">
            <div className="hero-panel-img">
              <img
                src={HERO_IMAGE}
                alt="Rent for events"
                width="560"
                height="600"
                fetchPriority="high"
                decoding="async"
              />
              <div className="hero-panel-overlay">
                <p className="hero-panel-tag">{yearsLabel}</p>
                <h2>Rent for every<br />celebration</h2>
                <Link to="/products" className="hero-panel-btn">
                  Explore all items <span>↗</span>
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT — category grid */}
          <div className="hero-categories">
            <h2 className="rm-heading">
              Explore <span className="accent">our Top Categories</span>
            </h2>

            <div className="cat-tiles-grid">
              {loading && visibleCats.length === 0
                ? [...Array(8)].map((_, i) => (
                  <div key={i} className="cat-tile cat-tile--skeleton" aria-hidden="true">
                    <div className="cat-tile-img" />
                    <div className="cat-tile-label-skeleton" />
                  </div>
                ))
                : visibleCats.map((cat, idx) => (
                <Link
                  key={cat.id}
                  to={getCategoryProductsPath(cat, city)}
                  className="cat-tile"
                >
                  <div className="cat-tile-img">
                    <img
                      src={getCategoryImage(cat.name, idx)}
                      alt={cat.name}
                      width="220"
                      height="110"
                      loading="lazy"
                      decoding="async"
                      onError={e => { e.target.src = CATEGORY_FALLBACKS[idx % CATEGORY_FALLBACKS.length]; }}
                    />
                  </div>
                  <p className="cat-tile-label">{cat.name}</p>
                </Link>
              ))}
            </div>

            {categories.length > 12 && (
              <button
                className="view-more-btn"
                onClick={() => setShowAllCats(v => !v)}
              >
                {showAllCats ? 'Show less ↑' : `View More categories ↓`}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          PROMO BANNERS
      ════════════════════════════════════════════════ */}
      <section className="promos-section">
        <div className="container">
          <div className="promos-grid">
            {PROMO_BANNERS.map((b, i) => (
              <div key={i} className="promo-card" style={{ background: b.bg }}>
                <div className="promo-text">
                  <span className="promo-tag">{b.tag}</span>
                  <h3>
                    {b.heading}<br />
                    <span className="promo-accent">{b.headingAccent}</span>
                  </h3>
                  <p>{b.sub}</p>
                  <Link to={b.link} className="promo-btn">
                    {b.cta} <span>↗</span>
                  </Link>
                </div>
                <div className="promo-img-wrap">
                  <img src={b.img} alt={b.headingAccent} width="300" height="170" loading="lazy" decoding="async" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          LATEST & TRENDING — horizontal carousel
      ════════════════════════════════════════════════ */}
      <section className="trending-section">
        <div className="container">
          <div className="trending-header">
            <h2 className="rm-heading">
              Latest &amp;<span className="accent">Trending</span>
            </h2>
            <Link to="/products" className="see-all-link">See all →</Link>
          </div>

          {loading ? (
            <div className="skeleton-row">
              {[...Array(5)].map((_, i) => <div key={i} className="skeleton-tile" />)}
            </div>
          ) : (
            <div className="products-carousel">
              {featured.map(prod => (
                <div key={prod.id} className="carousel-item">
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════════ */}
      <section className="how-section">
        <div className="container">
          <h2 className="rm-heading center-heading">
            How It<span className="accent"> Works</span>
          </h2>
          <div className="how-grid">
            {STEPS.map((s, i) => (
              <div key={i} className="how-step">
                <div className="how-step-top">
                  <div className="how-num">{s.n}</div>
                  {i < STEPS.length - 1 && <div className="how-connector" />}
                </div>
                <span className="how-emoji">{s.emoji}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          WHY PAKKARENT — clean 3-column trust strip
      ════════════════════════════════════════════════ */}
      <section className="why-section">
        <div className="container">
          <h2 className="rm-heading center-heading">
            Why Choose<span className="accent"> PakkaRent</span>
          </h2>
          <div className="why-grid">
            {[
              { icon: '✅', title: 'Verified & Sanitized',   desc: 'Every item goes through quality checks and deep cleaning before delivery' },
              { icon: '🚚', title: 'Doorstep Delivery',      desc: 'Free delivery and pickup in Chennai, Bangalore & Hyderabad' },
              { icon: '💰', title: 'Save up to 70%',         desc: 'Renting beats buying — get premium items at a fraction of the cost' },
              { icon: '🔄', title: 'Hassle-free Returns',    desc: 'Simply call us, we pick up your items at the end of your rental period' },
            ].map((w, i) => (
              <div key={i} className="why-card">
                <span className="why-icon">{w.icon}</span>
                <h4>{w.title}</h4>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════════════ */}
      <section className="reviews-section">
        <div className="container">
          <h2 className="rm-heading center-heading">
            Customer<span className="accent"> Reviews</span>
          </h2>
          <div className="reviews-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="review-card">
                <div className="review-stars" aria-label={`${t.rating} out of 5 stars`}>
                  {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                </div>
                <p className="review-text">"{t.text}"</p>
                <div className="review-author">
                  <span className="review-avatar" style={{ background: t.color }}>{t.init}</span>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.loc}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════════════ */}
      <section className="cta-strip">
        <div className="container">
          <div className="cta-strip-inner">
            <div className="cta-strip-text">
              <h2>Ready to rent smarter in <span>{city}</span>?</h2>
              <p>Join 50,000+ happy customers. Browse, book, and get it delivered.</p>
            </div>
            <Link to="/products" className="btn btn-primary cta-strip-btn">
              Browse All Products →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
