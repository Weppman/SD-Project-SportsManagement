import React from 'react';
import Toolbar from '../ToolBar/toolBar';
import { useUser } from '../UserContext';
import AdminToolbar from '../Admin/adminToolBar';


export default function Events() {
  const { userType } = useUser();

  return (
    <>
      <Toolbar userType={userType} />
      {userType === 'admin' && <AdminToolbar />}
  
      <section style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', padding: '1rem' }}>
        <section style={{ marginBottom: '1rem' }}>
          <h2>Events Dashboard</h2>
        </section>
        <section>
          <p>Welcome to the Events Dashboard.</p>
        </section>
      </section>
    </>
  );
}
