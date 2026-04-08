// Базовый url
const BACKEND_URL = "http://127.0.0.1:8000/api/"
const API_VERSION = "v1"

export const getApiBase = BACKEND_URL + API_VERSION;
export const getBackendUrl = (endpoint) => getApiBase + endpoint;

export const ROOMS_ENDPOINTS = {
  ROOMS_TYPES: '/room-types',
  ROOMS_AVAILABLE_COUNT: '/room-types/rooms/available/count',
  ROOMS_AVAILABLE_BY_TYPE: '/rooms/available/by-type/'
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
  CANCEL_SERVICE: '/tasks/:id/canceled',
  CREATE_SERVICE: '/tasks',
  CATEGORIES_SERVICES: '/services-categories/',
  SERVICES_BY_CATEGORY: '/services-categories/:id/services',
  SERVICE_BY_SLUG: '/services/:id',
}

export const RESERVATIONS_ENDPOINTS = {
  CURRENT_USER_RESERVATION: '/users/guests/profile/reservations',
  CURRENT_USER_ACTIVE_RESERVATION: '/users/guests/profile/active/reservations',
  CREATE_RESERVATION : '/reservations/',
  CANCEL_RESERVATION: '/reservations/:id/cancel'
}

