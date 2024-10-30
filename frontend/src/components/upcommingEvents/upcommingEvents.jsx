// UpcomingEvents.js
import React from 'react';
import './UpcomingEvents.css';
import { useAuth } from '../../auth/AuthContext';

const UpcomingEvents = ({ events, onJoinEvent }) => {
  const { username } = useAuth();

  let isAttending;

  const handleToggleEvent = (eventId) => {
    if (!username) {
      alert('Please log in to join or leave an event.');
      return;
    }

    // Find the event to check attendance status
    const event = events.find((event) => event.id === eventId);
    isAttending = event?.attending?.includes(username);

    // Only call onJoinEvent, no alerts here
    onJoinEvent(eventId, username, isAttending);

    // Remove the alerts from here since they're likely being handled in onJoinEvent
  };

  return (
    <div className="events-list">
      {events.length > 0 ? (
        events.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-banner"></div>
            <div className="content-group">
              <div className="event-header">
                <h2 className="event-title">{event.title}</h2>
              </div>
              <div className="event-details">
                <p>
                  <strong>Organizer:</strong> {event.organizerName}
                </p>
                <p>
                  <strong>Date:</strong> {event.date}
                </p>
                <p>
                  <strong>Location:</strong> {event.location}
                </p>
                <p>
                  <strong>Participants:</strong>{' '}
                  {event.attending ? event.attending.join(', ') : 'None'}
                </p>
              </div>
              <h3 className="description-title">Description</h3>
              <p className="event-description">{event.description}</p>
              <button
                className="join-button"
                onClick={() => handleToggleEvent(event.id)}
              >
                {event.attending?.includes(username)
                  ? 'Leave Event'
                  : 'Join Event'}
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="no-events">No events found</p>
      )}
    </div>
  );
};

export default UpcomingEvents;
