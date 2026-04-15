// src/config/apiClient.ts

import { getApiBase } from "./endpoints";
import axios from "axios";
import { getToken } from "../utils/auth/storage";


const apiClient = axios.create({
    baseURL: getApiBase(),
    timeout: 10000,
});

// Интерсептор запроса - добавляет токен
apiClient.interceptors.request.use(
    async (config) => {
    const token = await getToken('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

apiClient.interceptors.response.use(
  (response) => response, // возвращаем полный response
  // ошибки НЕ обрабатываем
);

export { apiClient };