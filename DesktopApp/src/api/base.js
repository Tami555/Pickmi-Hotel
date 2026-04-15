const API_PREFIX = "/api/v1";

// универсальный запрос
export async function apiRequest(
  url,
  method = "GET",
  body = null,
  responseType = null
) {
  try {
    return await window.electronAPI.apiRequest(
      url,
      method,
      body,
      responseType
    );
  } catch (err) {
    console.error("🔥 API ERROR:", err);

    if (err.message.includes("Unauthorized")) {
      localStorage.clear();
      window.location.href = "../loginWindow/index.html";
    }

    throw err;
  }
}

// =====================
// PROFILE API
// =====================
export const ProfileAPI = {
  getProfile: () => apiRequest("/users/admin/profile"),

  updateProfile: (data) =>
    apiRequest("/users/admin/profile/edit", "PATCH", data)
};

// =====================
// STAFF API (пример)
// =====================
export const StaffAPI = {
  getAll: () => apiRequest("/users/admin/staff"),
  create: (data) => apiRequest("/users/admin/staff", "POST", data),
  delete: (id) => apiRequest(`/users/admin/staff/${id}`, "DELETE")
};

// =====================
// ROOMS API (пример)
// =====================
export const RoomsAPI = {
  getAll: () => apiRequest("/rooms"),
  create: (data) => apiRequest("/rooms", "POST", data)
};

