import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from src.crud import tasks as task_crud, positions as position_crud, employees as employee_crud
from src.utils.pdf_generator import generate_pdf_from_html
from src.utils.reports import create_pie_chart, create_bar_chart, get_period_string, add_css_paths_to_context, create_horizontal_bar_chart


COLORS = {
    'purple_deep': '#6A4163',
    'pink_rose': '#D46A92',
    'pink_soft': '#F39DB6',
    'pink_peach': '#F6D2D6',
    'white_creamy': '#FEFAF9'
}


async def get_popular_services(
        session: AsyncSession,
        start_date: datetime.datetime | None,
        end_date: datetime.datetime | None
) -> list[dict]:
    """Получаем данные по популярности услуг"""
    raw_data = await task_crud.get_services_popularity(session, start_date, end_date)
    return [
        {"title": title, "slug": slug, "count": count}
        for title, slug, count in raw_data
    ]


async def get_room_type_stats(
        session: AsyncSession,
        start_date: datetime.datetime | None,
        end_date: datetime.datetime | None
) -> list[dict]:
    """ Получаем топ-услуги по типам номеров """

    raw_data = await task_crud.get_services_by_room_type(session, start_date, end_date)

    # Группируем по типам номеров
    room_type_stats = {}
    for row in raw_data:
        room_type = row.room_type
        service_name = row.service_name
        count = row.order_count
        
        if room_type not in room_type_stats:
            room_type_stats[room_type] = []
        room_type_stats[room_type].append({
            'service': service_name,
            'count': count
        })
    # Для каждого типа номера находим самую популярную услугу
    result_data = []
    for room_type, services in room_type_stats.items():
        services.sort(key=lambda x: x['count'], reverse=True)
        total_orders = sum(s['count'] for s in services)
        
        result_data.append({
            'room_type': room_type,
            'total_orders': total_orders,
            'services': services[:5],  # Топ-5 услуг
            'most_popular': services[0]['service'] if services else None,
            'most_popular_count': services[0]['count'] if services else 0
        })
    # Сортируем по общему количеству заказов
    result_data.sort(key=lambda x: x['total_orders'], reverse=True)
    return result_data


async def get_positions_services(session: AsyncSession) -> list[dict]:
    """Получаем данные по должностям и их услугам"""
    positions = await position_crud.get_positions_with_services_raw(session)

    return [
        {
            'id': pos.id,
            'title': pos.title,
            'description': pos.description,
            'services': [
                {
                    'id': service.id,
                    'title': service.title,
                    'slug': service.slug,
                    'price': service.price
                }
                for service in pos.services
            ]
        }
        for pos in positions
    ]


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


async def generate_services_report(
    session: AsyncSession,
    start_date: datetime.datetime | None = None,
    end_date: datetime.datetime | None = None
) -> bytes:
    """Генерирует отчет по услугам"""

    popular_services = await get_popular_services(session, start_date, end_date)
    room_type_stats = await get_room_type_stats(session, start_date, end_date)
    positions_services = await get_positions_services(session)
    
    # Создаем графики
    pie_chart = None
    bar_chart = None
    
    if popular_services:
        pie_data = [{'label': s['title'], 'value': s['count']} for s in popular_services]
        pie_chart = create_pie_chart(
            data=pie_data,
            title='Популярные услуги'
        )
    
    if room_type_stats:
        bar_data = [{'label': stat['room_type'], 'value': stat['total_orders']} 
                   for stat in room_type_stats[:6]]
        bar_chart = create_bar_chart(
            data=bar_data,
            title='Заказы услуг по типам номеров',
            x_label='Тип номера',
            y_label='Количество заказов'
        )
    
    # контекст для шаблона
    context = {
        'title': 'Отчет по услугам Pickmi Отеля',
        'date': datetime.datetime.now().strftime('%d.%m.%Y %H:%M'),
        'period': get_period_string(start_date, end_date),
        'popular_services': popular_services,
        'popularity_chart': pie_chart,
        'room_type_stats': room_type_stats,
        'room_type_chart': bar_chart,
        'positions_services': positions_services,
        'colors': COLORS,
        'total_services': sum(s['count'] for s in popular_services) if popular_services else 0,
        'unique_services': len(popular_services) if popular_services else 0
    }
    
    context = add_css_paths_to_context("services_style.css", context)

    #  Генерируем PDF
    pdf_bytes = await generate_pdf_from_html('services_report.html', context)
    return pdf_bytes


