from pydantic import BaseModel


class AmenityResponse(BaseModel):
    title: str
    image: str | None
    is_main: bool