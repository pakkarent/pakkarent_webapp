import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';
import useSEO from '../hooks/useSEO';
import './Auth.css';

export default function Register() {
  const [mode, setMode] = useState('email');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', city: 'Chennai' });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [normalizedPhone, setNormalizedPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle, sendPhoneOtp, verifyPhoneOtp } = useAuth();
  const { cities } = useCity();
  const navigate = useNavigate();

  useSEO({
    title: 'Create Account',
    description: 'Sign up for free on PakkaRent to rent appliances, furniture and event items in Chennai, Bangalore and Hyderabad with free delivery.',
    canonical: '/register',
    noindex: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message || 'Google sign-in failed.');
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please enter your name.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const normalized = await sendPhoneOtp(formData.phone);
      setNormalizedPhone(normalized);
      setOtpSent(true);
    } catch (err) {
      setError(err.message || 'Could not send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyPhoneOtp(normalizedPhone, otp, {
        name: formData.name,
        phone: formData.phone,
        city: formData.city,
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form">
          <div className="auth-header">
            <h1><span className="logo-pakka">Pakka</span><span className="logo-rent">Rent</span></h1>
            <p>Create your account</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button type="button" className="btn btn-oauth btn-full" onClick={handleGoogle} disabled={loading}>
            Sign up with Google
          </button>

          <div className="auth-divider"><span>or</span></div>

          <div className="auth-tabs">
            <button type="button" className={mode === 'email' ? 'active' : ''} onClick={() => setMode('email')}>Email</button>
            <button type="button" className={mode === 'phone' ? 'active' : ''} onClick={() => setMode('phone')}>Phone</button>
          </div>

          {mode === 'email' ? (
            <form onSubmit={handleEmailSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>City</label>
                <select name="city" value={formData.city} onChange={handleChange}>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          ) : !otpSent ? (
            <form onSubmit={handleSendOtp}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <div className="phone-input">
                  <span className="phone-prefix">+91</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                    placeholder="9876543210"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>City</label>
                <select name="city" value={formData.city} onChange={handleChange}>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading || formData.phone.length < 10}>
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div className="form-group">
                <label>Enter OTP sent to {normalizedPhone}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit code"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading || otp.length < 6}>
                {loading ? 'Verifying...' : 'Create Account'}
              </button>
            </form>
          )}

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Login here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
