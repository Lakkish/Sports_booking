import api from "./apiClient";

/**
 * Coach service
 */

/**
 * Get all coaches
 * @param {boolean} activeOnly - Filter only active coaches
 * @returns {Promise<object>} List of coaches
 */
export const getCoaches = async (activeOnly = true) => {
  const response = await api.get("/coaches", {
    params: { activeOnly },
  });
  return response.data;
};

/**
 * Get coach by ID
 * @param {string} coachId
 * @returns {Promise<object>} Coach details
 */
export const getCoachById = async (coachId) => {
  const response = await api.get(`/coaches/${coachId}`);
  return response.data;
};

/**
 * Create a new coach (admin only)
 * @param {object} coachData - Coach details
 * @returns {Promise<object>} Created coach
 */
export const createCoach = async (coachData) => {
  const response = await api.post("/coaches", coachData);
  return response.data;
};

/**
 * Update coach (admin only)
 * @param {string} coachId
 * @param {object} coachData - Updated coach data
 * @returns {Promise<object>} Updated coach
 */
export const updateCoach = async (coachId, coachData) => {
  const response = await api.put(`/coaches/${coachId}`, coachData);
  return response.data;
};

/**
 * Toggle coach active status (admin only)
 * @param {string} coachId
 * @returns {Promise<object>} Updated coach
 */
export const toggleCoachStatus = async (coachId) => {
  const response = await api.patch(`/coaches/${coachId}/status`);
  return response.data;
};

/**
 * Delete coach (admin only)
 * @param {string} coachId
 * @returns {Promise<object>} Deletion result
 */
export const deleteCoach = async (coachId) => {
  const response = await api.delete(`/coaches/${coachId}`);
  return response.data;
};

/**
 * Get coach availability
 * @param {string} coachId
 * @param {string} date - YYYY-MM-DD format
 * @returns {Promise<object>} Coach availability
 */
export const getCoachAvailability = async (coachId, date) => {
  const response = await api.get(`/coaches/${coachId}/availability`, {
    params: { date },
  });
  return response.data;
};
