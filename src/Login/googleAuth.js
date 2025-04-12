import React from 'react';
import { auth, googleProvider } from '../Firebase/firebaseApp';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const GoogleSignIn = () => {
    const navigate = useNavigate();  // Initialize useNavigate hook

    const handleGoogleSignIn = async () => {
        try {
          const result = await signInWithPopup(auth, googleProvider);
          if (result.user) {
            navigate('/test');  
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