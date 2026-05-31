import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCity } from '../../context/CityContext';
import { CITY_OPTIONS } from '../../utils/cities';
import './CityPickerModal.css';

export default function CityPickerModal() {
  const location = useLocation();
  const { showCityPicker, changeCity, dismissCityPicker, ensureCityPickerIfNeeded } = useCity();

  useEffect(() => {
    ensureCityPickerIfNeeded();
  }, [location.pathname, ensureCityPickerIfNeeded]);

  useEffect(() => {
    if (!showCityPicker) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [showCityPicker]);

  if (!showCityPicker) return null;

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
                <img src={option.image} alt="" loading="eager" />
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
