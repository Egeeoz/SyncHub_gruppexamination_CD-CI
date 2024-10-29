import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <Navbar />
      <div className="home-content">
        <h1>Welcome to the Home Page</h1>
      </div>
    </div>
  );
}

export default Home;