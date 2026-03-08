// Базовый url
const BACKEND_URL = "http://127.0.0.1:8000/api/"
const API_VERSION = "v1"

export const getBackendUrl = (endpoint) => BACKEND_URL + API_VERSION + endpoint;

export const ROOMS_ENDPOINTS = {
  ROOMS_TYPES: '/room-types',
};

export const USER_ENDPOINTS = {
  LOGIN: '/auth/login/',
};
