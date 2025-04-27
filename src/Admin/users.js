import React, { useState, useEffect } from 'react';
import Toolbar from '../ToolBar/toolBar';
import AdminToolbar from '../Admin/adminToolBar'

export default function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); 
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://getuserdatafull-mokwbj4tsa-uc.a.run.app');
        if (!response.ok) {
          throw new Error('Cannot access Users database');
        }
        const data = await response.json();
        setUsers(data); 
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers(); 
  }, []);

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setRole(user.UserType);
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;
  
    const updatedUser = {
      ...selectedUser,
      UserType: role,
    };
  
    try {
      const response = await fetch('https://updateuserdata-mokwbj4tsa-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
  
      const updatedUsersResponse = await fetch('https://getuserdatafull-mokwbj4tsa-uc.a.run.app');
      const updatedUsersData = await updatedUsersResponse.json();
      
      const fixedData = updatedUsersData.map(user => ({
        UUID: user.UUID || Date.now(),
        UserType: user.UserType || '',
      }));
  
      setUsers(fixedData);
      setSelectedUser(null);
      setRole('');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <>
      <Toolbar />
      <AdminToolbar/>
      <section style={{ display: 'flex', height: 'calc(100vh - 60px)', padding: '1rem' }}>
        <section style={{ flex: 3, overflowY: 'auto', borderRight: '1px solid #ccc', paddingRight: '1rem' }}>
          <h2>User List</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '0.5rem' }}>ID</th>
                <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '0.5rem' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.UUID}
                  onClick={() => handleRowClick(user)} 
                  style={{
                    cursor: 'pointer',
                    backgroundColor: selectedUser?.UUID === user.UUID ? '#f0f0f0' : 'white',
                  }}
                >
                  <td style={{ padding: '0.5rem' }}>{user.UUID}</td>
                  <td style={{ padding: '0.5rem' }}>{user.UserType}</td>
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

        <section style={{ flex: 2, padding: '1rem', overflowY: 'auto' }}>
          <h2>{selectedUser ? 'Update User' : 'Select a User to Update'}</h2>
          {selectedUser && (
            <>
              <section style={{ marginBottom: '1rem' }}>
                <label htmlFor="role">Role:</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ marginTop: '0.5rem', width: '100%', padding: '0.5rem', border: '1px solid #ccc', boxSizing: 'border-box' }}
                >
                  <option value="user">user</option>
                  <option value="staff">staff</option>
                  <option value="admin">admin</option>
                </select>
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
