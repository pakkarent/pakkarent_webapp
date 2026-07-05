import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCity } from '../../context/CityContext';
import { CITY_OPTIONS } from '../../utils/cities';
import './CityPickerModal.css';

const PICKER_DELAY_MS = 2000;

const SKIP_CITY_PICKER =
  /^\/(cart|checkout|admin)(\/|$)|^\/rent\/|^\/products\/[^/]+\/[^/]+$/;

export default function CityPickerModal() {
  const location = useLocation();
  const { showCityPicker, changeCity, dismissCityPicker, ensureCityPickerIfNeeded } = useCity();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (SKIP_CITY_PICKER.test(location.pathname)) return;
    ensureCityPickerIfNeeded();
  }, [location.pathname, ensureCityPickerIfNeeded]);

  useEffect(() => {
    if (!showCityPicker) {
      setVisible(false);
      return undefined;
    }
    const timer = window.setTimeout(() => setVisible(true), PICKER_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [showCityPicker]);

  useEffect(() => {
    if (!visible) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [visible]);

  if (!showCityPicker || !visible) return null;

  return (
    <div className="city-picker-overlay" role="presentation">
      <div
        className="city-picker-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="city-picker-title"
      >
        <div className="city-picker-header">
          <span className="city-picker-logo">
            <span className="logo-pakka">Pakka</span>
            <span className="logo-rent">Rent</span>
          </span>
          <h2 id="city-picker-title">Where are you renting?</h2>
          <p>Choose your city to see products and delivery options near you.</p>
        </div>

        <div className="city-picker-grid">
          {CITY_OPTIONS.map((option) => (
            <button
              key={option.name}
              type="button"
              className="city-picker-card"
              onClick={() => changeCity(option.name)}
            >
              <span className="city-picker-image-wrap">
                <img
                  src={option.image}
                  alt=""
                  width="320"
                  height="200"
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span className="city-picker-name">{option.name}</span>
              <span className="city-picker-tagline">{option.tagline}</span>
            </button>
          ))}
        </div>

        <button type="button" className="city-picker-skip" onClick={dismissCityPicker}>
          Continue with default location
        </button>
      </div>
    </div>
  );
}
