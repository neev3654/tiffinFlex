/**
 * Safe wrapper for localStorage and sessionStorage
 */

export const storage = {
  local: {
    get: (key, defaultValue = null) => {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
        return defaultValue;
      }
    },
    set: (key, value) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    remove: (key) => {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.warn(`Error removing localStorage key "${key}":`, error);
      }
    },
    clear: () => {
      try {
        window.localStorage.clear();
      } catch (error) {
        console.warn('Error clearing localStorage:', error);
      }
    }
  },
  session: {
    get: (key, defaultValue = null) => {
      try {
        const item = window.sessionStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.warn(`Error reading sessionStorage key "${key}":`, error);
        return defaultValue;
      }
    },
    set: (key, value) => {
      try {
        window.sessionStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    remove: (key) => {
      try {
        window.sessionStorage.removeItem(key);
      } catch (error) {
        console.warn(`Error removing sessionStorage key "${key}":`, error);
      }
    },
    clear: () => {
      try {
        window.sessionStorage.clear();
      } catch (error) {
        console.warn('Error clearing sessionStorage:', error);
      }
    }
  }
};
