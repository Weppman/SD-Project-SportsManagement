import React, { useEffect, useState, useMemo } from 'react';
import Toolbar from '../ToolBar/toolBar';
import WeatherWidget from '../HomePage/weather';
import { useUser } from '../UserContext';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import '../HomePage/homePage.css';
import '../CSS/events.css';

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
  const [userName, setUserName] = useState('User');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://getenricheduserauthdata-mokwbj4tsa-uc.a.run.app/');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        const enrichedUsers = data.users.map(user => ({
          id: user.id,
          uid: user.uid,
          displayName: user.displayName,
          UserType: user.UserType || 'user',
        }));

        setUsers(enrichedUsers);
      } catch (error) {

      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
  if (user && users.length > 0) {
    const currentUser = users.find(u => u.uid === user);
    if (currentUser) setUserName(currentUser.displayName);
  }
}, [user, users]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const bookingsResponse = await fetch('https://getacceptedfuturebookings-mokwbj4tsa-uc.a.run.app');
        const bookingsData = await bookingsResponse.json();

        setBookings(bookingsData.bookings || []);

        const eventsResponse = await fetch('https://geteventdata-mokwbj4tsa-uc.a.run.app');
        const eventsData = await eventsResponse.json();

        setEvents(eventsData.filter(event => event.status !== 'deleted') || []);

        const issuesResponse = await fetch('https://getresolved3days-mokwbj4tsa-uc.a.run.app');
        const issuesData = await issuesResponse.json();

        setIssues(Array.isArray(issuesData) ? issuesData : (issuesData.issues || []));

      } catch (error) {

      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % imagePaths.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Debug filtered bookings
  const userBookings = useMemo(() => {
    if (!user || !bookings) {
      return [];
    }

    const filtered = bookings.filter(b => {

      return b.UID === user;
    });

    return filtered;
  }, [bookings, user]);

  return (
    <main className="homepage-container">
      <Toolbar />
      <section data-testid="homepage-carousel" className="homepage-header-carousel">
        <img src={imagePaths[currentImage]} className="carousel-image" alt="Sports facility" />
      </section>
      <section className="homepage-main-layout">
        <aside className="weather-sidebar">
          <WeatherWidget />
        </aside>
        <section className="homepage-main">
          <h2>Welcome, {userName}</h2>
          <section className="homepage-intro">
            <h2>
              <strong>SportsHub</strong> – The Beating Heart of Our Community
            </h2>
            <p>
              Nestled in the vibrant suburb of Sherwood, Durban, <strong>SportsHub</strong> is more than just a
              collection of courts and fields — it's a dynamic, inclusive space where health, passion, and community
              spirit come alive.
            </p>
          </section>

          {userType !== 'default' && (
            <section className="homepage-info">
              <article className="info-block">
                <h3>Upcoming Events</h3>
                {loading ? (
                  <p>Loading events...</p>
                ) : events.length > 0 ? (
                  <ul className="event-list-homepage">
                    {events.map(event => (
                      <li key={event.id} className="homepage-event-item">
                        {event.imageUrl && (
                          <img src={event.imageUrl} alt={event.title} className="homepage-event-image" />
                        )}
                        <section className="homepage-event-details">
                          <h4>{event.title}</h4>
                          <p>{safeDateConversion(event.startDate)}</p>
                          <p>{event.description}</p>
                          <p>{event.location}</p>
                        </section>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No upcoming events.</p>
                )}
              </article>

              <article className="info-block">
                <h3>Maintenance Alerts</h3>
                {loading ? (
                  <p>Loading maintenance alerts...</p>
                ) : issues.length > 0 ? (
                  <ul>
                    {issues.map(issue => (
                      <li key={issue.id}>{issue.description}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No maintenance notices.</p>
                )}
              </article>

              <article className="info-block">
                <h3>Your Bookings</h3>
                {loading ? (
                  <p>Loading your bookings...</p>
                ) : (
                  <>
                    {userBookings.length > 0 ? (
                      <ul>
                        {userBookings.map(booking => (
                          <li key={booking.id}>
                            {booking.venueID} on {safeDateConversion(booking.date)} at {booking.timeSlot}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No bookings found.</p>
                    )}
                  </>
                )}
              </article>

              <article className="info-block calendar-section">
                <h3>Booking Calendar</h3>
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  events={[
                    ...userBookings.map(b => ({
                      title: b.venueID,
                      date: safeDateConversion(b.date),
                      backgroundColor: '#0A475A',
                    })),
                    ...events.map(e => ({
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
