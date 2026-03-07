from pathlib import Path
from typing import Dict, Any


def add_css_paths_to_context(
    css_filename: str, 
    template_dict: Dict[str, Any]
) -> Dict[str, Any]:
    """Добавляет в контекст шаблона пути к CSS файлам"""
    
    BASE_CSS_PATH = Path(__file__).parent.parent.parent / "templates" / "styles" / "reports"
    base_css_url = BASE_CSS_PATH / "base_style.css"
    css_url = BASE_CSS_PATH / css_filename
    
    template_dict.update({
        "base_css_url": f"file://{base_css_url.absolute()}",
        "css_url": f"file://{css_url.absolute()}",
    })
    return template_dict