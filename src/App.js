import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import IssuePage from './Issue page and assoicated stuff/Issues';
import BookingPage from './Bookings/bookingForm';
import LoginPage from './Login/loginUI';
import HomePage from './HomePage/homePage';


function App() {
  return (
    <Router>

        <ul>
          <li><Link to="/issues">Issue Page</Link></li>
          <li><Link to="/bookings">Bookings Page</Link></li>
          <li><Link to="/">Login Page</Link></li>
          <li><Link to="/home">Home Page</Link></li>
        </ul>


      <Routes>
        <Route path="/issues" element={<IssuePage />} />
        <Route path="/bookings" element={<BookingPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
