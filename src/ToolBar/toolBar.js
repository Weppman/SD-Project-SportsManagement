import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';
import GoogleSignIn from '../Login/googleAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase/firebaseApp'; 
import { useNavigate } from 'react-router-dom';

const navStyle = {
  display: 'flex',
  gap: '1.5rem',
};






const Toolbar = () => {
  const userType = useUser().userType; 
  const { setUserType } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);              
      setUserType('default');          
      navigate('/');                   
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  return (
    <header style={{
      backgroundColor: '#ffffff',
      color: '#0A475A',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      
      <nav style={navStyle}>
        {/* Common links for all users */}
        <Link to="/">Home</Link>
        
        


        {/* Staff-specific links */}
        {(userType === 'staff' || userType === 'admin' || userType === "user") && (
             <>
             <Link to="/issues">Issues</Link>
             <Link to="/bookings">Bookings</Link>
             <Link to="/facilities">Facilities</Link>
           </>
        )}


        {(userType === 'staff' || userType === 'admin') && (
          <Link to="/updates">Updates</Link>
        )}

        {/* Admin-specific links */}
        {userType === 'admin' && (
          <Link to="/admin">Admin</Link>
        )}
      </nav>
      {(userType === 'default') && (
        <section>
          <GoogleSignIn/>
        </section>
      )}
      {!(userType === 'default') && (
        <section>
        <button onClick={handleLogout}>Logout</button>
      </section>
      )}

    </header>
  );
};

export default Toolbar;
