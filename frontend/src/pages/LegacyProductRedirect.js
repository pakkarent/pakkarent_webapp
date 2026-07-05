import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { productAPI } from '../services/api';

/** Redirect old pakkarent.com HTML product paths to canonical /rent/:slug/:city URLs. */
export default function LegacyProductRedirect() {
  const location = useLocation();
  const [target, setTarget] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const path = location.pathname.replace(/^\//, '');
    productAPI
      .legacyRedirect(path)
      .then((res) => setTarget(res.data.url))
      .catch(() => setNotFound(true));
  }, [location.pathname]);

  if (notFound) return <Navigate to="/products" replace />;
  if (target) return <Navigate to={target} replace />;
  return <div className="loading">Redirecting…</div>;
}
