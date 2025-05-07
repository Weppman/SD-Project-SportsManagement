import React from 'react';
import { auth, googleProvider } from '../Firebase/firebaseApp';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext'; // To set userType
import './loginStyles.css';

const GoogleSignIn = () => {
  const navigate = useNavigate();
  const { setUserType } = useUser(); // Get context setter

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      if (result.user) {
        const user = result.user;
        const uid = user.uid;

        const response = await fetch(`https://getuserdatauuid-mokwbj4tsa-uc.a.run.app ?UUID=${uid}`);
        
        if (response.status === 404) {
          // User doesn't exist, create with 'default' role
          await fetch('https://adduserdata-mokwbj4tsa-uc.a.run.app', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              UUID: uid,
              name: user.displayName,
              role: 'user'
            })
          });

          setUserType('default');
          navigate('/home');
        } else if (response.ok) {
            // User exists, get role
           const data = await response.json();
           setUserType(data.role);
        
            navigate('/home');
          }
        } else {
          console.error('Unexpected status code:', response.status);
        }
      }
    } catch (error) {
      console.error('Google sign-in failed:', error);
    }
  };

  return (
    <button onClick={handleGoogleSignIn}>
      Sign In with Google
    </button>
  );
};

export default GoogleSignIn;
