import bcrypt


def hashed_password(password: str) -> bytes:
    bytes_psw = password.encode()
    salt = bcrypt.gensalt()
    hash_psw = bcrypt.hashpw(
        password=bytes_psw,
        salt=salt
    )
    return hash_psw


def checked_password(password: str, hash_password: bytes):
    bytes_psw = password.encode()
    is_equality = bcrypt.checkpw(
        password=bytes_psw,
        hashed_password=hash_password
    )
    return is_equality