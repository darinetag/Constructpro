import { USER_STORAGE_KEY } from '@/context/appContextConstants';

export const loadUserFromStorage = () => {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      return { user: parsedUser, authenticated: true };
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      localStorage.removeItem(USER_STORAGE_KEY);
      return { user: null, authenticated: false };
    }
  }
  return { user: null, authenticated: false };
};

export const saveUserToStorage = (userProfile) => {
  if (userProfile) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userProfile));
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
};

export const handleLogin = (profile, setUserProfileState, setIsAuthenticatedState) => {
  setUserProfileState(profile);
  setIsAuthenticatedState(true);
  saveUserToStorage(profile);
};

export const handleLogout = (setUserProfileState, setIsAuthenticatedState) => {
  localStorage.removeItem(USER_STORAGE_KEY);
  setUserProfileState(null);
  setIsAuthenticatedState(false);
};