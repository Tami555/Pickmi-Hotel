from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from core import db_helper
import crud.rooms as crud
from schemas import RoomTypeResponse, RoomTypeDetailResponse


router = APIRouter()


@router.get('/', response_model=list[RoomTypeResponse], summary="Getting all types of rooms")
async def get_room_types(session: AsyncSession=Depends(db_helper.create_scoped_session)) -> list[RoomTypeResponse]:
    return await crud.get_room_types(session)


@router.get('/{slug}', response_model=RoomTypeDetailResponse, summary="Getting the type of room by slug")
async def get_room_type_by_slug(
    slug: str, session: AsyncSession=Depends(db_helper.create_scoped_session)
) -> RoomTypeDetailResponse:
    room_type = await crud.get_room_type_by_slug(slug, session)
    if not room_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Room type {slug} not found"
        )
    return RoomTypeDetailResponse.from_orm_with_amenities(room_type)
