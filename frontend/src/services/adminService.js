import api from "./apiClient";

/**
 * Admin service for dashboard and admin operations
 */

/**
 * Get admin dashboard statistics
 * @returns {Promise<object>} Dashboard stats
 */
export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard/stats");
  return response.data;
};

/**
 * Get recent bookings for admin dashboard
 * @param {number} limit - Number of recent bookings to fetch
 * @returns {Promise<object>} Recent bookings
 */
export const getRecentBookings = async (limit = 10) => {
  const response = await api.get("/admin/bookings/recent", {
    params: { limit },
  });
  return response.data;
};

/**
 * Get revenue statistics
 * @param {string} period - 'daily', 'weekly', 'monthly'
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<object>} Revenue data
 */
export const getRevenueStats = async (
  period = "monthly",
  startDate,
  endDate
) => {
  const response = await api.get("/admin/revenue", {
    params: { period, startDate, endDate },
  });
  return response.data;
};

/**
 * Get user statistics
 * @returns {Promise<object>} User stats
 */
export const getUserStats = async () => {
  const response = await api.get("/admin/users/stats");
  return response.data;
};

/**
 * Get all users (admin only)
 * @param {object} filters - Optional filters
 * @returns {Promise<object>} List of users
 */
export const getAllUsers = async (filters = {}) => {
  const response = await api.get("/admin/users", { params: filters });
  return response.data;
};

/**
 * Update user role (admin only)
 * @param {string} userId
 * @param {string} role - New role
 * @returns {Promise<object>} Updated user
 */
export const updateUserRole = async (userId, role) => {
  const response = await api.patch(`/admin/users/${userId}/role`, { role });
  return response.data;
};

/**
 * Toggle user active status (admin only)
 * @param {string} userId
 * @returns {Promise<object>} Updated user
 */
export const toggleUserStatus = async (userId) => {
  const response = await api.patch(`/admin/users/${userId}/status`);
  return response.data;
};
