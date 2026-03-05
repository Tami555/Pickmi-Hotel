from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import Position, Services, Employee


async def get_positions(session: AsyncSession) -> list[Position]:
    """ Получение списка всех должностей сотрудников """
    stmt = select(Position).order_by(Position.id)
    positions = await session.scalars(stmt)
    return list(positions)


async def get_positions_by_service(service_id: int, session: AsyncSession) -> list[Position]:
    """ Получение списка должностей по id услуги """
    stmt = select(Position)\
        .options(selectinload(Position.employees)\
                 .selectinload(Employee.tasks)
        ).join(Position.services)\
        .where(Services.id == service_id)
    
    positions = await session.scalars(stmt)
    return list(positions)


async def get_position_by_id(position_id: int, session: AsyncSession) -> Position | None:
    """ Получение должности по id """
    stmt = select(Position).options(selectinload(Position.services)).where(Position.id == position_id)
    position = await session.scalar(stmt)
    return position
