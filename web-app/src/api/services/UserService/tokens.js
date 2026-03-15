// проверка и обновление jwt токенов
import { getCookie, setCookie, deleteCookie } from "../../utils/auth/cookies"
import axios from "axios";
import { getBackendUrl, USER_ENDPOINTS } from "../../config/endpoints"


export const check_token = async () => {
    try {
      const access_token = getCookie('access_token');
      if (!access_token) return false;
      // проверка действия токена
      const res = await axios.post(getBackendUrl(USER_ENDPOINTS.VERIFY), {
        token: access_token
      });
      return res.status === 200;
    } catch (error) {
        try {
            const refresh_token = getCookie('refresh_token');
            if (!refresh_token) return false;

            // Обновляем токен
            const refreshRes = await axios.post(getBackendUrl(USER_ENDPOINTS.REFRESH), {
                token: refresh_token
            });
            setCookie('access_token', refreshRes.data.access_token);
            return true;
        } catch (refreshError) {
            // Удаляем невалидные cookies
            deleteCookie('access_token');
            deleteCookie('refresh_token');
            return false;
      }
    }
}