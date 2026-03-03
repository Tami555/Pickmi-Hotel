from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from src.crud import room_types as room_types_crud, rooms as rooms_crud, reservations as reservations_crud
from src.exceptions import RoomTypeNotFoundError, NoAvailableRoomsError, AppException, IntervalReservationError
from src.utils.validators import validate_check_in, validate_dates
from src.schemas import RoomTypeAvailabilityResponse


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


async def get_available_rooms_count(
    quantity_places: int,
    check_in: datetime,
    check_out: datetime,
    session: AsyncSession
) -> list[RoomTypeAvailabilityResponse]:
    """Получение количества свободных номеров по каждому типу"""
    try:
        # Валидация дат
        if validate_check_in(check_in) and validate_dates(check_in, check_out):
    
            if not (check_out.date() - check_in.date()).days:
                raise IntervalReservationError()

            # Обновляем статусы броней
            await reservations_crud.update_reservation_statuses_by_dates(session)
            # Получаем все типы номеров
            room_types = await room_types_crud.get_room_types(session)
    
            result = []
            for room_type in room_types:
                rooms = await rooms_crud.get_available_rooms(room_type.slug, quantity_places, check_in, check_out, session)
                result.append(RoomTypeAvailabilityResponse(
                    slug=room_type.slug,
                    title=room_type.title,
                    available_rooms=len(rooms),
                    price_per_day=room_type.price_per_day
                ))

            return result
    except ValueError as err:
        raise AppException(message=str(err))