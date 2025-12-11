/**
 * LocalStorage utility functions
 */

/**
 * Save data to localStorage with expiration
 * @param {string} key
 * @param {any} data
 * @param {number} expiryHours - Hours until expiry (optional)
 */
export const saveToStorage = (key, data, expiryHours = null) => {
  try {
    const item = {
      data,
      timestamp: expiryHours ? Date.now() : null,
      expiry: expiryHours ? Date.now() + expiryHours * 60 * 60 * 1000 : null,
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

/**
 * Retrieve data from localStorage
 * @param {string} key
 * @returns {any|null}
 */
export const getFromStorage = (key) => {
  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);

    // Check if item has expired
    if (item.expiry && Date.now() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.data;
  } catch (error) {
    console.error("Error retrieving from localStorage:", error);
    return null;
  }
};

/**
 * Remove item from localStorage
 * @param {string} key
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
};

/**
 * Clear all app-related data from localStorage
 */
export const clearAppStorage = () => {
  const keys = ["token", "user", "bookingData", "selectedDate"];
  keys.forEach((key) => localStorage.removeItem(key));
};

/**
 * Save booking draft
 * @param {object} bookingData
 */
export const saveBookingDraft = (bookingData) => {
  saveToStorage("bookingDraft", bookingData, 24); // Expires in 24 hours
};

/**
 * Get booking draft
 * @returns {object|null}
 */
export const getBookingDraft = () => {
  return getFromStorage("bookingDraft");
};

/**
 * Clear booking draft
 */
export const clearBookingDraft = () => {
  removeFromStorage("bookingDraft");
};
