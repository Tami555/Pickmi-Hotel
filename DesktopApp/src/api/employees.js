import { apiRequest } from './base.js';

// 📋 список
export function getEmployees() {
  return apiRequest('/users/employees/');
}

// 👤 один
export function getEmployeeById(id) {
  return apiRequest(`/users/employees/${id}`);
}

// ➕ создать
export function createEmployee(data) {
  return apiRequest(
    '/auth/registration/employee/',
    'POST',
    data
  );
}

// ✏️ обновить
export function updateEmployee(id, data) {
  return apiRequest(
    `/users/employees/edit/${id}`,
    'PATCH',
    data
  );
}

// 🧠 задачи
export function getEmployeeTasks(id) {
  return apiRequest(`/users/employees/${id}/tasks`);
}