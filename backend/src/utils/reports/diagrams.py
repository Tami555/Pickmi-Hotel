import matplotlib.pyplot as plt
from io import BytesIO
import base64
from typing import List, Dict, Any


COLORS = {
    'purple_deep': '#6A4163',
    'pink_rose': '#D46A92',
    'pink_soft': '#F39DB6',
    'pink_peach': '#F6D2D6',
    'white_creamy': '#FEFAF9'
}


def _prepare_figure(title: str = '', figsize: tuple = (10, 8)) -> tuple:
    """Подготавливает фигуру с общими настройками"""
    plt.style.use('seaborn-v0_8')
    fig, ax = plt.subplots(figsize=figsize)
    fig.patch.set_facecolor(COLORS['white_creamy'])
    ax.set_facecolor(COLORS['white_creamy'])
    ax.set_title(title, fontsize=16, color=COLORS['purple_deep'], pad=20)
    return fig, ax


def _save_fig_to_base64(fig) -> str:
    """Сохраняет фигуру в base64 строку"""
    buffer = BytesIO()
    fig.savefig(buffer, format='png', bbox_inches='tight', dpi=300, 
                facecolor=COLORS['white_creamy'])
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.getvalue()).decode()
    plt.close(fig)
    return f"data:image/png;base64,{image_base64}"


def _extract_labels_and_values(data: List[Dict[str, Any]]) -> tuple:
    """Извлекает лейблы и значения из данных"""
    labels = [item.get('label', item.get('title', item.get('room_type', f'Item {i}'))) 
              for i, item in enumerate(data)]
    values = [item.get('value', item.get('count', item.get('total_orders', 0))) 
              for item in data]
    return labels, values


def create_pie_chart(
    data: List[Dict[str, Any]],
    title: str = '',
    figsize: tuple = (10, 8)
) -> str:
    """ Создает круговую диаграмму """
    labels, values = _extract_labels_and_values(data)
    fig, ax = _prepare_figure(title, figsize)
    
    chart_colors = [COLORS['purple_deep'], COLORS['pink_rose'], 
                    COLORS['pink_soft'], COLORS['pink_peach']]
    
    wedges, texts, autotexts = ax.pie(
        values,
        labels=labels,
        colors=chart_colors[:len(values)],
        autopct='%1.1f%%',
        startangle=90,
        textprops={'fontsize': 12, 'color': COLORS['purple_deep']}
    )
    plt.setp(autotexts, size=10, weight="bold", color=COLORS['white_creamy'])
    
    return _save_fig_to_base64(fig)


def create_bar_chart(
    data: List[Dict[str, Any]],
    title: str = '',
    x_label: str = '',
    y_label: str = '',
    figsize: tuple = (10, 8)
) -> str:
    """ Создает столбчатую диаграмму """
    labels, values = _extract_labels_and_values(data)
    fig, ax = _prepare_figure(title, figsize)
    
    bars = ax.bar(labels, values, color=COLORS['pink_rose'])
    ax.set_xlabel(x_label, color=COLORS['purple_deep'])
    ax.set_ylabel(y_label, color=COLORS['purple_deep'])
    ax.tick_params(colors=COLORS['purple_deep'])
    
    for bar, value in zip(bars, values):
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height,
               f'{value}', ha='center', va='bottom', color=COLORS['purple_deep'])
    
    return _save_fig_to_base64(fig)


def create_horizontal_bar_chart(
    data: List[Dict[str, Any]],
    title: str = '',
    x_label: str = '',
    y_label: str = '',
    figsize: tuple = (10, 8)
) -> str:
    """ Создает горизонтальную столбчатую диаграмму """
    labels, values = _extract_labels_and_values(data)
    fig, ax = _prepare_figure(title, figsize)
    
    y_pos = range(len(labels))
    bars = ax.barh(y_pos, values, color=COLORS['pink_rose'])
    ax.set_yticks(y_pos)
    ax.set_yticklabels(labels, color=COLORS['purple_deep'])
    ax.set_xlabel(x_label, color=COLORS['purple_deep'])
    ax.tick_params(colors=COLORS['purple_deep'])
    
    for i, (bar, value) in enumerate(zip(bars, values)):
        ax.text(value, bar.get_y() + bar.get_height()/2, 
               f'{value}', ha='left', va='center', color=COLORS['purple_deep'])
    
    return _save_fig_to_base64(fig)