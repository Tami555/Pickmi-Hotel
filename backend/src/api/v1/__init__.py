from fastapi import APIRouter
from .endpoints.rooms import router as rooms_router


router = APIRouter()
router.include_router(rooms_router, prefix='/room-types', tags=["Rooms"])


__all__ = ["router"]