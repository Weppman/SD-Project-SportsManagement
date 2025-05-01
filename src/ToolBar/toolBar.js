import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';

const navStyle = {
  display: 'flex',
  gap: '1.5rem',
};

const Toolbar = () => {
  const { userType } = useUser();

  return (
    <header style={{ backgroundColor: '#ffffff', color: '#0A475A', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      
      <nav style={navStyle}>
        {/* Common links for all users */}
        <Link to="/home">Home</Link>
        <Link to="/issues">Issues</Link>
        <Link to="/bookings">Bookings</Link>
        <Link to="/test">Tests</Link>
        <Link to="/facilities">Facilities</Link>

        {/* Staff-specific links */}
        {(userType === 'staff' || userType === 'admin') && (
          <Link to="/updates">Updates</Link>
        )}

        {/* Admin-specific links */}
        {userType === 'admin' && (
          <Link to="/admin">Admin</Link>
        )}
      </nav>
    </header>
  );
};

export default Toolbar;
