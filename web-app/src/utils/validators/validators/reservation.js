// Проверка заезда
export const checkCheckIn = (check_in_date) => {
  const selectedDate = new Date(check_in_date);
  const currentDate = new Date();
  if (selectedDate < currentDate) {
    return "Дата заезда не может быть в прошлом";
  }
  return null
};


// Проверка выезда
export const checkCheckOut = (check_out_date, check_in_date) => {  
  if (!check_in_date) {
    return "Сначала укажите дату и время заезда";
  }
  
  const checkIn = new Date(check_in_date);
  const checkOut = new Date(check_out_date);
  const currentDate = new Date();
  
  if (checkOut < currentDate) {
    return "Дата и время выезда не могут быть в прошлом";
  }
  
  if (checkOut <= checkIn) {
    return "Дата и время выезда должны быть позже даты и времени заезда";
  }
  
  const timeDifference = checkOut - checkIn;
  const hoursDifference = timeDifference / (1000 * 60 * 60);
  
  if (hoursDifference < 24) {
    return "Минимальный период бронирования - 1 ночь (промежуток между датами должен быть не меньше 24 часов)";
  }
  
  return null
};


// Проверка количества людей
export const checkNumberOfPeople = (numbers) => {
  if (!numbers && numbers !== 0) {
    return "Укажите количество гостей";
  }
  
  const num = Number(numbers);
  
  if (isNaN(num)) {
    return "Количество гостей должно быть числом";
  }
  
  if (!Number.isInteger(num)) {
    return "Количество гостей должно быть целым числом";
  }
  
  if (num < 1) {
    return "Количество гостей не может быть меньше 1";
  }
  return null
};