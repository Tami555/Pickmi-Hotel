import { handleApiError } from "../errorHandlers";


// обработка при входе
export const handleAuthError = (error) => {
  if (error.response?.status === 401) {
    throw new Error("Неверно введены email или пароль");
  }
  return handleApiError(error, "Ошибка авторизации");
};


// обработка при регистрации
export const handleCreateUpdateUserError = (error) => {
  if (error.response?.status === 409) {
    throw new Error(error.response?.data?.detail);
  }
  if (error.response?.status === 422) {
    if (error.response?.data?.detail[0].msg == "value is not a valid phone number"){
        throw new Error("Не корректный номер телефона");
    }
  }
  return handleApiError(error, "Ошибка при регистрации");
};  