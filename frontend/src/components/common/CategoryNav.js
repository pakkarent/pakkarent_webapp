import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { categoryAPI } from '../../services/api';
import { useCity } from '../../context/CityContext';
import { getParentCategories, getSubcategories, getCategoryProductsPath } from '../../utils/categoryUtils';

function navShortLabel(cat) {
  const name = cat.name
    .replace(/\s+Rental$/i, '')
    .replace(/^Kids Toys on Rent$/i, 'Kids Toys')
    .replace(/^Home Appliances Rental$/i, 'Appliances');
  return `${cat.icon || ''} ${name}`.trim();
}

function CategoryDropdown({ category, subcategories, city }) {
  const wrapRef = useRef(null);
  const closeTimer = useRef(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [searchParams] = useSearchParams();
  const activeCat = searchParams.get('category_id');
  const activeSub = searchParams.get('subcategory_id');
  const isActive = activeCat === String(category.id);

  const syncCoords = () => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({ top: rect.bottom, left: rect.left });
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  const showMenu = () => {
    cancelClose();
    syncCoords();
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return undefined;
    const onReposition = () => syncCoords();
    window.addEventListener('scroll', onReposition, true);
    window.addEventListener('resize', onReposition);
    return () => {
      window.removeEventListener('scroll', onReposition, true);
      window.removeEventListener('resize', onReposition);
    };
  }, [open]);

  useEffect(() => () => cancelClose(), []);

  const submenu = open
    ? createPortal(
        <div
          className="cat-submenu cat-submenu-portal"
          role="menu"
          style={{ top: coords.top, left: coords.left }}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          {subcategories.map((sub) => (
            <Link
              key={sub.id}
              to={getCategoryProductsPath(sub, city)}
              className={`cat-submenu-link${activeSub === String(sub.id) ? ' active' : ''}`}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <span>{sub.icon}</span>
              <span>{sub.name}</span>
            </Link>
          ))}
        </div>,
        document.body
      )
    : null;

  return (
    <div
      ref={wrapRef}
      className="cat-dropdown-wrap"
      onMouseEnter={showMenu}
      onMouseLeave={scheduleClose}
    >
      <Link
        to={getCategoryProductsPath(category, city)}
        className={`cat-link cat-link-has-sub${isActive && !activeSub ? ' active' : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
        onFocus={showMenu}
        onBlur={scheduleClose}
      >
        {navShortLabel(category)}
        <span className="cat-chevron" aria-hidden="true">▾</span>
      </Link>
      {submenu}
    </div>
  );
}

export function DesktopCategoryNav() {
  const { city } = useCity();
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const activeCat = searchParams.get('category_id');

  useEffect(() => {
    categoryAPI
      .getAll()
      .then((res) => setCategories(res.data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  const parents = getParentCategories(categories);

  return (
    <nav className="navbar-categories" aria-label="Product categories">
      {parents.map((cat) => {
        const subs = getSubcategories(categories, cat.id);
        if (subs.length > 0) {
          return <CategoryDropdown key={cat.id} category={cat} subcategories={subs} city={city} />;
        }
        return (
          <Link
            key={cat.id}
            to={getCategoryProductsPath(cat, city)}
            className={`cat-link${activeCat === String(cat.id) ? ' active' : ''}`}
          >
            {navShortLabel(cat)}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileCategoryNav({ onNavigate }) {
  const { city } = useCity();
  const [categories, setCategories] = useState([]);
  const location = useLocation();

  useEffect(() => {
    categoryAPI
      .getAll()
      .then((res) => setCategories(res.data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  const parents = getParentCategories(categories);
  const params = new URLSearchParams(location.search);
  const activeCat = params.get('category_id');
  const activeSub = params.get('subcategory_id');

  return (
    <div className="mobile-cat-nav">
      {parents.map((cat) => {
        const subs = getSubcategories(categories, cat.id);
        return (
          <div key={cat.id} className="mobile-cat-group">
            <Link
              to={getCategoryProductsPath(cat, city)}
              className={`mobile-cat-link${activeCat === String(cat.id) && !activeSub ? ' active' : ''}`}
              onClick={onNavigate}
            >
              {navShortLabel(cat)}
            </Link>
            {subs.length > 0 && (
              <div className="mobile-sub-links">
                {subs.map((sub) => (
                  <Link
                    key={sub.id}
                    to={getCategoryProductsPath(sub, city)}
                    className={`mobile-sub-link${activeSub === String(sub.id) ? ' active' : ''}`}
                    onClick={onNavigate}
                  >
                    {sub.icon} {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
