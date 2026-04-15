const API_PREFIX = "/users/admin";

export const ProfileAPI = {

  getProfile: async () => {
    return await window.electronAPI.apiRequest(
      `${API_PREFIX}/profile`
    );
  },

  updateProfile: async (data) => {
    return await window.electronAPI.apiRequest(
      `${API_PREFIX}/profile/edit`,
      "PATCH",
      data
    );
  }

};