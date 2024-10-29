// MARCUS
// src/components/Navbar/Navbar.jsx


// Navbar.jsx
import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <a href="/" className="logo">Logo</a>
      <ul className="nav-links">
        <li><a href="#events">Events</a></li>
        <li><a href="#profile">Profile</a></li>
        <li><a href="#login">Login</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;