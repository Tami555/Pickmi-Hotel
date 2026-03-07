import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from src.crud import tasks as task_crud, employees as employee_crud


async def get_employee_activity_data(
    session: AsyncSession,
    start_date: datetime.datetime | None,
    end_date: datetime.datetime | None
) -> dict:
    """ Получает и обрабатывает данные об активности сотрудников """

    raw_stats = await task_crud.get_completed_tasks_count_by_employee(
        session, start_date, end_date
    )
    
    if not raw_stats:
        return {
            'chart_data': [],
            'top_employees': [],
            'total_completed': 0,
            'avg_per_employee': 0
        }
    
    employees_data = []
    total_completed = 0
    
    for row in raw_stats:
        full_name = f"{row.first_name} {row.last_name}"
        employees_data.append({
            'label': full_name,
            'value': row.completed_tasks,
            'position': row.position,
            'employee_id': row.id
        })
        total_completed += row.completed_tasks
    
    # Топ-3 сотрудника
    top_employees = employees_data[:3]
    
    return {
        'chart_data': employees_data,
        'top_employees': top_employees,
        'total_completed': total_completed,
        'avg_per_employee': round(total_completed / len(employees_data), 1) if employees_data else 0
    }


async def get_detailed_employee_stats(
    session: AsyncSession,
    start_date: datetime.datetime | None,
    end_date: datetime.datetime | None
) -> list[dict]:
    """ Получает детальную статистику по сотрудникам """
    raw_stats = await task_crud.get_employee_performance_stats(session, start_date, end_date)
    
    result = []
    for row in raw_stats:
        full_name = f"{getattr(row, 'first_name', '')} {getattr(row, 'last_name', '')}".strip()
        if not full_name:
            full_name = "Неизвестный сотрудник"
        
        total_tasks = getattr(row, 'total_tasks', 0) or 0
        completed_tasks = getattr(row, 'completed_tasks', 0) or 0
        canceled_tasks = getattr(row, 'canceled_tasks', 0) or 0
        avg_time = getattr(row, 'avg_completion_time_hours', 0) or 0
        
        # Расчет эффективности
        efficiency = 0
        if total_tasks > 0:
            efficiency = round((completed_tasks / total_tasks) * 100, 1)
        
        result.append({
            'employee_id': getattr(row, 'id', None),
            'full_name': full_name,
            'position': getattr(row, 'position', 'Не указана'),
            'total_tasks': total_tasks,
            'completed_tasks': completed_tasks,
            'canceled_tasks': canceled_tasks,
            'avg_completion_time': round(avg_time, 1) if avg_time else 0,
            'efficiency': efficiency
        })
    result.sort(key=lambda x: x['efficiency'], reverse=True)
    return result


async def get_employees_salary_data(session: AsyncSession) -> dict:
    """ Получает данные по зарплатам сотрудников """
    employees = await employee_crud.get_employees_with_positions(session)
    
    result = []
    total_salary = 0
    
    for emp in employees:
        if emp and hasattr(emp, 'salary') and emp.salary is not None:
            # Расчет годового дохода
            months_worked = 12
            yearly_salary = emp.salary * months_worked
            
            full_name = "Неизвестный сотрудник"
            if emp.user:
                full_name = f"{emp.user.first_name or ''} {emp.user.last_name or ''}".strip()
            
            position_title = "Не указана"
            if emp.position:
                position_title = emp.position.title or "Не указана"
            
            result.append({
                'id': emp.id,
                'full_name': full_name,
                'position': position_title,
                'salary': emp.salary,
                'advance': emp.advance or 0,
                'yearly_salary': yearly_salary,
                'hire_date': emp.hire_date.strftime('%d.%m.%Y') if emp.hire_date else '—',
                'status': emp.status.value if emp.status else 'active',
                'bank_account': emp.bank_account or '—'
            })
            total_salary += emp.salary
    
    return {
        'employees': result,
        'total_salary': total_salary,
        'avg_salary': round(total_salary / len(result)) if result else 0,
        'total_count': len(result)
    }


async def get_employee_of_month_data(
    session: AsyncSession,
    activity_data: dict,
    salary_data: dict,
    start_date: datetime.datetime | None = None,
    end_date: datetime.datetime | None = None
) -> dict | None:
    """Получает данные о сотруднике месяца"""
    now = datetime.datetime.now()
    
    if start_date and end_date:
        month = start_date.month
        year = start_date.year
    else:
        month = now.month
        year = now.year
    
    employee_of_month = await employee_crud.get_employee_of_the_month(
        session, month, year
    )
    
    if not employee_of_month:
        return None
    
    for emp in activity_data.get('chart_data', []):
        if emp['employee_id'] == employee_of_month.id:
            return {
                'full_name': emp['label'],
                'position': emp['position'],
                'completed_tasks': emp['value'],
                'salary': next((s['salary'] for s in salary_data['employees'] if s['id'] == employee_of_month.id), 0),
                'hire_date': employee_of_month.hire_date.strftime('%d.%m.%Y')
            }
    
    if employee_of_month.user:
        return {
            'full_name': f"{employee_of_month.user.first_name} {employee_of_month.user.last_name}",
            'position': employee_of_month.position.title if employee_of_month.position else 'Не указана',
            'completed_tasks': 0,
            'salary': employee_of_month.salary,
            'hire_date': employee_of_month.hire_date.strftime('%d.%m.%Y')
        }
    
    return None