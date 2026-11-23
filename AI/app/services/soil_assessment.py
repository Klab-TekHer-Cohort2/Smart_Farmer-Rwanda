
from typing import Optional


def assess_soil(
    soil_texture: Optional[str],
    soil_type: Optional[str],
    soil_ph: Optional[float],
    drainage: Optional[str],
    soil_depth_cm: Optional[float],
    fertility: Optional[str]
):
    """
    Assess the availability and quality of parcel soil information.

    This function does not invent missing soil measurements.
    """

    soil_information = {
        "soil_texture": soil_texture,
        "soil_type": soil_type,
        "soil_ph": soil_ph,
        "drainage": drainage,
        "soil_depth_cm": soil_depth_cm,
        "fertility": fertility
    }

    missing_information = [
        field
        for field, value in soil_information.items()
        if value is None
    ]

    return {
        "soil_information": soil_information,
        "missing_information": missing_information,
        "is_complete": len(missing_information) == 0,
        "message": (
            "Soil information is complete."
            if not missing_information
            else "Some soil information is missing. "
                 "Crop recommendations should be limited."
        )
    }
