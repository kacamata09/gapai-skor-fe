 const setLocalStorageItem = (key, value) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error saving to local storage:', error);
      }
    }
  };
  
   const getLocalStorageItem = (key) => {
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem(key);
        return item ? (JSON.parse(item)) : null;
      } catch (error) {
        console.error('Error getting from local storage:', error);
      }
    }
    return null;
  };
  
   const removeLocalStorageItem = (key) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing from local storage:', error);
      }
    }
  };
  
  export {getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem}