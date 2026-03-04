import datetime
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from  sqlalchemy.orm import joinedload
from src.models import RoomTypes, Rooms, Reservation
from src.models.enums import ReservationStatus


async def get_rooms_by_type(
    room_type_slug: str,
    session: AsyncSession
) -> list[Rooms]:
    """Получение всех номеров определённого типа"""
    stmt = (
        select(Rooms)
        .join(RoomTypes).where(RoomTypes.slug == room_type_slug)
        .order_by(Rooms.room_number)
    )
    result = await session.execute(stmt)
    return list(result.scalars().all())


async def get_available_rooms(
        room_type_slug: str,
        quantity_places: int,
        check_in: datetime.datetime,
        check_out: datetime.datetime,
        session: AsyncSession
) -> list[Rooms]:
    """Поиск доступных номеров по критериям"""
    stmt = (
        select(Rooms)
        .join(RoomTypes)
        .where(
            RoomTypes.slug == room_type_slug,
            Rooms.quantity_places >= quantity_places,
        )
        .order_by(Rooms.quantity_places)
    )

    result = await session.execute(stmt)
    all_rooms = result.scalars().all()

    # Фильтруем по пересечению броней
    available_rooms = []
    for room in all_rooms:
        if await is_room_available(room.id, check_in, check_out, session):
            available_rooms.append(room)

    return available_rooms


async def is_room_available(
        room_id: int,
        check_in: datetime.date,
        check_out: datetime.date,
        session: AsyncSession
) -> bool:
    """Проверка, свободен ли номер в указанные даты"""
    stmt = select(Reservation).where(
        Reservation.room_id == room_id,
        Reservation.status.in_([ReservationStatus.ACTIVE, ReservationStatus.PENDING]),
        and_(
            Reservation.check_in_date < check_out,  # пересечение дат
            Reservation.check_out_date > check_in
        )
    )
    result = await session.execute(stmt)
    return result.first() is None


async def get_room_by_number(room_number: str, session: AsyncSession) -> Rooms | None:
    stmt = select(Rooms).options(joinedload(Rooms.room_type)).where(Rooms.room_number == room_number)
    room = await session.scalar(stmt)
    return room
