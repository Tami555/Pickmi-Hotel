import datetime
from sqlalchemy import select, Result, func
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import RoomTypes, RoomTypeAmenities, Reservation, Rooms
from src.models.enums import ReservationStatus


async def get_room_types(session: AsyncSession) -> list[RoomTypes]:
    """ Получение списка типов номеров """
    stmt = select(RoomTypes).order_by(-RoomTypes.price_per_day)
    room_types = await session.scalars(stmt)
    return list(room_types)


async def get_room_types_count(session: AsyncSession) -> int:
    """Возвращает количество типов номеров"""
    query = select(func.count(RoomTypes.id))
    result = await session.execute(query)
    return result.scalar() or 0


async def get_room_type_by_slug(slug: str, session: AsyncSession) -> RoomTypes:
    """ Получение типа номера по slug """
    stmt = select(RoomTypes).\
        options(
        selectinload(RoomTypes.amenities_association).joinedload(RoomTypeAmenities.amenity)).\
        where(RoomTypes.slug == slug)
    res: Result = await session.execute(stmt)
    room_type = res.scalar_one_or_none()
    return room_type


async def get_popular_room_types(
    session: AsyncSession,
    start_date: datetime.datetime | None = None,
    end_date: datetime.datetime | None = None
) -> list[tuple]:
    """ Возвращает популярность типов номеров по количеству броней """
    query = (
        select(
            RoomTypes.title,
            RoomTypes.slug,
            func.count(Reservation.id).label('booking_count')
        )
        .select_from(Reservation)
        .join(Rooms, Reservation.room_id == Rooms.id)
        .join(RoomTypes, Rooms.room_type_id == RoomTypes.id)
        .where(Reservation.status.in_([ReservationStatus.ACTIVE, ReservationStatus.COMPLETED]))
    )
    
    if start_date:
        query = query.where(Reservation.created_at >= start_date)
    if end_date:
        query = query.where(Reservation.created_at <= end_date)
    
    query = (
        query.group_by(RoomTypes.id, RoomTypes.title, RoomTypes.slug)
        .order_by(func.count(Reservation.id).desc())
    )
    
    result = await session.execute(query)
    return result.all()

