import React, { useState, useCallback } from 'react';
import './UpcomingEvents.css';
import { useAuth } from '../../auth/AuthContext';

const UpcomingEvents = ({ events, onJoinEvent, isHistorical = false }) => {
  const { username } = useAuth();
  const [expandedEventId, setExpandedEventId] = useState(null);

  const handleToggleEvent = useCallback(
    (eventId) => {
      const event = events.find((event) => event.id === eventId);
      const isAttending = event?.attending?.includes(username) ?? false;

      if (isHistorical) {
        onJoinEvent(eventId);
      } else {
        if (!isAttending && event.attending.length >= event.maxAttendees) {
          alert(
            `This event has reached the maximum number of participants (${event.maxAttendees}). You cannot join this event.`
          );
          return;
        }
        onJoinEvent(eventId, username, isAttending);
      }
    },
    [events, username, isHistorical, onJoinEvent]
  );

  const handleEventClick = useCallback((eventId) => {
    setExpandedEventId((prevEventId) =>
      prevEventId === eventId ? null : eventId
    );
  }, []);

  return (
    <div className="events-list">
      {events.length > 0 ? (
        events.map((event) => (
          <div key={event.id} className="event-card-container">
            <div
              className={`event-card ${
                expandedEventId === event.id ? 'highlight' : ''
              }`}
              onClick={() => handleEventClick(event.id)}
            >
              <div className="event-card-front">
                <div className="banner"></div>
                <div className="title">{event.title}</div>
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
              </div>
              <div className="label-content-container">
                <div className="label">Participants:</div>
                <div className="content">
                  {event.attending && event.attending.length > 0
                    ? event.attending.join(', ')
                    : 'None'}
                </div>
              </div>
              {expandedEventId === event.id && (
                <div className="additional-info">
                  <p>
                    <strong>Max Attendance:</strong> {event.maxAttendees}
                  </p>
                  <p>
                    <strong>Attending:</strong> {event.attending?.length || 0}
                  </p>
                  <p>
                    <strong>Description:</strong> {event.description}
                  </p>
                </div>
              )}
              <div className="actual-id">ID: {event.id}</div>
              <button
                className="join-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleEvent(event.id);
                }}
                disabled={
                  isHistorical ||
                  (!event.attending?.includes(username) &&
                    event.attending.length >= event.maxAttendees)
                }
              >
                {isHistorical || event.attending?.includes(username)
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
