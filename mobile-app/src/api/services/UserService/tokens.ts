// src/api/services/UserService/tokens.ts

import { getToken, setToken, deleteToken, clearTokens } from "../../utils/auth/storage";
import axios from "axios";
import { getBackendUrl, USER_ENDPOINTS } from "../../config/endpoints";

// 🔹 Простая проверка: есть ли токен в хранилище
export const hasValidToken = async (): Promise<boolean> => {
  const token = await getToken('access_token');
  return !!token;
};

// 🔹 Проверка и авто-обновление токена (если нужно)
export const check_token = async () => {
  try {
    const access_token = await getToken('access_token');
    if (!access_token) return false;
    
    // Проверка действия токена (опционально, если бэкенд поддерживает /verify)
    const res = await axios.post(getBackendUrl(USER_ENDPOINTS.VERIFY), {
      token: access_token
    });
    return res.status === 200;
    
  } catch (error) {
    try {
      const refresh_token = await getToken('refresh_token');
      if (!refresh_token) {
        // Нет токенов — чистим на всякий случай
        await clearTokens();
        return false;
      }

      // Обновляем токен
      const refreshRes = await axios.post(getBackendUrl(USER_ENDPOINTS.REFRESH), {
        token: refresh_token
      });
      
      await setToken('access_token', refreshRes.data.access_token);
      
      // Если бэкенд вернул новый refresh_token — сохраняем его
      if (refreshRes.data.refresh_token) {
        await setToken('refresh_token', refreshRes.data.refresh_token);
      }
      
      return true;
      
    } catch (refreshError) {
      // ❌ Рефреш не сработал — чистим всё и требуем новый логин
      await clearTokens();
      return false;
    }
  }
};

// 🔹 Принудительное обновление токена (можно вызвать вручную)
export const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const refresh_token = await getToken('refresh_token');
    if (!refresh_token) return false;

    const refreshRes = await axios.post(getBackendUrl(USER_ENDPOINTS.REFRESH), {
      token: refresh_token
    });
    
    await setToken('access_token', refreshRes.data.access_token);
    if (refreshRes.data.refresh_token) {
      await setToken('refresh_token', refreshRes.data.refresh_token);
    }
    
    return true;
  } catch (error) {
    await clearTokens();
    return false;
  }
};