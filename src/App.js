import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import IssuePage from './Issue page and assoicated stuff/Issues'; // optional if you have a homepage
import TestPage from './MainUIComponents/testMainUI';
import BookingPage from './Bookings/bookingForm';
import LoginPage from './Login/loginUI';

function App() {
  return (
    <Router>

        <ul>
          <li><Link to="/issues">Issue Page</Link></li>
          <li><Link to="/test">Test Page</Link></li>
          <li><Link to="/bookings">Bookings Page</Link></li>
          <li><Link to="/">Login Page</Link></li>
        </ul>


      <Routes>
        <Route path="/issues" element={<IssuePage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/bookings" element={<BookingPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
