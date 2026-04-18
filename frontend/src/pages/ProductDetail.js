import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import {
  hasOffer,
  originalPriceForTenure,
  offerPriceForTenure,
  effectivePriceForTenure,
} from '../utils/pricingDisplay';
import { resolveImageUrl, safeJsonArray, safeJsonObject } from '../utils/media';
import './ProductDetail.css';

const PLACEHOLDER_IMG = 'https://via.placeholder.com/400x400?text=PakkaRent';

// ── Lightbox overlay ──────────────────────────────────────────────────────────
function Lightbox({ images, startIdx, onClose }) {
  const [idx, setIdx] = useState(startIdx);
  const prev = useCallback(() => setIdx(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx(i => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape')     onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, onClose]);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={e => e.stopPropagation()}>
        <img
          src={resolveImageUrl(images[idx]) || PLACEHOLDER_IMG}
          alt={`Product image ${idx + 1}`}
          onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }}
        />
      </div>
      <button className="lightbox-close" onClick={onClose} aria-label="Close">✕</button>
      {images.length > 1 && (
        <>
          <button className="lightbox-arrow lightbox-arrow-left" onClick={prev} aria-label="Previous">‹</button>
          <button className="lightbox-arrow lightbox-arrow-right" onClick={next} aria-label="Next">›</button>
          <div className="lightbox-dots">
            {images.map((_, i) => (
              <button key={i} className={`lightbox-dot ${i === idx ? 'active' : ''}`}
                onClick={() => setIdx(i)} aria-label={`Image ${i + 1}`} />
            ))}
          </div>
          <div className="lightbox-counter">{idx + 1} / {images.length}</div>
        </>
      )}
    </div>
  );
}

