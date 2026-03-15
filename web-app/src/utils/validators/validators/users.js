// Проверка email
export const checkEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Введите корректный email";
  }
  return null
};


// Проверка номера телефона
export const checkPhone = (value) => {
  // Проверяем формат: начинается с +, затем 11 цифр
  const phoneRegex = /^\+\d{11}$/;
  if (!phoneRegex.test(value)) {
    return "Введите корректный номер телефона в формате +7xxxxxxxxxx";
  }
  return null;
};


// Проверка серии паспорта
export const checkPassportSeries = (value) => {
  if (!/^\d+$/.test(value)) {
    return "Серия паспорта должна содержать только цифры";
  }
  if (value.length !== 4) {
    return "Серия паспорта должна содержать 4 цифры";
  }
  return null;
};


// Проверка номера паспорта
export const checkPassportNumber = (value) => {
  if (!/^\d+$/.test(value)) {
    return "Номер паспорта должен содержать только цифры";
  }
  if (value.length !== 6) {
    return "Номер паспорта должен содержать 6 цифр";
  }
  return null;
};


// Проверка совпадения паролей
export const checkPasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) return "Пароли не совпадают";
  return null;
};