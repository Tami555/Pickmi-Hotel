import { apiRequest } from "../api/base.js";

// ГОСТИ
export const getGuests = () =>
  apiRequest("/users/guests/", "GET");

export const getGuestById = (id) =>
  apiRequest(`/users/guests/${id}`, "GET");

export const updateGuest = (id, data) =>
  apiRequest(`/users/guests/edit/${id}`, "PATCH", data);

// БРОНИ
export const getGuestReservations = (id) =>
  apiRequest(`/users/guests/${id}/reservations`, "GET");

export const cancelReservation = (id) =>
  apiRequest(`/reservations/${id}/cancel`, "PATCH", {});

// УСЛУГИ
export const getGuestTasks = (id) =>
  apiRequest(`/users/guests/${id}/tasks`, "GET");

export const cancelTask = (id) =>
  apiRequest(`/tasks/canceled?tasks_id=${id}`, "PATCH", {});
