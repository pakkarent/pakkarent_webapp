import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import './MyOrders.css';

const statusColors = {
  pending: '#FFC107',
  confirmed: '#2196F3',
  delivered: '#8BC34A',
  active: '#4CAF50',
  completed: '#4CAF50',
  cancelled: '#f44336'
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await orderAPI.getMyOrders();
        setOrders(res.data.orders);
      } catch (err) {
        console.error('Error loading orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="loading">Loading your orders...</div>;

  return (
    <div className="myorders-page">
      <div className="container">
        <h1>My Orders</h1>

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>No orders yet</p>
            <a href="/products" className="btn btn-primary">Start Shopping</a>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className="order-status" style={{ background: statusColors[order.status] }}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="order-items">
                  <h4>Items</h4>
                  {order.items && Array.isArray(order.items) && order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <span>{item.product_name || 'Product'} x {item.quantity}</span>
                      <span>₹{parseFloat(item.unit_price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-details">
                  <div className="detail-col">
                    <span className="detail-label">Rental Duration:</span>
                    <span className="detail-value">{order.tenure_months} Month{order.tenure_months > 1 ? 's' : ''}</span>
                  </div>
                  <div className="detail-col">
                    <span className="detail-label">Start Date:</span>
                    <span className="detail-value">{new Date(order.start_date).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-col">
                    <span className="detail-label">End Date:</span>
                    <span className="detail-value">{new Date(order.end_date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="order-footer">
                  <div className="order-amounts">
                    <div className="amount-row">
                      <span>Rental Amount:</span>
                      <span>₹{parseFloat(order.total_amount).toFixed(2)}</span>
                    </div>
                    <div className="amount-row">
                      <span>Security Deposit:</span>
                      <span>₹{parseFloat(order.security_deposit).toFixed(2)}</span>
                    </div>
                    <div className="amount-row total">
                      <span>Total:</span>
                      <span>₹{(parseFloat(order.total_amount) + parseFloat(order.security_deposit)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
