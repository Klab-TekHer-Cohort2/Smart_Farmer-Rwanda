
from fastapi import APIRouter, Depends, HTTPException, Path

from app.dependencies import get_current_user

from app.services.parcel_service import (
    get_parcel_by_id,
    save_parcel_coordinates
)

from app.services.weather_service import (
    get_weather,
    get_location_coordinates,
    WeatherAPIError,
    WeatherAPITimeout,
    LocationNotFound
)


router = APIRouter(
    prefix="/weather",
    tags=["Weather"]
)


@router.get("/{parcel_id}")
def get_parcel_weather(
    parcel_id: str = Path(..., min_length=1, max_length=64),
    current_user=Depends(get_current_user)
):
    user, role = current_user

    # Find the parcel using its internal parcel ID.
    parcel = get_parcel_by_id(parcel_id)

    if parcel is None:
        raise HTTPException(
            status_code=404,
            detail="Parcel not found."
        )

    # Farmers can only access their own parcels.
    # Admins can access all registered parcels.
    if (
        role == "farmer"
        and parcel.get("farmer_id") != user.get("farmer_id")
    ):
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to access this parcel's weather."
        )

    latitude = parcel.get("latitude")
    longitude = parcel.get("longitude")

    valid_coordinates = (
        isinstance(latitude, (int, float))
        and not isinstance(latitude, bool)
        and isinstance(longitude, (int, float))
        and not isinstance(longitude, bool)
        and -90 <= latitude <= 90
        and -180 <= longitude <= 180
    )

    if valid_coordinates:
        location = {
            "latitude": latitude,
            "longitude": longitude,
           "resolved_location": {
    "village": parcel.get("village"),
    "cell": parcel.get("cell"),
    "sector": parcel.get("sector"),
    "district": parcel.get("district")
}.get(parcel.get("location_precision")),
            "district": parcel.get("district"),
            "sector": parcel.get("sector"),
            "cell": parcel.get("cell"),
            "village": parcel.get("village"),
            "precision": parcel.get("location_precision")
                or "unknown"
        }

    else:
        try:
            location = get_location_coordinates(
                district=parcel.get("district"),
                sector=parcel.get("sector"),
                cell=parcel.get("cell"),
                village=parcel.get("village")
            )

            # Save successfully resolved coordinates so
            # future weather requests reuse them.
            save_parcel_coordinates(
                parcel_id=parcel_id,
                latitude=location["latitude"],
                longitude=location["longitude"],
                location_precision=location["precision"]
            )

        except LocationNotFound as error:
            raise HTTPException(
                status_code=422,
                detail=str(error)
            )

        except WeatherAPITimeout:
            raise HTTPException(
                status_code=504,
                detail="Location search timed out. Please try again."
            )

        except WeatherAPIError:
            raise HTTPException(
                status_code=502,
                detail="Unable to identify the parcel location."
            )

    try:
        weather = get_weather(
            location["latitude"],
            location["longitude"]
        )

    except ValueError:
        raise HTTPException(
            status_code=422,
            detail="Invalid parcel coordinates."
        )

    except WeatherAPITimeout:
        raise HTTPException(
            status_code=504,
            detail="Weather service timed out. Please try again."
        )

    except WeatherAPIError:
        raise HTTPException(
            status_code=502,
            detail="Unable to retrieve weather information."
        )

    return {
        "message": "Weather information retrieved successfully",

        "parcel": {
            "parcel_id": parcel.get("parcel_id"),
            "upi": parcel.get("upi"),
            "parcel_name": parcel.get("parcel_name"),
            "district": parcel.get("district"),
            "sector": parcel.get("sector"),
            "cell": parcel.get("cell"),
            "village": parcel.get("village")
        },

        "weather_location": location,

        "weather": weather,

        "source": "Open-Meteo",

        "attribution": "Weather data provided by Open-Meteo"
    }
