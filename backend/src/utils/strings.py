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