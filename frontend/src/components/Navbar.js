import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home as HomeIcon, BarChart3 } from 'lucide-react';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="navbar-logo">🥬</div>
          <h1>Veggie Price Predictor</h1>
        </div>

        <div className="navbar-menu">
          <button
            className="nav-link"
            onClick={() => navigate('/')}
            title="Dashboard"
          >
            <HomeIcon size={20} />
            <span>Dashboard</span>
          </button>
          <button
            className="nav-link"
            onClick={() => navigate('/prediction')}
            title="Predictions"
          >
            <BarChart3 size={20} />
            <span>Predictions</span>
          </button>
        </div>

        <div className="navbar-user">
          <span className="user-email">{user}</span>
          <button className="nav-logout" onClick={handleLogout} title="Logout">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
