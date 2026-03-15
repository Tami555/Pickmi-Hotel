import datetime
from sqlalchemy import select, update, func, extract
from sqlalchemy.orm import joinedload, selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import Reservation, User, Rooms, RoomTypes, Task
from src.models.enums import ReservationStatus


async def get_reservation_by_id(id_reservation: int, session: AsyncSession) -> Reservation | None:
    """Получение записи о бронировании по id"""
    stmt = select(Reservation).options(joinedload(Reservation.room),
                                       joinedload(Reservation.user),
                                       selectinload(Reservation.tasks).joinedload(Task.service)
                                       ).where(Reservation.id == id_reservation)
    reservation = await session.scalar(stmt)
    return reservation


async def get_reservations_by_user_id(id_user: int, session: AsyncSession) -> list[Reservation]:
    """Получение всех записей о бронировании пользователя по id"""
    stmt = select(Reservation).options(
            joinedload(Reservation.room).joinedload(Rooms.room_type),
            selectinload(Reservation.tasks).joinedload(Task.service)
        ).join(Reservation.user).where(User.id == id_user)
    reservations = await session.scalars(stmt)
    return reservations


async def get_active_reservation_by_user(user_id: int, session: AsyncSession) -> Reservation | None:
    """Получение активной брони пользователя"""
    stmt = (
        select(Reservation)
        .where(
            Reservation.user_id == user_id,
            Reservation.status == ReservationStatus.ACTIVE
        )
        .options(joinedload(Reservation.room))
        .limit(1)
    )
    result = await session.execute(stmt)
    return result.scalar_one_or_none()


async def get_active_reservation_by_room(
    room_id: int,
    session: AsyncSession
) -> Reservation | None:
    """Получение активной брони на номер"""
    stmt = (
        select(Reservation)
        .where(
            Reservation.room_id == room_id,
            Reservation.status == ReservationStatus.ACTIVE
        )
        .options(joinedload(Reservation.user))
        .limit(1)
    )
    result = await session.execute(stmt)
    return result.scalar_one_or_none()


async def create_reservation(
    reservation_data: dict,
    session: AsyncSession
) -> Reservation:
    """Создание записи о бронировании"""
    reservation = Reservation(**reservation_data)
    session.add(reservation)
    await session.commit()
    return reservation


async def update_reservation_statuses_by_dates(session: AsyncSession):
    """Обновление статусов броней по датам"""
    now = datetime.datetime.now()
    
    # наступила дата заезда
    pending_stmt = (
        update(Reservation)
        .where(
            Reservation.check_in_date <= now,
            Reservation.check_out_date >= now
        )
        .values(status=ReservationStatus.ACTIVE, updated_at = datetime.datetime.now())
    )
    await session.execute(pending_stmt)
    
    # прошла дата выезда
    active_stmt = (
        update(Reservation)
        .where(
            Reservation.check_out_date < now
        )
        .values(status=ReservationStatus.COMPLETED, updated_at = datetime.datetime.now())
    )
    await session.execute(active_stmt)
    await session.commit()


async def update_reservation_status(id_reservation: int, status: ReservationStatus, session: AsyncSession):
    """Обновление статуса брони """
    stmt = update(Reservation).where(Reservation.id == id_reservation).values(status=status, updated_at = datetime.datetime.now())
    await session.execute(stmt)
    await session.commit()


async def get_reservations_by_month(
    session: AsyncSession,
    year: int | None = None
) -> list[tuple]:
    """
    Возвращает количество броней по месяцам за указанный год
    Если год не указан - берет текущий
    """
    if year is None:
        year = datetime.datetime.now().year
    
    query = (
        select(
            extract('month', Reservation.created_at).label('month'),
            func.count(Reservation.id).label('count')
        )
        .where(extract('year', Reservation.created_at) == year)
        .where(Reservation.status.in_([ReservationStatus.ACTIVE, ReservationStatus.COMPLETED]))
        .group_by('month')
        .order_by('month')
    )
    
    result = await session.execute(query)
    return result.all()


async def get_total_stats(
    session: AsyncSession,
    start_date: datetime.datetime | None = None,
    end_date: datetime.datetime | None = None
) -> dict:
    """ Возвращает общую статистику по броням """
    query = select(
        func.count(Reservation.id).label('total_bookings'),
        func.sum(Reservation.total_price).label('total_revenue'),
        func.avg(Reservation.total_price).label('avg_booking_value')
    ).where(Reservation.status.in_([ReservationStatus.ACTIVE, ReservationStatus.COMPLETED]))
    
    if start_date:
        query = query.where(Reservation.created_at >= start_date)
    if end_date:
        query = query.where(Reservation.created_at <= end_date)
    
    result = await session.execute(query)
    row = result.one()
    
    return {
        'total_bookings': row.total_bookings or 0,
        'total_revenue': row.total_revenue or 0,
        'avg_booking_value': round(row.avg_booking_value or 0, 2)
    }
