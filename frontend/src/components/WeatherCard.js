import React from 'react';
import '../pages/Home.css';

function WeatherCard({ location, weather, loading }) {
  return (
    <div className="weather-card">
      <h2 className="weather-title">Weather in {location}</h2>

      {loading ? (
        <div className="loading-small">Loading weather...</div>
      ) : weather ? (
        <div className="weather-content">

          <div className="weather-row">
            <div className="weather-box highlight">
              <div className="icon">🌡️</div>
              <div className="info">
                <div className="label">Temperature</div>
                <div className="value">{weather.temperature} °C</div>
              </div>
            </div>

            <div className="weather-box">
              <div className="icon">💨</div>
              <div className="info">
                <div className="label">Wind</div>
                <div className="value">{weather.wind_speed} kph</div>
              </div>
            </div>
          </div>

          <div className="weather-row">
            <div className="weather-box">
              <div className="icon">💧</div>
              <div className="info">
                <div className="label">Humidity</div>
                <div className="value">{weather.humidity} %</div>
              </div>
            </div>

            <div className="weather-box">
              <div className="icon">🌦️</div>
              <div className="info">
                <div className="label">Condition</div>
                <div className="value">{weather.condition}</div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div>No weather data available</div>
      )}
    </div>
  );
}

export default WeatherCard;
