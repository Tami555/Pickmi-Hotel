from sqlalchemy import select
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import Task


async def get_task_by_id(id_task: int, session: AsyncSession) -> Task | None:
    """Получение задачи (заказанной услиги) по id"""
    stmt = select(Task).options(
        joinedload(Task.service),
        joinedload(Task.reservation),
        joinedload(Task.employee),
    ).where(Task.id == id_task)

    task = await session.scalar(stmt)
    return task


async def create_task(
    task_data: dict,
    session: AsyncSession
) -> Task:
    """Создание задачи по заказанной услуге """
    task = Task(**task_data)
    session.add(task)
    await session.commit()
    return task