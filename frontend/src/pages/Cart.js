import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';
import { useToast } from '../context/ToastContext';
import { hasOffer, originalPriceForTenure, offerPriceForTenure } from '../utils/pricingDisplay';
import { resolveImageUrl, safeJsonArray } from '../utils/media';
import { cartUsesMonthlyPricing, rentalDaysInclusive } from '../utils/rentalModel';
import { inquiryAPI } from '../services/api';
import useSEO from '../hooks/useSEO';
import './Cart.css';

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    tenure,
    setTenure,
    rentStart,
    setRentStart,
    rentEnd,
    setRentEnd,
    getItemPrice,
  } = useCart();
  const { user } = useAuth();
  const { city: siteCity, cities } = useCity();
  const { showToast } = useToast();
  const monthlyCart = cartUsesMonthlyPricing(cart);
  const rentalDays = rentalDaysInclusive(rentStart, rentEnd);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: siteCity,
  });
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      city: prev.city || siteCity,
      name: prev.name || user?.name || '',
      phone: prev.phone || user?.phone || '',
      email: prev.email || user?.email || '',
    }));
  }, [user, siteCity]);

  useSEO({
    title: cart.length ? `Shopping Cart (${cart.length})` : 'Shopping Cart',
    description: 'Review the items in your PakkaRent cart and place your rental order.',
    canonical: '/cart',
    noindex: true,
  });

  if (cart.length === 0 && !showConfirm) {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const rentalSummary = monthlyCart
    ? `${tenure} month${tenure !== 1 ? 's' : ''}${rentStart ? `, from ${rentStart}` : ''}`
    : `${rentalDays} day${rentalDays !== 1 ? 's' : ''} (${rentStart} to ${rentEnd})`;

  const handlePlaceOrder = async () => {
    if (!monthlyCart && rentalDays < 1) {
      showToast('Please choose valid rental from and to dates.', { type: 'error' });
      return;
    }
    if (!formData.address.trim()) {
      showToast('Please enter your delivery address.', { type: 'error' });
      return;
    }
    if (!formData.city.trim()) {
      showToast('Please select your city.', { type: 'error' });
      return;
    }
    if (!formData.name.trim()) {
      showToast('Please enter your name.', { type: 'error' });
      return;
    }
    if (!formData.phone.trim()) {
      showToast('Please enter your phone number.', { type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const items = cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        lineTotal: (getItemPrice(item) * item.quantity).toFixed(2),
      }));

      await inquiryAPI.submit({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        rentalSummary,
        items,
      });

      setShowConfirm(true);
      clearCart();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to place order. Please try again.', { type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cart-page">
      {showConfirm && (
        <div className="cart-confirm-overlay" role="dialog" aria-modal="true" aria-labelledby="cart-confirm-title">
          <div className="cart-confirm-modal">
            <span className="cart-confirm-icon" aria-hidden="true">✓</span>
            <h2 id="cart-confirm-title">Order request received</h2>
            <p>
              This information has been shared with the team and they will contact you for order confirmation.
            </p>
            <Link to="/products" className="btn btn-primary btn-full" onClick={() => setShowConfirm(false)}>
              Continue Shopping
            </Link>
          </div>
        </div>
      )}

      <div className="container">
        <h1>Shopping Cart</h1>

        <div className="cart-grid">
          <div className="cart-items-section">
            <h2>Items in Cart ({cart.length})</h2>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    {(() => {
                      const images = safeJsonArray(item.images);
                      return (
                        <img
                          src={resolveImageUrl(images[0]) || 'https://via.placeholder.com/100x100?text=Item'}
                          alt={item.name}
                        />
                      );
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
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10) || 1)}
                      />
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <div className="item-total">₹{(getItemPrice(item) * item.quantity).toFixed(2)}</div>
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

              <div className="cart-delivery-form">
                <h4>Delivery details</h4>
                <p className="cart-guest-note">No login required — we will call you to confirm your order.</p>
                <label>
                  Name
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </label>
                <label>
                  Phone
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    required
                  />
                </label>
                <label>
                  Email <span className="label-optional">(optional)</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                  />
                </label>
                <label>
                  Address
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your delivery address"
                    rows="3"
                    required
                  />
                </label>
                <label>
                  City
                  <select name="city" value={formData.city} onChange={handleChange} required>
                    {cities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-full"
                onClick={handlePlaceOrder}
                disabled={submitting || (!monthlyCart && rentalDays < 1)}
              >
                {submitting ? 'Submitting...' : 'Place Order'}
              </button>

              <div className="cart-support">
                <h4>Customer support</h4>
                <p>
                  Questions about your order? Call{' '}
                  <a href="tel:+919403890901" className="cart-support-phone">
                    +91 94038 90901
                  </a>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
