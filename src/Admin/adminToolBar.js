import React from 'react';
import { Link } from 'react-router-dom';

const AdminToolbar = () => {
  return (
    <section style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1rem' }}>
      <Link to="/users"><button style={toolbarButtonStyle}>Users</button></Link>
      <Link to="/adminBooking">
      <button style={toolbarButtonStyle}>Bookings</button>
      </Link>
      <Link to="/events"><button style={toolbarButtonStyle}>Events</button></Link>
      <Link to="/adminAnalytics"><button style={toolbarButtonStyle}>Analytics</button></Link>
    </section>
  );
};

const toolbarButtonStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
   width: '100%'
};

export default AdminToolbar;
