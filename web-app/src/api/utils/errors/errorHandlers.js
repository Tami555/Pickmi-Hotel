// Базовый обработчик ошибок API
export const handleApiError = (error, defaultMessage = "Произошла непредвиденная ошибка") => {
  console.error('API Error:', error);
  
  // Network errors
  if (error.code === 'ERR_NETWORK') {
    throw new Error("Сервер временно недоступен. Попробуйте позже.");
  }
  
  if (error.code === 'ECONNABORTED') {
    throw new Error("Превышено время ожидания ответа от сервера.");
  }
  
  // HTTP errors
  if (error.response?.data) {    
    //  Статус-специфичные ошибки
    if (error.response.status === 401) {
      throw new Error("Неавторизованный доступ. Пожалуйста, войдите снова.");
    }
    
    if (error.response.status === 403) {
      throw new Error("Доступ запрещен.");
    }
    
    if (error.response.status === 404) {
      throw new Error("Ресурс не найден.");
    }

    if (error.response.status === 422) {
      throw new Error(`Не корректные данные ${error.response?.data?.detail[0].msg}`)
    }
    
    if (error.response.status >= 500) {
      throw new Error("Внутренняя ошибка сервера. Попробуйте позже.");
    }
  }

  throw new Error(defaultMessage);
};