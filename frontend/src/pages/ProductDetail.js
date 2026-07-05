import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useCity } from '../context/CityContext';
import {
  hasOffer,
  originalPriceForTenure,
  offerPriceForTenure,
  effectivePriceForTenure,
} from '../utils/pricingDisplay';
import { resolveImageUrl, resolveThumbnailUrl, safeJsonArray, imageErrorFallback } from '../utils/media';
import { formatCategoryLabel } from '../utils/categoryUtils';
import { getDisplaySpecs, uniqueProductImages } from '../utils/productSpecs';
import {
  isMonthlyRentalProduct,
  rentalDaysInclusive,
  todayYMD,
  addDaysYMD,
} from '../utils/rentalModel';
import useSEO from '../hooks/useSEO';
import JsonLd from '../components/common/JsonLd';
import Breadcrumb from '../components/common/Breadcrumb';
import { getProductPath, getProductUrl, getCategoryPath } from '../utils/productUrls';
import {
  citySpecificDescription,
  citySpecificMetaDescription,
  schemaPriceUnit,
} from '../utils/productSeo';
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

  useEffect(() => {
    setIdx(startIdx);
  }, [startIdx]);

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
  const { slug, city: citySegment } = useParams();
  const navigate = useNavigate();
  const { confirmCityForCatalog } = useCity();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedTenure, setSelectedTenure] = useState(1);
  const [detailRentStart, setDetailRentStart] = useState('');
  const [detailRentEnd, setDetailRentEnd] = useState('');
  const { addToCart, setTenure } = useCart();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getBySlug(slug, citySegment);
        setProduct(res.data.product);
        setSelectedImage(0);
        confirmCityForCatalog();
      } catch (err) {
        console.error('Error loading product:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug, citySegment, confirmCityForCatalog]);

  useEffect(() => {
    if (!product) return;
    if (isMonthlyRentalProduct(product)) return;
    const rs = todayYMD();
    setDetailRentStart(rs);
    setDetailRentEnd(addDaysYMD(rs, 1));
  }, [product?.id]);

  const safeImages = product ? uniqueProductImages(safeJsonArray(product.images)) : [];
  const seoImage = product
    ? (resolveImageUrl(safeImages[0]) || '/og-image.svg')
    : '/og-image.svg';

  const productPath = product ? getProductPath(product) : `/rent/${slug}/${citySegment}`;

  useSEO({
    title: product
      ? `${product.name} on Rent in ${product.city === 'all' ? 'India' : product.city}`
      : 'Product',
    description: product
      ? citySpecificMetaDescription(product)
      : 'Browse rental products on PakkaRent.',
    image: seoImage,
    canonical: productPath,
    type: 'product',
    noindex: !product,
  });

  const productLd = useMemo(() => {
    if (!product) return null;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const price = effectivePriceForTenure(product, 1) || product.monthly_price;
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: citySpecificDescription(product),
      sku: `PAKKA-${product.id}`,
      brand: { '@type': 'Brand', name: 'PakkaRent' },
      category: product.category_name || 'Rental',
      image: safeImages
        .map(img => resolveImageUrl(img))
        .filter(Boolean)
        .slice(0, 6),
      offers: {
        '@type': 'Offer',
        url: getProductUrl(product, origin),
        priceCurrency: 'INR',
        price: String(price),
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: String(price),
          priceCurrency: 'INR',
          unitText: schemaPriceUnit(product),
        },
        availability: (product.stock ?? 1) > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        areaServed: product.city === 'all'
          ? ['Chennai', 'Bangalore', 'Hyderabad']
          : product.city,
        seller: { '@type': 'Organization', name: 'PakkaRent' },
      },
    };
  }, [product, safeImages]);

  const breadcrumbLd = useMemo(() => {
    if (!product) return null;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Products', item: `${origin}/products` },
        { '@type': 'ListItem', position: 3, name: product.category_name || 'Category',
          item: `${origin}${getCategoryPath(product.category_id, product.city)}` },
        { '@type': 'ListItem', position: 4, name: product.name,
          item: getProductUrl(product, origin) },
      ],
    };
  }, [product]);

  if (loading) return <div className="loading">Loading product...</div>;
  if (!product)  return <div className="error-msg">Product not found</div>;

  const images = safeImages;
  const displaySpecs = getDisplaySpecs(product);
  const monthlyProduct = isMonthlyRentalProduct(product);

  const getPrice = () => {
    if (monthlyProduct) return effectivePriceForTenure(product, selectedTenure);
    return Number(product.monthly_price);
  };

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
    if (monthlyProduct) {
      setTenure(selectedTenure);
      addToCart(product, 1);
    } else {
      addToCart(product, 1, {
        rentStart: detailRentStart,
        rentEnd: detailRentEnd,
      });
    }
    navigate('/cart');
  };

  const prevImg = () => setSelectedImage(i => (i - 1 + images.length) % images.length);
  const nextImg = () => setSelectedImage(i => (i + 1) % images.length);

  return (
    <div className="product-detail">
      {productLd && <JsonLd data={productLd} id="ld-product" />}
      {breadcrumbLd && <JsonLd data={breadcrumbLd} id="ld-breadcrumb" />}
      <div className="container">
        <Breadcrumb items={[
          { label: 'Home', to: '/' },
          { label: 'Products', to: '/products' },
          ...(product.category_name ? [{
            label: product.category_name,
            to: getCategoryPath(product.category_id, product.city),
          }] : []),
          { label: product.name },
        ]} />
        <div className="detail-grid">

          {/* ── Gallery ── */}
          <div className="detail-images">
            {/* Main image — click to open lightbox */}
            <div
              className="main-image"
              onClick={() => images.length && setLightboxOpen(true)}
            >
              <img
                src={resolveThumbnailUrl(images[selectedImage], 'detail') || PLACEHOLDER_IMG}
                alt={product.name}
                onError={(e) => {
                  imageErrorFallback(e, images[selectedImage]);
                  if (!e.currentTarget.src.includes('object/public')) {
                    e.currentTarget.onerror = () => { e.currentTarget.src = PLACEHOLDER_IMG; };
                  }
                }}
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
                      src={resolveThumbnailUrl(img, 'gallery') || PLACEHOLDER_IMG}
                      alt={`${product.name} ${idx + 1}`}
                      onError={(e) => imageErrorFallback(e, img)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="detail-info">
            <div className="detail-badges">
              <span className="category-badge">{formatCategoryLabel(product)}</span>
              {hasOffer(product) && (
                <span className="detail-offer-pill">{product.offer_discount_percent}% off</span>
              )}
            </div>
            <h1 className="product-name">{product.name}</h1>
            <p className="product-description">{citySpecificDescription(product)}</p>

            <div className="pricing-section">
              {monthlyProduct ? (
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
              ) : (
                <div className="tenure-options rental-dates">
                  <h4>Rental dates</h4>
                  <div className="rental-date-row">
                    <label>
                      <span className="rental-date-label">From</span>
                      <input
                        type="date"
                        value={detailRentStart}
                        onChange={(e) => setDetailRentStart(e.target.value)}
                      />
                    </label>
                    <label>
                      <span className="rental-date-label">To</span>
                      <input
                        type="date"
                        value={detailRentEnd}
                        min={detailRentStart || undefined}
                        onChange={(e) => setDetailRentEnd(e.target.value)}
                      />
                    </label>
                  </div>
                </div>
              )}

              <div className="price-info">
                <div className="price-row">
                  <span>
                    {monthlyProduct ? `Rate (${selectedTenure} mo plan):` : 'Rate (per day):'}
                  </span>
                  <span className="price-value price-value-stack">
                    {monthlyProduct && hasOffer(product) && offerPriceForTenure(product, selectedTenure) != null && (
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

            <div className="action-buttons">
              <button
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={!monthlyProduct && rentalDaysInclusive(detailRentStart, detailRentEnd) < 1}
              >
                Add to Cart
              </button>
            </div>

            <div className="info-cards">
              <div className="info-card">
                <span className="info-icon">🚚</span>
                <span className="info-text">Delivery applicable for some products</span>
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
        {displaySpecs.length > 0 && (
          <div className="specs-section">
            <h2 className="section-title">Product Specifications</h2>
            <ul className="specs-list">
              {displaySpecs.map((row, idx) => (
                <li key={idx} className={row.label ? 'specs-list-row' : 'specs-list-bullet'}>
                  {row.label ? (
                    <>
                      <span className="spec-label">{row.label}</span>
                      <span className="spec-value">{row.value}</span>
                    </>
                  ) : (
                    <span className="spec-bullet">{row.value}</span>
                  )}
                </li>
              ))}
            </ul>
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
