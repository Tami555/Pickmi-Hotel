import uvicorn
from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from api.v1 import router as api_v1_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print('Старт...')
    # await db_helper.create_data_base()
    yield
    print('Стоп...')


app = FastAPI(
    lifespan=lifespan,
    description="API (v.1) for a hotel management system for real pickme",
    title="API for Pickmi Hotel",
)
# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],  # разрешить все методы
    allow_headers=["*"],  # разрешить все заголовки
)
app.include_router(api_v1_router, prefix="/api/v1")


@app.get('/')
def check_health():
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)