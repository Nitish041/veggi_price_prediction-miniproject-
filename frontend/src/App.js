import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Prediction from './pages/Prediction';
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
          element={token ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} 
        />
        <Route 
          path="/" 
          element={token ? <Home /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/prediction" 
          element={token ? <Prediction /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
