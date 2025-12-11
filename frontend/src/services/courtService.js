import api from "./apiClient";

/**
 * Court service
 */

/**
 * Get all courts
 * @param {boolean} activeOnly - Filter only active courts
 * @returns {Promise<object>} List of courts
 */
export const getCourts = async (activeOnly = true) => {
  const response = await api.get("/courts", {
    params: { activeOnly },
  });
  return response.data;
};

/**
 * Get court by ID
 * @param {string} courtId
 * @returns {Promise<object>} Court details
 */
export const getCourtById = async (courtId) => {
  const response = await api.get(`/courts/${courtId}`);
  return response.data;
};

/**
 * Create a new court (admin only)
 * @param {object} courtData - Court details
 * @returns {Promise<object>} Created court
 */
export const createCourt = async (courtData) => {
  const response = await api.post("/courts", courtData);
  return response.data;
};

/**
 * Update court (admin only)
 * @param {string} courtId
 * @param {object} courtData - Updated court data
 * @returns {Promise<object>} Updated court
 */
export const updateCourt = async (courtId, courtData) => {
  const response = await api.put(`/courts/${courtId}`, courtData);
  return response.data;
};

/**
 * Toggle court active status (admin only)
 * @param {string} courtId
 * @returns {Promise<object>} Updated court
 */
export const toggleCourtStatus = async (courtId) => {
  const response = await api.patch(`/courts/${courtId}/status`);
  return response.data;
};

/**
 * Delete court (admin only)
 * @param {string} courtId
 * @returns {Promise<object>} Deletion result
 */
export const deleteCourt = async (courtId) => {
  const response = await api.delete(`/courts/${courtId}`);
  return response.data;
};

/**
 * Get court types
 * @returns {Promise<object>} Available court types
 */
export const getCourtTypes = async () => {
  const response = await api.get("/courts/types");
  return response.data;
};
