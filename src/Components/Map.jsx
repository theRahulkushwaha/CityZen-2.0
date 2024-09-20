import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from "leaflet";

import hospitalIconUrl from '../assets/hospital.png'; 
import policeIconUrl from '../assets/police.png'; 
import LocIconUrl from '../assets/loc.png';


const redIcon = new L.Icon({
  iconUrl: LocIconUrl, 
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const hospitalIcon = new L.Icon({
  iconUrl: hospitalIconUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const policeIcon = new L.Icon({
  iconUrl: policeIconUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapPage = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [places, setPlaces] = useState([]);
  const [locationError, setLocationError] = useState(false);

  // Fetch user's current position using Geolocation API
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition([latitude, longitude]);
      },
      (error) => {
        console.error("Error fetching the current position: ", error);
        setLocationError(true); // Set error to true in case of failure
      },
      { enableHighAccuracy: true }
    );
  }, []);

  // Fetch nearby hospitals and police stations using Overpass API
  useEffect(() => {
    if (currentPosition) {
      const overpassUrl = `
        https://overpass-api.de/api/interpreter?data=[out:json];
        (node["amenity"="hospital"](around:5000,${currentPosition[0]},${currentPosition[1]});
         node["amenity"="police"](around:5000,${currentPosition[0]},${currentPosition[1]}););
        out body;
      `;

      fetch(overpassUrl)
        .then((response) => response.json())
        .then((data) => {
          const fetchedPlaces = data.elements.map((place) => ({
            id: place.id,
            lat: place.lat,
            lon: place.lon,
            type: place.tags.amenity,
          }));
          setPlaces(fetchedPlaces);
        })
        .catch((error) =>
          console.error("Error fetching data from Overpass API:", error)
        );
    }
  }, [currentPosition]);

  // Dynamically set map height based on screen width for mobile responsiveness
  const mapStyle = {
    height: window.innerWidth < 768 ? "300px" : "400px",
    width: "100%",
  };

  return (
    <div>
      {locationError ? (
        <p>Unable to determine your location. Please check your location settings.</p>
      ) : currentPosition ? (
        <MapContainer center={currentPosition} zoom={13} style={mapStyle}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Marker for the user's current location with red icon */}
          <Marker position={currentPosition} icon={redIcon}>
            <Popup>Your current location</Popup>
          </Marker>
          {/* Markers for nearby hospitals and police stations */}
          {places.map((place) => (
            <Marker
              key={place.id}
              position={[place.lat, place.lon]}
              icon={place.type === "hospital" ? hospitalIcon : policeIcon}
            >
              <Popup>
                {place.type.charAt(0).toUpperCase() + place.type.slice(1)}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <p>Locating you...</p>
      )}
    </div>
  );
};

export default MapPage;
