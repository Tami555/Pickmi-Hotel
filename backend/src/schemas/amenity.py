from pydantic import BaseModel


class AmenityResponse(BaseModel):
    title: str
    is_main: bool