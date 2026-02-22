from fastapi import APIRouter, Depends, Path, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated

from core import db_helper
import crud.positions as crud
from schemas import PositionResponse, PositionDetailResponse


router = APIRouter()


@router.get('/', response_model=list[PositionResponse])
async def get_positions(session: AsyncSession = Depends(db_helper.create_scoped_session)) -> list[PositionResponse]:
    return await crud.get_positions(session)


@router.get('/{position_id}', response_model=PositionDetailResponse)
async def get_positions_by_id(
    position_id: Annotated[int, Path(example=1)],
    session: AsyncSession = Depends(db_helper.create_scoped_session)
) -> PositionDetailResponse:
    position = await crud.get_position_by_id(position_id, session)
    if position is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Position {position_id} not found")
    return position
