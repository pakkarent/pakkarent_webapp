import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { useCity } from '../context/CityContext';
import './Profile.css';

export default function Profile() {
  const { user } = useAuth();
  const { cities } = useCity();
  const [formData, setFormData] = useState({ name: '', phone: '', city: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        city: user.city || 'Chennai',
        address: user.address ? JSON.stringify(user.address) : ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await userAPI.updateMe(formData);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <h1>My Profile</h1>

        <div className="profile-grid">
          <div className="profile-form">
            <h2>Personal Information</h2>
            
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={user?.email || ''} disabled />
                <small>Email cannot be changed</small>
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>City</label>
                <select name="city" value={formData.city} onChange={handleChange}>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Delivery Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Enter your delivery address" rows="3"></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          <aside className="profile-info">
            <div className="info-card">
              <h3>Account Information</h3>
              <div className="info-row">
                <span className="label">Member Since:</span>
                <span className="value">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</span>
              </div>
              <div className="info-row">
                <span className="label">Account Status:</span>
                <span className="value badge badge-green">Active</span>
              </div>
              <div className="info-row">
                <span className="label">Role:</span>
                <span className="value">{user?.role === 'admin' ? 'Admin' : 'Customer'}</span>
              </div>
            </div>

            <div className="info-card">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="/my-orders">View Orders</a></li>
                <li><a href="/products">Browse Products</a></li>
                <li><a href="#contact">Contact Support</a></li>
                {user?.role === 'admin' && <li><a href="/admin">Admin Panel</a></li>}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
