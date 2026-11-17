import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/client';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import './Login.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await authAPI.register(email, password);
        setError('');
        setIsRegister(false);
        setPassword('');
      } else {
        const response = await authAPI.login(email, password);
        onLogin(response.data.access_token, response.data.email);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">🥬</div>
          <h1>Veggie Price Predictor</h1>
          <p>AI-Powered Vegetable Price Forecasting</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="alert alert-error">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="button button-login" disabled={loading}>
            {loading ? 'Loading...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          {isRegister ? (
            <>
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  className="toggle-link"
                  onClick={() => {
                    setIsRegister(false);
                    setError('');
                    setPassword('');
                  }}
                >
                  Login here
                </button>
              </p>
            </>
          ) : (
            <>
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  className="toggle-link"
                  onClick={() => {
                    setIsRegister(true);
                    setError('');
                    setPassword('');
                  }}
                >
                  Register here
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
