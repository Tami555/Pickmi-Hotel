// Базовый url
const BACKEND_URL = "http://127.0.0.1:8000/api/"
const API_VERSION = "v1"

export const getApiBase = BACKEND_URL + API_VERSION;
export const getBackendUrl = (endpoint) => getApiBase + endpoint;

export const ROOMS_ENDPOINTS = {
  ROOMS_TYPES: '/room-types',
};

export const USER_ENDPOINTS = {
  LOGIN: '/auth/login/',
  REGISTRATION: '/auth/registration/guest/',
  VERIFY: '/auth/verify',
  REFRESH: '/auth/refresh/',
  PROFILE: '/users/guests/profile',
  PROFILE_EDIT: '/users/guests/profile/edit'
};

export const SERVICES_ENDPOINTS = {
  CURRENT_USER_SERVICES: '/users/guests/profile/tasks',

}
