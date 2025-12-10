import api from "./apiClient";
export const getPricingRules = () => api.get("/pricing-rules");
