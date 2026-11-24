
from typing import Literal

from pydantic import BaseModel, Field, ConfigDict


class AIAdviceRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    parcel_id: str = Field(
        ...,
        min_length=1,
        max_length=64,
        description="ID of the parcel selected by the farmer"
    )

    question: str = Field(
        ...,
        min_length=3,
        max_length=2000,
        description="Farmer's agricultural question"
    )

    language: Literal["rw", "en"] = Field(
        ...,
        description="Response language: rw for Kinyarwanda, en for English"
    )
