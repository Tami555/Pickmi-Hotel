from fastapi import APIRouter, Depends
from schemas import UserResponse, UserDetailResponse
from .employees import router as employees_router
from .guests import router as guests_router
from ..dependencies.auth import get_current_user
from models import User


router = APIRouter()
router.include_router(employees_router, prefix='/employees', tags=["Users-Employees"])
router.include_router(guests_router, prefix='/guests', tags=["Users-Guests"])


@router.get("/profile", response_model=UserDetailResponse)
def get_profile(user: User = Depends(get_current_user)):
    return user
