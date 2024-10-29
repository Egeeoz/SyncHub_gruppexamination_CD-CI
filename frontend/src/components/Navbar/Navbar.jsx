// MARCUS
// src/components/Navbar/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/home">SyncHub</Link> 
      </div>
      <div className="navbar-links">
        <Link to="/events">Events</Link>
        <Link to="/profile">Profile</Link>
        {isAuthenticated ? (
          <button className="auth-link" onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login" className="auth-link">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;