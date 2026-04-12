import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator


class BookBase(BaseModel):
    author: Optional[str] = None
    review: Optional[str] = None
    score: Optional[float] = None
    cover_url: Optional[str] = None
    pages: Optional[int] = None

    @field_validator("score")
    @classmethod
    def score_range(cls, v: Optional[float]) -> Optional[float]:
        valid = {i / 2 for i in range(1, 11)}  # 0.5, 1.0, 1.5, ... 5.0
        if v is not None and v not in valid:
            raise ValueError("score must be a half-star increment between 0.5 and 5.0")
        return v


class BookCreate(BookBase):
    title: str


class BookUpdate(BookBase):
    title: Optional[str] = None


class BookOut(BaseModel):
    id: uuid.UUID
    title: str
    author: Optional[str]
    review: Optional[str]
    score: Optional[float]
    cover_url: Optional[str]
    pages: Optional[int]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
