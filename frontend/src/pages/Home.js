import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import { useCity } from '../context/CityContext';
import ProductCard from '../components/common/ProductCard';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { city } = useCity();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          productAPI.getAll({ featured: true, limit: 8 }),
          categoryAPI.getAll()
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
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Rent Smarter, Live Better</h1>
            <p className="hero-subtitle">Affordable rentals for appliances, baby gear & event items</p>
            <div className="hero-cta">
              <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
              <Link to="/products" className="btn btn-outline btn-lg">Browse All Items</Link>
            </div>
          </div>
          <div className="hero-features">
            <div className="feature">
              <span className="feature-icon">🚚</span>
              <h4>Free Delivery</h4>
              <p>Same day delivery available in select areas</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🔒</span>
              <h4>100% Safe</h4>
              <p>Verified products with security deposit</p>
            </div>
            <div className="feature">
              <span className="feature-icon">💰</span>
              <h4>Affordable</h4>
              <p>Save up to 70% compared to buying</p>
            </div>
            <div className="feature">
              <span className="feature-icon">📞</span>
              <h4>24/7 Support</h4>
              <p>Dedicated customer service team</p>
            </div>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Browse our wide range of rental items</p>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link key={cat.id} to={`/products?category_id=${cat.id}`} className="category-card">
                <span className="cat-icon">{cat.icon}</span>
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">Most popular items this month</p>
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <div className="products-grid">
              {featured.map(prod => <ProductCard key={prod.id} product={prod} />)}
            </div>
          )}
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">3 simple steps to get your rental</p>
          <div className="steps-grid">
            <div className="step">
              <div className="step-num">1</div>
              <h3>Browse & Select</h3>
              <p>Choose from thousands of verified rental items in your city</p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h3>Checkout Easily</h3>
              <p>Select your rental period and proceed to secure checkout</p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h3>Get Delivered</h3>
              <p>Your items arrive at your doorstep on the scheduled date</p>
            </div>
          </div>
        </div>
      </section>

      <section className="why-pakkarent">
        <div className="container">
          <h2 className="section-title">Why PakkaRent?</h2>
          <div className="reasons-grid">
            <div className="reason-card">
              <span className="reason-icon">🏆</span>
              <h4>Trusted by 50,000+ Customers</h4>
              <p>We're India's fastest-growing rental platform with excellent ratings</p>
            </div>
            <div className="reason-card">
              <span className="reason-icon">🌍</span>
              <h4>Available in 3 Major Cities</h4>
              <p>Chennai, Bangalore, and Hyderabad with plans to expand</p>
            </div>
            <div className="reason-card">
              <span className="reason-icon">✅</span>
              <h4>Verified & Sanitized</h4>
              <p>All items undergo quality checks and sanitization</p>
            </div>
            <div className="reason-card">
              <span className="reason-icon">📱</span>
              <h4>Easy Management</h4>
              <p>Track orders, manage deliveries and returns through our app</p>
            </div>
            <div className="reason-card">
              <span className="reason-icon">💳</span>
              <h4>Flexible Payments</h4>
              <p>Multiple payment options with EMI facility for long-term rentals</p>
            </div>
            <div className="reason-card">
              <span className="reason-icon">🎯</span>
              <h4>Best Prices Guaranteed</h4>
              <p>We offer the most competitive prices in the market</p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"Amazing service! Rented a washing machine and it was delivered the same day. Highly recommend!"</p>
              <p className="author">- Priya Singh, Chennai</p>
            </div>
            <div className="testimonial">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"Best place to rent baby items. Quality products and great customer support throughout."</p>
              <p className="author">- Rahul Verma, Bangalore</p>
            </div>
            <div className="testimonial">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"Rented party decorations for my wedding. Everything was perfect. Worth every rupee!"</p>
              <p className="author">- Anjali Patel, Hyderabad</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-final">
        <div className="container">
          <h2>Ready to Start Renting?</h2>
          <p>Join thousands of happy customers in {city}</p>
          <Link to="/products" className="btn btn-primary btn-lg">Browse Products Now</Link>
        </div>
      </section>
    </div>
  );
}
