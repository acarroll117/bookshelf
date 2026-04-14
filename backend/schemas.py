import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator

VALID_SCORES = {i / 2 for i in range(1, 11)}


class BookBase(BaseModel):
    author: Optional[str] = None
    review: Optional[str] = None
    score: Optional[float] = None
    cover_url: Optional[str] = None
    pages: Optional[int] = None

    @field_validator("score")
    @classmethod
    def score_range(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v not in VALID_SCORES:
            raise ValueError("score must be a half-star increment between 0.5 and 5.0")
        return v


class BookCreate(BookBase):
    title: str

    @field_validator("title")
    @classmethod
    def title_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("title cannot be blank")
        return v


class BookUpdate(BookBase):
    title: Optional[str] = None

    @field_validator("title")
    @classmethod
    def title_not_blank(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError("title cannot be blank")
        return v


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
