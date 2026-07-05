import React from 'react';
import './PageLoader.css';

export default function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-live="polite" aria-label="Loading">
      <span className="page-loader-spinner" />
    </div>
  );
}
