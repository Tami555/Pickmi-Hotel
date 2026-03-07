import datetime
import matplotlib.pyplot as plt
from io import BytesIO
import base64
from sqlalchemy.ext.asyncio import AsyncSession
from pathlib import Path
from src.crud import tasks as task_cud, positions as position_crud
from src.utils.pdf_generator import generate_pdf_from_html


COLORS = {
    'purple_deep': '#6A4163',
    'pink_rose': '#D46A92',
    'pink_soft': '#F39DB6',
    'pink_peach': '#F6D2D6',
    'white_creamy': '#FEFAF9'
}

async def generate_services_report(
    session: AsyncSession,
    start_date: datetime.datetime | None = None,
    end_date: datetime.datetime | None = None
) -> bytes:
    """ Генерирует отчет по услугам """
    # Получаем данные
    popular_services = await task_cud.get_services_popularity(session, start_date, end_date)
    room_type_stats = await task_cud.get_services_by_room_type(session, start_date, end_date)
    positions_services = await position_crud.get_positions_with_services(session)
    
    # Создаем графики
    pie_chart = None
    bar_chart = None
    
    if popular_services:
        pie_data = [{'label': s['title'], 'value': s['count']} for s in popular_services]
        pie_chart = create_chart_base64(
            data=pie_data,
            chart_type='pie',
            title='Популярные услуги'
        )
    
    if room_type_stats:
        # Данные для столбчатой диаграммы - общее количество заказов по типам номеров
        bar_data = [{'label': stat['room_type'], 'value': stat['total_orders']} 
                   for stat in room_type_stats[:6]]  # Топ-6 типов номеров
        bar_chart = create_chart_base64(
            data=bar_data,
            chart_type='bar',
            title='Заказы услуг по типам номеров',
            x_label='Тип номера',
            y_label='Количество заказов'
        )
    
    # Подготавливаем контекст для шаблона
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
        'total_services': sum(s['count'] for s in popular_services),
        'unique_services': len(popular_services)
    }
    context = push_css_absolute_urls("services_style.css", context)
    
    # Генерируем PDF
    pdf_bytes = await generate_pdf_from_html('services_report.html', context)
    return pdf_bytes


def get_period_string(start_date: datetime.datetime | None, end_date: datetime.datetime | None) -> str:
    """Формирует строку с периодом отчета"""
    if start_date and end_date:
        return f"с {start_date.strftime('%d.%m.%Y')} по {end_date.strftime('%d.%m.%Y')}"
    elif start_date:
        return f"с {start_date.strftime('%d.%m.%Y')}"
    elif end_date:
        return f"по {end_date.strftime('%d.%m.%Y')}"
    else:
        return "за всё время"


def create_chart_base64(
    data: list[dict],
    chart_type: str = 'pie',
    title: str = '',
    x_label: str = '',
    y_label: str = '',
    figsize: tuple[int, int] = (10, 8)
) -> str:
    """
    Универсальная функция для создания графиков
    
    Args:
        data: список словарей с данными
        chart_type: тип графика ('pie', 'bar', 'line', 'horizontal_bar')
        title: заголовок графика
        x_label: подпись оси X
        y_label: подпись оси Y
        figsize: размер фигуры
    """
    plt.style.use('seaborn-v0_8')
    fig, ax = plt.subplots(figsize=figsize)
    
    if chart_type == 'pie':
        # Для круговой диаграммы ожидаем ключи 'label' и 'value' в данных
        labels = [item.get('label', item.get('title', f'Item {i}')) for i, item in enumerate(data)]
        values = [item.get('value', item.get('count', 0)) for item in data]
        
        colors = [COLORS['purple_deep'], COLORS['pink_rose'], 
                  COLORS['pink_soft'], COLORS['pink_peach']]
        
        wedges, texts, autotexts = ax.pie(
            values,
            labels=labels,
            colors=colors[:len(values)],
            autopct='%1.1f%%',
            startangle=90,
            textprops={'fontsize': 12, 'color': COLORS['purple_deep']}
        )
        plt.setp(autotexts, size=10, weight="bold", color=COLORS['white_creamy'])
        
    elif chart_type == 'bar':
        # Столбчатая диаграмма
        labels = [item.get('label', item.get('title', f'Item {i}')) for i, item in enumerate(data)]
        values = [item.get('value', item.get('count', 0)) for item in data]
        
        bars = ax.bar(labels, values, color=COLORS['pink_rose'])
        ax.set_xlabel(x_label, color=COLORS['purple_deep'])
        ax.set_ylabel(y_label, color=COLORS['purple_deep'])
        ax.tick_params(colors=COLORS['purple_deep'])
        
        # Добавляем значения над столбцами
        for bar, value in zip(bars, values):
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height,
                   f'{value}', ha='center', va='bottom', color=COLORS['purple_deep'])
            
    elif chart_type == 'horizontal_bar':
        # Горизонтальная столбчатая диаграмма
        labels = [item.get('label', item.get('title', f'Item {i}')) for i, item in enumerate(data)]
        values = [item.get('value', item.get('count', 0)) for item in data]
        
        y_pos = range(len(labels))
        bars = ax.barh(y_pos, values, color=COLORS['pink_rose'])
        ax.set_yticks(y_pos)
        ax.set_yticklabels(labels, color=COLORS['purple_deep'])
        ax.set_xlabel(x_label, color=COLORS['purple_deep'])
        ax.tick_params(colors=COLORS['purple_deep'])
        
        # Добавляем значения
        for i, (bar, value) in enumerate(zip(bars, values)):
            ax.text(value, bar.get_y() + bar.get_height()/2, 
                   f'{value}', ha='left', va='center', color=COLORS['purple_deep'])
    
    ax.set_title(title, fontsize=16, color=COLORS['purple_deep'], pad=20)
    
    # Настройка фона
    fig.patch.set_facecolor(COLORS['white_creamy'])
    ax.set_facecolor(COLORS['white_creamy'])
    
    # Сохраняем в base64
    buffer = BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight', dpi=300, 
                facecolor=COLORS['white_creamy'])
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.getvalue()).decode()
    plt.close()
    
    return f"data:image/png;base64,{image_base64}"



def push_css_absolute_urls(css_filename: str, template_dict: dict):
    "Добавлем к контекст шаблона пути к css файлам"
    BASE_CSS_PATH = Path(__file__).parent.parent / "templates" / "styles" / "reports"
    base_css_url, css_filename  = BASE_CSS_PATH / "base_style.css", BASE_CSS_PATH / css_filename

    template_dict.update({
        "base_css_url": f"file://{base_css_url.absolute()}",
        "css_url": f"file://{css_filename.absolute()}",
    })
    return template_dict