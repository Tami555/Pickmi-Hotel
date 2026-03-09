// вход, регистрация, выход
import { getBackendUrl, USER_ENDPOINTS } from "../../config/endpoints";
import axios from "axios";
import { handleAuthError, handleRegistrationError } from "../../utils/errors/users/AuthHandlers";
import { apiRequest } from "../../utils/apiRequest";
import { setCookie, deleteCookie } from "../../utils/auth/cookies";


export const login = async (email, password) => {
  return await apiRequest(
    async () => {
      const res = await axios.post(getBackendUrl(USER_ENDPOINTS.LOGIN), {
        email: email,
        password: password
      });
      const data = res.data;
      setCookie('access_token', data.access_token);
      setCookie('refresh_token', data.refresh_token);
      return res.status === 200;
    },
    handleAuthError
  );
};


export const registration = async (
  first_name,
  last_name,
  patronymic,
  email,
  phone,
  passport_series,
  passport_number,
  password
) => {
    return await apiRequest(
        async () => {
            await axios.post(getBackendUrl(USER_ENDPOINTS.REGISTRATION), {
            first_name: first_name,
            last_name: last_name,
            patronymic: patronymic,
            email: email,
            phone: phone,
            passport_series: passport_series,
            passport_number: passport_number,
            password: password
        });
        // Автоматический вход после успешной регистрации
        const data = await login(email, password);  
        return data;
        },
        handleRegistrationError
    )
}


export const logout = () => {
    // Удаляем cookies и инфу о пользователе
    deleteCookie('access_token');
    deleteCookie('refresh_token');
}