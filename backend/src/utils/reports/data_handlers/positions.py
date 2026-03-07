from sqlalchemy.ext.asyncio import AsyncSession
from src.crud import positions as position_crud


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