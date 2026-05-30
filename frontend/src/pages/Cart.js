import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { hasOffer, originalPriceForTenure, offerPriceForTenure } from '../utils/pricingDisplay';
import { resolveImageUrl, safeJsonArray } from '../utils/media';
import { cartUsesMonthlyPricing, rentalDaysInclusive } from '../utils/rentalModel';
import useSEO from '../hooks/useSEO';
import './Cart.css';

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    depositTotal,
    tenure,
    setTenure,
    rentStart,
    setRentStart,
    rentEnd,
    setRentEnd,
    getItemPrice,
  } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const monthlyCart = cartUsesMonthlyPricing(cart);
  const rentalDays = rentalDaysInclusive(rentStart, rentEnd);

  useSEO({
    title: cart.length ? `Shopping Cart (${cart.length})` : 'Shopping Cart',
    description: 'Review the items in your PakkaRent cart and proceed to a secure checkout.',
    canonical: '/cart',
    noindex: true,
  });

  if (cart.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <div className="container">
          <div className="empty-state">
            <span className="empty-icon">🛒</span>
            <h2>Your Cart is Empty</h2>
            <p>Start adding items to your cart to get started!</p>
            <Link to="/products" className="btn btn-primary btn-lg">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!monthlyCart && rentalDays < 1) {
      showToast('Please choose valid rental from and to dates.', { type: 'error' });
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>

        <div className="cart-grid">
          <div className="cart-items-section">
            <h2>Items in Cart ({cart.length})</h2>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    {(() => {
                      const images = safeJsonArray(item.images);
                      return <img src={resolveImageUrl(images[0]) || 'https://via.placeholder.com/100x100?text=Item'} alt={item.name} />;
                    })()}
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-category">{item.category_name}</p>
                    <div className="item-price">
                      {monthlyCart && hasOffer(item) && offerPriceForTenure(item, tenure) != null ? (
                        <>
                          <span className="cart-price-original">₹{originalPriceForTenure(item, tenure)}</span>
                          <span className="cart-price-offer">₹{getItemPrice(item)}</span>
                        </>
                      ) : (
                        <span>₹{getItemPrice(item)}</span>
                      )}
                      <span className="tenure-label">
                        {monthlyCart
                          ? `per ${tenure} mo`
                          : rentalDays > 0
                            ? `for ${rentalDays} day${rentalDays !== 1 ? 's' : ''}`
                            : 'set dates'}
                      </span>
                    </div>
                  </div>
                  <div className="item-controls">
                    <div className="quantity-control">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <input type="number" value={item.quantity} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)} />
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <div className="item-total">
                      ₹{(getItemPrice(item) * item.quantity).toFixed(2)}
                    </div>
                    <button className="btn-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-outline" onClick={clearCart}>Clear Cart</button>
          </div>

          <aside className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>

              {monthlyCart ? (
                <div className="tenure-selector">
                  <h4>Rental Duration</h4>
                  <div className="tenure-options">
                    <button className={`tenure-opt ${tenure === 1 ? 'active' : ''}`} onClick={() => setTenure(1)}>1 Month</button>
                    <button className={`tenure-opt ${tenure === 3 ? 'active' : ''}`} onClick={() => setTenure(3)}>3 Months</button>
                    <button className={`tenure-opt ${tenure === 6 ? 'active' : ''}`} onClick={() => setTenure(6)}>6 Months</button>
                    <button className={`tenure-opt ${tenure === 12 ? 'active' : ''}`} onClick={() => setTenure(12)}>12 Months</button>
                  </div>
                </div>
              ) : (
                <div className="tenure-selector rental-dates-summary">
                  <h4>Rental dates</h4>
                  <div className="cart-date-fields">
                    <label>
                      From
                      <input type="date" value={rentStart} onChange={(e) => setRentStart(e.target.value)} />
                    </label>
                    <label>
                      To
                      <input type="date" value={rentEnd} min={rentStart || undefined} onChange={(e) => setRentEnd(e.target.value)} />
                    </label>
                  </div>
                  {rentalDays > 0 && (
                    <p className="cart-rental-days">{rentalDays} day{rentalDays !== 1 ? 's' : ''} total</p>
                  )}
                </div>
              )}

              <div className="summary-rows">
                <div className="summary-row">
                  <span>Rental Amount:</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                {depositTotal > 0 && (
                  <div className="summary-row">
                    <span>Security Deposit:</span>
                    <span>₹{depositTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-row discount">
                  <span>Delivery Charges:</span>
                  <span>FREE</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>₹{(cartTotal + depositTotal).toFixed(2)}</span>
                </div>
              </div>

              <button className="btn btn-primary btn-full" onClick={handleCheckout}>
                {user ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>

              <div className="benefits">
                <h4>Included with your order:</h4>
                <ul>
                  <li>Free delivery & installation</li>
                  <li>Free maintenance & support</li>
                  <li>Flexible cancellation</li>
                  <li>24/7 customer support</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
