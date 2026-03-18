import { handleApiError } from "../errorHandlers";


// обработка при поиске номеров
export const handleReservationRoomError = (error) => {
  if (error.response?.status === 404) {
    throw new Error(error.response?.data?.detail);
  }
  return handleApiError(error, "Ошибка поиска номеров");
};