import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IssuePage from './Issues/Issues';
import TestPage from './MainUIComponents/testMainUI';
import BookingPage from './Bookings/bookingForm';
import LoginPage from './Login/loginUI';
import HomePage from './HomePage/homePage';
import IssueUpdatePage from './Issues/issuesUpdate';
import AdminHomePage from './Admin/adminHome';
import UsersPage from './Admin/users';
import Facilities from './Venues/facilities'
import { UserProvider } from './UserContext'; // <-- import your provider here

function App() {
  return (
    <UserProvider> {/* <-- wrap your app with UserProvider */}
      <Router>
      <header>
          <nav>
            <figure>
              <img src="/logo.png" alt="SportsHub Logo" className="logo" />
            </figure>
          </nav>
        </header>

        <Routes>
          <Route path="/updates" element={<IssueUpdatePage />} />
          <Route path="/issues" element={<IssuePage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/bookings" element={<BookingPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/admin" element={<AdminHomePage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/facilities" element={<Facilities/>}/>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
