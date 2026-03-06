from pydantic import BaseModel


class ServiceResponse(BaseModel):
    id: int
    slug: str
    title: str
    price: int
    description: str
    image: str | None


class ServiceDetailResponse(ServiceResponse):
    pass