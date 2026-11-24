
import re
from typing import Literal

from pydantic import (
    BaseModel,
    Field,
    ConfigDict,
    field_validator
)


def normalize_rwanda_phone(value: str) -> str:
    """Normalize and validate Rwandan mobile numbers."""

    value = re.sub(r"[\s-]", "", value)

    if value.startswith("07") and len(value) == 10:
        value = "+250" + value[1:]

    if not re.fullmatch(r"\+2507\d{8}", value):
        raise ValueError(
            "Enter a valid Rwandan mobile number, e.g. 0788123456"
        )

    return value


class FarmerCreate(BaseModel):
    """Information required to register a farmer."""

    model_config = ConfigDict(extra="forbid")

    full_name: str = Field(..., min_length=2, max_length=100)
    phone_number: str
    preferred_language: Literal["rw", "en"]

    @field_validator("full_name")
    @classmethod
    def clean_text(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("Full name cannot be empty.")

        return value

    @field_validator("phone_number")
    @classmethod
    def validate_rwanda_phone(cls, value):
        return normalize_rwanda_phone(value)


class FarmerUpdate(BaseModel):
    """Fields an admin can update."""

    model_config = ConfigDict(extra="forbid")

    full_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    phone_number: str | None = None

    preferred_language: Literal["rw", "en"] | None = None

    @field_validator(
        "full_name",
        "phone_number",
        "preferred_language",
        mode="before"
    )
    @classmethod
    def reject_null_values(cls, value):
        if value is None:
            raise ValueError("This field cannot be null.")

        return value

    @field_validator("full_name")
    @classmethod
    def clean_text(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("Full name cannot be empty.")

        return value

    @field_validator("phone_number")
    @classmethod
    def validate_rwanda_phone(cls, value):
        return normalize_rwanda_phone(value)

class FarmerResponse(BaseModel):
    """Public farmer information. Never expose PIN security fields."""

    model_config = ConfigDict(extra="ignore")

    farmer_id: str
    full_name: str
    phone_number: str

    # Default supports older farmer records without this field.
    preferred_language: Literal["rw", "en"] = "rw"

    phone_verified: bool = False
    is_active: bool = True


class PhoneOTPRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    phone_number: str

    @field_validator("phone_number")
    @classmethod
    def validate_rwanda_phone(cls, value):
        return normalize_rwanda_phone(value)


class FarmerLoginRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    phone_number: str
    pin: str = Field(..., pattern=r"^\d{4,6}$")

    @field_validator("phone_number")
    @classmethod
    def validate_rwanda_phone(cls, value):
        return normalize_rwanda_phone(value)


class FarmerPINSetupRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    phone_number: str
    otp: str = Field(..., pattern=r"^\d{6}$")
    pin: str = Field(..., pattern=r"^\d{4,6}$")

    @field_validator("phone_number")
    @classmethod
    def validate_rwanda_phone(cls, value):
        return normalize_rwanda_phone(value)


class OTPVerifyRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    phone_number: str
    otp: str = Field(..., pattern=r"^\d{6}$")

    @field_validator("phone_number")
    @classmethod
    def validate_rwanda_phone(cls, value):
        return normalize_rwanda_phone(value)


class FarmerPINResetRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    phone_number: str
    otp: str = Field(..., pattern=r"^\d{6}$")
    new_pin: str = Field(..., pattern=r"^\d{4,6}$")

    @field_validator("phone_number")
    @classmethod
    def validate_rwanda_phone(cls, value):
        return normalize_rwanda_phone(value)
