import api from "./apiClient";

/**
 * Booking service
 */

/**
 * Create a new booking
 * @param {object} bookingData - Booking details
 * @returns {Promise<object>} Created booking
 */
export const createBooking = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

/**
 * Get user's bookings
 * @param {string} userId - Optional, defaults to current user
 * @returns {Promise<object>} User bookings
 */
export const getUserBookings = async (userId = null) => {
  const url = userId ? `/bookings/user/${userId}` : "/bookings/my-bookings";
  const response = await api.get(url);
  return response.data;
};

/**
 * Get booking by ID
 * @param {string} bookingId
 * @returns {Promise<object>} Booking details
 */
export const getBookingById = async (bookingId) => {
  const response = await api.get(`/bookings/${bookingId}`);
  return response.data;
};

/**
 * Cancel a booking
 * @param {string} bookingId
 * @returns {Promise<object>} Cancelled booking
 */
export const cancelBooking = async (bookingId) => {
  const response = await api.patch(`/bookings/${bookingId}/cancel`);
  return response.data;
};

/**
 * Calculate booking price
 * @param {object} bookingData - Partial booking data for calculation
 * @returns {Promise<object>} Price breakdown
 */
export const calculatePrice = async (bookingData) => {
  const response = await api.post("/bookings/calculate-price", bookingData);
  return response.data;
};

/**
 * Get available time slots for a court
 * @param {string} courtId
 * @param {string} date - YYYY-MM-DD format
 * @returns {Promise<object>} Available time slots
 */
export const getAvailableTimeSlots = async (courtId, date) => {
  const response = await api.get(`/bookings/available-slots/${courtId}`, {
    params: { date },
  });
  return response.data;
};

/**
 * Get all bookings (admin only)
 * @param {object} filters - Optional filters
 * @returns {Promise<object>} All bookings
 */
export const getAllBookings = async (filters = {}) => {
  const response = await api.get("/bookings", { params: filters });
  return response.data;
};

/**
 * Update booking status (admin only)
 * @param {string} bookingId
 * @param {string} status - New status
 * @returns {Promise<object>} Updated booking
 */
export const updateBookingStatus = async (bookingId, status) => {
  const response = await api.patch(`/bookings/${bookingId}/status`, { status });
  return response.data;
};
