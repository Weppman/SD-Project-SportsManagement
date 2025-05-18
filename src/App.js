import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IssuePage from './Issues/Issues';
import BookingPage from './Bookings/bookingForm';
import HomePage from './HomePage/homePage';
import IssueUpdatePage from './Issues/issuesUpdate';
import AdminHomePage from './Admin/adminHome';
import UsersPage from './Admin/users';
import Facilities from './Venues/facilities'
import EventsPage from './Admin/events';
import AdminBookings from './Admin/adminBooking';
import AdminUsageTrends from './Admin/adminAnalytics';
import { UserProvider } from './UserContext'; // <-- import your provider here

function App() {
  return (
    <UserProvider> {/* <-- wrap your app with UserProvider */}
      <Router>
        <section style={{ width: '100%', margin: 0, padding: 0 }}></section>
          <header style={{ width: '100%' }}>
              <nav>
                <figure>
                  <img src="/logo.png" alt="SportsHub Logo" className="logo" />
                </figure>
              </nav>
          </header>


            <Routes>
              <Route path="/updates" element={<IssueUpdatePage />} />
              <Route path="/issues" element={<IssuePage />} />
              <Route path="/bookings" element={<BookingPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/admin" element={<AdminHomePage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/facilities" element={<Facilities/>}/>
              <Route path="/adminBooking" element={<AdminBookings />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/adminAnalytics" element={<AdminUsageTrends />} />
            </Routes>
          <section />
      </Router>
    </UserProvider>
  );
}

export default App;
