import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HoneypotField from '../components/common/HoneypotField';
import useSEO from '../hooks/useSEO';
import './Auth.css';

export default function Login() {
  const [mode, setMode] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [normalizedPhone, setNormalizedPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, sendPhoneOtp, verifyPhoneOtp } = useAuth();
  const navigate = useNavigate();

  useSEO({
    title: 'Login',
    description: 'Sign in to your PakkaRent account to manage rentals, track orders and access exclusive offers.',
    canonical: '/login',
    noindex: true,
  });

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password, website);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
    setError('');
    setLoading(true);
    try {
      const normalized = await sendPhoneOtp(phone);
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
      await verifyPhoneOtp(normalizedPhone, otp);
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
            <p>Welcome back</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button type="button" className="btn btn-oauth btn-full" onClick={handleGoogle} disabled={loading}>
            Continue with Google
          </button>

          <div className="auth-divider"><span>or</span></div>

          <div className="auth-tabs">
            <button type="button" className={mode === 'email' ? 'active' : ''} onClick={() => setMode('email')}>Email</button>
            <button type="button" className={mode === 'phone' ? 'active' : ''} onClick={() => setMode('phone')}>Phone</button>
          </div>

          {mode === 'email' ? (
            <form onSubmit={handleEmailSubmit}>
              <HoneypotField value={website} onChange={(e) => setWebsite(e.target.value)} />
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login with Email'}
              </button>
            </form>
          ) : !otpSent ? (
            <form onSubmit={handleSendOtp}>
              <div className="form-group">
                <label>Mobile Number</label>
                <div className="phone-input">
                  <span className="phone-prefix">+91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading || phone.length < 10}>
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
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>
              <button type="button" className="btn btn-link btn-full" onClick={() => { setOtpSent(false); setOtp(''); }}>
                Change number
              </button>
            </form>
          )}

          <div className="auth-footer">
            <p>Don&apos;t have an account? <Link to="/register">Create one</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
