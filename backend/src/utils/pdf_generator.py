from weasyprint import HTML
from jinja2 import Environment, FileSystemLoader
import os
from pathlib import Path

# Настройка Jinja2
TEMPLATES_DIR = Path(__file__).parent.parent / "templates"
env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))

async def generate_pdf_from_html(template_name: str, context: dict) -> bytes:
    """ Генерирует PDF из HTML шаблона """
    template = env.get_template(f"reports/{template_name}")
    html_content = template.render(**context)
    
    pdf = HTML(string=html_content).write_pdf()
    return pdf