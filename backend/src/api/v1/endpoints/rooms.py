import datetime
from fastapi import APIRouter, Depends, Path, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated

from src.core import db_helper
from src.schemas import RoomResult, RoomTypeOccupancyResponse
from src.services import rooms_service
from src.exceptions import AppException


router = APIRouter()


@router.get('/available/by-type/{room_type_slug}', response_model=list[RoomResult])
async def get_available_rooms(
        room_type_slug: Annotated[str, Path(example='lyuks')],
        quantity_places: Annotated[int, Query(gt=0, example=2)],
        check_in: Annotated[datetime.datetime, Query(example='2026-12-10 10:10')],
        check_out: Annotated[datetime.datetime, Query(example='2027-01-10 10:10')],
        session: AsyncSession = Depends(db_helper.create_scoped_session)
):
    try:
        return await rooms_service.get_available_rooms(room_type_slug, quantity_places, check_in, check_out, session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)
    

@router.get('/occupancy/by-type/{room_type_slug}', response_model=RoomTypeOccupancyResponse)
async def get_rooms_occupancy_by_type(
    room_type_slug: Annotated[str, Path(example='lyuks')],
    session: AsyncSession = Depends(db_helper.create_scoped_session)
) -> RoomTypeOccupancyResponse:
    """Получение всех номеров типа с информацией о загруженности"""
    try:
        return await rooms_service.get_rooms_by_type_with_occupancy(room_type_slug, session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)