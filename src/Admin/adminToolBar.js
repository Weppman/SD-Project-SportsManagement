import React from 'react';
import { Link } from 'react-router-dom';

const AdminToolbar = () => {
  return (
    <section style={toolbarStyle}>
      <Link to="/users"><button style={toolbarButtonStyle}>Users</button></Link>
      <Link to="/adminBooking"><button style={toolbarButtonStyle}>Bookings</button></Link>
      <Link to="/events"><button style={toolbarButtonStyle}>Events</button></Link>
      <Link to="/adminAnalytics"><button style={toolbarButtonStyle}>Analytics</button></Link>
    </section>
  );
};

const toolbarStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
  padding: '1rem',
  backgroundColor: '#0A475A',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
};

const toolbarButtonStyle = {
  padding: '0.8rem 1.5rem',
  backgroundColor: 'white',
  color: '#0A475A',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
  transition: 'background-color 0.3s ease-in-out, transform 0.2s ease-in-out',
};

export default AdminToolbar;

