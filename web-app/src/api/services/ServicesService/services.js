import { getBackendUrl, SERVICES_ENDPOINTS } from "../../config/endpoints";
import { apiClient } from "../../config/apiClient";
import { handleApiError } from "../../utils/errors/errorHandlers";
import { apiRequest } from "../../utils/apiRequest";
import { check_token } from "../UserService/tokens";
import axios from "axios";


export const services_categories = async () => {
  return await apiRequest(
    async () => {
      const res = await axios.get(getBackendUrl(SERVICES_ENDPOINTS.CATEGORIES_SERVICES));
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