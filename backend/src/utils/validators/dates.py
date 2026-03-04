import datetime


def validate_weekends(value):
    """Проверка дней недели """
    valid_days = [1, 2, 3, 4, 5, 6, 7]
    if not all(day in valid_days for day in value):
        raise ValueError('Дни недели должны быть от 1 (пн) до 7 (вс)')
    return value


def validate_check_in(v):
    """Проверка не прошедшей даты """
    if v < datetime.datetime.today():
        raise ValueError('Дата заезда не может быть в прошлом')
    return v


def validate_dates(check_in_date, check_out_date):
    """Проверка правильности промежутка """
    if check_out_date <= check_in_date:
        raise ValueError('Дата выезда должна быть позже даты заезда')
    return True