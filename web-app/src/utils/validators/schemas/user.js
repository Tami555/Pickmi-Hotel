import { checkRequired, checkPhone } from "../validators";


export const editProfileSchema = {
   // схема редактирования профиля
  first_name: (value) => checkRequired(value, 'Имя'),
  last_name: (value) => checkRequired(value, 'Фамилия'),
  phone: (value) => checkRequired(value, 'Номер телефона') || checkPhone(value),
};
