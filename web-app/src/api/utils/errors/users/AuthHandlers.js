import { handleApiError } from "../errorHandlers";

// обработка при входе
export const handleAuthError = (error) => {
  if (error.response?.status === 401) {
    throw new Error("Неверно введены email или пароль");
  }
  return handleApiError(error, "Ошибка авторизации");
};
