import React from 'react';
import { Link } from 'react-router-dom';
import { trustedServiceLabel } from '../../utils/company';
import FooterLocations from './FooterLocations';
import './Footer.css';

export default function Footer() {
  const yearsLabel = trustedServiceLabel();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo"><span>Pakka</span><span style={{color:'var(--primary)'}}>Rent</span></div>
            <p className="footer-trust-badge">{yearsLabel}</p>
            <p>Chennai's most trusted rental platform for appliances, baby gear, and event items. Rent smarter, live better.</p>
            <div className="footer-social">
              <a href="https://wa.me/919361432697" target="_blank" rel="noreferrer" className="social-btn whatsapp">💬 WhatsApp</a>
              <a href="tel:+919403890901" className="social-btn phone">📞 +91 94038 90901</a>
            </div>
            <div className="footer-follow">
              <h4>Follow us</h4>
              <p className="footer-follow-text">
                Instagram: @pakkarent · Facebook: PakkaRent · Twitter: @pakka_rent
              </p>
              <div className="footer-follow-links">
                <a href="https://www.instagram.com/pakkarent/" target="_blank" rel="noreferrer" className="follow-btn instagram">Instagram</a>
                <a href="https://www.facebook.com/pakkarent/" target="_blank" rel="noreferrer" className="follow-btn facebook">Facebook</a>
                <a href="https://twitter.com/pakka_rent" target="_blank" rel="noreferrer" className="follow-btn twitter">Twitter</a>
              </div>
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
            <Link to="/about">About Us</Link>
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <Link to="/faq">FAQs</Link>
            <Link to="/delivery-info">Delivery Info</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>

        <FooterLocations />

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} PakkaRent. All rights reserved.</p>
          <p>Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
}
