import datetime
from typing import Optional


def get_period_string(
    start_date: Optional[datetime.datetime] = None, 
    end_date: Optional[datetime.datetime] = None
) -> str:
    """Формирует строку с периодом отчета"""
    if start_date and end_date:
        return f"с {start_date.strftime('%d.%m.%Y')} по {end_date.strftime('%d.%m.%Y')}"
    elif start_date:
        return f"с {start_date.strftime('%d.%m.%Y')}"
    elif end_date:
        return f"по {end_date.strftime('%d.%m.%Y')}"
    else:
        return "за всё время"


def generate_filename(
    report_type: str,
    start_date: Optional[datetime.date] = None,
    end_date: Optional[datetime.date] = None
) -> str:
    """Генерирует имя файла для отчета"""
    period_str = ""
    if start_date and end_date:
        period_str = f"_{start_date}_{end_date}"
    elif start_date:
        period_str = f"_from_{start_date}"
    elif end_date:
        period_str = f"_to_{end_date}"
    
    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    return f"{report_type}_report{period_str}_{timestamp}.pdf"


def format_date(date: datetime.date | datetime.datetime, format: str = '%d.%m.%Y') -> str:
    """Форматирует дату"""
    return date.strftime(format)