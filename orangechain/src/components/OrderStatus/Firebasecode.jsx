import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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
  const [gpsData, setGpsData] = useState({});
  const [dhtData, setDhtData] = useState({});

  // Leaflet custom marker icon
  const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],  // Size of the marker
    iconAnchor: [12, 41], // Anchor of the marker
    popupAnchor: [1, -34], // Popup position
    shadowSize: [41, 41]  // Size of the shadow
  });

  useEffect(() => {
    const gpsDataRef = ref(database, 'gps_data'); // Path to gps_data
    const sensorDataRef = ref(database, 'sensor_data'); // Path to sensor_data

    // Listen for changes in GPS data
    const gpsListener = onValue(gpsDataRef, (snapshot) => {
      const data = snapshot.val();
      console.log("GPS Data:", data);
      if (data) {
        // Get the first record from gps_data
        const firstGpsRecord = Object.values(data)[0];
        setGpsData(firstGpsRecord || {});
      } else {
        setGpsData({});
      }
    });

    // Listen for changes in DHT sensor data
    const sensorListener = onValue(sensorDataRef, (snapshot) => {
      const data = snapshot.val();
      console.log("DHT Data:", data);
      if (data) {
        const firstSensorRecord = Object.values(data)[0];
        setDhtData(firstSensorRecord || {});
      } else {
        setDhtData({});
      }
    });

    // Clean up the listeners when the component unmounts
    return () => {
      off(gpsDataRef, "value", gpsListener);
      off(sensorDataRef, "value", sensorListener);
    };
  }, []);

  // Set default latitude and longitude if gpsData is empty
  const latitude = gpsData.latitude || 30.15;  // Default coordinates
  const longitude = gpsData.longitude || 71.45;

  return (
    <div className="Firebase">
      <h1 className='orderStatus' >Order Status</h1>

   <div className="firbasecon">
       {/* Display GPS Data */}
       <div className='gpscontainer' >
        <h2 className='gps' >Weather </h2>
        <p><strong className='lat' >Temperature:</strong> {dhtData.temperature ?? 'N/A'}°C</p>
        <p><strong className='lat'>Humidity:</strong> {dhtData.humidity ?? 'N/A'}%</p>
      </div>
       <div className='gpscontainer' >
        <h2 className='gps' >Location</h2>
        <p><strong className='lat' >Latitude:</strong> {gpsData.latitude ?? 'N/A'}</p>
        <p><strong className='lat' >Longitude:</strong> {gpsData.longitude ?? 'N/A'}</p>
        <p><strong className='lat' >Speed:</strong> {gpsData.speed ?? 'N/A'} km/h</p>
        <p><strong className='lat' >Altitude:</strong> {gpsData.altitude ?? 'N/A'} meters</p>
      </div>

      {/* Display DHT Sensor Data */}
    
   </div>

      {/* Leaflet Map */}
      <div style={{ height: '400px', width: '100%' }}>
        <MapContainer
          center={[latitude, longitude]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          {/* Tile Layer for OpenStreetMap */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Only render Marker if valid GPS coordinates exist */}
          {latitude && longitude && (
            <Marker position={[latitude, longitude]} icon={markerIcon}>
              <Popup>
                <b>Latitude:</b> {latitude} <br />
                <b>Longitude:</b> {longitude}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default Firebasecode;
