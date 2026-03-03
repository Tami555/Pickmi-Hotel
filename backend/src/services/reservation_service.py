import datetime
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import User, Reservation
from src.crud import rooms as rooms_crud, reservations as reservations_crud
from src.schemas import ReservationCreate
from src.exceptions import RoomNotFoundError, NoAvailableRoomsError, AppException, IntervalReservationError, ReservationNotFoundError, ForbiddenError, CannotCancelReservationError
from src.models.enums import ReservationStatus, Role


async def create_reservation(
        user: User,
        reservation_data: ReservationCreate,
        session: AsyncSession
) -> Reservation:
    """Создание бронирования"""

    # Проверяем номер на существование
    room = await rooms_crud.get_room_by_number(reservation_data.room_number, session)
    if not room:
        raise RoomNotFoundError(reservation_data.room_number)
    
    # Проверка промежутка бронирования
    nights = (reservation_data.check_out_date.date() - reservation_data.check_in_date.date()).days
    if not nights:
        raise IntervalReservationError()
    
    # Обновление статусов бронирования
    await reservations_crud.update_reservation_statuses_by_dates(session)

    # проверка свободен ли он
    is_available_room = await rooms_crud.is_room_available(
        room_id=room.id,
        check_in=reservation_data.check_in_date,
        check_out=reservation_data.check_out_date,
        session=session
    )
    if not is_available_room:
        raise NoAvailableRoomsError(plural=False)

    # Рассчитываем цену
    total_price = room.room_type.price_per_day * nights

    # Определяем статус
    today = datetime.date.today()
    if reservation_data.check_in_date.date() == today:
        status = ReservationStatus.ACTIVE
    elif reservation_data.check_in_date.date() > today:
        status = ReservationStatus.PENDING
    else:
        raise AppException("Дата заезда не может быть в прошлом", 400)
    
    reservation_dict = {
        "user_id": user.id,
        "room_id": room.id,
        "check_in_date": reservation_data.check_in_date,
        "check_out_date": reservation_data.check_out_date,
        "total_price": total_price,
        "status": status
    }
    reservation = await reservations_crud.create_reservation(reservation_dict, session)
    return await reservations_crud.get_reservation_by_id(reservation.id, session)


async def cancel_reservation(
    reservation_id: int,
    user: User,
    session: AsyncSession
) -> Reservation:
    """Отмена брони (доступно гостю-владельцу или админу)"""
    
    reservation = await reservations_crud.get_reservation_by_id(reservation_id, session)
    if not reservation:
        raise ReservationNotFoundError()
    
    if user.role != Role.ADMIN and reservation.user_id != user.id:
        raise ForbiddenError("Не достаточно прав для отмены брони")
    
    if reservation.status != ReservationStatus.PENDING:
        raise CannotCancelReservationError(f"Бронь уже {reservation.status.value}")
    # Отменяем    
    await reservations_crud.update_reservation_status(reservation.id, ReservationStatus.CANCELED, session)
    return await reservations_crud.get_reservation_by_id(reservation.id, session)