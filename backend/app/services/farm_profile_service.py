
from app.services.parcel_service import get_parcel_by_upi
from app.services.soil_service import get_soil_by_upi


def get_farm_profile(upi: str):
    """
    Retrieve parcel and soil information using one UPI.
    """

    # Retrieve parcel information
    parcel = get_parcel_by_upi(upi)

    if parcel is None:
        return None

    # Retrieve soil information
    soil = get_soil_by_upi(upi)

    # A parcel may exist without available soil information
    return {
        "parcel": parcel,
        "soil": soil
    }

