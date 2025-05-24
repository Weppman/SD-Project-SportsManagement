import React from 'react';
import Toolbar from '../ToolBar/toolBar';
import { useUser } from '../UserContext';
import AdminToolbar from '../Admin/adminToolBar';

export default function AdminPage() {
  const { userType } = useUser(); 

  return (
    <>
      <main style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        minWidth: '100vw',
        width: '100%',
        padding: '1rem',
        boxSizing: 'border-box',
      }}>
        <Toolbar userType={userType} style={{ width: '100%', minWidth: '100vw' }} />
        <AdminToolbar style={{ width: '100%', minWidth: '100vw' }} />
        <section style={{ marginBottom: '1rem', width: '100%' }}>
          <h2>Admin Dashboard</h2>
        </section>
        <section>
          <p>Welcome to the Admin Dashboard. Manage Users, Bookings, and Events.</p>
        </section>
      </main>
    </>
  );
}
