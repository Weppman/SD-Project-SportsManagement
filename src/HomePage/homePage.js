import React, { useEffect, useState } from 'react';
import Toolbar from '../ToolBar/toolBar';
import WeatherWidget from '../HomePage/weather';
import { useUser } from '../UserContext';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import '../HomePage/homePage.css';

const imagePaths = [
  '/images/entrance.png',
  '/images/miniPool.png',
  '/images/tennis.png',
  '/images/soccerField.png',
  '/images/archery.png',
  '/images/badminton.png',
  '/images/basketball.png',
  '/images/volleyball.png',
  '/images/padelCourt.png',
  '/images/indoorSoccer.png',
  '/images/cricketField.png',
  '/images/tableTennis.png',
];

const safeDateConversion = (timestamp) => {
  if (!timestamp?.seconds) return "Invalid Date"; 
  const date = new Date(timestamp.seconds * 1000);
  return isNaN(date.getTime()) ? "Invalid Date" : date.toISOString().split('T')[0];
};

const HomePage = () => {
  const { userType, user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [issues, setIssues] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const bookingsResponse = await fetch('https://getacceptedfuturebookings-mokwbj4tsa-uc.a.run.app');
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData.bookings || []);

        const eventsResponse = await fetch('https://geteventdata-mokwbj4tsa-uc.a.run.app');
        const eventsData = await eventsResponse.json();
        setEvents(eventsData || []);

  
        const issuesResponse = await fetch('https://getresolved3days-mokwbj4tsa-uc.a.run.app');
        const issuesData = await issuesResponse.json();
        setIssues(issuesData || []);

        if (user?.uid) {
          const userResponse = await fetch(`https://getenricheduserauthdata-mokwbj4tsa-uc.a.run.app/?uid=${user.uid}`);
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUserName(userData.displayName || userData.email || 'User');
          } else {
            console.error('Failed to fetch user data');
            setUserName(user.email || 'User');
          }
        } else {
          setUserName('User'); 
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setUserName(user?.email || 'User');
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % imagePaths.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="homepage-container">
      <Toolbar />

      <section className="homepage-header-carousel">
        <img src={imagePaths[currentImage]} className="carousel-image" alt="Sports facility" />
      </section>

      <section className="homepage-main-layout">
        <aside className="weather-sidebar">
          <WeatherWidget />
        </aside>

        <section className="homepage-main">
          <h2>Welcome, {userName || 'User'}</h2>

          <section className="homepage-intro">
            <h2>
              Welcome to <strong>SportsHub</strong> – The Beating Heart of Our Community
            </h2>
            <p>
              Nestled in the vibrant suburb of Sherwood, Durban, <strong>SportsHub</strong> is more than just a
              collection of courts and fields — it's a dynamic, inclusive space where health, passion, and community
              spirit come alive.
            </p>
            {/* Rest of your intro content */}
          </section>

          {userType !== 'default' && (
            <section className="homepage-info">
              <article className="info-block">
                <h3>Upcoming Events & Maintenance</h3>
                <ul>
                  {events.length > 0 ? (
                    events.map((event) => (
                      <li key={event.id}>
                        {event.title} — {safeDateConversion(event.startDate)}
                      </li>
                    ))
                  ) : (
                    <li>No upcoming events</li>
                  )}
                </ul>
                <h4>Maintenance Alerts</h4>
                <ul>
                  {issues.length > 0 ? (
                    issues.map((issue) => (
                      <li key={issue.id}>{issue.description}</li>
                    ))
                  ) : (
                    <li>No maintenance notices</li>
                  )}
                </ul>
              </article>

              <article className="info-block">
                <h3>Your Bookings</h3>
                <ul>
                  {bookings.filter((b) => b.userId === user?.uid).length > 0 ? (
                    bookings
                      .filter((booking) => booking.userId === user?.uid)
                      .map((booking) => (
                        <li key={booking.id}>
                          {booking.venueID} on {safeDateConversion(booking.date)} at {booking.timeSlot}
                        </li>
                      ))
                  ) : (
                    <li>No bookings found</li>
                  )}
                </ul>
              </article>

              <article className="info-block calendar-section">
                <h3>Booking Calendar</h3>
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  events={[
                    ...bookings.map((b) => ({
                      title: b.venueID,
                      date: safeDateConversion(b.date),
                      backgroundColor: '#0A475A',
                    })),
                    ...events.map((e) => ({
                      title: e.title,
                      date: safeDateConversion(e.startDate),
                      backgroundColor: '#378006',
                    })),
                  ]}
                  height="auto"
                />
              </article>
            </section>
          )}
        </section>
      </section>

      <footer className="homepage-footer">
        © {new Date().getFullYear()} SportsHub. All rights reserved.
      </footer>
    </main>
  );
};

export default HomePage;