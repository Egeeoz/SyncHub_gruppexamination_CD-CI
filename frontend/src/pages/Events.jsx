import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import './Events.css';

function Events() {
  const events = [
    { id: 1, title: "Event 1", description: "Description for Event 1" },
    { id: 2, title: "Event 2", description: "Description for Event 2" },
    { id: 3, title: "Event 3", description: "Description for Event 3" },
    // Add more events as needed
  ];

  // State to track applied status for each event
  const [appliedEvents, setAppliedEvents] = useState({});

  // Toggle "Apply" / "Cancel" for each event
  const handleApplyClick = (eventId) => {
    setAppliedEvents(prevState => ({
      ...prevState,
      [eventId]: !prevState[eventId]  // Toggle the applied status
    }));
  };

  return (
    <div className="events-container">
      <Navbar />
      <div className="events-content">
        <h1>Upcoming Events</h1>
        <div className="events-grid">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <h2>{event.title}</h2>
              <p>{event.description}</p>
              <button 
                className="apply-button" 
                onClick={() => handleApplyClick(event.id)}
              >
                {appliedEvents[event.id] ? "Cancel" : "Apply"}
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Events;
