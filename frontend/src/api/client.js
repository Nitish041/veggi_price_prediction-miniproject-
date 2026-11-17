import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password) => api.post('/auth/register', { email, password }),
};

export const dataAPI = {
  getLocations: () => api.get('/data/locations'),
  getVegetables: () => api.get('/data/vegetables'),
  // avg-arrivals removed; market_arrivals is no longer used
};

export const weatherAPI = {
  // getWeather: if two args provided, treated as lat, lon; if one arg provided, treated as location name
  getWeather: (a, b) => {
    if (typeof b !== 'undefined') {
      return api.get('/weather', { params: { lat: a, lon: b } });
    }
    return api.get('/weather', { params: { location: a } });
  },
  getExpectedRainfall: (location, month) => api.get('/weather/expected', { params: { location, month } }),
};

export const datasetAPI = {
  getMonthlyRainfall: (location, month) => api.get('/data/monthly-rainfall', { params: { location, month } }),
};


export const predictionAPI = {
  predict: (data) => api.post('/predict', data),
};

export const analyticsAPI = {
  getPriceTrend: (vegetable, location) =>
    api.get('/analytics/price-trend', { params: { vegetable, location } }),
  getSeasonalAvailability: (vegetable, location) =>
    api.get('/analytics/seasonal-availability', { params: { vegetable, location } }),
  getMonthlyAvailability: (vegetable) =>
    api.get('/analytics/monthly-availability', { params: { vegetable } }),
};

export default api;
