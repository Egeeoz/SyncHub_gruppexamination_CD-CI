import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Hero from '../components/Hero/Hero';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <Navbar />
      <div className="home-content">
        <Hero />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
