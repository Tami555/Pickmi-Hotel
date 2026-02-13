from sqlalchemy import select, Result
from sqlalchemy.orm import selectinload, joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from models import RoomTypes, RoomTypeAmenities


async def get_room_types(session: AsyncSession) -> list[RoomTypes]:
    stmt = select(RoomTypes).order_by(-RoomTypes.price_per_day)
    room_types = await session.scalars(stmt)
    return list(room_types)


async def get_room_type_by_slug(slug: str, session: AsyncSession) -> RoomTypes:
    stmt = select(RoomTypes).\
            options(
                selectinload(RoomTypes.amenities_association).\
                    joinedload(RoomTypeAmenities.amenity)
                ).\
            where(RoomTypes.slug == slug)
    res: Result = await session.execute(stmt)
    room_type = res.scalar_one_or_none()
    return room_type