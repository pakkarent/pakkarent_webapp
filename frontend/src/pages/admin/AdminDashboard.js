import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import './Admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminAPI.getStats();
        setStats(res.data.stats);
      } catch (err) {
        console.error('Error loading stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome to PakkaRent Admin Panel</p>
      </div>

      <div className="container">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{stats?.total_users || 0}</h3>
              <p>Total Users</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3>{stats?.total_products || 0}</h3>
              <p>Active Products</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{stats?.orders_by_status?.pending || 0}</h3>
              <p>Pending Orders</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>₹{stats?.total_revenue?.toFixed(0) || 0}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="orders-status">
          <h2>Orders by Status</h2>
          <div className="status-cards">
            {stats?.orders_by_status && Object.entries(stats.orders_by_status).map(([status, count]) => (
              <div key={status} className={`status-badge status-${status}`}>
                <span className="status-name">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                <span className="status-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-actions">
          <h2>Quick Actions</h2>
          <div className="action-grid">
            <Link to="/admin/products" className="action-card">
              <span className="action-icon">📦</span>
              <h3>Manage Products</h3>
              <p>Add, edit, or remove products</p>
            </Link>

            <Link to="/admin/orders" className="action-card">
              <span className="action-icon">📋</span>
              <h3>Manage Orders</h3>
              <p>View and update order status</p>
            </Link>

            <Link to="/admin/users" className="action-card">
              <span className="action-icon">👥</span>
              <h3>Manage Users</h3>
              <p>View user list and permissions</p>
            </Link>

            <Link to="/admin/products/new" className="action-card">
              <span className="action-icon">➕</span>
              <h3>Add New Product</h3>
              <p>Create a new rental product</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
