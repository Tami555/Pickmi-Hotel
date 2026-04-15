const API_PREFIX = "/api/v1/reports";

function buildQuery(params = {}) {
  const q = new URLSearchParams();

  if (params.start_date) q.append("start_date", params.start_date);
  if (params.end_date) q.append("end_date", params.end_date);

  return q.toString();
}

async function request(endpoint, params) {
  const query = buildQuery(params);
  const url = query ? `${endpoint}?${query}` : endpoint;

  return await window.electronAPI.apiRequest(url, "GET");
}

// ===== REPORTS API =====
export const ReportsAPI = {
  getRooms: (params) => request(`${API_PREFIX}/rooms`, params),
  getEmployees: (params) => request(`${API_PREFIX}/employees`, params),
  getServices: (params) => request(`${API_PREFIX}/services`, params)
};
