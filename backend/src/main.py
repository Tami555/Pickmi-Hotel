import uvicorn
from fastapi import FastAPI
from contextlib import asynccontextmanager
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
app.include_router(api_v1_router, prefix="/api/v1")


@app.get('/')
def check_health():
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)