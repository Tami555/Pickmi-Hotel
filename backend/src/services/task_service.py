import datetime
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import User, Task
from src.crud import services as service_crud, reservations as reservation_crud, positions as position_crud, tasks as task_crud
from src.schemas import TaskCreate
from src.exceptions import ServiceNotFoundError, ReservationNotFoundError, ForbiddenError, CannotCreateTaskError, TaskNotFoundError, CannotChangeStatusTaskError
from src.models.enums import ReservationStatus, TaskStatus, Role, EmployeeStatus


async def create_task(
        user: User,
        task_data: TaskCreate,
        session: AsyncSession
) -> Task:
    """Создание заказа услуги (задачи для сотрудника)"""
    print('СОЗДАНИЕ УСЛУГИ')

    # Проверяем услугу на существование
    service = await service_crud.get_service_by_id(task_data.service_id, session)
    if not service:
        raise ServiceNotFoundError()
    
    # Проверяем бронь на существование + ее активность
    reservation = await reservation_crud.get_reservation_by_id(task_data.reservation_id, session)
    if reservation is None:
        raise ReservationNotFoundError()
    if reservation.user != user and user.role != Role.ADMIN:
        raise ForbiddenError(message="Вы можете заказывать услуги только на свои брони")
    if reservation.status != ReservationStatus.ACTIVE:
        raise CannotCreateTaskError(reason="Услугу можно заказать только на активную бронь")

    # Проверяем, что время планирования не в прошлом
    now = datetime.datetime.now() + datetime.timedelta(hours=3)
    if task_data.scheduled_time < now:
        raise CannotCreateTaskError(reason="Нельзя запланировать услугу на прошедшее время")

    # Проверяем время планирования (входит в промежуток брони)
    if not(reservation.check_in_date <= task_data.scheduled_time <= reservation.check_out_date):
        raise CannotCreateTaskError(reason="Услугу можно заказать только в промежуток действия брони")
    
    #  Назначаем сотрудника на выполнение
    positions = await position_crud.get_positions_by_service(task_data.service_id, session) # получаем должности, получаем сотрудников
    active_employees = [] # берем тех, и у кого нет выходных
    for position in positions:
        for employee in position.employees:
            if task_data.scheduled_time.weekday() + 1 not in employee.weekends and employee.status in [EmployeeStatus.ACTIVE, EmployeeStatus.PROBATION]:
                active_employees.append(employee)

    # сортируем по возрастанию по кол активных задач
    active_employees.sort(key=lambda employee: len([t for t in employee.tasks if t.status in [TaskStatus.PENDING, TaskStatus.IN_PROGRESS]]))

    if not active_employees:
        raise CannotCreateTaskError(reason="Не можем найти сотрудника для выполнения услуги! Пожалуйста попробуйте заказать позже")
    
    task_dict = {
        "service_id": service.id,
        "reservation_id": reservation.id,
        "employee_id": active_employees[0].id,
        "scheduled_time": task_data.scheduled_time,
        "comment": task_data.comment,
    }
    reservation.total_price = reservation.total_price + service.price # добавляем сумму за услугу в счет брони
    session.add(reservation)

    task = await task_crud.create_task(task_dict, session)
    return await task_crud.get_task_by_id(task.id, session)


async def started_task_by_id(user: User, task_id: int, session: AsyncSession) -> Task:
    """Начало выполнения задачи (заказанной услуги) сотрудником"""
    task = await task_crud.get_task_by_id(task_id, session)
    if not task:
        raise TaskNotFoundError()
    if task.employee != user.employee:
        raise ForbiddenError(message="Только ответственный за эту задачу сотрудник может ее начать")
    if task.status != TaskStatus.PENDING:
        raise CannotChangeStatusTaskError(reason=f"Задача уже {task.status.value}")
    
    await task_crud.update_task_status_by_id(task_id, TaskStatus.IN_PROGRESS, session)
    return await task_crud.get_task_by_id(task_id, session)
    
    
async def completed_task_by_id(user: User, task_id: int, session: AsyncSession) -> Task:
    """Завершение выполнения задачи (заказанной услуги) сотрудником"""
    task = await task_crud.get_task_by_id(task_id, session)
    if not task:
        raise TaskNotFoundError()
    if task.employee != user.employee:
        raise ForbiddenError(message="Только ответственный за эту задачу сотрудник может ее завершить")
    if task.status != TaskStatus.IN_PROGRESS:
        raise CannotChangeStatusTaskError(reason=f"Задача уже {task.status.value}")
    
    await task_crud.update_task_status_by_id(task_id, TaskStatus.COMPLETED, session)
    return await task_crud.get_task_by_id(task_id, session)


async def canceled_task_by_id(user: User, task_id: int, session: AsyncSession) -> Task:
    """Завершение выполнения задачи (заказанной услуги) сотрудником"""
    task = await task_crud.get_task_by_id(task_id, session)
    if not task:
        raise TaskNotFoundError()
    if task.reservation.user_id != user.id and user.role != Role.ADMIN:
        raise ForbiddenError(message="Только гость заказавший эту услугу может ее отменить")
    if task.status != TaskStatus.PENDING:
        raise CannotChangeStatusTaskError(reason=f"Задача уже {task.status.value}")
    
    await task_crud.update_task_status_by_id(task_id, TaskStatus.CANCELED, session)
    return await task_crud.get_task_by_id(task_id, session)