import api from "./apiClient";
export const getCourts = () => api.get("/courts");
