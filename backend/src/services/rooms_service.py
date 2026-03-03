from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from src.crud import room_types as room_types_crud, rooms as rooms_crud, reservations as reservations_crud
from src.exceptions import RoomTypeNotFoundError, NoAvailableRoomsError, AppException, IntervalReservationError
from src.utils.validators import validate_check_in, validate_dates


async def get_room_type_by_slug(slug: str, session: AsyncSession):
    """ Получение типа комнаты по slug """
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
    """ Получение свободных номеров по критериям """
    try:
        if validate_check_in(check_in) and validate_dates(check_in, check_out):
            # Проверка промежутка бронирования
            if not (check_out.date() - check_in.date()).days:
                raise IntervalReservationError()
            
            # проверка существования типа номера
            await get_room_type_by_slug(room_type_slug, session)

            # Обновление статусов бронирования
            await reservations_crud.update_reservation_statuses_by_dates(session)

            rooms = await rooms_crud.get_available_rooms(room_type_slug, quantity_places, check_in, check_out, session)
            if rooms:
                return rooms
            raise NoAvailableRoomsError() 
        
    except ValueError as err:
        raise AppException(message=str(err))
