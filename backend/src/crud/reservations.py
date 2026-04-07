import datetime
from sqlalchemy import select, update, func, extract, case
from sqlalchemy.orm import joinedload, selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import Reservation, User, Rooms, RoomTypes, Task
from src.models.enums import ReservationStatus, TaskStatus


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
    reservation_status_order = case(
        (Reservation.status == ReservationStatus.ACTIVE, 1),
        (Reservation.status == ReservationStatus.PENDING, 2),
        (Reservation.status == ReservationStatus.CANCELED, 3),
        (Reservation.status == ReservationStatus.COMPLETED, 4)
    )

    task_status_order = case(
        (Task.status == TaskStatus.IN_PROGRESS, 1),
        (Task.status == TaskStatus.PENDING, 2),
        (Task.status == TaskStatus.CANCELED, 3),
        (Task.status == TaskStatus.COMPLETED, 4)
    )

    stmt = select(Reservation).options(
        joinedload(Reservation.room).joinedload(Rooms.room_type),
        selectinload(Reservation.tasks).joinedload(Task.service)
    ).join(Reservation.user).where(User.id == id_user).order_by(reservation_status_order)

    result = await session.execute(stmt)
    reservations = result.unique().scalars().all()

    # Сортируем задачи внутри каждой брони
    for reservation in reservations:
        reservation.tasks.sort(key=lambda task: (
            task_status_order._keyfunc(task.status) if hasattr(task_status_order, '_keyfunc')
            else {
                TaskStatus.IN_PROGRESS: 1,
                TaskStatus.PENDING: 2,
                TaskStatus.CANCELED: 3,
                TaskStatus.COMPLETED: 4
            }.get(task.status, 5)
        ))
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


async def get_all_active_reservations_by_user(user_id: int, session: AsyncSession) -> list[Reservation]:
    """Получение всех активных броней пользователя"""
    stmt = (
        select(Reservation)
        .where(
            Reservation.user_id == user_id,
            Reservation.status == ReservationStatus.ACTIVE
        )
        .options(joinedload(Reservation.room))
    )
    result = await session.scalars(stmt)
    return result


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
        .values(status=ReservationStatus.ACTIVE, updated_at=datetime.datetime.now())
    )
    await session.execute(pending_stmt)

    # прошла дата выезда
    completed_reservations_stmt = (
        select(Reservation.id)
        .where(
            Reservation.check_out_date < now,
            Reservation.status != ReservationStatus.COMPLETED  # чтобы не обновлять повторно
        )
    )
    result = await session.execute(completed_reservations_stmt)
    completed_reservation_ids = [row[0] for row in result.fetchall()]

    if completed_reservation_ids:
        active_stmt = (
            update(Reservation)
            .where(Reservation.id.in_(completed_reservation_ids))
            .values(status=ReservationStatus.COMPLETED, updated_at=datetime.datetime.now())
        )
        await session.execute(active_stmt)

        # обновляем статусы задач
        tasks_stmt = (
            update(Task)
            .where(
                Task.reservation_id.in_(completed_reservation_ids),
                Task.status.in_([TaskStatus.PENDING, TaskStatus.IN_PROGRESS])
            )
            .values(
                status=TaskStatus.COMPLETED,
                completed_at=datetime.datetime.now(),
                updated_at=datetime.datetime.now()
            )
        )
        await session.execute(tasks_stmt)

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
