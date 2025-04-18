import React, { useState } from 'react';
import Toolbar from '../ToolBar/toolBar'; // Assuming you have a toolbar component

export default function Users() {
  const [users, setUsers] = useState([
    // Example users (You would fetch these from an API or database)
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    // Add more user entries as needed
  ]);
  const [selectedUser, setSelectedUser] = useState(null); // To store the selected user for editing
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  // Handle row click to select a user
  const handleRowClick = (user) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
  };

  // Handle user update
  const handleUpdate = () => {
    if (!selectedUser) return;

    const updatedUser = { ...selectedUser, name, email, role };
    
    setUsers((prev) =>
      prev.map((user) => (user.id === selectedUser.id ? updatedUser : user))
    );

    // Clear selected user and form
    setSelectedUser(null);
    setName('');
    setEmail('');
    setRole('');
  };

  return (
    <>
      <Toolbar />
      <section style={{ display: 'flex', height: 'calc(100vh - 60px)', padding: '1rem' }}>
        {/* Left: Scrolling Table */}
        <section style={{ flex: 3, overflowY: 'auto', borderRight: '1px solid #ccc', paddingRight: '1rem' }}>
          <h2>User List</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '0.5rem' }}>Name</th>
                <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '0.5rem' }}>Email</th>
                <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '0.5rem' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => handleRowClick(user)} // Click to select user
                  style={{
                    cursor: 'pointer',
                    backgroundColor: selectedUser?.id === user.id ? '#f0f0f0' : 'white',
                  }}
                >
                  <td style={{ padding: '0.5rem' }}>{user.name}</td>
                  <td style={{ padding: '0.5rem' }}>{user.email}</td>
                  <td style={{ padding: '0.5rem' }}>{user.role}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ padding: '1rem', textAlign: 'center', color: '#777' }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Right: Update Form */}
        <section style={{ flex: 2, padding: '1rem', overflowY: 'auto' }}>
          <h2>{selectedUser ? 'Update User' : 'Select a User to Update'}</h2>
          {selectedUser && (
            <>
              <section style={{ marginBottom: '1rem' }}>
                <label htmlFor="name">Name:</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ marginTop: '0.5rem', width: '100%', padding: '0.5rem', border: '1px solid #ccc', boxSizing: 'border-box' }}
                />
              </section>
              <section style={{ marginBottom: '1rem' }}>
                <label htmlFor="email">Email:</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ marginTop: '0.5rem', width: '100%', padding: '0.5rem', border: '1px solid #ccc', boxSizing: 'border-box' }}
                />
              </section>
              <section style={{ marginBottom: '1rem' }}>
                <label htmlFor="role">Role:</label>
                <input
                  id="role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ marginTop: '0.5rem', width: '100%', padding: '0.5rem', border: '1px solid #ccc', boxSizing: 'border-box' }}
                />
              </section>
              <button
                onClick={handleUpdate}
                style={{
                  padding: '0.5rem 1rem',
                  width: '100%',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Update User
              </button>
            </>
          )}
        </section>
      </section>
    </>
  );
}
