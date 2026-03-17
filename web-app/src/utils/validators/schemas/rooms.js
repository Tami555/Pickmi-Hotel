import { checkRequired, checkCheckIn, checkCheckOut, checkNumberOfPeople } from "../validators";


export const roomAvailableFiltersSchema = {
    // схема проверки фильтров
  check_in: (value) => checkRequired(value, 'Заезд') || checkCheckIn(value),
  check_out: (value, allValues) => 
    checkRequired(value, ' Выезд') || checkCheckOut(value, allValues.check_in),
  number_people: (value) => checkNumberOfPeople(value)
};