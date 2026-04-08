import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator


class BookCreate(BaseModel):
    title: str
    author: Optional[str] = None
    review: Optional[str] = None
    score: Optional[int] = None

    @field_validator("score")
    @classmethod
    def score_range(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and not (1 <= v <= 10):
            raise ValueError("score must be between 1 and 10")
        return v


class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    review: Optional[str] = None
    score: Optional[int] = None

    @field_validator("score")
    @classmethod
    def score_range(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and not (1 <= v <= 10):
            raise ValueError("score must be between 1 and 10")
        return v


class BookOut(BaseModel):
    id: uuid.UUID
    title: str
    author: Optional[str]
    review: Optional[str]
    score: Optional[int]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
