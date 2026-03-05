from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import ServiceCategories


async def get_service_categories(session: AsyncSession) -> list[ServiceCategories]:
    """ Получение списка категорий услуг """
    stmt = select(ServiceCategories)
    categories = await session.scalars(stmt)
    return list(categories)


async def get_service_category_by_slug(category_slug:str, session: AsyncSession) -> ServiceCategories | None:
    """ Получение категории услуг по slug """
    stmt = select(ServiceCategories).where(ServiceCategories.slug == category_slug)
    category = await session.scalar(stmt)
    return category
