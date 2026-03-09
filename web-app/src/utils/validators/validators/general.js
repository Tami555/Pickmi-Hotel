// Проверка на пустые поля
export const checkRequired = (value, fieldName = 'Поле') => {
  if (!value?.trim()) return `${fieldName} обязательно для заполнения`;
  return null;
};