import { checkRequired, checkEmail, checkMinLength, checkPhone, checkPassportSeries, checkPassportNumber, checkPasswordMatch} from "../validators";


export const loginSchema = {
    // схема проверки входа
  email: (value) => checkRequired(value, 'Email') || checkEmail(value),
  password: (value) => checkRequired(value, 'Пароль') || checkMinLength(value, 8, 'Пароль')
};


export const registrationSchema = {
   // схема проверки регистрации
  first_name: (value) => checkRequired(value, 'Имя'),
  last_name: (value) => checkRequired(value, 'Фамилия'),
  email: (value) => checkRequired(value, 'Email') || checkEmail(value),
  password: (value) => checkRequired(value, 'Пароль') || checkMinLength(value, 8, 'Пароль'),
  phone: (value) => checkRequired(value, 'Номер телефона') || checkPhone(value),
  passport_series: (value) => checkRequired(value, 'Серия паспорта') || checkPassportSeries(value),
  passport_number: (value) => checkRequired(value, 'Номер паспорта') || checkPassportNumber(value),
  repeat_password: (value, allValues) => 
    checkRequired(value, 'Подтверждение пароля') || 
    checkPasswordMatch(value, allValues.password)
};
