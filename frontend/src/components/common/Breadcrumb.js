import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumb.css';

/** Visible HTML breadcrumb trail (mirrors JSON-LD where used). */
export default function Breadcrumb({ items }) {
  if (!items?.length) return null;
  return (
    <nav className="breadcrumb-nav" aria-label="Breadcrumb">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={item.label + i} className="breadcrumb-segment">
            {i > 0 && <span className="breadcrumb-sep" aria-hidden="true">›</span>}
            {isLast || !item.to ? (
              <span className="breadcrumb-current" aria-current={isLast ? 'page' : undefined}>
                {item.label}
              </span>
            ) : (
              <Link to={item.to}>{item.label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
