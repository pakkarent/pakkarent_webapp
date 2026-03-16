import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import { useCity } from '../context/CityContext';
import ProductCard from '../components/common/ProductCard';
import './Home.css';

const TESTIMONIALS = [
  {
    name: 'Priya Singh',
    location: 'Chennai',
    initials: 'PS',
    color: '#E91E63',
    text: 'Amazing service! Rented a washing machine and it was delivered the same day. Highly recommend!',
  },
  {
    name: 'Rahul Verma',
    location: 'Bangalore',
    initials: 'RV',
    color: '#2196F3',
    text: 'Best place to rent baby items. Quality products and great customer support throughout.',
  },
  {
    name: 'Anjali Patel',
    location: 'Hyderabad',
    initials: 'AP',
    color: '#4CAF50',
    text: 'Rented party decorations for my wedding. Everything was perfect. Worth every rupee!',
  },
];

const REASONS = [
  { icon: '🏆', bg: '#E3F2FD', title: 'Trusted by 50,000+ Customers', desc: "India's fastest-growing rental platform with excellent ratings" },
  { icon: '🌍', bg: '#F3E5F5', title: 'Available in 3 Major Cities', desc: 'Chennai, Bangalore, and Hyderabad with plans to expand' },
  { icon: '✅', bg: '#E8F5E9', title: 'Verified & Sanitized', desc: 'All items undergo quality checks and sanitization before delivery' },
  { icon: '📱', bg: '#FFF8E1', title: 'Easy Management', desc: 'Track orders, manage deliveries and returns with ease' },
  { icon: '💳', bg: '#FBE9E7', title: 'Flexible Payments', desc: 'Multiple payment options with EMI facility for long-term rentals' },
  { icon: '🎯', bg: '#E0F7FA', title: 'Best Prices Guaranteed', desc: 'We offer the most competitive prices in the market' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { city } = useCity();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          productAPI.getAll({ featured: true, limit: 8, city }),
          categoryAPI.getAll({ city }),
        ]);
        setFeatured(prodRes.data.products);
        setCategories(catRes.data.categories);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [city]);

  return (
    <div className="home">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span>🇮🇳</span>
              <span>India's Trusted Rental Platform</span>
            </div>
            <h1 className="hero-title">
              Rent Smarter,<br />
              <span className="hero-highlight">Live Better</span>
            </h1>
            <p className="hero-subtitle">
              Affordable rentals for appliances, baby gear &amp; event items —
              delivered right to your doorstep.
            </p>
            <div className="hero-cta">
              <Link to="/products" className="btn btn-cta btn-lg">
                🛍️ Start Renting
              </Link>
              <Link to="/products" className="btn btn-hero-outline">
                Browse All Items
              </Link>
            </div>
            <div className="hero-trust">
              <span>⭐ 4.8/5 Rating</span>
              <span className="trust-divider">•</span>
              <span>🏆 50,000+ Customers</span>
              <span className="trust-divider">•</span>
              <span>🚚 Same Day Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────── */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">3</span>
              <span className="stat-label">Major Cities</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">1,200+</span>
              <span className="stat-label">Products Available</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">70%</span>
              <span className="stat-label">Savings vs Buying</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES STRIP ────────────────────────────────────── */}
      <section className="features-strip">
        <div className="container">
          <div className="features-grid">
            {[
              { icon: '🚚', title: 'Free Delivery', sub: 'Same day in select areas' },
              { icon: '🔒', title: '100% Safe', sub: 'Verified & sanitized items' },
              { icon: '💰', title: 'Save 70%', sub: 'vs buying new' },
              { icon: '📞', title: '24/7 Support', sub: 'Always here to help' },
            ].map((f, i) => (
              <div key={i} className="feature-chip">
                <span className="feature-chip-icon">{f.icon}</span>
                <div>
                  <strong>{f.title}</strong>
                  <span>{f.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────────── */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <span className="section-chip">Categories</span>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Browse our wide range of rental items</p>
          </div>
          <div className="categories-grid">
            {categories.map((cat, idx) => (
              <Link
                key={cat.id}
                to={`/products?category_id=${cat.id}`}
                className="category-card"
              >
                <div className={`cat-icon-wrap cat-color-${idx % 6}`}>
                  <span className="cat-icon">{cat.icon}</span>
                </div>
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>
                <span className="cat-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────────── */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <span className="section-chip">Trending</span>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Most popular items this month</p>
          </div>
          {loading ? (
            <div className="loading-skeleton">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {featured.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
          <div className="view-all-wrap">
            <Link to="/products" className="btn btn-outline-primary">
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-chip">Simple Process</span>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">3 simple steps to get your rental</p>
          </div>
          <div className="steps-grid">
            <div className="step">
              <div className="step-num">1</div>
              <span className="step-emoji">🔍</span>
              <h3>Browse &amp; Select</h3>
              <p>Choose from thousands of verified rental items in your city</p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <span className="step-emoji">🛒</span>
              <h3>Checkout Easily</h3>
              <p>Select your rental period and proceed to secure checkout</p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <span className="step-emoji">📦</span>
              <h3>Get Delivered</h3>
              <p>Your items arrive at your doorstep on the scheduled date</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY PAKKARENT ─────────────────────────────────────── */}
      <section className="why-pakkarent">
        <div className="container">
          <div className="section-header">
            <span className="section-chip">Why Us</span>
            <h2 className="section-title">Why PakkaRent?</h2>
            <p className="section-subtitle">What makes us different</p>
          </div>
          <div className="reasons-grid">
            {REASONS.map((r, i) => (
              <div key={i} className="reason-card">
                <div className="reason-icon-wrap" style={{ background: r.bg }}>
                  <span className="reason-icon">{r.icon}</span>
                </div>
                <h4>{r.title}</h4>
                <p>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <span className="section-chip">Reviews</span>
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Real stories from real customers</p>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial">
                <div className="testimonial-quote">"</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-footer">
                  <div
                    className="testimonial-avatar"
                    style={{ background: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div className="testimonial-info">
                    <strong>{t.name}</strong>
                    <span>{t.location}</span>
                  </div>
                  <div className="stars">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="cta-final">
        <div className="container">
          <div className="cta-content">
            <span className="cta-emoji">🎉</span>
            <h2>Ready to Start Renting?</h2>
            <p>Join thousands of happy customers in {city}</p>
            <Link to="/products" className="btn btn-cta btn-cta-large">
              Browse Products Now →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
