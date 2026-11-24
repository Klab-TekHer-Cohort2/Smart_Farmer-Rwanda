

import uuid

from datetime import datetime, timedelta, timezone

from pwdlib import PasswordHash
from pymongo.errors import DuplicateKeyError
from pymongo import ReturnDocument

from app.database import get_database
from app.models.farmer import FarmerCreate, FarmerUpdate



pin_hasher = PasswordHash.recommended()

MAX_PIN_ATTEMPTS = 5
PIN_LOCK_MINUTES = 15



def get_collection():
    return get_database()["farmers"]


def register_farmer(farmer_data: FarmerCreate):
    """Register a farmer without requiring parcel information."""

    collection = get_collection()

    new_farmer = {
        "farmer_id": f"FARMER-{uuid.uuid4().hex.upper()}",
        **farmer_data.model_dump(),
        "phone_verified": False,
        "is_active": True,
    }

    try:
        collection.insert_one(new_farmer)
    except DuplicateKeyError:
        return {"error": "phone_exists"}

    return new_farmer


def get_farmer_by_id(farmer_id: str):
    return get_collection().find_one(
        {"farmer_id": farmer_id},
        {"_id": 0}
    )


def get_all_farmers(status: str = "all"):
    """Retrieve farmers filtered by account status."""

    query = {}

    if status == "active":
        query["is_active"] = {"$ne": False}

    elif status == "inactive":
        query["is_active"] = False

    return list(
        get_collection().find(query, {"_id": 0})
    )


def get_farmer_by_phone(phone_number: str):
    return get_collection().find_one(
        {"phone_number": phone_number},
        {"_id": 0}
    )


def mark_phone_as_verified(phone_number: str):
    """Mark an active farmer's phone as verified."""

    collection = get_collection()

    return collection.find_one_and_update(
        {
            "phone_number": phone_number,
            "is_active": {"$ne": False},
        },
        {"$set": {"phone_verified": True}},
        projection={"_id": 0},
        return_document=ReturnDocument.AFTER,
    )


def update_farmer(farmer_id: str, farmer_data: FarmerUpdate):
    """Update farmer information. Admin routes only."""

    collection = get_collection()

    farmer = collection.find_one(
        {"farmer_id": farmer_id}
    )

    if farmer is None:
        return {"error": "farmer_not_found"}

    updates = farmer_data.model_dump(exclude_unset=True)

    if not updates:
        return {"error": "no_updates"}

    # A changed phone number requires new verification and a new PIN.
    if (
        "phone_number" in updates
        and updates["phone_number"] != farmer.get("phone_number")
    ):
        updates.update({
            "phone_verified": False,
            "pin_hash": None,
            "pin_failed_attempts": 0,
            "pin_locked_until": None,
        })

    try:
        collection.update_one(
            {"farmer_id": farmer_id},
            {"$set": updates}
        )
    except DuplicateKeyError:
        return {"error": "phone_exists"}

    return get_farmer_by_id(farmer_id)


def deactivate_farmer(farmer_id: str):
    """Deactivate a farmer and invalidate existing sessions."""

    collection = get_collection()

    farmer = collection.find_one_and_update(
        {
            "farmer_id": farmer_id,
            "is_active": {"$ne": False},
        },
        {
            "$set": {"is_active": False},
            "$inc": {"auth_version": 1},
        },
        projection={"_id": 0},
        return_document=ReturnDocument.AFTER,
    )

    return farmer or get_farmer_by_id(farmer_id)


def reactivate_farmer(farmer_id: str):
    """Reactivate a farmer and invalidate previous sessions."""

    collection = get_collection()

    farmer = collection.find_one_and_update(
        {
            "farmer_id": farmer_id,
            "is_active": False,
        },
        {
            "$set": {"is_active": True},
            "$inc": {"auth_version": 1},
        },
        projection={"_id": 0},
        return_document=ReturnDocument.AFTER,
    )

    return farmer or get_farmer_by_id(farmer_id)


def set_farmer_pin(
    phone_number: str,
    pin: str,
    invalidate_sessions: bool = False
):
    """Set or reset a farmer's PIN."""

    updates = {
        "pin_hash": pin_hasher.hash(pin),
        "phone_verified": True,
        "pin_failed_attempts": 0,
        "pin_locked_until": None,
    }

    update_operation = {"$set": updates}

    if invalidate_sessions:
        update_operation["$inc"] = {"auth_version": 1}

    return get_collection().find_one_and_update(
        {
            "phone_number": phone_number,
            "is_active": {"$ne": False},
        },
        update_operation,
        projection={"_id": 0},
        return_document=ReturnDocument.AFTER,
    )


def authenticate_farmer(phone_number: str, pin: str):
    """Authenticate a farmer using phone number and PIN."""

    collection = get_collection()

    farmer = collection.find_one({
        "phone_number": phone_number
    })

    if farmer is None:
        return None

    if farmer.get("is_active", True) is not True:
        return None

    if farmer.get("phone_verified") is not True:
        return None

    stored_hash = farmer.get("pin_hash")

    if not stored_hash:
        return None

    now = datetime.now(timezone.utc)

    locked_until = farmer.get("pin_locked_until")

    if locked_until:
        lock_time = datetime.fromisoformat(locked_until)

        if now < lock_time:
            return None

        # Lock period has ended.
        collection.update_one(
            {"farmer_id": farmer["farmer_id"]},
            {
                "$set": {
                    "pin_locked_until": None,
                    "pin_failed_attempts": 0,
                }
            }
        )

    if not pin_hasher.verify(pin, stored_hash):
        attempts = farmer.get("pin_failed_attempts", 0) + 1

        updates = {
            "pin_failed_attempts": attempts
        }

        if attempts >= MAX_PIN_ATTEMPTS:
            updates["pin_locked_until"] = (
                now + timedelta(minutes=PIN_LOCK_MINUTES)
            ).isoformat()

        collection.update_one(
            {
                "farmer_id": farmer["farmer_id"],
                "pin_failed_attempts": farmer.get(
                    "pin_failed_attempts", 0
                ),
            },
            {"$set": updates}
        )

        return None

    # Successful authentication.
    collection.update_one(
        {"farmer_id": farmer["farmer_id"]},
        {
            "$set": {
                "pin_failed_attempts": 0,
                "pin_locked_until": None,
            }
        }
    )

    return get_farmer_by_id(farmer["farmer_id"])
