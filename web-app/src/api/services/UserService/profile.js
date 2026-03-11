// получение, редактирование профиля
import { USER_ENDPOINTS } from "../../config/endpoints";
import { apiClient } from "../../config/apiClient";
import { handleApiError } from "../../utils/errors/errorHandlers";
import { apiRequest } from "../../utils/apiRequest";
import { check_token } from "./tokens";


export const read_profile = async () => {
  return await apiRequest(
    async () => {
      await check_token() //обновляем токен
      const res = await apiClient.get(USER_ENDPOINTS.PROFILE);
      return res.data;
    },
    handleApiError
  );
};
