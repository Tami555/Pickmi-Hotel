import datetime
from fastapi import APIRouter, Depends, HTTPException, Path, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated
from src.core import db_helper
import src.crud.room_types as crud
from src.schemas import RoomTypeDetailResponse, RoomTypeAmenitiesResponse, RoomTypeAvailabilityResponse, RoomTypeOccupancyResponse
from src.services import rooms_service
from src.exceptions import AppException


router = APIRouter()


@router.get('/', response_model=list[RoomTypeDetailResponse], summary="Getting all types of rooms")
async def get_room_types(session: AsyncSession = Depends(db_helper.create_scoped_session)):
    return await crud.get_room_types(session)


@router.get('/{slug}', response_model=RoomTypeAmenitiesResponse, summary="Getting the type of room by slug")
async def get_room_type_by_slug(
    slug: Annotated[str, Path(example="lyuks")],
    session: AsyncSession = Depends(db_helper.create_scoped_session)
) -> RoomTypeAmenitiesResponse:
    try:
        room_type = await rooms_service.get_room_type_by_slug(slug, session)
        return RoomTypeAmenitiesResponse.from_orm_with_amenities(room_type)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)
    

@router.get('/rooms/available/count', response_model=list[RoomTypeAvailabilityResponse])
async def get_available_rooms_count(
    quantity_places: Annotated[int, Query(gt=0, example=2)],
    check_in: Annotated[datetime.datetime, Query(example='2026-12-10 10:10')],
    check_out: Annotated[datetime.datetime, Query(example='2027-01-10 10:10')],
    session: AsyncSession = Depends(db_helper.create_scoped_session)
):
    """Получение количества свободных номеров по каждому типу"""
    try:
        return await rooms_service.get_available_rooms_count( quantity_places, check_in, check_out, session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)
    
