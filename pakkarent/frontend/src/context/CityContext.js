import React, { createContext, useContext, useState } from 'react';

const CityContext = createContext(null);
const CITIES = ['Chennai', 'Bangalore', 'Hyderabad'];

export const CityProvider = ({ children }) => {
  const [city, setCity] = useState(() => localStorage.getItem('pakkarent_city') || 'Chennai');

  const changeCity = (newCity) => {
    setCity(newCity);
    localStorage.setItem('pakkarent_city', newCity);
  };

  return (
    <CityContext.Provider value={{ city, changeCity, cities: CITIES }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => useContext(CityContext);
