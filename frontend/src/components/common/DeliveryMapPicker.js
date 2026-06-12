import React, { useMemo } from 'react';
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';

const CITY_CENTERS = {
  Chennai: [13.0827, 80.2707],
  Bangalore: [12.9716, 77.5946],
  Hyderabad: [17.385, 78.4867],
};

function RecenterMap({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom(), { animate: true });
  return null;
}

function TapHandler({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });
  return null;
}

export default function DeliveryMapPicker({ city, value, onSelect }) {
  const center = useMemo(() => {
    if (value?.lat && value?.lng) return [value.lat, value.lng];
    return CITY_CENTERS[city] || CITY_CENTERS.Chennai;
  }, [city, value]);

  return (
    <div className="cart-map-picker" aria-label="Delivery location picker">
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="cart-leaflet-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap center={center} />
        <TapHandler onSelect={onSelect} />
        {value?.lat && value?.lng && (
          <CircleMarker center={[value.lat, value.lng]} radius={9} pathOptions={{ color: '#ff6b00', fillOpacity: 0.8 }} />
        )}
      </MapContainer>
    </div>
  );
}
