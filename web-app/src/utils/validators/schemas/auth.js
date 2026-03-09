import { checkRequired, checkEmail, checkMinLength } from "../validators";


export const loginSchema = {
    // схема проверки входа
  email: (value) => checkRequired(value, 'Email') || checkEmail(value),
  password: (value) => checkRequired(value, 'Пароль') || checkMinLength(value, 8, 'Пароль')
};