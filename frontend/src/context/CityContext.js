import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  CITIES,
  hasConfirmedCity,
  markCityConfirmed,
  getStoredCity,
} from '../utils/cities';

const CityContext = createContext(null);

export const CityProvider = ({ children }) => {
  const [city, setCity] = useState(getStoredCity);
  const [showCityPicker, setShowCityPicker] = useState(() => !hasConfirmedCity());

  const changeCity = useCallback((newCity) => {
    setCity(newCity);
    markCityConfirmed(newCity);
    setShowCityPicker(false);
  }, []);

  const dismissCityPicker = useCallback(() => {
    markCityConfirmed(city);
    setShowCityPicker(false);
  }, [city]);

  /** Show picker on any route until the user has confirmed a city once. */
  const ensureCityPickerIfNeeded = useCallback(() => {
    if (!hasConfirmedCity()) {
      setShowCityPicker(true);
    }
  }, []);

  return (
    <CityContext.Provider value={{
      city,
      changeCity,
      cities: CITIES,
      showCityPicker,
      dismissCityPicker,
      ensureCityPickerIfNeeded,
    }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => useContext(CityContext);
