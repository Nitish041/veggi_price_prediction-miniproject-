from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib
import os
from datetime import datetime
import requests
from pathlib import Path
import csv

app = Flask(__name__)
jwt_secret_key = os.environ.get('JWT_SECRET_KEY')
if not jwt_secret_key:
    raise RuntimeError('JWT_SECRET_KEY must be set before starting the application')
app.config['JWT_SECRET_KEY'] = jwt_secret_key
jwt = JWTManager(app)
CORS(app)

BACKEND_DIR = Path(__file__).resolve().parent
DATASET_PATH = BACKEND_DIR / 'data' / 'vegetable_prices.csv'
MODEL_DIR = BACKEND_DIR / 'models'
PRICE_COLUMNS = ['location', 'vegetable', 'date', 'month', 'season', 'rainfall', 'price']

model = None
location_encoder = None
vegetable_encoder = None
season_encoder = None


users = {}
demo_user_email = os.environ.get('DEMO_USER_EMAIL')
demo_user_password = os.environ.get('DEMO_USER_PASSWORD')
if demo_user_email and demo_user_password:
    users[demo_user_email] = demo_user_password


def read_price_data():
    """Read prices and tolerate legacy rows with an unused arrivals value."""
    rows = []
    with DATASET_PATH.open(newline='', encoding='utf-8-sig') as dataset_file:
        reader = csv.reader(dataset_file)
        headers = next(reader, [])
        has_market_arrivals = 'market_arrivals' in headers
        for line_number, row in enumerate(reader, start=2):
            if has_market_arrivals:
                if len(row) != len(headers):
                    raise ValueError(f'Invalid price data row at line {line_number}')
                record = dict(zip(headers, row))
                rows.append([record[column] for column in PRICE_COLUMNS])
            elif len(row) == len(PRICE_COLUMNS):
                rows.append(row)
            elif len(row) == len(PRICE_COLUMNS) + 1:
                # Some existing rows include market_arrivals before the price.
                rows.append(row[:len(PRICE_COLUMNS) - 1] + [row[-1]])
            else:
                raise ValueError(f'Invalid price data row at line {line_number}')
    return pd.DataFrame(rows, columns=PRICE_COLUMNS)


def load_model():
    """Load or train the model"""
    global model, location_encoder, vegetable_encoder, season_encoder
    
    csv_path = DATASET_PATH
    
    if not os.path.exists(csv_path):
        print("CSV file not found. Please create data/vegetable_prices.csv")
        return False
    
    try:
        df = read_price_data()
        
     
        location_encoder = LabelEncoder()
        vegetable_encoder = LabelEncoder()
        season_encoder = LabelEncoder()
        
        df['location_encoded'] = location_encoder.fit_transform(df['location'])
        df['vegetable_encoded'] = vegetable_encoder.fit_transform(df['vegetable'])
        df['season_encoded'] = season_encoder.fit_transform(df['season'])
        
      
        X = df[['location_encoded', 'vegetable_encoded', 'date', 'month', 'season_encoded', 'rainfall']]
        y = df['price']
        
     
        model = RandomForestRegressor(
            n_estimators=100,
            random_state=42,
            max_depth=15,
            min_samples_split=5
        )
        model.fit(X, y)
        
   
        os.makedirs(MODEL_DIR, exist_ok=True)
        joblib.dump(location_encoder, MODEL_DIR / 'location_encoder.pkl')
        joblib.dump(vegetable_encoder, MODEL_DIR / 'vegetable_encoder.pkl')
        joblib.dump(season_encoder, MODEL_DIR / 'season_encoder.pkl')
        joblib.dump(model, MODEL_DIR / 'model.pkl')
        
        print("Model trained and saved successfully!")
        return True
    except Exception as e:
        print(f"Error loading model: {e}")
        return False

