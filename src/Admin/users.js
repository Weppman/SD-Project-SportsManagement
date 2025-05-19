import React, { useState, useEffect } from 'react';
import Toolbar from '../ToolBar/toolBar';
import AdminToolbar from '../Admin/adminToolBar';
import '../Admin/users.css'; 

export default function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); 
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://getenricheduserauthdata-mokwbj4tsa-uc.a.run.app/');
        if (!response.ok) {
          throw new Error('Cannot access Users database');
        }
        const data = await response.json();
        const enrichedUsers = data.users.map((user) => ({
          id: user.id,
          displayName: user.displayName,
          UserType: user.UserType || 'user',
        }));
        setUsers(enrichedUsers);
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
      id: selectedUser.id,
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

      // Refresh user list after update
      const updatedResponse = await fetch('https://getenricheduserauthdata-mokwbj4tsa-uc.a.run.app/');
      const updatedData = await updatedResponse.json();
      const refreshedUsers = updatedData.users.map((user) => ({
        id: user.id,
        displayName: user.displayName,
        UserType: user.UserType || 'user',
      }));
      setUsers(refreshedUsers);
      setSelectedUser(null);
      setRole('');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <>
      <Toolbar />
      <AdminToolbar />
      <section className="main-container">
        <section className="user-list-section">
          <h2>User List</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => handleRowClick(user)}
                  className={selectedUser?.id === user.id ? 'selected' : ''}
                >
                  <td>{user.id}</td>
                  <td>{user.displayName}</td>
                  <td>{user.UserType}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="3" className="no-users" data-testid="no-users">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section className="update-section">
          <h2>{selectedUser ? 'Update User' : 'Select a User to Update'}</h2>
          {selectedUser && (
            <>
              <section>
                <label htmlFor="role">Role:</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="role-select"
                >
                  <option value="user">user</option>
                  <option value="staff">staff</option>
                  <option value="admin">admin</option>
                </select>
              </section>
              <button
                onClick={handleUpdate}
                className="update-button"
                data-testid="update-button"
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
