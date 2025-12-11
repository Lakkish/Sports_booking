import { useState, useCallback } from "react";
import api from "../services/apiClient";

/**
 * Custom hook for API calls with loading and error states
 * @returns {object} { callApi, isLoading, error, clearError }
 */
export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Make API call with error handling
   * @param {Function} apiCall - API function to call
   * @param {...any} args - Arguments for the API function
   * @returns {Promise<any>}
   */
  const callApi = useCallback(async (apiCall, ...args) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiCall(...args);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * GET request wrapper
   * @param {string} url
   * @param {object} config
   * @returns {Promise<any>}
   */
  const get = useCallback(
    async (url, config = {}) => {
      return callApi(api.get, url, config);
    },
    [callApi]
  );

  /**
   * POST request wrapper
   * @param {string} url
   * @param {object} data
   * @param {object} config
   * @returns {Promise<any>}
   */
  const post = useCallback(
    async (url, data, config = {}) => {
      return callApi(api.post, url, data, config);
    },
    [callApi]
  );

  /**
   * PUT request wrapper
   * @param {string} url
   * @param {object} data
   * @param {object} config
   * @returns {Promise<any>}
   */
  const put = useCallback(
    async (url, data, config = {}) => {
      return callApi(api.put, url, data, config);
    },
    [callApi]
  );

  /**
   * PATCH request wrapper
   * @param {string} url
   * @param {object} data
   * @param {object} config
   * @returns {Promise<any>}
   */
  const patch = useCallback(
    async (url, data, config = {}) => {
      return callApi(api.patch, url, data, config);
    },
    [callApi]
  );

  /**
   * DELETE request wrapper
   * @param {string} url
   * @param {object} config
   * @returns {Promise<any>}
   */
  const del = useCallback(
    async (url, config = {}) => {
      return callApi(api.delete, url, config);
    },
    [callApi]
  );

  return {
    callApi,
    get,
    post,
    put,
    patch,
    delete: del,
    isLoading,
    error,
    clearError,
  };
};
