import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <Navbar />
      <div className="home-content">
        <h1>Welcome to the Home Page</h1>
      </div>
      <Footer/>
    </div>
  );
}

export default Home;