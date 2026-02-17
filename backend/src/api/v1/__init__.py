from fastapi import APIRouter
from .endpoints.rooms import router as rooms_router
from .endpoints.users import router as users_router


router = APIRouter()
router.include_router(rooms_router, prefix='/room-types', tags=["Rooms"])
router.include_router(users_router, prefix='/users', tags=["Users"])


__all__ = ["router"]