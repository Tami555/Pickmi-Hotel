import datetime
from sqlalchemy import select, update
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import Reservation
from src.models.enums import ReservationStatus


async def get_reservation_by_id(id_reservation: int, session: AsyncSession) -> Reservation | None:
    """Получение записи о бронировании по id"""
    stmt = select(Reservation).options(joinedload(Reservation.room),
                                       joinedload(Reservation.user)).where(Reservation.id == id_reservation)
    reservation = await session.scalar(stmt)
    return reservation


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