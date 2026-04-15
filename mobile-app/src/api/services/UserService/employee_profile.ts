import axios from "axios";
import { apiRequest } from "../../utils/apiRequest";
import { setToken, deleteToken, clearTokens } from "../../utils/auth/storage";
import { USER_ENDPOINTS } from "../../config/endpoints";
import { apiClient } from "../../config/apiClient";
import { handleApiError } from "../../utils/errors/errorHandlers";
import { check_token } from './tokens';
import { handleCreateUpdateUserError } from '../../utils/errors/users/AuthHandlers';

export interface Position {
  id: number;
  title: string;
}


export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  patronymic: string;
  phone: string;
  passport_series: string;
  passport_number: string;
}

export interface EmployeeProfileResponse {
  user: UserProfile;
  position: Position;
  salary: number;
  advance: number;
  hire_date: string;        // "2026-04-12"
  bank_account: string;
  status: 'active' | 'inactive' | 'fired';
  fired_date: string | null; // "2026-04-12T17:46:14.544Z" или null
  weekends: number[];        // [6, 7] — номера дней недели (0 = Вс)
}

export const getEmployeeProfile = async () => {
  return await apiRequest(
    async () => {
      // Обновляем токен при необходимости
      await check_token();
      
      const res = await apiClient.get(USER_ENDPOINTS.EMPLOYEE_PROFILE);
      return res.data;
    },
    handleApiError
  );
};

export interface UpdateEmployeeProfilePayload {
  first_name?: string;
  last_name?: string;
  patronymic?: string;
  phone?: string;
  passport_series?: string;
  passport_number?: string;
  bank_account?: string;
}

export const updateEmployeeProfile = async (payload: UpdateEmployeeProfilePayload) => {
  return await apiRequest(
    async () => {
      await check_token();
      
      const res = await apiClient.patch(
        USER_ENDPOINTS.EMPLOYEE_PROFILE_EDIT,
        payload
      );
      return res.data;
    },
    handleApiError
  );
};

