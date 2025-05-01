import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import IssuePage from './Issues/Issues';
import BookingPage from './Bookings/bookingForm';
import LoginPage from './Login/loginUI';
import HomePage from './HomePage/homePage';
import IssueUpdatePage from './Issues/issuesUpdate';
import AdminHomePage from './Admin/adminHome';
import UsersPage from './Admin/users';
import EventsPage from './Admin/events';
import { UserProvider } from './UserContext'; // <-- import your provider here

function App() {
  return (
    <UserProvider> {/* <-- wrap your app with UserProvider */}
      <Router>
        <ul>
          <li><Link to="/issues">Issue Page</Link></li>
          <li><Link to="/bookings">Bookings Page</Link></li>
          <li><Link to="/">Login Page</Link></li>
          <li><Link to="/home">Home Page</Link></li>
        </ul>

        <Routes>
          <Route path="/updates" element={<IssueUpdatePage />} />
          <Route path="/issues" element={<IssuePage />} />
          <Route path="/bookings" element={<BookingPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/admin" element={<AdminHomePage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/events" element={<EventsPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
