from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from src.crud import room_types as room_types_crud, rooms as rooms_crud
from src.exceptions import RoomTypeNotFoundError, NoAvailableRoomsError


async def get_room_type_by_slug(slug: str, session: AsyncSession):
    room_type = await room_types_crud.get_room_type_by_slug(slug, session)
    if room_type:
        return room_type
    raise RoomTypeNotFoundError()


async def get_available_rooms(
        room_type_slug: str,
        quantity_places: int,
        check_in: datetime,
        check_out: datetime,
        session: AsyncSession
):
    # проверка существования типа номера
    await get_room_type_by_slug(room_type_slug, session)
    rooms = await rooms_crud.get_available_rooms(room_type_slug, quantity_places, check_in, check_out, session)
    if rooms:
        return rooms
    raise NoAvailableRoomsError()