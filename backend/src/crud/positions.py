from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import Position


async def get_positions(session: AsyncSession) -> list[Position]:
    """ Получение списка всех должностей сотрудников """
    stmt = select(Position).order_by(Position.id)
    positions = await session.scalars(stmt)
    return list(positions)


async def get_position_by_id(position_id: int, session: AsyncSession) -> Position | None:
    """ Получение должности по id """
    position = await session.get(Position, position_id)
    return position
