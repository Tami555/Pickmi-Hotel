from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import User
from src.core import db_helper
from src.exceptions import AppException
from src.services import reservation_service
from src.schemas import ReservationResponse, ReservationCreate, ReservationDetailResponse
from ..dependencies.auth import guest_by_token, get_current_user


router = APIRouter()


@router.post('/', response_model=ReservationDetailResponse)
async def create_reservation(
        reservation_data: ReservationCreate,
        user: User = Depends(guest_by_token),
        session: AsyncSession = Depends(db_helper.create_scoped_session)
):
    try:
        return await reservation_service.create_reservation(user, reservation_data, session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)
    

@router.patch('/{reservation_id}/cancel', response_model=ReservationResponse)
async def cancel_reservation(
    reservation_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.create_scoped_session)
) -> ReservationResponse:
    try:
        return await reservation_service.cancel_reservation(reservation_id, user, session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)