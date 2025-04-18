import React from 'react';
import Toolbar from '../ToolBar/toolBar';
import { useUser } from '../UserContext';
import { Link } from 'react-router-dom';

// Admin Toolbar Component
const AdminToolbar = () => {
  return (
    <section style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1rem' }}>
      <Link to="/users"> {/* Link to Users Page */}
        <button style={toolbarButtonStyle}>Users</button>
      </Link>
      <button style={toolbarButtonStyle}>Bookings</button>
      <button style={toolbarButtonStyle}>Events</button>
    </section>
  );
};

// Styling for toolbar buttons
const toolbarButtonStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
};

// Main Admin Page Component
export default function AdminPage() {
  const userType = useUser(); // Get the user type, possibly for permission-based rendering

  return (
    <>
      <Toolbar userType={userType} /> {/* Main toolbar for the logged-in user */}
      
      {/* Admin Toolbar under the main toolbar */}
      <AdminToolbar />

      <section style={{ padding: '1rem' }}>
        <h2>Admin Dashboard</h2>
        {/* Content below can be dynamically loaded based on the selected toolbar option */}
        <p>Welcome to the Admin Dashboard. Manage Users, Bookings, and Events.</p>
      </section>
    </>
  );
}
