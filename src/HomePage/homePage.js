import React, { useEffect, useState } from 'react';
import Toolbar from '../ToolBar/toolBar';
import WeatherWidget from '../HomePage/weather';
import { useUser } from '../UserContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/firebaseApp';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import '../HomePage/homePage.css';
import '@fullcalendar/core/package.json';
import '@fullcalendar/daygrid/package.json';

const imagePaths = [
  '/images/entrance.png', '/images/miniPool.png', '/images/tennis.png',
  '/images/soccerField.png', '/images/cricket.png', '/images/archery.png',
  '/images/badminton.png', '/images/basketball.png', '/images/volleyball.png',
  '/images/padelCourt.png', '/images/indoorSoccer.png', '/images/cricketField.png',
  '/images/tableTennis.png'
];

const HomePage = () => {
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [issues, setIssues] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
      const eventsSnapshot = await getDocs(collection(db, 'events'));
      const issuesSnapshot = await getDocs(collection(db, 'issues'));

      setBookings(bookingsSnapshot.docs.map(doc => doc.data()));
      setEvents(eventsSnapshot.docs.map(doc => doc.data()));
      setIssues(issuesSnapshot.docs.map(doc => doc.data()));
    };

    fetchData();
  }, []);

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
        <img src={imagePaths[currentImage]} alt="Sports Facility" className="carousel-image" />
      </section>

      <section className="homepage-main-layout">
        <aside className="weather-sidebar">
          <WeatherWidget />
        </aside>

        <section className="homepage-main">
          <h2>Welcome, {user?.name ?? 'User'} </h2>

          <section className="homepage-intro">
          <h2> Welcome to <strong>SportsHub</strong> – The Beating Heart of Our Community</h2>
          <p>
            Nestled in the vibrant suburb of Sherwood, Durban, <strong>SportsHub</strong> is more than just a collection of courts and fields — it's a dynamic, inclusive space where health, passion, and community spirit come alive.
          </p>
          <p>
            Designed for athletes of every age and ability, this state-of-the-art facility blends modern infrastructure with the natural charm of open spaces, offering the perfect environment for competition, recreation, and connection.
          </p>
          <p>
             Dive into our Olympic-sized swimming pool, unleash your skills on full-sized and mini soccer fields, or challenge yourself on our indoor climbing wall. Whether you're a badminton buff, cricket connoisseur, or just looking for a place to stay active and unwind, there's something here for everyone.
          </p>
          <p>
             From floodlit outdoor arenas to climate-controlled indoor courts, SportsHub is meticulously maintained and equipped with cutting-edge amenities — including digital booking, real-time weather alerts, and live event notifications — all accessible at your fingertips.
          </p>
          <p>
             More than just a venue, <strong>SportsHub is a lifestyle destination</strong> — a place where families gather, friendships are forged, and memories are made, one game at a time.
          </p>
        </section>

          <section className="homepage-info">
            <article className="info-block">
              <h3>Upcoming Events & Maintenance</h3>
              <ul>
                {events.length > 0 ? events.map((event, idx) => (
                  <li key={idx}> {event.title} — {event.date}</li>
                )) : <li>No upcoming events</li>}
              </ul>
              <h4>Maintenance Alerts</h4>
              <ul>
                {issues.length > 0 ? issues.map((issue, idx) => (
                  <li key={idx}> {issue.description}</li>
                )) : <li>No maintenance notices</li>}
              </ul>
            </article>

            <article className="info-block">
              <h3>Your Bookings</h3>
              <ul>
                {bookings.length > 0 ? bookings.map((booking, idx) => (
                  <li key={idx}> {booking.facility} on {booking.date}</li>
                )) : <li>No bookings found</li>}
              </ul>
            </article>

            <article className="info-block calendar-section">
              <h3> Booking Calendar</h3>
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={[
                  ...bookings.map(b => ({ title: b.facility, date: b.date })),
                  ...events.map(e => ({ title: e.title, date: e.date }))
                ]}
                height="auto"
              />
            </article>
          </section>
        </section>
      </section>

      <footer className="homepage-footer">
        © {new Date().getFullYear()} SportsHub. All rights reserved.
      </footer>
    </main>
  );
};

export default HomePage;