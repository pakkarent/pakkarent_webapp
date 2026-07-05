import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CITIES,
  hasConfirmedCity,
  markCityConfirmed,
  getStoredCity,
} from '../utils/cities';

const CityContext = createContext(null);

export const CityProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [city, setCity] = useState(getStoredCity);
  const [showCityPicker, setShowCityPicker] = useState(() => !hasConfirmedCity());

  const changeCity = useCallback((newCity) => {
    if (newCity === city) {
      markCityConfirmed(newCity);
      setShowCityPicker(false);
      return;
    }
    setCity(newCity);
    markCityConfirmed(newCity);
    setShowCityPicker(false);
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo(0, 0);
    }
  }, [city, location.pathname, navigate]);

  const dismissCityPicker = useCallback(() => {
    markCityConfirmed(city);
    setShowCityPicker(false);
  }, [city]);

  /** Confirm stored city and close picker (e.g. deep-linked product URLs). */
  const confirmCityForCatalog = useCallback(() => {
    markCityConfirmed(city);
    setShowCityPicker(false);
  }, [city]);

  /** Show picker on any route until the user has confirmed a city once. */
  const ensureCityPickerIfNeeded = useCallback(() => {
    if (!hasConfirmedCity()) {
      setShowCityPicker(true);
    }
  }, []);

  /** Set city from a deep link without redirecting (city landing / category slug pages). */
  const syncCityFromRoute = useCallback((newCity) => {
    if (!newCity) return;
    setCity(newCity);
    markCityConfirmed(newCity);
    setShowCityPicker(false);
  }, []);

  return (
    <CityContext.Provider value={{
      city,
      changeCity,
      syncCityFromRoute,
      cities: CITIES,
      showCityPicker,
      dismissCityPicker,
      confirmCityForCatalog,
      ensureCityPickerIfNeeded,
    }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => useContext(CityContext);
