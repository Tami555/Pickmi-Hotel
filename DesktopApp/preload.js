const { contextBridge } = require('electron');

const API_URL = 'http://localhost:8000/api/v1';

// =====================
// TOKEN HELPERS
// =====================
function getAccessToken() {
  return localStorage.getItem('access_token');
}

function getRefreshToken() {
  return localStorage.getItem('refresh_token');
}

function setAccessToken(token) {
  localStorage.setItem('access_token', token);
}

function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

// =====================
// REFRESH TOKEN
// =====================
async function refreshAccessToken() {
  const refresh = getRefreshToken();

  if (!refresh) {
    throw new Error("No refresh token");
  }

  const res = await fetch(`${API_URL}/auth/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token: refresh
    })
  });

  if (!res.ok) {
    clearTokens();
    throw new Error("Refresh expired");
  }

  const data = await res.json();
  setAccessToken(data.access_token);

  return data.access_token;
}

// =====================
// CORE REQUEST
// =====================
async function apiRequest(
  endpoint,
  method = 'GET',
  body = null,
  responseType = null
) {
  let token = getAccessToken();

  const makeRequest = async (token) => {
    return fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: body ? JSON.stringify(body) : undefined
    });
  };

  let response = await makeRequest(token);

  // 🔁 AUTO REFRESH
  if (response.status === 401) {
    try {
      const newToken = await refreshAccessToken();
      response = await makeRequest(newToken);
    } catch (e) {
      clearTokens();
      throw new Error("Unauthorized - please login again");
    }
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }

  const contentType = response.headers.get("content-type") || "";

  if (responseType === "blob" || contentType.includes("application/pdf")) {
    return await response.blob();
  }

  if (responseType === "json" || contentType.includes("application/json")) {
    return await response.json();
  }

  return await response.json();
}

// =====================
// EXPOSE
// =====================
contextBridge.exposeInMainWorld('electronAPI', {
  apiRequest
});