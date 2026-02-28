import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useCity } from '../../context/CityContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { city, changeCity, cities } = useCity();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/products?search=${searchQuery.trim()}`);
  };

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="container navbar-top-inner">
          <Link to="/" className="navbar-logo">
            <span className="logo-pakka">Pakka</span><span className="logo-rent">Rent</span>
          </Link>

          <div className="city-selector" onClick={() => setCityOpen(!cityOpen)}>
            <span className="city-icon">📍</span>
            <span className="city-name">{city}</span>
            <span className="city-arrow">▼</span>
            {cityOpen && (
              <div className="city-dropdown">
                {cities.map(c => (
                  <button key={c} className={`city-option ${c === city ? 'active' : ''}`}
                    onClick={() => { changeCity(c); setCityOpen(false); }}>
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form className="navbar-search" onSubmit={handleSearch}>
            <input type="text" placeholder="Search for products..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)} />
            <button type="submit">🔍</button>
          </form>

          <nav className="navbar-actions">
            {user ? (
              <>
                <Link to="/my-orders" className="nav-link">My Orders</Link>
                {user.role === 'admin' && <Link to="/admin" className="nav-link admin-link">Admin</Link>}
                <button onClick={handleLogout} className="nav-link">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
              </>
            )}
            <Link to="/cart" className="cart-btn">
              🛒 <span className="cart-count">{cartCount}</span>
            </Link>
          </nav>

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      <div className="navbar-bottom">
        <div className="container">
          <nav className="navbar-categories">
            <Link to="/products?category_id=1" className="cat-link">🏠 Appliances</Link>
            <Link to="/products?category_id=2" className="cat-link">🎉 Event Rentals</Link>
            <Link to="/products?category_id=3" className="cat-link">👶 Kids & Baby</Link>
            <Link to="/products?category_id=4" className="cat-link">🛋️ Furniture</Link>
            <Link to="/products?featured=true" className="cat-link featured">⭐ Featured</Link>
          </nav>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-city">
            <span>📍 City:</span>
            {cities.map(c => (
              <button key={c} className={`city-btn ${c === city ? 'active' : ''}`}
                onClick={() => { changeCity(c); }}>
                {c}
              </button>
            ))}
          </div>
          <form className="mobile-search" onSubmit={handleSearch}>
            <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </form>
          <Link to="/products?category_id=1" onClick={() => setMenuOpen(false)}>🏠 Appliances</Link>
          <Link to="/products?category_id=2" onClick={() => setMenuOpen(false)}>🎉 Event Rentals</Link>
          <Link to="/products?category_id=3" onClick={() => setMenuOpen(false)}>👶 Kids & Baby</Link>
          <Link to="/products?category_id=4" onClick={() => setMenuOpen(false)}>🛋️ Furniture</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>🛒 Cart ({cartCount})</Link>
          {user ? (
            <>
              <Link to="/my-orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
              {user.role === 'admin' && <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