async def generate_employees_report(
    session: AsyncSession,
    start_date: datetime.datetime | None = None,
    end_date: datetime.datetime | None = None
) -> bytes:
    """ Генерирует отчет по сотрудникам """

    activity_data = await get_employee_activity_data(session, start_date, end_date)
    detailed_stats = await get_detailed_employee_stats(session, start_date, end_date)
    salary_data = await get_employees_salary_data(session)
    
    now = datetime.datetime.now()
    
    if start_date and end_date:
        employee_month_start = start_date
        employee_month_end = end_date
    else:
        employee_month_start = datetime.datetime(now.year, now.month, 1)
        if now.month == 12:
            employee_month_end = datetime.datetime(now.year + 1, 1, 1)
        else:
            employee_month_end = datetime.datetime(now.year, now.month + 1, 1)
    
    employee_of_month = await employee_crud.get_employee_of_the_month(
        session, 
        employee_month_start.month if not (start_date and end_date) else start_date.month,
        employee_month_start.year if not (start_date and end_date) else start_date.year
    )
    
    employee_of_month_data = None
    if employee_of_month:
        found = False
        for emp in activity_data['chart_data']:
            if emp['employee_id'] == employee_of_month.id:
                employee_of_month_data = {
                    'full_name': emp['label'],
                    'position': emp['position'],
                    'completed_tasks': emp['value'], 
                    'salary': next((s['salary'] for s in salary_data['employees'] if s['id'] == employee_of_month.id), 0),
                    'hire_date': employee_of_month.hire_date.strftime('%d.%m.%Y')
                }
                found = True
                break
        
        if not found and employee_of_month.user:
            employee_of_month_data = {
                'full_name': f"{employee_of_month.user.first_name} {employee_of_month.user.last_name}",
                'position': employee_of_month.position.title if employee_of_month.position else 'Не указана',
                'completed_tasks': 0,
                'salary': employee_of_month.salary,
                'hire_date': employee_of_month.hire_date.strftime('%d.%m.%Y')
            }
    
    # Создаем диаграммы
    activity_chart = None
    if activity_data['chart_data']:
        # топ-10
        top_10_data = activity_data['chart_data'][:10]
        activity_chart = create_bar_chart(
            data=top_10_data,
            title='Активность сотрудников (топ-10)',
            x_label='Сотрудник',
            y_label='Количество выполненных задач',
            figsize=(12, 7)
        )
    
    efficiency_data = []
    if detailed_stats:
        for stat in detailed_stats[:8]:
            name_parts = stat['full_name'].split()
            short_name = name_parts[0]
            if len(name_parts) > 1:
                short_name += ' ' + name_parts[1][0] + '.'
            
            efficiency_data.append({
                'label': short_name,
                'value': stat['efficiency']
            })
    
    efficiency_chart = None
    if efficiency_data:
        efficiency_chart = create_horizontal_bar_chart(
            data=efficiency_data,
            title='Эффективность сотрудников (%)',
            x_label='Процент выполненных задач',
            y_label='Сотрудник',
            figsize=(10, 6)
        )
    
    # контекст для шаблона
    context = {
        'title': 'Отчет по сотрудникам Pickmi Отеля 👥',
        'date': datetime.datetime.now().strftime('%d.%m.%Y %H:%M'),
        'period': get_period_string(start_date, end_date),
        'activity_chart': activity_chart,
        'efficiency_chart': efficiency_chart,
        'total_employees': salary_data['total_count'],
        'total_completed_tasks': activity_data['total_completed'],
        'avg_tasks_per_employee': activity_data['avg_per_employee'],
        'total_salary_fund': salary_data['total_salary'],
        'avg_salary': salary_data['avg_salary'],
        'employee_of_month': employee_of_month_data,
        'detailed_stats': detailed_stats[:15],
        'salary_data': salary_data['employees'],
        'colors': COLORS
    }
    context = add_css_paths_to_context("employees_style.css", context)
    
    # Генерируем PDF
    pdf_bytes = await generate_pdf_from_html('employees_report.html', context)
    return pdf_bytes