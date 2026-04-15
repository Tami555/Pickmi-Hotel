import { getBackendUrl, USER_ENDPOINTS } from "../../config/endpoints";
import axios from "axios";
import { handleAuthError, handleCreateUpdateUserError } from "../../utils/errors/users/AuthHandlers";
import { apiRequest } from "../../utils/apiRequest";
import { setToken, deleteToken, clearTokens } from "../../utils/auth/storage";

export const login = async (email: string, password: string) => {
  return await apiRequest(
    async () => {
      // 🔥 ВАЖНО: Очищаем старые токены перед входом нового пользователя!
      await clearTokens();
      
      const res = await axios.post(getBackendUrl(USER_ENDPOINTS.LOGIN), {
        email,
        password
      });
      const data = res.data;
      
      // Сохраняем новые токены
      await setToken('access_token', data.access_token);
      await setToken('refresh_token', data.refresh_token);
      
      console.log('✅ Вход успешен, токены сохранены');
      return res.status === 200;
    },
    handleAuthError
  );
};

export const registration = async (
  first_name: string,
  last_name: string,
  patronymic: string,
  email: string,
  phone: string,
  passport_series: string,
  passport_number: string,
  password: string
) => {
  return await apiRequest(
    async () => {
      await axios.post(getBackendUrl(USER_ENDPOINTS.REGISTRATION), {
        first_name,
        last_name,
        patronymic,
        email,
        phone,
        passport_series,
        passport_number,
        password
      });
      
      // Автоматический вход после успешной регистрации
      return await login(email, password);  
    },
    handleCreateUpdateUserError
  );
};

export const logout = async () => {
  // Очищаем токены
  await clearTokens();
  
  // 🔥 Опционально: можно отправить запрос на бэкенд для инвалидации токена
  // await apiClient.post(USER_ENDPOINTS.LOGOUT); // если есть такой эндпоинт
  
  console.log('🚪 Выход выполнен, токены удалены');
};