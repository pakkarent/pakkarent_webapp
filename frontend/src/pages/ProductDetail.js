import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
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
  if (!product) return <div className="error-msg">Product not found</div>;

  const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]');
  const specs = typeof product.specs === 'string' ? JSON.parse(product.specs) : product.specs;

  const getPrice = () => {
    if (selectedTenure === 3) return product.price_3month || product.monthly_price * 3;
    if (selectedTenure === 6) return product.price_6month || product.monthly_price * 6;
    if (selectedTenure === 12) return product.price_12month || product.monthly_price * 12;
    return product.monthly_price * selectedTenure;
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('/cart');
  };

  return (
    <div className="product-detail">
      <div className="container">
        <div className="detail-grid">
          <div className="detail-images">
            <div className="main-image">
              <img src={images[selectedImage] || 'https://via.placeholder.com/400x400?text=PakkaRent'} alt={product.name} />
              {product.is_featured && <span className="featured-badge">⭐ Featured</span>}
            </div>
            {images.length > 1 && (
              <div className="thumbnail-list">
                {images.map((img, idx) => (
                  <button key={idx} className={`thumbnail ${idx === selectedImage ? 'active' : ''}`}
                    onClick={() => setSelectedImage(idx)}>
                    <img src={img} alt={`${product.name} ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="detail-info">
            <span className="category-badge">{product.category_name}</span>
            <h1 className="product-name">{product.name}</h1>
            <p className="product-description">{product.description}</p>

            <div className="pricing-section">
              <div className="tenure-options">
                <h4>Select Rental Period</h4>
                <div className="tenure-buttons">
                  <button className={`tenure-btn ${selectedTenure === 1 ? 'active' : ''}`} onClick={() => setSelectedTenure(1)}>
                    <span className="tenure-num">1</span>
                    <span className="tenure-label">Month</span>
                    <span className="tenure-price">₹{product.monthly_price}</span>
                  </button>
                  {product.price_3month && (
                    <button className={`tenure-btn ${selectedTenure === 3 ? 'active' : ''}`} onClick={() => setSelectedTenure(3)}>
                      <span className="tenure-num">3</span>
                      <span className="tenure-label">Months</span>
                      <span className="tenure-price">₹{product.price_3month}</span>
                    </button>
                  )}
                  {product.price_6month && (
                    <button className={`tenure-btn ${selectedTenure === 6 ? 'active' : ''}`} onClick={() => setSelectedTenure(6)}>
                      <span className="tenure-num">6</span>
                      <span className="tenure-label">Months</span>
                      <span className="tenure-price">₹{product.price_6month}</span>
                    </button>
                  )}
                  {product.price_12month && (
                    <button className={`tenure-btn ${selectedTenure === 12 ? 'active' : ''}`} onClick={() => setSelectedTenure(12)}>
                      <span className="tenure-num">12</span>
                      <span className="tenure-label">Months</span>
                      <span className="tenure-price">₹{product.price_12month}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="price-info">
                <div className="price-row">
                  <span>Rental Price ({selectedTenure}M):</span>
                  <span className="price-value">₹{getPrice()}</span>
                </div>
                {product.security_deposit > 0 && (
                  <div className="price-row">
                    <span>Security Deposit:</span>
                    <span className="price-value">₹{product.security_deposit}</span>
                  </div>
                )}
                <div className="price-row total">
                  <span>Total:</span>
                  <span className="price-value">₹{getPrice() + product.security_deposit}</span>
                </div>
              </div>
            </div>

            <div className="quantity-section">
              <h4>Quantity</h4>
              <div className="quantity-control">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} />
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

        {Object.keys(specs).length > 0 && (
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
    </div>
  );
}
