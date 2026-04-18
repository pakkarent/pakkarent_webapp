import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import { useCity } from '../context/CityContext';
import ProductCard from '../components/common/ProductCard';
import './Home.css';

/* ── Category → Unsplash image map (keyword-based) ── */
const CAT_IMGS = {
  camping:    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=220&h=180&fit=crop&q=75',
  appliance:  'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=220&h=180&fit=crop&q=75',
  home:       'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=220&h=180&fit=crop&q=75',
  event:      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=220&h=180&fit=crop&q=75',
  backdrop:   'https://images.unsplash.com/photo-1478147427282-58a87a433049?w=220&h=180&fit=crop&q=75',
  birthday:   'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=220&h=180&fit=crop&q=75',
  baby:       'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=220&h=180&fit=crop&q=75',
  kids:       'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=220&h=180&fit=crop&q=75',
  toy:        'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=220&h=180&fit=crop&q=75',
  game:       'https://images.unsplash.com/photo-1612404730960-5c71577fca11?w=220&h=180&fit=crop&q=75',
};
const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=220&h=180&fit=crop&q=75',
  'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=220&h=180&fit=crop&q=75',
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=220&h=180&fit=crop&q=75',
  'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=220&h=180&fit=crop&q=75',
];

function getCategoryImage(catName, idx) {
  const name = (catName || '').toLowerCase();
  for (const [key, url] of Object.entries(CAT_IMGS)) {
    if (name.includes(key)) return url;
  }
  return FALLBACK_IMGS[idx % FALLBACK_IMGS.length];
}

/* ── Static promo banners ── */
const PROMO_BANNERS = [
  {
    tag: 'Most Popular',
    heading: 'Birthday &',
    headingAccent: 'Party Rentals',
    sub: 'Decorations, props, backdrops & more',
    cta: 'Explore now',
    link: '/products?category_id=5',
    img: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&h=340&fit=crop&q=80',
    bg: '#FFF3E0',
  },
  {
    tag: 'Top Rated',
    heading: 'Baby &',
    headingAccent: 'Kids Essentials',
    sub: 'Strollers, cribs, toys & gear on rent',
    cta: 'Rent now',
    link: '/products?category_id=6',
    img: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=340&fit=crop&q=80',
    bg: '#E8F5E9',
  },
];

/* ── Testimonials ── */
const TESTIMONIALS = [
  { name: 'Priya S.', loc: 'Chennai', init: 'P', color: '#E64A19',
    text: 'Rented party decorations and they were delivered on time. Everything was perfect — saved us so much money!' },
  { name: 'Rahul V.', loc: 'Bangalore', init: 'R', color: '#1565C0',
    text: 'The baby crib and stroller were in great condition. Exactly what we needed for 3 months. Highly recommend.' },
  { name: 'Anjali P.', loc: 'Hyderabad', init: 'A', color: '#2E7D32',
    text: 'Camping gear was clean and well-maintained. Setup was quick. Will definitely rent from PakkaRent again!' },
];

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

  useEffect(() => {
    (async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          productAPI.getAll({ featured: true, limit: 12, city }),
          categoryAPI.getAll({ city }),
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

  return (
    <div className="home">

      {/* ════════════════════════════════════════════════
          HERO — split layout: lifestyle image | category grid
      ════════════════════════════════════════════════ */}
      <section className="hero-split">
        <div className="container hero-split-inner">

          {/* LEFT — featured image panel */}
          <div className="hero-panel">
            <div className="hero-panel-img">
              <img
                src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=560&h=600&fit=crop&q=80"
                alt="Rent for events"
              />
              <div className="hero-panel-overlay">
                <p className="hero-panel-tag">✨ New arrivals</p>
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
              <span className="dash" />
            </h2>

            <div className="cat-tiles-grid">
              {visibleCats.map((cat, idx) => (
                <Link
                  key={cat.id}
                  to={`/products?category_id=${cat.id}`}
                  className="cat-tile"
                >
                  <div className="cat-tile-img">
                    <img
                      src={getCategoryImage(cat.name, idx)}
                      alt={cat.name}
                      loading="lazy"
                      onError={e => { e.target.src = FALLBACK_IMGS[idx % FALLBACK_IMGS.length]; }}
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
                  <img src={b.img} alt={b.headingAccent} loading="lazy" />
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
              <span className="dash" />
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
            <span className="dash" />
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
            <span className="dash" />
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
            <span className="dash" />
          </h2>
          <div className="reviews-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="review-card">
                <div className="review-stars">★★★★★</div>
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
