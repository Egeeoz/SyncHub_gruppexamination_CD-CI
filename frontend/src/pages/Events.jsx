import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Searchbar from '../components/searchbar/searchbar';
import UpcomingEvents from '../components/upcommingEvents/upcommingEvents';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Events.css';

function Events() {
  const [events, setEvents] = useState([]); // All events fetched initially
  const [filteredEvents, setFilteredEvents] = useState([]); // Events displayed

  const fetchEvents = async (keyword = '') => {
    try {
      const response = await fetch(
        `https://dyiz5f0s9h.execute-api.eu-north-1.amazonaws.com/meetups/search?keyword=${keyword}`
      );
      const data = await response.json();

      const formattedData = data.map((event) => ({
        ...event,
        attending: event.attending || [], // Ensure this is always an array
        attendingCount: event.attendingCount || 0, // Initialize count if not present
      }));

      setEvents(formattedData); // Store all fetched events
      setFilteredEvents(formattedData); // Set displayed events
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleSearch = async (keyword) => {
    if (!keyword) {
      await fetchEvents();
    } else {
      // Let the backend handle the search instead of client-side filtering
      await fetchEvents(keyword);
    }
  };

  const handleJoinEvent = async (eventId, username, isCurrentlyAttending) => {
    try {
      const response = await fetch(
        'https://dyiz5f0s9h.execute-api.eu-north-1.amazonaws.com/meetups/attend',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ meetupId: eventId, username }),
        }
      );

      if (response.ok) {
        // Re-fetch events to update UI
        await fetchEvents();

        // Show toast notification based on whether the user was joining or leaving
        toast.success(
          isCurrentlyAttending
            ? 'Successfully left the event!'
            : 'Successfully joined the event!'
        );
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
      }
    } catch (error) {
      console.error('Error updating event attendance:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    fetchEvents(); // Fetch all events when the component mounts
  }, []);

  return (
    <div className="events-container">
      <Navbar />
      <div className="events-content">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
        />
        <h1>Upcoming Events</h1>
        <Searchbar onSearch={handleSearch} />
        <UpcomingEvents
          events={filteredEvents}
          setEvents={setEvents}
          onJoinEvent={handleJoinEvent}
        />
      </div>
      <Footer />
    </div>
  );
}

export default Events;
