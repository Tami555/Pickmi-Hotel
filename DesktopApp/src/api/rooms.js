export const RoomsAPI = {

  async getRoomTypes() {
    try {
      const data = await window.electronAPI.apiRequest(
        '/room-types/', // ВАЖНО: слэш в конце
        'GET'
      );

      return data;
    } catch (e) {
      console.error("getRoomTypes error:", e);
      return [];
    }
  },

  async getRoomsByType(slug) {
    try {
      const data = await window.electronAPI.apiRequest(
        `/rooms/occupancy/by-type/${slug}`,
        'GET'
      );

      return data;
    } catch (e) {
      console.error("getRoomsByType error:", e);
      return {
        percentage_occupied: 0,
        rooms: []
      };
    }
  }

};