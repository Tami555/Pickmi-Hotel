import datetime
from fastapi import APIRouter, Depends, HTTPException, Path, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated
from src.core import db_helper
import src.crud.service_categories as crud
from src.schemas import ServiceCategoryResponse, ServiceResponse
from src.services import service_service
from src.exceptions import AppException


router = APIRouter()


@router.get('/', response_model=list[ServiceCategoryResponse])
async def get_service_categories(session: AsyncSession = Depends(db_helper.create_scoped_session)):
    return await crud.get_service_categories(session)


@router.get('/{category_slug}/services', response_model=list[ServiceResponse])
async def get_services_by_category(
    category_slug: Annotated[str, Path(example="uborka-i-klining")],
    session: AsyncSession = Depends(db_helper.create_scoped_session)
):
    try:
        return await service_service.get_services_by_service_category(category_slug, session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)