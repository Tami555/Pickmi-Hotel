// получение, редактирование профиля
import { USER_ENDPOINTS } from "../../config/endpoints";
import { apiClient } from "../../config/apiClient";
import { handleApiError } from "../../utils/errors/errorHandlers";
import { apiRequest } from "../../utils/apiRequest";
import { check_token } from "./tokens";
import { handleCreateUpdateUserError } from "../../utils/errors/users/AuthHandlers";


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


export const edit_profile = async (first_name, last_name, patronymic, phone) => {
    return await apiRequest(
      async () => {
        await check_token() //обновляем токен
        await apiClient.patch(USER_ENDPOINTS.PROFILE_EDIT, {
            first_name: first_name,
            last_name: last_name,
            patronymic: patronymic,
            phone: phone,
        })
        return {status: "ok"}
      },
      handleCreateUpdateUserError
    )
}
