
from pydantic import (
    BaseModel,
    Field,
    field_validator,
    model_validator,
    ConfigDict
)


class ParcelCreate(BaseModel):
    """Fields a farmer provides when registering their own parcel."""

    model_config = ConfigDict(extra="forbid")

    # UPI is mandatory for every new parcel.
    upi: str = Field(..., min_length=1, max_length=64)
    parcel_name: str | None = Field(default=None, max_length=100)

    district: str = Field(..., min_length=2, max_length=100)
    sector: str = Field(..., min_length=2, max_length=100)
    cell: str = Field(..., min_length=2, max_length=100)
    village: str = Field(..., min_length=2, max_length=100)

    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)

    area_hectares: float | None = Field(default=None, gt=0)

    @field_validator("upi")
    @classmethod
    def normalize_upi(cls, value):
        value = value.strip().upper()

        if not value:
            raise ValueError("UPI cannot be empty.")

        return value

    @field_validator(
        "district",
        "sector",
        "cell",
        "village",
        "parcel_name"
    )
    @classmethod
    def clean_text(cls, value):
        if value is not None:
            value = value.strip()

            if not value:
                raise ValueError("This field cannot be empty.")

        return value

    @model_validator(mode="after")
    def validate_coordinates(self):
        if (self.latitude is None) != (self.longitude is None):
            raise ValueError(
                "Latitude and longitude must be provided together."
            )

        return self


class AdminParcelCreate(ParcelCreate):
    """Admin provides the farmer who will own this parcel."""

    farmer_id: str = Field(..., min_length=1, max_length=64)

    @field_validator("farmer_id")
    @classmethod
    def clean_farmer_id(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("Farmer ID cannot be empty.")

        return value


class ParcelUpdate(BaseModel):
    """Admin-only parcel updates."""

    model_config = ConfigDict(extra="forbid")

    # Optional when not updating, but cannot be cleared.
    upi: str | None = Field(default=None, min_length=1, max_length=64)
    parcel_name: str | None = Field(default=None, max_length=100)

    district: str | None = Field(default=None, min_length=2, max_length=100)
    sector: str | None = Field(default=None, min_length=2, max_length=100)
    cell: str | None = Field(default=None, min_length=2, max_length=100)
    village: str | None = Field(default=None, min_length=2, max_length=100)

    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)

    area_hectares: float | None = Field(default=None, gt=0)

    @field_validator("upi")
    @classmethod
    def validate_upi(cls, value):
        if value is None:
            raise ValueError("UPI cannot be removed from a parcel.")

        value = value.strip().upper()

        if not value:
            raise ValueError("UPI cannot be empty.")

        return value

    @field_validator(
        "district",
        "sector",
        "cell",
        "village",
        "parcel_name"
    )
    @classmethod
    def clean_text(cls, value):
        if value is not None:
            value = value.strip()

            if not value:
                raise ValueError("This field cannot be empty.")

        return value

    @model_validator(mode="after")
    def validate_coordinates(self):
        fields = self.model_fields_set

        latitude_updated = "latitude" in fields
        longitude_updated = "longitude" in fields

        if latitude_updated != longitude_updated:
            raise ValueError(
                "Latitude and longitude must be updated together."
            )

        return self



class ParcelResponse(BaseModel):
    parcel_id: str
    farmer_id: str

    upi: str
    parcel_name: str | None = None

    district: str
    sector: str
    cell: str
    village: str

    latitude: float | None = None
    longitude: float | None = None

    # Indicates how specifically the location was resolved.
    location_precision: str | None = None

    area_hectares: float | None = None


class ParcelListResponse(BaseModel):
    total_parcels: int
    data: list[ParcelResponse]
