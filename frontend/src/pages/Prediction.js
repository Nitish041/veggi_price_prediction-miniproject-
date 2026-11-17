import React, { useState } from 'react';
import { AlertCircle, TrendingUp } from 'lucide-react';
import {
  dataAPI,
  analyticsAPI,
  predictionAPI,
  weatherAPI,
  datasetAPI,
} from '../api/client';
import PriceTrendChart from '../components/PriceTrendChart';
import './Prediction.css';

function Prediction() {
  const [location, setLocation] = useState('Mangalore');
  const [locations, setLocations] = useState([]);
  const [vegetable, setVegetable] = useState('Tomato');
  const [month, setMonth] = useState(1);
  const [season, setSeason] = useState('Winter');
  const [date, setDate] = useState(15);
  const [rainfall, setRainfall] = useState(10);
  const [rainfallSource, setRainfallSource] = useState('unknown');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [vegetables, setVegetables] = useState([]);
  const [priceTrendData, setPriceTrendData] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  React.useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const vegResponse = await dataAPI.getVegetables();
        setVegetables(vegResponse.data.vegetables);
        const locResponse = await dataAPI.getLocations();
        setLocations(locResponse.data.locations);

        if (locResponse.data.locations.length > 0) {
          setLocation(locResponse.data.locations[0]);
        }

        if (vegResponse.data.vegetables.length > 0) {
          setVegetable(vegResponse.data.vegetables[0]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchInitialData();
  }, []);

  // When location/vegetable/month change, fetch expected rainfall from dataset (monthly average)
  React.useEffect(() => {
    const fetchDefaults = async () => {
      try {
        if (!location) return;
        // Prefer direct dataset monthly endpoint to ensure we use CSV averages
        const rainResp = await datasetAPI.getMonthlyRainfall(location, month);
        if (rainResp.data && typeof rainResp.data.rainfall !== 'undefined') {
          setRainfall(rainResp.data.rainfall);
          setRainfallSource('monthly');
        }
      } catch (err) {
        console.error('Error fetching defaults from dataset:', err);
        // Fallback to weather expected endpoint if dataset call fails
        try {
          const rainResp2 = await weatherAPI.getExpectedRainfall(location, month);
          if (rainResp2.data && typeof rainResp2.data.rainfall !== 'undefined') {
            setRainfall(rainResp2.data.rainfall);
            setRainfallSource('api');
          }
        } catch (err2) {
          console.error('Fallback weather API failed:', err2);
          setRainfallSource('error');
        }
      }
    };

    fetchDefaults();
  }, [location, month, vegetable]);

  const seasonMap = {
    1: 'Winter',
    2: 'Winter',
    3: 'Spring',
    4: 'Spring',
    5: 'Summer',
    6: 'Monsoon',
    7: 'Monsoon',
    8: 'Monsoon',
    9: 'Monsoon',
    10: 'Summer',
    11: 'Winter',
    12: 'Winter',
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    setMonth(newMonth);
    setSeason(seasonMap[newMonth]);
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setError('');
    setPrediction(null);
    setLoading(true);

    try {
      // Fetch chart data
      const trendResponse = await analyticsAPI.getPriceTrend(vegetable, location);
      setPriceTrendData(trendResponse.data);

      // Make prediction

      // Use dataset monthly average (already fetched) — do not refresh live weather here
      const reqBody = {
        location,
        vegetable,
        month,
        season,
        date,
        rainfall: rainfall, // rainfall is read-only, auto-filled from dataset monthly average; backend will infer market_arrivals
      };

      const predResponse = await predictionAPI.predict(reqBody);

      setPrediction(predResponse.data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to make prediction. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (monthNum) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return months[monthNum - 1];
  };

  if (loadingInitial) {
    return (
      <div className="prediction-container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="prediction-container">
      <div className="container">
        <div className="prediction-header">
          <h1>Price Prediction Engine</h1>
          <p>AI-powered vegetable price forecasting using Random Forest</p>
        </div>

        <div className="prediction-layout">
          {/* Prediction Form */}
          <div className="prediction-form-section">
            <div className="card">
              <h2>Make a Prediction</h2>
              <form onSubmit={handlePredict} className="form">
                <div className="input-group">
                  <label>Location</label>
                  <select value={location} onChange={(e) => setLocation(e.target.value)}>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label>Vegetable</label>
                  <select
                    value={vegetable}
                    onChange={(e) => setVegetable(e.target.value)}
                  >
                    {vegetables.map((veg) => (
                      <option key={veg} value={veg}>
                        {veg}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label>Month</label>
                  <select value={month} onChange={handleMonthChange}>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {getMonthName(i + 1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label>Season</label>
                  <input
                    type="text"
                    value={season}
                    disabled
                    style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                  />
                  <small style={{ color: '#666', marginTop: '5px' }}>
                    Auto-populated based on month
                  </small>
                </div>

                <div className="input-group">
                  <label>Date (Day of Month)</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={date}
                    onChange={(e) => setDate(parseInt(e.target.value))}
                  />
                </div>

                <div className="input-group">
                  <label>Expected Rainfall (mm)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={rainfall}
                    readOnly
                    disabled
                    style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                  />
                  <small style={{ color: '#666', marginTop: '5px' }}>
                    Auto-filled
                  </small>
                </div>

                {error && (
                  <div className="alert alert-error">
                    <AlertCircle size={20} />
                    {error}
                  </div>
                )}

                <button type="submit" className="button" disabled={loading}>
                  {loading ? 'Predicting...' : 'Predict Price'}
                </button>
              </form>
            </div>
          </div>

          {/* Results and Charts Section */}
          <div className="prediction-charts-section">
            {/* Prediction Result */}
            {prediction && (
              <div className="card prediction-result">
                <div className="result-header">
                  <TrendingUp size={32} color="#667eea" />
                  <h2>Prediction Result</h2>
                </div>

                <div className="result-grid">
                  <div className="result-item">
                    <span className="result-label">Vegetable</span>
                    <span className="result-value">{prediction.vegetable}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Location</span>
                    <span className="result-value">{prediction.location}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Month</span>
                    <span className="result-value">{getMonthName(prediction.month)}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Season</span>
                    <span className="result-value">{prediction.season}</span>
                  </div>
                </div>

                <div className="price-display">
                  <div className="price-label">Predicted Price</div>
                  <div className="price-value">₹{prediction.predicted_price}/kg</div>
                  <div className="price-unit">per kilogram</div>
                </div>

                <div className="result-info">
                  <p>
                    This prediction is based on historical data, weather patterns,
                    seasonal trends, and market factors using a Random Forest
                    machine learning model.
                  </p>
                </div>
              </div>
            )}

            {/* Price Trend Chart */}
            {priceTrendData && (
              <div className="card">
                <h2>Price Trend</h2>
                <p className="chart-subtitle">
                  Historical monthly average prices
                </p>
                <PriceTrendChart data={priceTrendData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Prediction;
