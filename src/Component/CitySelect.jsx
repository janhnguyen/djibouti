import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useNavigate } from "react-router-dom";
import 'leaflet/dist/leaflet.css';
import '../styles/CitySelect.css'; 
import L from 'leaflet';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ onSelect }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onSelect({ lat, lng });
    },
  });

  return position ? <Marker position={position} /> : null;
};

const CitySelect = ({ onCitySelected }) => {
    const [selectedCity, setSelectedCity] = useState(null);
    const [sameCitySelected, setSameCitySelected] = useState(false);

    const navigate = useNavigate();


;


  return (
<div style={{ height: '400px', width: '600px' }}>
  <MapContainer
    center={[39.8283, -98.5795]}
    zoom={4}
    style={{ height: '100%', width: '100%' }}
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; OpenStreetMap contributors"
    />
    <LocationMarker onSelect={onCitySelected} />
  </MapContainer>
</div>


  );
};

export default CitySelect;
