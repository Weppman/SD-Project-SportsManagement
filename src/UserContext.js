// UserContext.js
import React, { createContext, useContext, useState } from 'react';

// Create the UserContext
export const UserContext = createContext();

// Custom hook to access the context
export const useUser = () => {
  return useContext(UserContext);
};

// Provider component
export const UserProvider = ({ children }) => {
  const [basename] = useState('default'); // Example value for basename
  const [userType, setUserType] = useState('default'); // Example value for userType

  return (
    <UserContext.Provider value={{ basename, userType, setUserType }}>
      {children}
    </UserContext.Provider>
  );

  
};
