import React from 'react';
import { Link } from 'react-router-dom';
import { SITE_PAGES } from '../content/sitePages';
import useSEO from '../hooks/useSEO';
import './InfoPage.css';

const PAGE_PATHS = {
  about: '/about',
  'how-it-works': '/how-it-works',
  contact: '/contact',
  faq: '/faq',
  delivery: '/delivery-info',
  terms: '/terms',
  privacy: '/privacy',
};

export default function InfoPage({ pageKey }) {
  const page = SITE_PAGES[pageKey];
  if (!page) return null;

  useSEO({
    title: page.title,
    description: page.seoDescription,
    canonical: PAGE_PATHS[pageKey] || '/',
  });

  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="container">
          <h1>{page.title}</h1>
          {page.subtitle && <p className="info-subtitle">{page.subtitle}</p>}
        </div>
      </div>

      <div className="container info-body">
        {page.faqs ? (
          <div className="info-faq-list">
            {page.faqs.map((item, i) => (
              <details key={i} className="info-faq-item" open={i === 0}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        ) : (
          page.sections.map((section, i) => (
            <section key={i} className="info-section">
              <h2>{section.heading}</h2>
              {section.body && <p>{section.body}</p>}
              {section.list && (
                <ul>
                  {section.list.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              )}
              {section.links && (
                <div className="info-links">
                  {section.links.map((link, j) =>
                    link.external ? (
                      <a key={j} href={link.href} target="_blank" rel="noreferrer" className="info-link-btn">
                        {link.label}
                      </a>
                    ) : link.href.startsWith('/') ? (
                      <Link key={j} to={link.href} className="info-link-btn">
                        {link.label}
                      </Link>
                    ) : (
                      <a key={j} href={link.href} className="info-link-btn">
                        {link.label}
                      </a>
                    )
                  )}
                </div>
              )}
            </section>
          ))
        )}

        <div className="info-cta">
          <p>Ready to rent?</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
          <Link to="/contact" className="btn btn-outline info-cta-secondary">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
