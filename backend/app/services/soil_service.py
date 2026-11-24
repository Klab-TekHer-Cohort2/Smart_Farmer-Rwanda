
from app.database import get_database


def get_soil_by_upi(upi: str):
    """
    Retrieve soil information using a parcel's UPI from MongoDB.
    """

    if not isinstance(upi, str) or not upi.strip():
        return None

    db = get_database()

    return db["soil_records"].find_one(
        {"upi": upi.strip().upper()},
        {"_id": 0}
    )
