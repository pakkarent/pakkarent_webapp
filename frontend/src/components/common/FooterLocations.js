import React from 'react';
import { PAKKARENT_LOCATIONS } from '../../content/locations';

function MapPinIcon() {
  return (
    <svg className="loc-pin-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
      />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg className="loc-ext-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M10 2h4v4h-1.5V4.56L7.75 9.31 6.69 8.25 11.44 3.5H10V2zM4 4v8h8V9h1.5v3.5a.5.5 0 0 1-.5.5H3.5a.5.5 0 0 1-.5-.5V4.5a.5.5 0 0 1 .5-.5H7V4H4z"
      />
    </svg>
  );
}

export default function FooterLocations() {
  return (
    <section className="footer-locations" aria-labelledby="footer-locations-heading">
      <div className="footer-locations-head">
        <div>
          <p className="footer-locations-kicker">Store locator</p>
          <h3 id="footer-locations-heading">Find PakkaRent on Google Maps</h3>
          <p className="footer-locations-sub">
            Tap a branch for directions, reviews and hours — Chennai has two pickup points.
          </p>
        </div>
        <div className="footer-locations-legend" aria-hidden="true">
          <span className="legend-chip"><MapPinIcon /> Branch</span>
          <span className="legend-chip muted">Rental listing</span>
        </div>
      </div>

      <div className="footer-loc-grid">
        {PAKKARENT_LOCATIONS.map((loc) => (
          <article
            key={loc.id}
            className="footer-loc-card"
            style={{ '--loc-accent': loc.accent }}
          >
            <header className="footer-loc-card-head">
              <span className="footer-loc-city-badge">{loc.city.slice(0, 2).toUpperCase()}</span>
              <div>
                <h4>{loc.city}</h4>
                {loc.branches.length > 1 && (
                  <p className="footer-loc-branch-count">{loc.branches.length} locations</p>
                )}
              </div>
            </header>

            <ul className="footer-loc-branches">
              {loc.branches.map((branch) => (
                <li key={branch.name}>
                  <a
                    href={branch.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-loc-branch-link"
                  >
                    <span className="footer-loc-branch-pin" aria-hidden="true">
                      <MapPinIcon />
                    </span>
                    <span className="footer-loc-branch-text">
                      <strong>{branch.name}</strong>
                      <span>{branch.hint}</span>
                    </span>
                    <span className="footer-loc-branch-cta">
                      Directions <ExternalIcon />
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {loc.listings.length > 0 && (
              <div className="footer-loc-listings">
                <p className="footer-loc-listings-label">Also on Google</p>
                <div className="footer-loc-listing-chips">
                  {loc.listings.map((item) => (
                    <a
                      key={item.label}
                      href={item.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-loc-listing-chip"
                    >
                      {item.label}
                      <ExternalIcon />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
