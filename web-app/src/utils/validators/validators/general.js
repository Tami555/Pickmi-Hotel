// Проверка на пустые поля
export const checkRequired = (value, fieldName = 'Поле') => {
  if (!value?.trim()) return `${fieldName} обязательно для заполнения`;
  return null;
};


// Проверка длины
export const checkMinLength = (value, minLength, fieldName = 'Поле') => {
  if (value.length < minLength) {
    return `${fieldName} должно содержать минимум ${minLength} символов`;
  }
  return null;
};