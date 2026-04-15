import { SERVICES_ENDPOINTS } from "../../config/endpoints";
import { apiClient } from "../../config/apiClient";
import { handleApiError } from "../../utils/errors/errorHandlers";
import { apiRequest } from "../../utils/apiRequest";
import { check_token } from "../UserService/tokens";



export const current_user_services = async () => {
  return await apiRequest(
    async () => {
      await check_token() //обновляем токен
      const res = await apiClient.get(SERVICES_ENDPOINTS.CURRENT_USER_SERVICES);
      return res.data;
    },
    handleApiError
  );
};
