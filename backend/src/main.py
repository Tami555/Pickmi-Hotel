from fastapi import FastAPI
from core.config import settings
import uvicorn


app = FastAPI()


@app.get('/')
def check_health():
    return {"status": "ok"}


@app.get('/settings')
def get_set():
    return {"settingd": settings.db_async_url}


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)