from fastapi import APIRouter, Depends
from schemas import UserResponse
from .employees import router as employees_router
from .guests import router as guests_router
from .admin import router as admin_router
from ..dependencies.auth import get_current_user
from models import User


router = APIRouter()
router.include_router(employees_router, prefix='/employees', tags=["Users-Employees"])
router.include_router(guests_router, prefix='/guests', tags=["Users-Guests"])
router.include_router(admin_router, prefix='/admin', tags=["Users-Admin"])


@router.get("/profile", response_model=UserResponse)
def get_profile(user: User = Depends(get_current_user)):
    return user
