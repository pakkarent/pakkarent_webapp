import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { hasOffer, originalPriceForTenure, offerPriceForTenure } from '../../utils/pricingDisplay';
import { resolveImageUrl, safeJsonArray } from '../../utils/media';
import './ProductCard.css';

const PLACEHOLDER_IMG = 'https://via.placeholder.com/300x200?text=PakkaRent';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const images = safeJsonArray(product.images);

  const [activeIdx, setActiveIdx] = useState(0);
  const [hovered, setHovered] = useState(false);

  const mainImg =
    resolveImageUrl(images[activeIdx]) ||
    PLACEHOLDER_IMG;

  const prev = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIdx(i => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIdx(i => (i + 1) % images.length);
  }, [images.length]);

  const goTo = useCallback((e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIdx(idx);
  }, []);

  const showOffer = hasOffer(product);
  const origMonthly = originalPriceForTenure(product, 1);
  const offerMonthly = offerPriceForTenure(product, 1);

  return (
    <div
      className="product-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setActiveIdx(0); }}
    >
      {/* ── Image area ── */}
      <Link to={`/products/${product.id}`} className="card-img-wrap">
        {product.is_featured && <span className="featured-tag">⭐ Featured</span>}
        {showOffer && (
          <span className="offer-tag" aria-label={`${product.offer_discount_percent}% off`}>
            {product.offer_discount_percent}% OFF
          </span>
        )}

        <img
          src={mainImg}
          alt={product.name}
          loading="lazy"
          className={hovered ? 'zoomed' : ''}
          onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }}
        />

        {/* Badge showing total image count */}
        {images.length > 1 && (
          <span className="img-count-badge">📷 {images.length}</span>
        )}

        {/* Arrow navigation – visible on hover */}
        {images.length > 1 && hovered && (
          <>
            <button className="img-arrow img-arrow-left" onClick={prev} aria-label="Previous">‹</button>
            <button className="img-arrow img-arrow-right" onClick={next} aria-label="Next">›</button>
          </>
        )}

        {/* Dot indicators – visible on hover */}
        {images.length > 1 && hovered && (
          <div className="img-dots" onClick={e => e.preventDefault()}>
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`img-dot ${idx === activeIdx ? 'active' : ''}`}
                onClick={(e) => goTo(e, idx)}
                aria-label={`Image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </Link>

      {/* ── Card body ── */}
      <div className="card-body">
        <span className="card-category">{product.category_name}</span>
        <Link to={`/products/${product.id}`}>
          <h3 className="card-title">{product.name}</h3>
        </Link>
        <div className="card-city">📍 {product.city === 'all' ? 'All Cities' : product.city}</div>

        <div className="card-pricing">
          <div>
            <div className="price-main">
              {showOffer && offerMonthly != null ? (
                <>
                  <span className="price-original">₹{origMonthly}</span>
                  <span className="price-amt">₹{offerMonthly}</span>
                </>
              ) : (
                <span className="price-amt">₹{product.monthly_price}</span>
              )}
              <span className="price-unit">/mo</span>
            </div>
            {product.security_deposit > 0 && (
              <div className="price-deposit">+ ₹{product.security_deposit} deposit</div>
            )}
          </div>
          <div className="price-monthly-label">Monthly<br />rent</div>
        </div>

        <div className="card-plans">
          {product.price_3month && <span className="plan-badge">3M</span>}
          {product.price_6month && <span className="plan-badge">6M</span>}
          {product.price_12month && <span className="plan-badge">12M</span>}
        </div>

        <button className="btn btn-primary card-btn" onClick={() => addToCart(product)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
