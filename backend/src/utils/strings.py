def pascal_to_snake(string: str) -> str:
    """ example: RoomTypes -> room_types """
    result = [string[0].lower()]
    for char in string[1:]:
        if char.isupper():
            result.extend(["_", char.lower()])
        else:
            result.append(char)
    return "".join(result)


def snake_to_camel(string: str) -> str:
    """ example: room_types -> RoomTypes """
    string_split = string.split("_")
    return "".join(word.capitalize() for word in string_split)


def create_slug(string: str):
    """ example: Номер Люкс -> nomer-lyuks """
    letters = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z',
        'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's',
        'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y',
        'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', '.': '-', ' ': '-'}
    return ''.join([letters.get(l.lower(), l) for l in string])