import { handleApiError } from "./errors/errorHandlers";

export const apiRequest = async (requestFn, errorHandler=handleApiError) => {
  try {
    return await requestFn();
  } catch (error) {
    // Пробрасываем уже обработанную ошибку
    throw errorHandler(error);
  }
};