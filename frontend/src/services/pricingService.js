import api from "./apiClient";

/**
 * Pricing service
 */

/**
 * Get all pricing rules
 * @param {boolean} activeOnly - Filter only active rules
 * @returns {Promise<object>} List of pricing rules
 */
export const getPricingRules = async (activeOnly = true) => {
  const response = await api.get("/pricing-rules", {
    params: { activeOnly },
  });
  return response.data;
};

/**
 * Get pricing rule by ID
 * @param {string} ruleId
 * @returns {Promise<object>} Pricing rule details
 */
export const getPricingRuleById = async (ruleId) => {
  const response = await api.get(`/pricing-rules/${ruleId}`);
  return response.data;
};

/**
 * Create new pricing rule (admin only)
 * @param {object} ruleData - Pricing rule details
 * @returns {Promise<object>} Created pricing rule
 */
export const createPricingRule = async (ruleData) => {
  const response = await api.post("/pricing-rules", ruleData);
  return response.data;
};

/**
 * Update pricing rule (admin only)
 * @param {string} ruleId
 * @param {object} ruleData - Updated rule data
 * @returns {Promise<object>} Updated pricing rule
 */
export const updatePricingRule = async (ruleId, ruleData) => {
  const response = await api.put(`/pricing-rules/${ruleId}`, ruleData);
  return response.data;
};

/**
 * Toggle pricing rule active status (admin only)
 * @param {string} ruleId
 * @returns {Promise<object>} Updated pricing rule
 */
export const togglePricingRuleStatus = async (ruleId) => {
  const response = await api.patch(`/pricing-rules/${ruleId}/status`);
  return response.data;
};

/**
 * Delete pricing rule (admin only)
 * @param {string} ruleId
 * @returns {Promise<object>} Deletion result
 */
export const deletePricingRule = async (ruleId) => {
  const response = await api.delete(`/pricing-rules/${ruleId}`);
  return response.data;
};

/**
 * Get pricing breakdown for specific parameters
 * @param {object} params - Pricing parameters
 * @returns {Promise<object>} Price breakdown
 */
export const getPriceBreakdown = async (params) => {
  const response = await api.post("/pricing/calculate", params);
  return response.data;
};
