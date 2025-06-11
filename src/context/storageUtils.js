import { 
  initialPersonnel, 
  initialProjects, 
  initialMaterials, 
  initialFinances, 
  initialLabTests, 
  initialMarketplaceItems,
  initialLabAppointments,
  initialLabServices,
  initialUserTasks,
  initialUserTimeLogs,
  initialUserPayments,
  initialSiteTasks
} from './initialData';
import { DATA_SLICES_TO_PERSIST, USER_STORAGE_KEY } from './appContextConstants';


const defaultDataMap = {
  personnel: initialPersonnel,
  projects: initialProjects,
  materials: initialMaterials,
  finances: initialFinances,
  labTests: initialLabTests,
  marketplace: initialMarketplaceItems,
  labAppointments: initialLabAppointments,
  labServices: initialLabServices,
  userTasks: initialUserTasks,
  userTimeLogs: initialUserTimeLogs,
  userPayments: initialUserPayments,
  siteTasks: initialSiteTasks,
};

// ALL_APP_STORAGE_KEYS should be the values from DATA_SLICES_TO_PERSIST
const ALL_APP_STORAGE_KEYS = Object.values(DATA_SLICES_TO_PERSIST);


export function loadDataFromStorage(storageKeysToLoad) {
  const loadedData = {};
  const errors = {};

  // Find the slice key (e.g., 'projects') for a given storage key (e.g., 'constructProProjects')
  const getSliceKeyFromStorageKey = (storageKey) => {
    return Object.keys(DATA_SLICES_TO_PERSIST).find(key => DATA_SLICES_TO_PERSIST[key] === storageKey);
  };
  
  storageKeysToLoad.forEach(storageKey => {
    const sliceKey = getSliceKeyFromStorageKey(storageKey);
    if (!sliceKey) {
      console.warn(`No slice key mapping found for storage key: ${storageKey}`);
      return; // Skip if no mapping
    }

    try {
      const storedData = localStorage.getItem(storageKey);
      if (storedData) {
        loadedData[sliceKey] = JSON.parse(storedData);
      } else {
        loadedData[sliceKey] = defaultDataMap[sliceKey] || [];
      }
    } catch (error) {
      console.error(`Error loading ${sliceKey} (from ${storageKey}) from localStorage:`, error);
      errors[sliceKey] = `Failed to load ${sliceKey} data. Using default values.`;
      loadedData[sliceKey] = defaultDataMap[sliceKey] || [];
    }
  });
  
  return { ...loadedData, error: Object.keys(errors).length > 0 ? errors : null };
}

export function saveDataToStorage(key, data) {
  try {
    if (data === undefined) {
      console.warn(`Attempted to save undefined data for key: ${key}. Skipping.`);
      return;
    }
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

export function getStoredUser() {
  try {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Error getting stored user from localStorage:', error);
    return null;
  }
}

export function setStoredUser(user) {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error setting stored user in localStorage:', error);
  }
}

export function clearStoredUser() {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch (error)
    {
    console.error('Error clearing stored user from localStorage:', error);
  }
}

export function clearAllAppData() {
  try {
    ALL_APP_STORAGE_KEYS.forEach(key => {
      localStorage.removeItem(key);
    });
    console.log("All application data slices cleared from localStorage.");
  } catch (error) {
    console.error('Error clearing all app data from localStorage:', error);
  }
}

export function clearSpecificAppData(storageKey) {
  try {
    localStorage.removeItem(storageKey);
    console.log(`Cleared data for key: ${storageKey}`);
  } catch (error) {
    console.error(`Error clearing data for key ${storageKey}:`, error);
  }
}