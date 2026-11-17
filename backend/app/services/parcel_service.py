
import uuid

from pymongo.errors import DuplicateKeyError

from app.database import get_database
from app.models.parcel import ParcelCreate, ParcelUpdate

from app.services.weather_service import (
    get_location_coordinates,
    WeatherAPIError,
    WeatherAPITimeout,
    LocationNotFound
)


def get_parcel_collection():
    return get_database()["parcels"]


def normalize_upi(upi: str) -> str:
    """Normalize UPI values before comparing or saving."""

    if not isinstance(upi, str):
        raise ValueError("UPI must be a valid string.")

    normalized = upi.strip().upper()

    if not normalized:
        raise ValueError("UPI cannot be empty.")

    return normalized


def resolve_parcel_coordinates(
    district: str,
    sector: str,
    cell: str,
    village: str
):
    """Resolve the best available coordinates for a parcel."""

    try:
        location = get_location_coordinates(
            district=district,
            sector=sector,
            cell=cell,
            village=village
        )

        return {
            "latitude": location["latitude"],
            "longitude": location["longitude"],
            "location_precision": location["precision"]
        }

    except (
        LocationNotFound,
        WeatherAPIError,
        WeatherAPITimeout
    ):
        return None


def get_all_parcels():
    """Retrieve all registered parcels."""

    return list(
        get_parcel_collection().find({}, {"_id": 0})
    )


def get_parcel_by_id(parcel_id: str):
    """Retrieve one parcel using its internal parcel ID."""

    return get_parcel_collection().find_one(
        {"parcel_id": parcel_id},
        {"_id": 0}
    )


def get_parcel_by_upi(upi: str):
    """Retrieve a parcel using its official UPI."""

    normalized_upi = normalize_upi(upi)

    return get_parcel_collection().find_one(
        {"upi": normalized_upi},
        {"_id": 0}
    )


def get_parcels_by_farmer(farmer_id: str):
    """Retrieve parcels belonging to one farmer."""

    db = get_database()

    farmer = db["farmers"].find_one(
        {"farmer_id": farmer_id},
        {"_id": 0, "farmer_id": 1}
    )

    if farmer is None:
        return None

    return list(
        db["parcels"].find(
            {"farmer_id": farmer_id},
            {"_id": 0}
        )
    )


def save_parcel_coordinates(
    parcel_id: str,
    latitude: float,
    longitude: float,
    location_precision: str | None = None
):
    """Save system-resolved coordinates for an existing parcel."""

    if (
        isinstance(latitude, bool)
        or not isinstance(latitude, (int, float))
        or not -90 <= latitude <= 90
    ):
        return None

    if (
        isinstance(longitude, bool)
        or not isinstance(longitude, (int, float))
        or not -180 <= longitude <= 180
    ):
        return None

    collection = get_parcel_collection()

    collection.update_one(
        {"parcel_id": parcel_id},
        {
            "$set": {
                "latitude": latitude,
                "longitude": longitude,
                "location_precision": location_precision
            }
        }
    )

    return get_parcel_by_id(parcel_id)


def create_parcel(parcel_data: ParcelCreate, farmer_id: str):
    """Register a parcel and link it to its owner."""

    db = get_database()

    farmer = db["farmers"].find_one(
        {"farmer_id": farmer_id}
    )

    if farmer is None:
        return {"error": "farmer_not_found"}

    if farmer.get("is_active") is not True:
        return {"error": "farmer_inactive"}

    try:
        upi = normalize_upi(parcel_data.upi)
    except ValueError:
        return {"error": "invalid_upi"}

    new_parcel = parcel_data.model_dump()
    new_parcel["upi"] = upi

    new_parcel["parcel_id"] = (
        f"PARCEL-{uuid.uuid4().hex[:12].upper()}"
    )
    new_parcel["farmer_id"] = farmer_id

    latitude = new_parcel.get("latitude")
    longitude = new_parcel.get("longitude")

    # Resolve coordinates when none were supplied.
    if latitude is None and longitude is None:
        coordinates = resolve_parcel_coordinates(
            district=new_parcel["district"],
            sector=new_parcel["sector"],
            cell=new_parcel["cell"],
            village=new_parcel["village"]
        )

        if coordinates is not None:
            new_parcel.update(coordinates)
        else:
            new_parcel["location_precision"] = "unresolved"

    else:
        new_parcel["location_precision"] = "provided"

    try:
        get_parcel_collection().insert_one(new_parcel)
    except DuplicateKeyError:
        return {"error": "upi_already_exists"}

    return new_parcel


def update_parcel(parcel_id: str, parcel_data: ParcelUpdate):
    """Update an existing parcel. Admin-only at the route."""

    collection = get_parcel_collection()

    parcel = collection.find_one(
        {"parcel_id": parcel_id}
    )

    if parcel is None:
        return {"error": "parcel_not_found"}

    updates = parcel_data.model_dump(exclude_unset=True)

    if not updates:
        return {"error": "no_updates"}

    # Required location fields cannot be cleared.
    for field in ("district", "sector", "cell", "village"):
        if field in updates and (
            updates[field] is None
            or not updates[field].strip()
        ):
            return {"error": "invalid_update"}

    # Every parcel must retain a valid UPI.
    new_upi = updates.get("upi", parcel.get("upi"))

    try:
        new_upi = normalize_upi(new_upi)
    except ValueError:
        return {"error": "invalid_upi"}

    updates["upi"] = new_upi

    # Check whether administrative location fields changed.
    location_fields = (
        "district",
        "sector",
        "cell",
        "village"
    )

    location_changed = any(
        field in updates
        and updates[field] != parcel.get(field)
        for field in location_fields
    )

    coordinates_supplied = (
        "latitude" in updates
        and "longitude" in updates
    )

    if location_changed and not coordinates_supplied:
        new_district = updates.get(
            "district", parcel.get("district")
        )
        new_sector = updates.get(
            "sector", parcel.get("sector")
        )
        new_cell = updates.get(
            "cell", parcel.get("cell")
        )
        new_village = updates.get(
            "village", parcel.get("village")
        )

        # Old coordinates may no longer represent the new location.
        updates["latitude"] = None
        updates["longitude"] = None

        coordinates = resolve_parcel_coordinates(
            district=new_district,
            sector=new_sector,
            cell=new_cell,
            village=new_village
        )

        if coordinates is not None:
            updates.update(coordinates)
        else:
            updates["location_precision"] = "unresolved"

    elif coordinates_supplied:
        updates["location_precision"] = "provided"

    try:
        collection.update_one(
            {"parcel_id": parcel_id},
            {"$set": updates}
        )
    except DuplicateKeyError:
        return {"error": "upi_already_exists"}

    return get_parcel_by_id(parcel_id)


def delete_parcel(parcel_id: str):
    """Delete one parcel without changing the farmer account."""

    collection = get_parcel_collection()

    parcel = collection.find_one(
        {"parcel_id": parcel_id},
        {"_id": 0}
    )

    if parcel is None:
        return {"error": "parcel_not_found"}

    collection.delete_one({"parcel_id": parcel_id})

    return {
        "message": "Parcel deleted successfully",
        "deleted_parcel": parcel
    }
