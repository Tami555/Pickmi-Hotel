import { getBackendUrl, SERVICES_ENDPOINTS } from "../../config/endpoints";
import { handleApiError } from "../../utils/errors/errorHandlers";
import { apiRequest } from "../../utils/apiRequest";
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


export const services_by_category = async (category_slug ) => {
  return await apiRequest(
    async () => {
      const res = await axios.get(getBackendUrl(SERVICES_ENDPOINTS.SERVICES_BY_CATEGORY.replace(':id', category_slug)));
      return res.data;
    },
    handleApiError
  );
};


export const service_by_slug = async (service_slug ) => {
  return await apiRequest(
    async () => {
      const res = await axios.get(getBackendUrl(SERVICES_ENDPOINTS.SERVICE_BY_SLUG.replace(':id', service_slug)));
      return res.data;
    },
    handleApiError
  );
};