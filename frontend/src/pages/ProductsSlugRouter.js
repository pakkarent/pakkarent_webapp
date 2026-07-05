import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { isCategorySlug } from '../utils/categorySlugs';
import { isCityUrlSegment } from '../utils/cityUrls';
import Products from './Products';
import LegacyProductRedirect from './LegacyProductRedirect';

/** Dispatch /products/:a/:b to category slug page or legacy HTML redirect. */
export default function ProductsSlugRouter() {
  const { a, b } = useParams();

  if (b && /\.html$/i.test(b)) {
    return <LegacyProductRedirect />;
  }

  if (isCategorySlug(a) && isCityUrlSegment(b)) {
    return <Products />;
  }

  return <Navigate to="/products" replace />;
}
