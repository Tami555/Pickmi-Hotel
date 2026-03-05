from pydantic import BaseModel


class ServiceResponse(BaseModel):
    slug: str
    title: str
    price: int


class ServiceDetailResponse(ServiceResponse):
    description: str
    image: str | None