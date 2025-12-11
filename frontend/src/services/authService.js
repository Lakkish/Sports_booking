import api from "./apiClient";

/**
 * Authentication service
 */

/**
 * User login
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} User data and token
 */
export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

/**
 * User registration
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} Created user data
 */
export const signup = async (name, email, password) => {
  const response = await api.post("/auth/signup", { name, email, password });
  return response.data;
};

/**
 * Get current user profile
 * @returns {Promise<object>} User profile
 */
export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

/**
 * Update user profile
 * @param {object} userData - Updated user data
 * @returns {Promise<object>} Updated user
 */
export const updateProfile = async (userData) => {
  const response = await api.put("/auth/profile", userData);
  return response.data;
};

/**
 * Change password
 * @param {string} currentPassword
 * @param {string} newPassword
 * @returns {Promise<object>}
 */
export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.post("/auth/change-password", {
    currentPassword,
    newPassword,
  });
  return response.data;
};

/**
 * Logout user (client-side only)
 */
export const logout = () => {
  // This is client-side logout
  // Server-side token invalidation would require an API call
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
