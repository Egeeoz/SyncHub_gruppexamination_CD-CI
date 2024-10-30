import React, { useEffect, useState } from 'react';
import './EventHistory.css';
import { useAuth } from '../../auth/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EventHistory() {
  const { username } = useAuth();
  const [historicalEvents, setHistoricalEvents] = useState([]);
  const [expandedEvent, setExpandedEvent] = useState(null); // For expanded event details

  useEffect(() => {
    const fetchEvents = async () => {
      if (!username) return; // Don't fetch if user is not logged in
      try {
        const response = await fetch(
          'https://dyiz5f0s9h.execute-api.eu-north-1.amazonaws.com/meetups/search'
        );
        const data = await response.json();
        const filteredEvents = data.filter((event) =>
          event.attending?.includes(username)
        );
        setHistoricalEvents(filteredEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents(); // Fetch events on mount
  }, [username]);

  const handleLeaveEvent = async (eventId) => {
    try {
      await fetch(
        'https://dyiz5f0s9h.execute-api.eu-north-1.amazonaws.com/meetups/attend',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ meetupId: eventId, username }),
        }
      );
      setHistoricalEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
      toast.success('Successfully left the event!');
    } catch (error) {
      console.error('Error leaving event:', error);
      toast.error('Failed to leave the event. Please try again.');
    }
  };

  const handleToggleExpand = (eventId) => {
    setExpandedEvent((prevId) => (prevId === eventId ? null : eventId));
  };

  return (
    <div className="event-history">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <h1>Your Event History</h1>
      {historicalEvents.length > 0 ? (
        historicalEvents.map((event) => (
          <div key={event.id} className="event-card">
            <h2
              onClick={() => handleToggleExpand(event.id)}
              style={{ cursor: 'pointer' }}
            >
              {event.title} {expandedEvent === event.id ? '-' : '+'}
            </h2>
            {expandedEvent === event.id && (
              <div className="event-details">
                <div className="label-content-container">
                  <div className="label">Organizer:</div>
                  <div className="content">{event.organizerName}</div>
                </div>
                <div className="label-content-container">
                  <div className="label">Date:</div>
                  <div className="content">{event.date}</div>
                </div>
                <div className="label-content-container">
                  <div className="label">Location:</div>
                  <div className="content">{event.location}</div>
                </div>
                <p>
                  <strong>Description:</strong> {event.description}
                </p>
                <button onClick={() => handleLeaveEvent(event.id)}>
                  Leave Event
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No historical events found.</p>
      )}
    </div>
  );
}
