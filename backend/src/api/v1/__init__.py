from fastapi import APIRouter
from .endpoints.room_types import router as room_types_router
from .endpoints.positions import router as positions_router
from .endpoints.users import router as users_router
from .endpoints.auth import router as auth_router
from .endpoints.rooms import router as rooms_router
from .endpoints.reservations import router as reservation_router
from .endpoints.service_categories import router as service_categories_router
from .endpoints.services import router as service_router
from .endpoints.tasks import router as task_router


router = APIRouter()
router.include_router(room_types_router, prefix='/room-types', tags=["Rooms"])
router.include_router(rooms_router, prefix='/rooms', tags=["Rooms"])
router.include_router(reservation_router, prefix='/reservations', tags=["Reservation"])
router.include_router(auth_router, prefix='/auth', tags=["Auth"])
router.include_router(users_router, prefix='/users', tags=["Users"])
router.include_router(positions_router, prefix='/positions', tags=["Positions"])
router.include_router(service_categories_router, prefix='/services-categories', tags=["Service"])
router.include_router(service_router, prefix='/services', tags=["Service"])
router.include_router(task_router, prefix='/tasks', tags=["Tasks"])


__all__ = ["router"]