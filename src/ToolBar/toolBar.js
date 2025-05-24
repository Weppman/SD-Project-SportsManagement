import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import GoogleSignIn from '../Login/googleAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase/firebaseApp';

const navStyle = {
  display: 'flex',
  gap: '1.5rem',
  fontWeight: 'bold',  // fixed typo
  padding: '0.5rem',
};

const Toolbar = () => {
  const { userType, setUserType, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserType('default');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        color: '#0A475A',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '100%',
        overflowX: 'hidden',
        overflowY: 'hidden',
      }}
    >
      <nav style={navStyle}>
        <Link to="/">Home</Link>

        {(userType === 'staff' || userType === 'admin' || userType === 'user') && (
          <>
            <Link to="/issues">Issues</Link>
            <Link to="/bookings">Bookings</Link>
            <Link to="/facilities">Facilities</Link>
          </>
        )}

        {(userType === 'staff' || userType === 'admin') && <Link to="/updates">Updates</Link>}

        {userType === 'admin' && <Link to="/admin">Admin</Link>}
      </nav>

      {userType === 'default' ? (
        <section>
          <GoogleSignIn />
        </section>
      ) : (
        <section>
          <button onClick={handleLogout}>Logout</button>
        </section>
      )}
    </header>
  );
};

export default Toolbar;
