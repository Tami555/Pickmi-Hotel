from sqlalchemy.ext.asyncio import AsyncSession
from src.crud import services as service_crud, service_categories as service_categories_crud
from src.exceptions import ServiceCategoriesNotFoundError, ServiceNotFoundError


async def get_services_by_service_category(category_slug: str, session: AsyncSession):
    """ Получение списка услуг по slug категории услуг """
    category =  await service_categories_crud.get_service_category_by_slug(category_slug, session)
    if category is None:
        raise ServiceCategoriesNotFoundError()
    services = await service_crud.get_services_by_category_by_slug(category_slug, session)
    response = {
        "slug": category.slug,
        "title": category.title,
        "services": services
    }
    return response


async def get_service_by_slug(service_slug: str, session):
    """ Получение подробной информации об услуге по slug"""
    service = await service_crud.get_service_by_slug(service_slug, session)
    if service is None:
        raise ServiceNotFoundError()
    return service