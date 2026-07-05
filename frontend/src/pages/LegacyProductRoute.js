import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import LegacyProductRedirect from './LegacyProductRedirect';

/** Only treat paths ending in .html as legacy product pages. */
export default function LegacyProductRoute() {
  const { filename } = useParams();
  if (!filename || !/\.html$/i.test(filename)) {
    return <Navigate to="/products" replace />;
  }
  return <LegacyProductRedirect />;
}
