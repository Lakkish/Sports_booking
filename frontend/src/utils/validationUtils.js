/**
 * Validation utilities for forms
 */

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password
 * @returns {object} {isValid: boolean, message: string}
 */
export const validatePassword = (password) => {
  if (password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters long",
    };
  }

  if (!/(?=.*[a-z])/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }

  if (!/(?=.*\d)/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }

  return { isValid: true, message: "" };
};

/**
 * Validate name (letters and spaces only)
 * @param {string} name
 * @returns {boolean}
 */
export const validateName = (name) => {
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  return nameRegex.test(name);
};

/**
 * Validate phone number (Indian format)
 * @param {string} phone
 * @returns {boolean}
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate booking time slot
 * @param {object} timeSlot
 * @returns {object} {isValid: boolean, message: string}
 */
export const validateTimeSlot = (timeSlot) => {
  if (!timeSlot.start || !timeSlot.end) {
    return { isValid: false, message: "Please select a time slot" };
  }

  const start = new Date(timeSlot.start);
  const end = new Date(timeSlot.end);
  const now = new Date();

  if (start < now) {
    return { isValid: false, message: "Cannot book past time slots" };
  }

  if (end <= start) {
    return { isValid: false, message: "End time must be after start time" };
  }

  return { isValid: true, message: "" };
};

/**
 * Validate equipment quantity
 * @param {number} quantity
 * @param {number} maxStock
 * @returns {object} {isValid: boolean, message: string}
 */
export const validateEquipmentQuantity = (quantity, maxStock) => {
  if (quantity < 0) {
    return { isValid: false, message: "Quantity cannot be negative" };
  }

  if (quantity > maxStock) {
    return {
      isValid: false,
      message: `Maximum available stock is ${maxStock}`,
    };
  }

  return { isValid: true, message: "" };
};
