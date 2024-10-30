import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import EventHistory from '../components/eventHistory/eventHistory';
import './Profile.css';

export default function Profile() {
  return (
    <div>
      <Navbar />
      <EventHistory />
      <Footer />
    </div>
  );
}