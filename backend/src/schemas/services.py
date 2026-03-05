from pydantic import BaseModel


class ServiceResponse(BaseModel):
    id: int
    slug: str
    title: str
    price: int


class ServiceDetailResponse(ServiceResponse):
    description: str
    image: str | None