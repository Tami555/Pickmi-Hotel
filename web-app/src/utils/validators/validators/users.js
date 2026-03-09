// Проверка email
export const checkEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Введите корректный email";
  }
  return null
};

// Проверка длины
export const checkMinLength = (value, minLength, fieldName = 'Поле') => {
  if (value.length < minLength) {
    return `${fieldName} должно содержать минимум ${minLength} символов`;
  }
  return null;
};