// ── Product Detail page ───────────────────────────────────────────────────────
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedTenure, setSelectedTenure] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await productAPI.getOne(id);
        setProduct(res.data.product);
        setSelectedImage(0);
      } catch (err) {
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <div className="loading">Loading product...</div>;
  if (!product)  return <div className="error-msg">Product not found</div>;

  const images = safeJsonArray(product.images);
  const specs = safeJsonObject(product.specs);

  const getPrice = () => effectivePriceForTenure(product, selectedTenure);

  const tenurePriceDisplay = (months) => {
    const orig = originalPriceForTenure(product, months);
    const off = offerPriceForTenure(product, months);
    const show = hasOffer(product) && off != null;
    return (
      <span className="tenure-price-inner">
        {show && <span className="price-strike">₹{orig}</span>}
        <span className="tenure-price-amt">₹{show ? off : orig}</span>
      </span>
    );
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    navigate('/cart');
  };

  const prevImg = () => setSelectedImage(i => (i - 1 + images.length) % images.length);
  const nextImg = () => setSelectedImage(i => (i + 1) % images.length);

  return (
    <div className="product-detail">
      <div className="container">
        <div className="detail-grid">

          {/* ── Gallery ── */}
          <div className="detail-images">
            {/* Main image — click to open lightbox */}
            <div
              className="main-image"
              onClick={() => images.length && setLightboxOpen(true)}
            >
              <img
                src={resolveImageUrl(images[selectedImage]) || PLACEHOLDER_IMG}
                alt={product.name}
                onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }}
              />
              {product.is_featured && <span className="featured-badge">⭐ Featured</span>}

              {images.length > 1 && (
                <>
                  <button className="gallery-arrow gallery-arrow-left"
                    onClick={e => { e.stopPropagation(); prevImg(); }} aria-label="Previous">‹</button>
                  <button className="gallery-arrow gallery-arrow-right"
                    onClick={e => { e.stopPropagation(); nextImg(); }} aria-label="Next">›</button>
                  <span className="gallery-counter">{selectedImage + 1} / {images.length}</span>
                </>
              )}
            </div>

            {/* Scrollable thumbnail strip */}
            {images.length > 1 && (
              <div className="thumbnail-strip">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`thumbnail ${idx === selectedImage ? 'active' : ''}`}
                    onClick={() => setSelectedImage(idx)}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img
                      src={resolveImageUrl(img) || PLACEHOLDER_IMG}
                      alt={`${product.name} ${idx + 1}`}
                      onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="detail-info">
            <div className="detail-badges">
              <span className="category-badge">{product.category_name}</span>
              {hasOffer(product) && (
                <span className="detail-offer-pill">{product.offer_discount_percent}% off</span>
              )}
            </div>
            <h1 className="product-name">{product.name}</h1>
            <p className="product-description">{product.description}</p>

            <div className="pricing-section">
              <div className="tenure-options">
                <h4>Select Rental Period</h4>
                <div className="tenure-buttons">
                  <button className={`tenure-btn ${selectedTenure === 1 ? 'active' : ''}`} onClick={() => setSelectedTenure(1)}>
                    <span className="tenure-num">1</span>
                    <span className="tenure-label">Month</span>
                    <span className="tenure-price">{tenurePriceDisplay(1)}</span>
                  </button>
                  {product.price_3month && (
                    <button className={`tenure-btn ${selectedTenure === 3 ? 'active' : ''}`} onClick={() => setSelectedTenure(3)}>
                      <span className="tenure-num">3</span>
                      <span className="tenure-label">Months</span>
                      <span className="tenure-price">{tenurePriceDisplay(3)}</span>
                    </button>
                  )}
                  {product.price_6month && (
                    <button className={`tenure-btn ${selectedTenure === 6 ? 'active' : ''}`} onClick={() => setSelectedTenure(6)}>
                      <span className="tenure-num">6</span>
                      <span className="tenure-label">Months</span>
                      <span className="tenure-price">{tenurePriceDisplay(6)}</span>
                    </button>
                  )}
                  {product.price_12month && (
                    <button className={`tenure-btn ${selectedTenure === 12 ? 'active' : ''}`} onClick={() => setSelectedTenure(12)}>
                      <span className="tenure-num">12</span>
                      <span className="tenure-label">Months</span>
                      <span className="tenure-price">{tenurePriceDisplay(12)}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="price-info">
                <div className="price-row">
                  <span>Rental Price ({selectedTenure}M):</span>
                  <span className="price-value price-value-stack">
                    {hasOffer(product) && offerPriceForTenure(product, selectedTenure) != null && (
                      <span className="price-strike">₹{originalPriceForTenure(product, selectedTenure)}</span>
                    )}
                    <span>₹{getPrice()}</span>
                  </span>
                </div>
                {product.security_deposit > 0 && (
                  <div className="price-row">
                    <span>Security Deposit:</span>
                    <span className="price-value">₹{product.security_deposit}</span>
                  </div>
                )}
                <div className="price-row total">
                  <span>Total:</span>
                  <span className="price-value">₹{(Number(getPrice()) + Number(product.security_deposit || 0)).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="quantity-section">
              <h4>Quantity</h4>
              <div className="quantity-control">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <input type="number" value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <p className="stock-info">Stock available: {product.stock}</p>
            </div>

            <div className="action-buttons">
              <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>

            <div className="info-cards">
              <div className="info-card">
                <span className="info-icon">🚚</span>
                <span className="info-text">Free Delivery</span>
              </div>
              <div className="info-card">
                <span className="info-icon">🔒</span>
                <span className="info-text">Secure Deposit</span>
              </div>
              <div className="info-card">
                <span className="info-icon">📞</span>
                <span className="info-text">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specs */}
        {specs && Object.keys(specs).length > 0 && (
          <div className="specs-section">
            <h2 className="section-title">Product Specifications</h2>
            <table className="specs-table">
              <tbody>
                {Object.entries(specs).map(([key, val]) => (
                  <tr key={key}>
                    <td className="spec-key">{key}</td>
                    <td className="spec-val">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Fullscreen lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          startIdx={selectedImage}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
