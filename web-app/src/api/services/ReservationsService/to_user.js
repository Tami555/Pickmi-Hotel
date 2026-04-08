import { RESERVATIONS_ENDPOINTS } from "../../config/endpoints";
import { apiClient } from "../../config/apiClient";
import { handleApiError } from "../../utils/errors/errorHandlers";
import { apiRequest } from "../../utils/apiRequest";
import { check_token } from "../UserService/tokens";



export const current_user_reservations = async () => {
  return await apiRequest(
    async () => {
      await check_token() //обновляем токен
      const res = await apiClient.get(RESERVATIONS_ENDPOINTS.CURRENT_USER_RESERVATION);
      return res.data;
    },
    handleApiError
  );
};

export const current_user_active_reservations = async () => {
  return await apiRequest(
    async () => {
      await check_token() //обновляем токен
      const res = await apiClient.get(RESERVATIONS_ENDPOINTS.CURRENT_USER_ACTIVE_RESERVATION);
      return res.data;
    },
    handleApiError
  );
};