import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import IssuePage from './Issue page and assoicated stuff/Issues';
import TestPage from './MainUIComponents/testMainUI';
import BookingPage from './Bookings/bookingForm';
import LoginPage from './Login/loginUI';
import HomePage from './HomePage/homePage';
import { UserProvider } from './UserContext'; // <-- import your provider here

function App() {
  return (
    <UserProvider> {/* <-- wrap your app with UserProvider */}
      <Router>
        <ul>
          <li><Link to="/issues">Issue Page</Link></li>
          <li><Link to="/test">Test Page</Link></li>
          <li><Link to="/bookings">Bookings Page</Link></li>
          <li><Link to="/">Login Page</Link></li>
          <li><Link to="/home">Home Page</Link></li>
        </ul>

        <Routes>
          <Route path="/issues" element={<IssuePage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/bookings" element={<BookingPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
