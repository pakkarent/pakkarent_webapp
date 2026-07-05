import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import { getProductPath } from '../utils/productUrls';

/** Client redirect from /products/:id to /rent/:slug/:city */
export default function ProductIdRedirect() {
  const { id } = useParams();
  const [target, setTarget] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!/^\d+$/.test(id)) {
      setNotFound(true);
      return;
    }
    productAPI
      .getOne(id)
      .then((res) => setTarget(getProductPath(res.data.product)))
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) return <Navigate to="/products" replace />;
  if (target) return <Navigate to={target} replace />;
  return <div className="loading">Redirecting…</div>;
}
