import React, { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getStoredUser, clearStoredUser } from '@/context/storageUtils'; // Assuming clearStoredUser is for full logout

const AuthManager = ({ children }) => {
  const { setIsAuthenticated, setUserProfile } = useAppContext();

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUserProfile(storedUser);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setUserProfile(null);
      // Optionally, you might want to clear any other session-specific data here
      // clearStoredUser(); // Only if you want to ensure all traces are gone on initial load without user
    }
  }, [setIsAuthenticated, setUserProfile]);

  return <>{children}</>;
};

export default AuthManager;