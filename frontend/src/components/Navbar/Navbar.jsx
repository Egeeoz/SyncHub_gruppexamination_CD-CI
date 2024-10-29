// MARCUS
// src/components/Navbar/Navbar.jsx

import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="/">Home</a>
      </div>
      <ul className="navbar-links">
        <li>
          <a href="/login">Login</a>
        </li>
        <li>
          <a href="/events">Events</a>
        </li>
        <li>
          <a href="/profile">Profile</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
