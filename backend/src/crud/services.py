from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import ServiceCategories, Services


async def get_service_by_slug(slug: str, session: AsyncSession) -> Services:
    """ Получение услуги по slug """
    stmt = select(Services).where(Services.slug == slug)
    service = await session.scalar(stmt)
    return service


async def get_services_by_category_by_slug(slug: str, session: AsyncSession) -> list[Services]:
    """ Получение списка услуг по slug категории """
    stmt = (
        select(Services)
        .join(Services.category)
        .where(ServiceCategories.slug == slug)
    )
    services = await session.scalars(stmt)
    return services.all()
