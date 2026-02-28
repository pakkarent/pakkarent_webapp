import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import './Checkout.css';

export default function Checkout() {
  const { cart, cartTotal, depositTotal, tenure, clearCart, getItemPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    pincode: '',
    startDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const orderData = {
        items: cart.map(item => ({ product_id: item.id, quantity: item.quantity })),
        delivery_address: formData,
        tenure_months: tenure,
        start_date: formData.startDate
      };
      const res = await orderAPI.create(orderData);
      clearCart();
      navigate(`/my-orders`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        <div className="checkout-grid">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Delivery Address</h2>
              {error && <div className="alert alert-error">{error}</div>}
              
              <div className="form-group">
                <label>Full Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Enter your delivery address" required rows="3"></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Your city" required />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" required />
                </div>
              </div>

              <div className="form-group">
                <label>Rental Start Date</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-section">
              <h2>Order Items</h2>
              <div className="items-list">
                {cart.map(item => (
                  <div key={item.id} className="order-item">
                    <span>{item.name} x {item.quantity}</span>
                    <span>₹{(getItemPrice(item) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>

          <aside className="order-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-section">
                <p className="summary-label">Rental Duration:</p>
                <p className="summary-value">{tenure} Month{tenure > 1 ? 's' : ''}</p>
              </div>

              <div className="summary-section">
                <p className="summary-label">Total Items:</p>
                <p className="summary-value">{cart.length} item{cart.length > 1 ? 's' : ''}</p>
              </div>

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
                <div className="summary-row">
                  <span>Delivery Charge:</span>
                  <span className="free">FREE</span>
                </div>
                <div className="summary-row total">
                  <span>Total Amount:</span>
                  <span>₹{(cartTotal + depositTotal).toFixed(2)}</span>
                </div>
              </div>

              <div className="payment-methods">
                <h4>Payment Methods</h4>
                <p>Credit/Debit Card, UPI, Net Banking</p>
              </div>

              <div className="policies">
                <h4>Policies</h4>
                <ul>
                  <li>Free delivery in selected areas</li>
                  <li>Free installation & setup</li>
                  <li>30-day return guarantee</li>
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
