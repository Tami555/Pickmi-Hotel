import { RESERVATIONS_ENDPOINTS } from "../../config/endpoints";
import { apiClient } from "../../config/apiClient";
import { handleApiError } from "../../utils/errors/errorHandlers";
import { apiRequest } from "../../utils/apiRequest";
import { check_token } from "../UserService/tokens";


export const create_reservations = async (room_number, check_in, check_out) => {
  return await apiRequest(
    async () => {
      await check_token() //обновляем токен
      const res = await apiClient.post(RESERVATIONS_ENDPOINTS.CREATE_RESERVATION, {
        room_number: room_number,
        check_in_date: check_in,
        check_out_date: check_out
    });
      return res.data;
    },
    handleApiError
  );
};