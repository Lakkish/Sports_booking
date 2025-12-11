/**
 * Date utility functions for the booking system
 */

/**
 * Format date to YYYY-MM-DD string
 * @param {Date} date
 * @returns {string}
 */
export const formatDateToInput = (date) => {
  return date.toISOString().split("T")[0];
};

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string}
 */
export const getTodayDate = () => {
  return formatDateToInput(new Date());
};

/**
 * Get tomorrow's date in YYYY-MM-DD format
 * @returns {string}
 */
export const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDateToInput(tomorrow);
};

/**
 * Format time slot for display
 * @param {string} startTime - ISO string
 * @param {string} endTime - ISO string
 * @returns {string}
 */
export const formatTimeSlot = (startTime, endTime) => {
  if (!startTime || !endTime) return "";

  const start = new Date(startTime);
  const end = new Date(endTime);

  return `${start.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })} - ${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

/**
 * Create ISO time string from date and hour
 * @param {string} dateStr - YYYY-MM-DD
 * @param {string} hourStr - HH:00
 * @returns {string}
 */
export const createTimeISO = (dateStr, hourStr) => {
  return `${dateStr}T${hourStr}:00`;
};

/**
 * Get available time slots for a given date
 * @param {string} dateStr - YYYY-MM-DD
 * @returns {Array} Array of time slot objects
 */
export const getTimeSlotsForDate = (dateStr) => {
  const timeSlots = [];
  for (let hour = 5; hour <= 22; hour++) {
    const startHour = hour.toString().padStart(2, "0");
    const endHour = (hour + 1).toString().padStart(2, "0");

    timeSlots.push({
      label: `${startHour}:00 - ${endHour}:00`,
      start: createTimeISO(dateStr, `${startHour}:00`),
      end: createTimeISO(dateStr, `${endHour}:00`),
      value: `${startHour}:00`,
    });
  }
  return timeSlots;
};

/**
 * Check if a date is weekend
 * @param {Date} date
 * @returns {boolean}
 */
export const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
};

/**
 * Check if time is in peak hours (6 PM - 9 PM)
 * @param {string} startTime - ISO string
 * @returns {boolean}
 */
export const isPeakHour = (startTime) => {
  const hour = new Date(startTime).getHours();
  return hour >= 18 && hour < 21; // 6 PM - 9 PM
};

/**
 * Calculate hours between two dates
 * @param {string} startTime - ISO string
 * @param {string} endTime - ISO string
 * @returns {number}
 */
export const calculateHours = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return (end - start) / (1000 * 60 * 60);
};

/**
 * Format price with Indian Rupee symbol
 * @param {number} amount
 * @returns {string}
 */
export const formatPrice = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Validate date is not in the past
 * @param {string} dateStr - YYYY-MM-DD
 * @returns {boolean}
 */
export const isValidFutureDate = (dateStr) => {
  const selectedDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
};
