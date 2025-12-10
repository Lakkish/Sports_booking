import api from "./apiClient";

export const createBooking = (data) => api.post("/bookings", data);
export const getUserBookings = (id) => api.get(`/bookings/user/${id}`);
