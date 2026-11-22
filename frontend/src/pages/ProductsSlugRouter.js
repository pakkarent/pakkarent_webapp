import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { isCategorySlug, subcategoryIdFromSlug } from '../utils/categorySlugs';
import { isCityUrlSegment } from '../utils/cityUrls';
import Products from './Products';
import LegacyProductRedirect from './LegacyProductRedirect';

/** Dispatch /products/:a/:b(/:c) to category slug page or legacy HTML redirect. */
export default function ProductsSlugRouter() {
  const { a, b, c } = useParams();

  if (b && /\.html$/i.test(b)) {
    return <LegacyProductRedirect />;
  }

  if (isCategorySlug(a) && isCityUrlSegment(b)) {
    // /products/{category}/{city}/{subcategory}: unknown subcategory → category page
    if (c && !subcategoryIdFromSlug(c)) {
      return <Navigate to={`/products/${a}/${b}`} replace />;
    }
    return <Products />;
  }

  return <Navigate to="/products" replace />;
}
