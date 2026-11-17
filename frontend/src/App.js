import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Prediction from './pages/Prediction';
import Landing from './pages/Landing';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(localStorage.getItem('user'));

  const handleLogin = (newToken, email) => {
    setToken(newToken);
    setUser(email);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', email);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      {token && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        <Route 
          path="/login"
          element={token ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={token ? <Navigate to="/dashboard" replace /> : <Login key="register" onLogin={handleLogin} initialMode="register" />}
        />
        <Route
          path="/"
          element={token ? <Home /> : <Landing />}
        />
        <Route
          path="/dashboard"
          element={token ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/prediction"
          element={token ? <Prediction /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to={token ? '/dashboard' : '/'} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
