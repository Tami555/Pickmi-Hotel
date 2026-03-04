def validate_passport_series(value):
    """Проверка серии паспорта """
    if not value.isdigit():
        raise ValueError("Серия паспорта должна содержать только цифры")
    if len(value) != 4:
        raise ValueError("Серия паспорта должна содержать 4 цифры")
    return value
    

def validate_passport_number(value):
    """Проверка номера паспорта """
    if not value.isdigit():
        raise ValueError("Номер паспорта должен содержать только цифры")
    if len(value) != 6:
        raise ValueError("Номер паспорта должен содержать 6 цифр")
    return value
    

def validate_password(value):
    """Проверка состава пароля перед созданием """
    if len(value) < 8:
        raise ValueError('Пароль должен быть не менее 8 символов')
    return value


def validate_bank_account(value):
    """Проверка лицевого счета """
    if value and (not value.isdigit() or len(value) != 20):
        raise ValueError('Расчётный счёт должен содержать 20 цифр')
    return value
