import React, { useState, useEffect } from 'react';
import { dataAPI, weatherAPI } from '../api/client';
import './Home.css';
import WeatherCard from '../components/WeatherCard';

function Home() {
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState(['Mangalore', 'Mysore', 'Bangalore']);
  const [selectedLocation, setSelectedLocation] = useState('Mangalore');
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch available locations from backend if available
        try {
          const locResp = await dataAPI.getLocations();
          if (locResp.data && locResp.data.locations && locResp.data.locations.length > 0) {
            setLocations(locResp.data.locations);
            setSelectedLocation(locResp.data.locations[0]);
          }
        } catch (err) {
          // keep defaults
        }

        // Fetch weather for initial selection
        await fetchWeather(selectedLocation);
      } catch (err) {
        console.error('Error fetching initial data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWeather = async (loc) => {
    try {
      setLoadingWeather(true);
      const resp = await weatherAPI.getWeather(loc);
      if (resp.data) {
        setWeather({
          temperature: resp.data.temperature,
          humidity: resp.data.humidity,
          rainfall: resp.data.rainfall,
          wind_speed: resp.data.wind_speed,
          city: resp.data.city,
          condition: resp.data.condition,
        });
      } else {
        setWeather(null);
      }
    } catch (err) {
      console.error('Failed to fetch weather:', err);
      setWeather(null);
    } finally {
      setLoadingWeather(false);
    }
  };

  // No weather fetching here; Home shows news and static info. Location toggle updates label only.

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="container">
        <div className="home-header">
          <h1>Vegetable Market Dashboard</h1>
          <p>News and updates to support price prediction</p>
        </div>

        {/* Location buttons */}
        <div style={{ marginBottom: 12 }}>
          {locations.map((loc) => (
            <button
              key={loc}
              onClick={() => { setSelectedLocation(loc); fetchWeather(loc); }}
              className={`button ${loc === selectedLocation ? '' : 'button-secondary'}`}
              style={{ marginRight: 8 }}
            >
              {loc}
            </button>
          ))}
        </div>

        {/* Weather Section */}
        <WeatherCard
          location={selectedLocation}
          weather={weather}
          loading={loadingWeather}
        />

        {/* Info Section */}
        <div className="info-section">
          <div className="info-card">
            <div className="info-icon">📊</div>
            <h3>Price Predictions</h3>
            <p>Get accurate price predictions using machine learning for Tomato, Onion, and Potato</p>
          </div>
          <div className="info-card">
            <div className="info-icon">🌦️</div>
            <h3>Weather Integration</h3>
            <p>Real-time weather data affects price predictions</p>
          </div>
          <div className="info-card">
            <div className="info-icon">📈</div>
            <h3>Market Trends</h3>
            <p>Regional vegetable market trends with seasonal patterns</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
