# Vegetable Price Prediction App

A full-stack AI-powered application for predicting vegetable prices using machine learning.

## Features

✅ **User Authentication**
- Login and Registration
- Secure JWT-based authentication

✅ **Real-time Weather Data**
- Live weather information integration
- Weather impact on price predictions

✅ **Price Predictions**
- Random Forest machine learning model
- Predictions based on location, vegetable type, month, season, and rainfall

✅ **Market Analytics**
- Price trend visualization (monthly trends)
- Seasonal availability charts
- Monthly availability with scarcity multiplication factors

✅ **Interactive Dashboards**
- Real-time weather display
- Multiple chart visualizations (Recharts)
- Responsive design

## Project Structure

```
new mini/
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js     # Login/Register page
│   │   │   ├── Home.js      # Dashboard with weather & charts
│   │   │   └── Prediction.js # Prediction engine page
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── WeatherCard.js
│   │   │   ├── PriceTrendChart.js
│   │   │   ├── SeasonalAvailabilityChart.js
│   │   │   └── MonthlyAvailabilityChart.js
│   │   ├── api/
│   │   │   └── client.js    # Axios API client
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── backend/                  # Flask Backend
    ├── app.py               # Flask application with routes
    ├── requirements.txt     # Python dependencies
    └── data/
        └── vegetable_prices.csv  # Training data
```

## Technology Stack

### Frontend
- **React 18.2** - UI library
- **React Router 6** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **CSS3** - Styling

### Backend
- **Flask 2.3** - Web framework
- **Flask-CORS** - CORS support
- **Flask-JWT-Extended** - Authentication
- **Scikit-learn** - Machine learning
- **Pandas** - Data processing
- **NumPy** - Numerical computation

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000`

## Dataset (CSV File)

The `vegetable_prices.csv` file should contain the following columns:

```
location,vegetable,date,month,season,rainfall,price
Delhi,Tomato,15,1,Winter,5,35
Delhi,Tomato,15,2,Winter,8,32
...
```

### Columns Description:
- **location**: City/region (e.g., Delhi, Mumbai, Bangalore)
- **vegetable**: Type of vegetable (e.g., Tomato, Onion, Potato)
- **date**: Day of month (1-31)
- **month**: Month number (1-12)
- **season**: Season (Winter, Spring, Summer, Monsoon)
- **rainfall**: Rainfall in mm
- **price**: Price in ₹/kg

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user

### Data
- `GET /api/data/locations` - Get available locations
- `GET /api/data/vegetables` - Get available vegetables

### Weather
- `GET /api/weather` - Get current weather data

### Predictions
- `POST /api/predict` - Get price prediction
  ```json
  {
    "location": "Delhi",
    "vegetable": "Tomato",
    "month": 1,
    "season": "Winter",
    "date": 15,
    "rainfall": 5
  }
  ```

### Analytics
- `GET /api/analytics/price-trend?vegetable=Tomato&location=Delhi` - Price trends
- `GET /api/analytics/seasonal-availability?vegetable=Tomato` - Seasonal data
- `GET /api/analytics/monthly-availability?vegetable=Tomato` - Monthly availability with scarcity factors

## Demo Credentials

- Email: `demo@example.com`
- Password: `demo123`

## Machine Learning Model

The app uses a **Random Forest Regressor** with the following configuration:
- Number of estimators: 100
- Max depth: 15
- Min samples split: 5
- Random state: 42

### Features Used:
1. Location (encoded)
2. Vegetable type (encoded)
3. Date (day of month)
4. Month (1-12)
5. Season (encoded)
6. Rainfall (mm)

## How to Use

1. **Login/Register** - Create an account or use demo credentials
2. **View Dashboard** - Check real-time weather and market trends
3. **Select Vegetables & Location** - Choose what to analyze
4. **Make Predictions** - Go to Predictions page and enter details
5. **View Analytics** - Analyze price trends, seasonal availability, and scarcity factors

## Deployment

### Frontend (Vercel, Netlify)
```bash
npm run build
```

### Backend (Heroku, Railway, Render)
```bash
pip install -r requirements.txt
python app.py
```

## Future Enhancements

- [ ] Real database integration (PostgreSQL/MongoDB)
- [ ] Advanced ML models (XGBoost, LSTM)
- [ ] Mobile app (React Native)
- [ ] Farmer-specific recommendations
- [ ] Market comparison tools
- [ ] Price alerts & notifications

## License

MIT License

## Support

For issues or questions, please create an issue in the repository.
