import { apiRequest } from './base.js';

export function login(email, password) {
  return apiRequest(
    '/auth/login/',
    'POST',
    { email, password }
  );
}

export function refreshToken() {
  const refresh = localStorage.getItem('refresh_token');

  return apiRequest(
    '/auth/refresh/',
    'POST',
    { token: refresh }
  );
}