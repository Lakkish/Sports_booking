import api from "./apiClient";
export const getEquipment = () => api.get("/equipment");
