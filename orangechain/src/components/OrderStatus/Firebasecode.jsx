import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import 'leaflet/dist/leaflet.css'; // Leaflet's CSS for proper map styling
import L from 'leaflet'; // Import Leaflet for custom marker icon

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCI5nL-n-djoo1IzhjCdpX3PdAUmcW9xmo",
  authDomain: "iot-a3dd1.firebaseapp.com",
  databaseURL: "https://iot-a3dd1-default-rtdb.firebaseio.com",
  projectId: "iot-a3dd1",
  storageBucket: "iot-a3dd1.firebasestorage.app",
  messagingSenderId: "472525442916",
  appId: "1:472525442916:web:31a24ec674b90105513471"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const Firebasecode = () => {
  const [sensorData, setSensorData] = useState({});
  const mapRef = useRef(null); // Reference for the MapContainer
  
  // Leaflet custom marker icon
  const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],  // Size of the marker
    iconAnchor: [12, 41], // Anchor of the marker
    popupAnchor: [1, -34], // Popup position
    shadowSize: [41, 41]  // Size of the shadow
  });

  useEffect(() => {
    const sensorDataRef = ref(database, 'sensor_data'); // Path to sensor_data
  
    // Listen for changes in sensor data (both GPS and DHT)
    const sensorDataListener = onValue(sensorDataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Get the latest record from sensor_data
        const latestRecord = Object.values(data).slice(-1)[0];
        console.log("Latest Sensor Data:", latestRecord);  // Check the data here
        setSensorData(latestRecord || {});
      } else {
        setSensorData({});
      }
    });
  
    // Cleanup the listener when the component unmounts
    return () => {
      off(sensorDataRef, "value", sensorDataListener);
    };
  }, []);
  
  // Destructure the latest sensor data
  const { latitude, longitude, altitude, speed, temperature, humidity } = sensorData;

  // Set default values if data is missing
  const displayLatitude = latitude || 30.15;
  const displayLongitude = longitude || 71.45;

  // Component to handle map refocusing whenever sensor data changes
  const RefocusMap = ({ lat, lon }) => {
    const map = useMap();
    useEffect(() => {
      if (map) {
        map.panTo(new L.LatLng(lat, lon)); // Pan map to the new marker position
        map.setView(new L.LatLng(lat, lon), 10); // Set zoom level
      }
    }, [lat, lon, map]);

    return null; // This component does not render anything directly
  };

  return (
    <div className="Firebase">
      <h1>Order Status</h1>

      <div className="firbasecon">
        {/* Display GPS Data and DHT Sensor Data */}
        <div className="gpscontainer">
          <h2>Weather</h2>
          <p><strong>Temperature:</strong> {temperature ?? 'N/A'}°C</p>
          <p><strong>Humidity:</strong> {humidity ?? 'N/A'}%</p>
        </div>

        <div className="gpscontainer">
          <h2>Location</h2>
          <p><strong>Latitude:</strong> {latitude ?? 'N/A'}</p>
          <p><strong>Longitude:</strong> {longitude ?? 'N/A'}</p>
          <p><strong>Speed:</strong> {speed ?? 'N/A'} km/h</p>
          <p><strong>Altitude:</strong> {altitude ?? 'N/A'} meters</p>
        </div>
      </div>

      {/* Leaflet Map */}
      <div style={{ height: '400px', width: '100%' }}>
        <MapContainer
          center={[displayLatitude, displayLongitude]}
          zoom={10}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}  // Assign map reference
        >
          {/* Tile Layer for OpenStreetMap */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Only render Marker if valid GPS coordinates exist */}
          {latitude && longitude && (
            <Marker position={[displayLatitude, displayLongitude]} icon={markerIcon}>
              <Popup>
                <b>Latitude:</b> {displayLatitude} <br />
                <b>Longitude:</b> {displayLongitude}
              </Popup>
            </Marker>
          )}
          
          {/* Refocus the map when the position updates */}
          <RefocusMap lat={displayLatitude} lon={displayLongitude} />
        </MapContainer>
      </div>
    </div>
  );
};

export default Firebasecode;
