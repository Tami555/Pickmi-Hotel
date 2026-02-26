from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, async_scoped_session
from asyncio import current_task
from src.core import settings
from src.models import Base


class DatabaseHelper:
    def __init__(self, db_url):
        self.engine = create_async_engine(
            url=db_url,
            echo=True, # Отладка
            pool_size=20, 
            max_overflow=30
        )
        self.session_factory = async_sessionmaker(
            bind=self.engine,
            expire_on_commit=False,
            autoflush=False,
            autocommit=False
        )

    async def create_data_base(self):
        async with self.engine.begin() as connect:
            await connect.run_sync(Base.metadata.create_all)

    async def create_session(self):
        async with self.session_factory() as session:
            yield session

    async def create_scoped_session(self):
        session = async_scoped_session(
            session_factory=self.session_factory,
            scopefunc=current_task
        )
        yield session
        await session.remove()  


db_helper = DatabaseHelper(settings.db_async_url)
