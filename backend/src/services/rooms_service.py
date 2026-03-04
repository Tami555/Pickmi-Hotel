from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from src.crud import room_types as room_types_crud, rooms as rooms_crud, reservations as reservations_crud
from src.exceptions import RoomTypeNotFoundError, NoAvailableRoomsError, AppException, IntervalReservationError
from src.utils.validators import validate_check_in, validate_dates
from src.schemas import RoomTypeAvailabilityResponse, RoomTypeOccupancyResponse, RoomOccupancyInfo, UserResponse


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
    

async def get_rooms_by_type_with_occupancy(
    room_type_slug: str,
    session: AsyncSession
) -> RoomTypeOccupancyResponse:
    """Получение всех номеров типа с информацией о загруженности"""
    
    # Проверяем существование типа
    room_type = await room_types_crud.get_room_type_by_slug(room_type_slug, session)
    if not room_type:
        raise RoomTypeNotFoundError()
    
    # Получаем все номера этого типа
    rooms = await rooms_crud.get_rooms_by_type(room_type_slug, session)

    # Обновляем статусы броней
    await reservations_crud.update_reservation_statuses_by_dates(session)
    
    occupied_count = 0
    rooms_info = []
    
    for room in rooms:
        # Ищем активную бронь
        active_reservation = await reservations_crud.get_active_reservation_by_room(room.id, session)
        
        is_occupied = active_reservation is not None
        if is_occupied:
            occupied_count += 1
        
        # Собираем информацию о номере
        room_info = RoomOccupancyInfo(
            room_number=room.room_number,
            floor=room.floor,
            quantity_places=room.quantity_places,
            is_occupied=is_occupied,
            current_guest=UserResponse(
                id=active_reservation.user.id,
                email=active_reservation.user.email,
                first_name=active_reservation.user.first_name,
                last_name=active_reservation.user.last_name
            ) if is_occupied else None,
            days_occupied=(
                (active_reservation.check_out_date - active_reservation.check_in_date).days
            ) if is_occupied else None,
        )
        rooms_info.append(room_info)

    # Считаем процент загруженности
    percentage = (occupied_count / len(rooms) * 100) if rooms else 0
    
    return RoomTypeOccupancyResponse(
        percentage_occupied=round(percentage, 1),
        total_rooms=len(rooms),
        occupied_rooms=occupied_count,
        rooms=rooms_info
    )