import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { isCityUrlSegment } from '../utils/cityUrls';
import ProductDetail from './ProductDetail';
import NotFound from './NotFound';

const isCityOrIndia = (segment) =>
  isCityUrlSegment(segment) || String(segment || '').toLowerCase() === 'india';

/**
 * Canonical route: /rent/:city/:slug
 * Legacy /rent/:slug/:city is detected and redirected to the new path.
 */
export default function RentProductRoute() {
  const { city, slug } = useParams();

  if (isCityOrIndia(city) && slug) {
    return <ProductDetail citySegment={city} slug={slug} />;
  }

  if (isCityOrIndia(slug) && city) {
    return <Navigate to={`/rent/${slug}/${city}`} replace />;
  }

  return <NotFound />;
}
