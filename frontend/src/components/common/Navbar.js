import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useCity } from '../../context/CityContext';
import { productAPI } from '../../services/api';
import { resolveThumbnailUrl, safeJsonArray } from '../../utils/media';
import { getProductPath } from '../../utils/productUrls';
import { DesktopCategoryNav, MobileCategoryNav } from './CategoryNav';
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
        navigate(getProductPath(results[activeIdx]));
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
    navigate(getProductPath(product));
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
    return resolveThumbnailUrl(imgs[0], 'search') || null;
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
  const cityRef                   = useRef(null);
  const navigate                  = useNavigate();

  const handleLogout = async () => { await logout(); navigate('/'); setMenuOpen(false); };

  useEffect(() => {
    if (!cityOpen) return undefined;
    const handler = (e) => {
      if (cityRef.current && !cityRef.current.contains(e.target)) {
        setCityOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [cityOpen]);

  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="container navbar-top-inner">
          <Link to="/" className="navbar-logo">
            <span className="logo-pakka">Pakka</span><span className="logo-rent">Rent</span>
          </Link>

          {/* City selector — visible on desktop AND mobile main view */}
          <div
            className="city-selector"
            onClick={() => setCityOpen(!cityOpen)}
            ref={cityRef}
            role="button"
            aria-haspopup="listbox"
            aria-expanded={cityOpen}
            aria-label={`Change city, current city ${city}`}
          >
            <span className="city-icon" aria-hidden="true">📍</span>
            <span className="city-name">{city}</span>
            <span className="city-arrow" aria-hidden="true">▼</span>
            {cityOpen && (
              <div className="city-dropdown" role="listbox">
                {cities.map(c => (
                  <button
                    key={c}
                    className={`city-option ${c === city ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); changeCity(c); setCityOpen(false); }}
                    role="option"
                    aria-selected={c === city}
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
          <DesktopCategoryNav />
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <MobileSearch city={city} onClose={() => setMenuOpen(false)} />
          <MobileCategoryNav onNavigate={() => setMenuOpen(false)} />
          <Link to="/cart" onClick={() => setMenuOpen(false)}>🛒 Cart ({cartCount})</Link>
          {user ? (
            <>
              <Link to="/my-orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
              <Link to="/profile"   onClick={() => setMenuOpen(false)}>Profile</Link>
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