def load_saved_model():
    """Load previously trained model"""
    global model, location_encoder, vegetable_encoder, season_encoder
    
    try:
        model = joblib.load(MODEL_DIR / 'model.pkl')
        location_encoder = joblib.load(MODEL_DIR / 'location_encoder.pkl')
        vegetable_encoder = joblib.load(MODEL_DIR / 'vegetable_encoder.pkl')
        season_encoder = joblib.load(MODEL_DIR / 'season_encoder.pkl')
       
        try:
            expected_features = 6  
            if hasattr(model, 'n_features_in_') and model.n_features_in_ != expected_features:
                print(f"Loaded model expects {model.n_features_in_} features but expected {expected_features}. Retraining.")
                return False
        except Exception:
            pass
        
        csv_path = DATASET_PATH
        try:
            if os.path.exists(csv_path):
                df = read_price_data()
           
                missing_loc = set(df['location'].unique()) - set(location_encoder.classes_)
                missing_veg = set(df['vegetable'].unique()) - set(vegetable_encoder.classes_)
                missing_sea = set(df['season'].unique()) - set(season_encoder.classes_)

                if missing_loc or missing_veg or missing_sea:
                    print(f"Saved encoders missing labels, retraining model. Missing - loc:{missing_loc}, veg:{missing_veg}, sea:{missing_sea}")
                    return False
        except Exception:
            
            pass

        print("Model loaded from saved files!")
        return True
    except:
        return False

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Email and password required'}), 400
    
    if email in users:
        return jsonify({'message': 'User already exists'}), 400
    
    users[email] = password
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Email and password required'}), 400
    
    if email not in users or users[email] != password:
        return jsonify({'message': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity=email)
    return jsonify({'access_token': access_token, 'email': email}), 200

@app.route('/api/weather', methods=['GET'])
def get_weather():
    """Get weather data from OpenWeatherMap API for Mangalore"""
    try:
        
        loc = request.args.get('location')
        lat = request.args.get('lat')
        lon = request.args.get('lon')
        # Simple mapping for supported locations
        coords = {
            'Mangalore': ('12.8628', '74.8430'),
            'Mysore': ('12.2958', '76.6394'),
            'Bangalore': ('12.9716', '77.5946')
        }

        if loc and loc in coords:
            lat, lon = coords[loc]

        # Try WeatherAPI.com first if key is provided in environment
        weatherapi_key = os.environ.get('WEATHERAPI_KEY')
        provider_used = 'none'
        upstream_status = None
        upstream_snippet = None

        try:
            if weatherapi_key:
                # WeatherAPI accepts q as city or 'lat,lon'
                q = f"{lat},{lon}" if lat and lon else (loc or 'Mangalore')
                resp = requests.get(
                    'https://api.weatherapi.com/v1/current.json',
                    params={'key': weatherapi_key, 'q': q},
                    timeout=5
                )
                provider_used = 'weatherapi'
                upstream_status = resp.status_code
                upstream_snippet = (resp.text or '')[:200]
                if resp.status_code == 200:
                    data = resp.json()
                    current = data.get('current', {})
                    location_name = data.get('location', {}).get('name') or loc or 'Mangalore'
                    if request.args.get('debug') == '1':
                        return jsonify({
                            'temperature': current.get('temp_c'),
                            'humidity': current.get('humidity'),
                            'rainfall': current.get('precip_mm', 0),
                            'wind_speed': current.get('wind_kph'),
                            'city': location_name,
                            'condition': current.get('condition', {}).get('text'),
                            'provider': provider_used,
                            'q': q,
                            'upstream_status': upstream_status
                        }), 200
                    return jsonify({
                        'temperature': current.get('temp_c'),
                        'humidity': current.get('humidity'),
                        'rainfall': current.get('precip_mm', 0),
                        'wind_speed': current.get('wind_kph'),
                        'city': location_name,
                        'condition': current.get('condition', {}).get('text')
                    }), 200
                else:
                    # continue to fallback
                    pass
        except Exception as e:
            provider_used = 'weatherapi_error'
            upstream_status = None
            upstream_snippet = str(e)[:200]
            # If WeatherAPI call fails, we'll fall back to OpenWeather
            pass

        # Fallback: OpenWeatherMap (existing behavior)
        if not lat or not lon:
            # default to Mangalore
            lat, lon = coords['Mangalore']

        api_key = os.environ.get('OPENWEATHERMAP_API_KEY')
        response = None
        if api_key:
            response = requests.get(
                'https://api.openweathermap.org/data/2.5/weather',
                params={'lat': lat, 'lon': lon, 'appid': api_key, 'units': 'metric'},
                timeout=5
            )
            provider_used = 'openweathermap'
            upstream_status = response.status_code
            upstream_snippet = (response.text or '')[:200]
        else:
            provider_used = 'openweathermap_unconfigured'
            upstream_status = None
            upstream_snippet = 'OPENWEATHERMAP_API_KEY is not configured'

        if response is not None and response.status_code == 200:
            data = response.json()
            if request.args.get('debug') == '1':
                return jsonify({
                    'temperature': data['main']['temp'],
                    'humidity': data['main']['humidity'],
                    'rainfall': data.get('rain', {}).get('1h', 0),
                    'wind_speed': data['wind']['speed'],
                    'city': data.get('name') or loc or 'Mangalore',
                    'condition': data['weather'][0]['main'],
                    'provider': provider_used,
                    'q': f"{lat},{lon}",
                    'upstream_status': upstream_status
                }), 200
            return jsonify({
                'temperature': data['main']['temp'],
                'humidity': data['main']['humidity'],
                'rainfall': data.get('rain', {}).get('1h', 0),
                'wind_speed': data['wind']['speed'],
                'city': data.get('name') or loc or 'Mangalore',
                'condition': data['weather'][0]['main']
            }), 200
        else:
            # Final fallback response (include debug info if requested)
            if request.args.get('debug') == '1':
                return jsonify({
                    'temperature': 28.5,
                    'humidity': 75,
                    'rainfall': 15,
                    'wind_speed': 10,
                    'city': loc or 'Mangalore',
                    'condition': 'Partly Cloudy',
                    'provider': provider_used,
                    'q': f"{lat},{lon}",
                    'upstream_status': upstream_status,
                    'upstream_snippet': upstream_snippet
                }), 200
            return jsonify({
                'temperature': 28.5,
                'humidity': 75,
                'rainfall': 15,
                'wind_speed': 10,
                'city': loc or 'Mangalore',
                'condition': 'Partly Cloudy'
            }), 200
    except Exception:
        return jsonify({
            'temperature': 28.5,
            'humidity': 75,
            'rainfall': 15,
            'wind_speed': 10,
            'city': loc or 'Mangalore',
            'condition': 'Partly Cloudy'
        }), 200


@app.route('/api/weather/expected', methods=['GET'])
def get_expected_rainfall():
    """Return expected rainfall (mm) for a given location and month/day.
    If the requested date is today and API available, returns current rainfall; otherwise returns monthly average rainfall from CSV."""
    try:
        loc = request.args.get('location')
        month = int(request.args.get('month')) if request.args.get('month') else None
        # Try to use current weather first when no month or month==current month
        df = read_price_data()

        # Map to coordinates if possible
        coords = {
            'Mangalore': ('12.8628', '74.8430'),
            'Mysore': ('12.2958', '76.6394'),
            'Bangalore': ('12.9716', '77.5946')
        }

        if loc in coords:
            lat, lon = coords[loc]
        else:
            lat = request.args.get('lat')
            lon = request.args.get('lon')

        # If month is provided and not current, return monthly average rainfall from CSV
        try:
            # Prefer WeatherAPI if available
            weatherapi_key = os.environ.get('WEATHERAPI_KEY')
            if weatherapi_key:
                q = f"{lat},{lon}" if lat and lon else (loc or 'Mangalore')
                resp = requests.get(
                    'https://api.weatherapi.com/v1/current.json',
                    params={'key': weatherapi_key, 'q': q},
                    timeout=5
                )
                if resp.status_code == 200:
                    data = resp.json()
                    rainfall = data.get('current', {}).get('precip_mm', 0)
                    return jsonify({'rainfall': rainfall}), 200

            api_key = os.environ.get('OPENWEATHERMAP_API_KEY')
            if api_key:
                resp = requests.get(
                    'https://api.openweathermap.org/data/2.5/weather',
                    params={'lat': lat, 'lon': lon, 'appid': api_key, 'units': 'metric'},
                    timeout=5
                )
                if resp.status_code == 200:
                    data = resp.json()
                    rainfall = data.get('rain', {}).get('1h', 0)
                    return jsonify({'rainfall': rainfall}), 200
        except Exception:
            pass

        # Fallback: compute monthly average rainfall from CSV
        if month and 'month' in df.columns:
            md = df
            if loc:
                md = md[md['location'] == loc]
            if md.empty:
                return jsonify({'rainfall': 0}), 200
            avg = md[md['month'] == month]['rainfall'].mean()
            avg = float(avg) if not np.isnan(avg) else 0.0
            return jsonify({'rainfall': round(avg, 2)}), 200

        return jsonify({'rainfall': 0}), 200
    except Exception as e:
        return jsonify({'rainfall': 0, 'error': str(e)}), 200


@app.route('/api/data/monthly-rainfall', methods=['GET'])
def get_monthly_rainfall():
    """Return monthly average rainfall (mm) for a given location and month from the CSV dataset."""
    try:
        loc = request.args.get('location')
        month = int(request.args.get('month')) if request.args.get('month') else None

        if month is None:
            return jsonify({'rainfall': 0, 'error': 'month parameter required'}), 400

        csv_path = DATASET_PATH
        if not os.path.exists(csv_path):
            return jsonify({'rainfall': 0, 'error': 'data file not found'}), 200

        df = read_price_data()

        md = df
        if loc:
            md = md[md['location'] == loc]

        if md.empty:
            return jsonify({'rainfall': 0}), 200

        if 'month' not in md.columns or 'rainfall' not in md.columns:
            return jsonify({'rainfall': 0}), 200

        avg = md[md['month'] == month]['rainfall'].mean()
        avg = float(avg) if not np.isnan(avg) else 0.0
        return jsonify({'rainfall': round(avg, 2)}), 200
    except Exception as e:
        return jsonify({'rainfall': 0, 'error': str(e)}), 200

@app.route('/api/data/locations', methods=['GET'])
@jwt_required()
def get_locations():
    """Get available locations"""
    try:
        df = read_price_data()
        locations = sorted(df['location'].unique().tolist())
        return jsonify({'locations': locations}), 200
    except Exception:
        return jsonify({'locations': ['Mangalore', 'Mysore', 'Bangalore']}), 200

@app.route('/api/data/vegetables', methods=['GET'])
@jwt_required()
def get_vegetables():
    """Get available vegetables (Mangalore region)"""
    try:
        df = read_price_data()
        vegetables = sorted(df['vegetable'].unique().tolist())
        return jsonify({'vegetables': vegetables}), 200
    except Exception:
        return jsonify({'vegetables': ['Tomato', 'Onion', 'Potato']}), 200

@app.route('/api/predict', methods=['POST'])
@jwt_required()
def predict():
    """Predict vegetable price"""
    if model is None:
        return jsonify({'message': 'Model not trained'}), 500
    
    data = request.get_json()
    location = data.get('location')
    vegetable = data.get('vegetable')
    date = int(data.get('date', 15))
    month = int(data.get('month'))
    season = data.get('season')
    rainfall = float(data.get('rainfall', 10))
    
    try:
        # Encode inputs
        try:
            location_encoded = location_encoder.transform([location])[0]
            vegetable_encoded = vegetable_encoder.transform([vegetable])[0]
            season_encoded = season_encoder.transform([season])[0]
        except ValueError as ve:
            # Handle unseen labels by retraining the model once (if CSV updated)
            if 'previously unseen labels' in str(ve) or 'y contains previously unseen labels' in str(ve):
                print(f"Encoder transform error: {ve} -- retraining model and retrying")
                # Attempt to retrain to include new labels
                if load_model():
                    location_encoded = location_encoder.transform([location])[0]
                    vegetable_encoded = vegetable_encoder.transform([vegetable])[0]
                    season_encoded = season_encoder.transform([season])[0]
                else:
                    raise
            else:
                raise
        
        # Create feature vector (matching training order - exclude market_arrivals)
        features = np.array([[location_encoded, vegetable_encoded, date, month, season_encoded, rainfall]])
        
        # Make prediction
        predicted_price = model.predict(features)[0]
        
        return jsonify({
            'predicted_price': round(float(predicted_price), 2),
            'location': location,
            'vegetable': vegetable,
            'month': month,
            'season': season
        }), 200
    except Exception as e:
        return jsonify({'message': f'Prediction error: {str(e)}'}), 500

@app.route('/api/analytics/price-trend', methods=['GET'])
@jwt_required()
def get_price_trend():
    """Get price trend for a vegetable in a location"""
    try:
        df = read_price_data()
        vegetable = request.args.get('vegetable')
        location = request.args.get('location', 'Mangalore')

        if not vegetable:
            return jsonify({'months': list(range(1, 13)), 'prices': [0] * 12}), 200

        filtered_df = df[(df['vegetable'] == vegetable) & (df['location'] == location)]

        if filtered_df.empty:
            return jsonify({'months': list(range(1, 13)), 'prices': [0] * 12}), 200

        monthly_avg = filtered_df.groupby('month')['price'].mean().sort_index()

        return jsonify({
            'months': list(range(1, 13)),
            'prices': [float(monthly_avg.get(m, 0)) for m in range(1, 13)],
            'vegetable': vegetable,
            'location': location
        }), 200
    except Exception as e:
        return jsonify({'months': list(range(1, 13)), 'prices': [0] * 12, 'error': str(e)}), 200


@app.route('/api/data/avg-arrivals', methods=['GET'])
@jwt_required()
def get_avg_arrivals():

    try:
        return jsonify({'avg_arrivals': 0}), 200
    except Exception as e:
        return jsonify({'avg_arrivals': 0, 'error': str(e)}), 200

@app.route('/api/analytics/seasonal-availability', methods=['GET'])
@jwt_required()
def get_seasonal_availability():
    """Get vegetable availability by season"""
    try:
        df = read_price_data()
        vegetable = request.args.get('vegetable')
        location = request.args.get('location', 'Mangalore')
        
        filtered_df = df[(df['vegetable'] == vegetable) & (df['location'] == location)]
        
        if filtered_df.empty:
            return jsonify({
                'seasons': ['Winter', 'Spring', 'Summer', 'Monsoon'],
                'availability': [0, 0, 0, 0]
            }), 200
        
        seasonal_count = filtered_df['season'].value_counts().to_dict()
        seasons = ['Winter', 'Spring', 'Summer', 'Monsoon']
        availability = [seasonal_count.get(s, 0) for s in seasons]
        
        return jsonify({
            'seasons': seasons,
            'availability': availability,
            'vegetable': vegetable,
            'location': location
        }), 200
    except Exception as e:
        return jsonify({
            'seasons': ['Winter', 'Spring', 'Summer', 'Monsoon'],
            'availability': [0, 0, 0, 0]
        }), 200

@app.route('/api/analytics/monthly-availability', methods=['GET'])
@jwt_required()
def get_monthly_availability():
    """Get vegetable availability by month with multiplication factor"""
    try:
        df = read_price_data()
        vegetable = request.args.get('vegetable')
        
        filtered_df = df[df['vegetable'] == vegetable]
        
        if filtered_df.empty:
            return jsonify({
                'months': list(range(1, 13)),
                'availability': [0] * 12,
                'multiplication_factors': [1.0] * 12
            }), 200
        

        monthly_count = filtered_df['month'].value_counts().sort_index()
        availability = [monthly_count.get(m, 0) for m in range(1, 13)]
        
   
        max_availability = max(availability) if max(availability) > 0 else 1
        multiplication_factors = [
            round((a / max_availability), 2) if a > 0 else 0.1
            for a in availability
        ]
        
        return jsonify({
            'months': list(range(1, 13)),
            'availability': availability,
            'multiplication_factors': multiplication_factors,
            'vegetable': vegetable
        }), 200
    except Exception as e:
        return jsonify({
            'months': list(range(1, 13)),
            'availability': [0] * 12,
            'multiplication_factors': [1.0] * 12
        }), 200

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'Backend is running'}), 200


def initialize_model():
    """Load the saved model or train it once for this application process."""
    os.makedirs(MODEL_DIR, exist_ok=True)
    if not load_saved_model() and not load_model():
        raise RuntimeError(f'Could not load or train the model using {DATASET_PATH}')


# Gunicorn imports this module, so initialize the model during application import.
initialize_model()


if __name__ == '__main__':
    app.run(debug=True, port=5000, use_reloader=False)
