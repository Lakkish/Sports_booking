import api from "./apiClient";
export const getCoaches = () => api.get("/coaches");
