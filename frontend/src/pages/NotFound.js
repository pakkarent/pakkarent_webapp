import React from 'react';
import { Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';

/** Hard 404 page for unknown client routes (no homepage redirect — avoids soft 404s). */
export default function NotFound() {
  useSEO({
    title: 'Page not found',
    description: 'This page is not available on PakkaRent. Browse rentals in Chennai, Bangalore and Hyderabad.',
    noindex: true,
    canonical: '/',
  });

  return (
    <div className="container" style={{ maxWidth: 560, margin: '4rem auto', textAlign: 'center', padding: '0 1rem' }}>
      <h1>Page not found</h1>
      <p style={{ color: 'var(--gray, #666)', lineHeight: 1.6 }}>
        This URL is not available. It may have been moved or removed from the catalog.
      </p>
      <p style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary">Home</Link>
        <Link to="/products" className="btn btn-outline">All rentals</Link>
      </p>
    </div>
  );
}
