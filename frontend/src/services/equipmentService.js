import api from "./apiClient";

/**
 * Equipment service
 */

/**
 * Get all equipment
 * @param {boolean} inStockOnly - Filter only equipment with stock > 0
 * @returns {Promise<object>} List of equipment
 */
export const getEquipment = async (inStockOnly = false) => {
  const response = await api.get("/equipment", {
    params: { inStockOnly },
  });
  return response.data;
};

/**
 * Get equipment by ID
 * @param {string} equipmentId
 * @returns {Promise<object>} Equipment details
 */
export const getEquipmentById = async (equipmentId) => {
  const response = await api.get(`/equipment/${equipmentId}`);
  return response.data;
};

/**
 * Create new equipment (admin only)
 * @param {object} equipmentData - Equipment details
 * @returns {Promise<object>} Created equipment
 */
export const createEquipment = async (equipmentData) => {
  const response = await api.post("/equipment", equipmentData);
  return response.data;
};

/**
 * Update equipment (admin only)
 * @param {string} equipmentId
 * @param {object} equipmentData - Updated equipment data
 * @returns {Promise<object>} Updated equipment
 */
export const updateEquipment = async (equipmentId, equipmentData) => {
  const response = await api.put(`/equipment/${equipmentId}`, equipmentData);
  return response.data;
};

/**
 * Update equipment stock (admin only)
 * @param {string} equipmentId
 * @param {number} quantity - New stock quantity
 * @returns {Promise<object>} Updated equipment
 */
export const updateEquipmentStock = async (equipmentId, quantity) => {
  const response = await api.patch(`/equipment/${equipmentId}/stock`, {
    quantity,
  });
  return response.data;
};

/**
 * Delete equipment (admin only)
 * @param {string} equipmentId
 * @returns {Promise<object>} Deletion result
 */
export const deleteEquipment = async (equipmentId) => {
  const response = await api.delete(`/equipment/${equipmentId}`);
  return response.data;
};

/**
 * Check equipment availability
 * @param {Array} equipmentItems - Array of {equipmentId, quantity}
 * @param {string} startTime - ISO string
 * @param {string} endTime - ISO string
 * @returns {Promise<object>} Availability status
 */
export const checkEquipmentAvailability = async (
  equipmentItems,
  startTime,
  endTime
) => {
  const response = await api.post("/equipment/availability", {
    equipment: equipmentItems,
    startTime,
    endTime,
  });
  return response.data;
};
