from pydantic import BaseModel


class ServiceCategoryResponse(BaseModel):
    slug: str
    title: str