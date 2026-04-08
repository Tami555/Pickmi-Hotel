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


export const cancel_service = async (service_id) => {
  return await apiRequest(
    async () => {
      await check_token() //обновляем токен
      const res = await apiClient.patch(SERVICES_ENDPOINTS.CANCEL_SERVICE.replace(':id', service_id));
      return res.data;
    },
    handleApiError
  );
};


export const create_service = async (service_id, reservation_id, scheduled_time, comment) => {
  return await apiRequest(
    async () => {
      await check_token() //обновляем токен
      const res = await apiClient.post(SERVICES_ENDPOINTS.CREATE_SERVICE, 
        {
          service_id: service_id,
          reservation_id: reservation_id,
          scheduled_time: scheduled_time,
          comment: comment
        }
      );
      return res.data;
    },
    handleApiError
  );
};