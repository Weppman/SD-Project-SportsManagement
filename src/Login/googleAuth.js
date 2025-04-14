import React from 'react';
import { auth, googleProvider } from '../Firebase/firebaseApp';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './loginStyles.css';

const GoogleSignIn = () => {
    const navigate = useNavigate();  // Initialize useNavigate hook

    const handleGoogleSignIn = async () => {
        try {
          const result = await signInWithPopup(auth, googleProvider);
          if (result.user) {
            navigate('/home');  
          }
        } catch (error) {
          console.error(error);
        }
      };

  return (
    <button onClick={handleGoogleSignIn}>
      Sign In with Google
    </button>
  );
};

export default GoogleSignIn;
