import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    margin: 0,
    padding: 0,
  };

  const headerStyle = {
    backgroundColor: '#ffffff',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const logoSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  };

  const navStyle = {
    display: 'flex',
    gap: '1.5rem',
  };

  const mainStyle = {
    padding: '4rem 2rem',
    textAlign: 'center',
  };

  const footerStyle = {
    backgroundColor: '#ffffff',
    textAlign: 'center',
    padding: '1rem',
    fontSize: '0.875rem',
    color: '#666666',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
    marginTop: '5rem',
  };
return (
    <main style={containerStyle}>
      <header style={headerStyle}>
        <section style={logoSectionStyle}>
          <img src="/logo.png" alt="Logo" style={{ width: '40px', height: '40px' }} />
          <h1 style={{ color: '#1e3a8a' }}>Community Sports Hub</h1>
        </section>
        <nav style={navStyle}>
          <Link to="/login">Login Page</Link>
          <Link to="/test">Test Page</Link>
          <Link to="/bookings">Bookings Page</Link>
          <Link to="/issues">Issue Page</Link>
        </nav>
      </header>

      <section style={mainStyle}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333333' }}>
          Welcome to the Community Sports Facility Management System
        </h2>
        <p style={{ fontSize: '1.125rem', color: '#666666', maxWidth: '600px', margin: '0 auto' }}>
          Reserve sports venues, report issues, and stay updated on community events with ease.
        </p>
      </section>

      <footer style={footerStyle}>
        © {new Date().getFullYear()} Community Sports Hub. All rights reserved.
      </footer>
    </main>
  );
};

export default HomePage;