import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]');
  const img = images[0] || 'https://via.placeholder.com/300x200?text=PakkaRent';

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="card-img-wrap">
        {product.is_featured && <span className="featured-tag">⭐ Featured</span>}
        <img src={img} alt={product.name} loading="lazy" />
      </Link>
      <div className="card-body">
        <span className="card-category">{product.category_name}</span>
        <Link to={`/products/${product.id}`}><h3 className="card-title">{product.name}</h3></Link>
        <div className="card-city">📍 {product.city === 'all' ? 'All Cities' : product.city}</div>
        <div className="card-pricing">
          <div className="price-main">
            <span className="price-amt">₹{product.monthly_price}</span>
            <span className="price-unit">/month</span>
          </div>
          {product.security_deposit > 0 && (
            <div className="price-deposit">+ ₹{product.security_deposit} deposit</div>
          )}
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
