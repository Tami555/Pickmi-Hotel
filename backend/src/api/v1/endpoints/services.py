from fastapi import APIRouter, Depends, HTTPException, Path, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated
from src.core import db_helper
from src.schemas import ServiceDetailResponse
from src.exceptions import AppException
from src.services import service_service


router = APIRouter()


@router.get('/{service_slug}', response_model=ServiceDetailResponse)
async def get_service_by_slug(
    service_slug: Annotated[str, Path(example="ezhednevnaya-uborka-nomera")],
    session: AsyncSession = Depends(db_helper.create_scoped_session)
):
    try:
        return await service_service.get_service_by_slug(service_slug, session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)

