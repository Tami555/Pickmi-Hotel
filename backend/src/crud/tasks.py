import datetime
from sqlalchemy import select, update
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import Task
from src.models.enums import TaskStatus


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


async def update_task_status_by_id(task_id: int, status: TaskStatus,  session: AsyncSession):
    """Обновление статуса задачи по id """
    now_date = datetime.datetime.now()
    stmt = update(Task).where(Task.id == task_id)\
        .values(
            status = status,
            started_at=now_date if status is TaskStatus.IN_PROGRESS else Task.started_at,
            completed_at=now_date if status is TaskStatus.COMPLETED else Task.completed_at,
            updated_at=now_date
        )
    await session.execute(stmt)
    await session.commit()