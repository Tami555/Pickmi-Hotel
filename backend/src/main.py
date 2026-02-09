from fastapi import FastAPI
from core import settings, db_helper
import uvicorn
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    print('Старт...')
    await db_helper.create_data_base()
    yield
    print('Стоп...')


app = FastAPI(lifespan=lifespan)


@app.get('/')
def check_health():
    return {"status": "ok"}


@app.get('/settings')
def get_set():
    return {"settingd": settings.db_async_url}


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)