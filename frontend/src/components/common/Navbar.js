import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useCity } from '../../context/CityContext';
import { productAPI } from '../../services/api';
import { resolveImageUrl, safeJsonArray } from '../../utils/media';
import './Navbar.css';

/* ── Search Autocomplete ───────────────────────────────────── */
function SearchBar({ city }) {
  const navigate = useNavigate();
  const [query, setQuery]         = useState('');
  const [results, setResults]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [open, setOpen]           = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  const debounceRef = useRef(null);
  const wrapRef     = useRef(null);

  /* ── Fetch suggestions (debounced 300 ms) ── */
  const fetchSuggestions = useCallback(async (q) => {
    if (q.trim().length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res = await productAPI.getAll({ search: q.trim(), limit: 8, city });
      setResults(res.data.products || []);
      setOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [city]);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setActiveIdx(-1);
    clearTimeout(debounceRef.current);
    if (val.trim().length < 2) { setResults([]); setOpen(false); return; }
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  /* ── Keyboard navigation ── */
  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActiveIdx(-1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0 && results[activeIdx]) {
        navigate(`/products/${results[activeIdx].id}`);
        closeDropdown();
      } else if (query.trim()) {
        navigate(`/products?search=${encodeURIComponent(query.trim())}`);
        closeDropdown();
      }
    }
  };

  const closeDropdown = () => {
    setOpen(false);
    setActiveIdx(-1);
    setQuery('');
    setResults([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      closeDropdown();
    }
  };

  const handleSelect = (product) => {
    navigate(`/products/${product.id}`);
    closeDropdown();
  };

  /* ── Close on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Helpers ── */
  const getImg = (product) => {
    const imgs = safeJsonArray(product.images);
    return resolveImageUrl(imgs[0]) || null;
  };

  return (
    <div className="search-wrap" ref={wrapRef}>
      <form className="navbar-search" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search for products to rent..."
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          autoComplete="off"
          aria-label="Search products"
          aria-autocomplete="list"
          aria-expanded={open}
        />
        <button type="submit" aria-label="Search">🔍</button>
      </form>

      {/* ── Dropdown ── */}
      {open && (
        <div className="ac-dropdown" role="listbox">
          {loading && (
            <div className="ac-loading">
              <span className="ac-spinner" />
              Searching…
            </div>
          )}

          {!loading && results.length === 0 && query.trim().length >= 2 && (
            <div className="ac-empty">
              <span>😕</span>
              No products found for "<strong>{query}</strong>"
            </div>
          )}

          {!loading && results.map((p, idx) => {
            const img = getImg(p);
            return (
              <button
                key={p.id}
                className={`ac-item${idx === activeIdx ? ' ac-item--active' : ''}`}
                role="option"
                aria-selected={idx === activeIdx}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseDown={(e) => { e.preventDefault(); handleSelect(p); }}
              >
                <div className="ac-thumb">
                  {img
                    ? <img src={img} alt={p.name} />
                    : <span className="ac-thumb-placeholder">📦</span>
                  }
                </div>
                <div className="ac-info">
                  <span className="ac-name">{highlightMatch(p.name, query)}</span>
                  <span className="ac-meta">{p.category_name} · {p.city === 'all' ? 'All Cities' : p.city}</span>
                </div>
                <div className="ac-price">
                  <span className="ac-price-amt">₹{p.monthly_price}</span>
                  <span className="ac-price-unit">/mo</span>
                </div>
              </button>
            );
          })}

          {!loading && query.trim().length >= 2 && results.length > 0 && (
            <button
              className="ac-see-all"
              onMouseDown={(e) => {
                e.preventDefault();
                navigate(`/products?search=${encodeURIComponent(query.trim())}`);
                closeDropdown();
              }}
            >
              🔍 See all results for "<strong>{query}</strong>"
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* Bold-highlight the matched portion of a name */
function highlightMatch(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

/* ── Navbar ────────────────────────────────────────────────── */
export default function Navbar() {
  const { user, logout }          = useAuth();
  const { cartCount }             = useCart();
  const { city, changeCity, cities } = useCity();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [cityOpen, setCityOpen]   = useState(false);
  const navigate                  = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="container navbar-top-inner">
          <Link to="/" className="navbar-logo">
            <span className="logo-pakka">Pakka</span><span className="logo-rent">Rent</span>
          </Link>

          {/* City selector */}
          <div className="city-selector" onClick={() => setCityOpen(!cityOpen)}>
            <span className="city-icon">📍</span>
            <span className="city-name">{city}</span>
            <span className="city-arrow">▼</span>
            {cityOpen && (
              <div className="city-dropdown">
                {cities.map(c => (
                  <button
                    key={c}
                    className={`city-option ${c === city ? 'active' : ''}`}
                    onClick={() => { changeCity(c); setCityOpen(false); }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search with autocomplete */}
          <SearchBar city={city} />

          {/* Nav actions */}
          <nav className="navbar-actions">
            {user ? (
              <>
                <Link to="/my-orders" className="nav-link">My Orders</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="nav-link admin-link">Admin</Link>
                )}
                <button onClick={handleLogout} className="nav-link">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login"    className="nav-link">Login</Link>
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

      {/* Category strip */}
      <div className="navbar-bottom">
        <div className="container">
          <nav className="navbar-categories">
            <Link to="/products?category_id=1" className="cat-link">⛺ Camping</Link>
            <Link to="/products?category_id=2" className="cat-link">🏠 Appliances</Link>
            <Link to="/products?category_id=3" className="cat-link">🎉 Events</Link>
            <Link to="/products?category_id=4" className="cat-link">🖼️ Backdrops</Link>
            <Link to="/products?category_id=5" className="cat-link">🎂 Birthday</Link>
            <Link to="/products?category_id=6" className="cat-link">👶 Baby Props</Link>
            <Link to="/products?category_id=7" className="cat-link">🧸 Kids Toys</Link>
            <Link to="/products?category_id=8" className="cat-link">🎯 Games</Link>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-city">
            <span>📍 City:</span>
            {cities.map(c => (
              <button
                key={c}
                className={`city-btn ${c === city ? 'active' : ''}`}
                onClick={() => changeCity(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <MobileSearch city={city} onClose={() => setMenuOpen(false)} />
          <Link to="/products?category_id=1" onClick={() => setMenuOpen(false)}>⛺ Camping Rental</Link>
          <Link to="/products?category_id=2" onClick={() => setMenuOpen(false)}>🏠 Home Appliances</Link>
          <Link to="/products?category_id=3" onClick={() => setMenuOpen(false)}>🎉 Event Rental</Link>
          <Link to="/products?category_id=4" onClick={() => setMenuOpen(false)}>🖼️ Backdrop Rental</Link>
          <Link to="/products?category_id=5" onClick={() => setMenuOpen(false)}>🎂 Birthday Rental</Link>
          <Link to="/products?category_id=6" onClick={() => setMenuOpen(false)}>👶 Baby Props</Link>
          <Link to="/products?category_id=7" onClick={() => setMenuOpen(false)}>🧸 Kids Toys</Link>
          <Link to="/products?category_id=8" onClick={() => setMenuOpen(false)}>🎯 Games Rental</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>🛒 Cart ({cartCount})</Link>
          {user ? (
            <>
              <Link to="/my-orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
              <Link to="/profile"   onClick={() => setMenuOpen(false)}>Profile</Link>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
              )}
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

/* ── Mobile search (inside hamburger menu) ── */
function MobileSearch({ city, onClose }) {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) { navigate(`/products?search=${encodeURIComponent(q.trim())}`); onClose(); }
  };
  return (
    <form className="mobile-search" onSubmit={submit}>
      <input
        type="text"
        placeholder="Search products..."
        value={q}
        onChange={e => setQ(e.target.value)}
      />
      <button type="submit">🔍</button>
    </form>
  );
}
