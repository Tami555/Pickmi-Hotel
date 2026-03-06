import datetime
import matplotlib.pyplot as plt
from io import BytesIO
import base64
from sqlalchemy.ext.asyncio import AsyncSession

from src.crud.tasks import get_services_popularity
from src.utils.pdf_generator import generate_pdf_from_html


COLORS = {
    'purple_deep': '#6A4163',
    'pink_rose': '#D46A92',
    'pink_soft': '#F39DB6',
    'pink_peach': '#F6D2D6',
    'white_creamy': '#FEFAF9'
}

async def generate_services_report(start_date, end_date, session: AsyncSession) -> bytes:
    """ Генерация отчет по услугам """

    popular_services = await get_services_popularity(session, start_date, end_date)
    # Создаем круговую диаграмму
    chart_base64 = create_pie_chart(popular_services)
    
    # контекст для шаблона
    context = {
        'title': 'Отчет по услугам отеля',
        'date': datetime.datetime.now().strftime('%d.%m.%Y'),
        'popular_services': popular_services,
        'popularity_chart': chart_base64,
        'colors': COLORS
    }
    pdf_bytes = await generate_pdf_from_html('services_report.html', context)
    return pdf_bytes


def create_pie_chart(services_data: list[dict]) -> str:
    """ Создает круговую диаграмму и возвращает ее в base64 """

    plt.style.use('seaborn-v0_8')
    
    labels = [item['title'] for item in services_data]
    sizes = [item['count'] for item in services_data]
    
    # Твоя цветовая гамма для диаграммы
    colors = [COLORS['purple_deep'], COLORS['pink_rose'], 
              COLORS['pink_soft'], COLORS['pink_peach']]
    
    # Создание диаграммы
    fig, ax = plt.subplots(figsize=(10, 8))
    wedges, texts, autotexts = ax.pie(
        sizes, 
        labels=labels, 
        colors=colors,
        autopct='%1.1f%%',
        startangle=90,
        textprops={'fontsize': 12, 'color': COLORS['purple_deep']}
    )
    
    # Настройка внешнего вида
    plt.setp(autotexts, size=10, weight="bold", color=COLORS['white_creamy'])
    ax.set_title('Популярные услуги', fontsize=16, color=COLORS['purple_deep'], pad=20)
    
    # Сохраняем в base64
    buffer = BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight', dpi=300, 
                facecolor=COLORS['white_creamy'])
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.getvalue()).decode()
    plt.close()
    
    return f"data:image/png;base64,{image_base64}"