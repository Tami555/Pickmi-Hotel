// Базовый url
const BACKEND_URL = "http://10.0.2.2:8000/api/";
const API_VERSION = "v1";

export const getApiBase = () => BACKEND_URL + API_VERSION;
export const getBackendUrl = (endpoint: string) => getApiBase() + endpoint;

export const ROOMS_ENDPOINTS = {
  ROOMS_TYPES: '/room-types',
};

export const USER_ENDPOINTS = {
  LOGIN: '/auth/login/',
  REGISTRATION: '/auth/registration/guest/',
  VERIFY: '/auth/verify',
  REFRESH: '/auth/refresh/',
  EMPLOYEE_PROFILE: '/users/employees/profile',  // GET
  EMPLOYEE_PROFILE_EDIT: '/users/employees/profile/edit', // PATCH
};

export const SERVICES_ENDPOINTS = {
  CURRENT_USER_SERVICES: '/users/employees/profile/tasks',
  EMPLOYEE_TASKS: (employee_id: number) => `/users/employees/${employee_id}/tasks`,
  TASK_STARTED: (task_id: number) => `/tasks/${task_id}/started`,
  TASK_COMPLETED: (task_id: number) => `/tasks/${task_id}/completed`,
}

export const RESERVATIONS_ENDPOINTS = {
  CURRENT_USER_RESERVATION: '/users/guests/profile/reservations',
}