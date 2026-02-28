import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo"><span>Pakka</span><span style={{color:'var(--primary)'}}>Rent</span></div>
            <p>Chennai's most trusted rental platform for appliances, baby gear, and event items. Rent smarter, live better.</p>
            <div className="footer-social">
              <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="social-btn whatsapp">💬 WhatsApp</a>
              <a href="tel:+919999999999" className="social-btn phone">📞 Call Us</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Categories</h4>
            <Link to="/products?category_id=1">Appliances</Link>
            <Link to="/products?category_id=2">Event Rentals</Link>
            <Link to="/products?category_id=3">Kids & Baby</Link>
            <Link to="/products?category_id=4">Furniture</Link>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/">About Us</Link>
            <Link to="/">How It Works</Link>
            <Link to="/">Blog</Link>
            <Link to="/">Contact</Link>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <Link to="/">FAQs</Link>
            <Link to="/">Delivery Info</Link>
            <Link to="/">Terms of Service</Link>
            <Link to="/">Privacy Policy</Link>
          </div>

          <div className="footer-col">
            <h4>Cities</h4>
            <p>📍 Chennai</p>
            <p>📍 Bangalore</p>
            <p>📍 Hyderabad</p>
            <p className="more-cities">More cities coming soon!</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 PakkaRent. All rights reserved.</p>
          <p>Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
}
