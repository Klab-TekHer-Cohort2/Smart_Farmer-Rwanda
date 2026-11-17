
import requests


GEOCODING_API_URL = (
    "https://geocoding-api.open-meteo.com/v1/search"
)

WEATHER_API_URL = (
    "https://api.open-meteo.com/v1/forecast"
)


class WeatherAPIError(Exception):
    pass


class WeatherAPITimeout(Exception):
    pass


class LocationNotFound(Exception):
    pass


def _request_json(url, params):
    """Make a safe request to an Open-Meteo endpoint."""

    try:
        response = requests.get(
            url,
            params=params,
            timeout=15
        )
        response.raise_for_status()
        data = response.json()

        if not isinstance(data, dict) or data.get("error"):
            raise WeatherAPIError(
                "The weather provider returned an invalid response."
            )

        return data

    except requests.exceptions.Timeout as error:
        raise WeatherAPITimeout(
            "The weather service took too long to respond."
        ) from error

    except requests.exceptions.RequestException as error:
        raise WeatherAPIError(
            "Unable to connect to the weather provider."
        ) from error

    except ValueError as error:
        raise WeatherAPIError(
            "The weather provider returned invalid JSON."
        ) from error



def _same_location_name(value, expected):
    """Compare location names without case sensitivity."""
    return (
        isinstance(value, str)
        and isinstance(expected, str)
        and value.strip().casefold() == expected.strip().casefold()
    )


def get_location_coordinates(
    district,
    sector,
    cell=None,
    village=None
):
    """
    Find the best available coordinates for a Rwandan parcel.

    Search order:
    village -> cell -> sector -> district.

    More specific results must match their administrative context.
    """

    if not isinstance(district, str) or not district.strip():
        raise LocationNotFound("A valid district is required.")

    if not isinstance(sector, str) or not sector.strip():
        raise LocationNotFound("A valid sector is required.")

    district = district.strip()
    sector = sector.strip()

    if cell is not None:
        if not isinstance(cell, str) or not cell.strip():
            cell = None
        else:
            cell = cell.strip()

    if village is not None:
        if not isinstance(village, str) or not village.strip():
            village = None
        else:
            village = village.strip()

    # Try the most specific locations first.
    search_levels = []

    if village:
        search_levels.append(("village", village))

    if cell:
        search_levels.append(("cell", cell))

    search_levels.append(("sector", sector))
    search_levels.append(("district", district))

    for precision, place_name in search_levels:

        location_data = _request_json(
            GEOCODING_API_URL,
            {
                "name": place_name,
                "count": 10,
                "countryCode": "RW",
                "language": "en",
                "format": "json"
            }
        )

        results = location_data.get("results", [])

        if not isinstance(results, list):
            raise WeatherAPIError(
                "Invalid geocoding response."
            )

        for result in results:

            if not isinstance(result, dict):
                continue

            if result.get("country_code", "").upper() != "RW":
                continue

            # The returned place must match the searched name.
            if not _same_location_name(
                result.get("name"),
                place_name
            ):
                continue

            administrative_areas = [
                result.get("admin1", ""),
                result.get("admin2", ""),
                result.get("admin3", ""),
                result.get("admin4", "")
            ]

            # The requested district must appear in the
            # returned administrative hierarchy.
            district_matches = any(
                _same_location_name(area, district)
                for area in administrative_areas
            )

            if precision == "district":
                context_matches = True

            elif precision == "sector":
                context_matches = district_matches

            else:
                # Village and cell results must match both
                # the requested district and sector.
                sector_matches = any(
                    _same_location_name(area, sector)
                    for area in administrative_areas
                )

                context_matches = (
                    district_matches and sector_matches
                )

            if not context_matches:
                continue

            latitude = result.get("latitude")
            longitude = result.get("longitude")

            if (
                isinstance(latitude, bool)
                or not isinstance(latitude, (int, float))
                or not -90 <= latitude <= 90
            ):
                continue

            if (
                isinstance(longitude, bool)
                or not isinstance(longitude, (int, float))
                or not -180 <= longitude <= 180
            ):
                continue

            return {
                "latitude": latitude,
                "longitude": longitude,
                "resolved_location": result.get("name"),
                "district": district,
                "sector": sector,
                "cell": cell,
                "village": village,
                "precision": precision
            }

    raise LocationNotFound(
        "The location could not be identified. "
        "Please check the district, sector, cell and village."
    )



def get_weather(latitude, longitude):
    """Retrieve current weather and a 7-day forecast."""

    if not (-90 <= latitude <= 90):
        raise ValueError("Invalid latitude.")

    if not (-180 <= longitude <= 180):
        raise ValueError("Invalid longitude.")

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": (
            "temperature_2m,"
            "relative_humidity_2m,"
            "apparent_temperature,"
            "precipitation,"
            "rain,"
            "weather_code,"
            "cloud_cover,"
            "wind_speed_10m,"
            "wind_direction_10m,"
            "wind_gusts_10m"
        ),
        "daily": (
            "temperature_2m_max,"
            "temperature_2m_min,"
            "precipitation_sum,"
            "precipitation_probability_max,"
            "wind_speed_10m_max,"
            "uv_index_max"
        ),
        "forecast_days": 7,
        "timezone": "Africa/Kigali",
        "temperature_unit": "celsius",
        "wind_speed_unit": "kmh",
        "precipitation_unit": "mm"
    }

    data = _request_json(WEATHER_API_URL, params)

    if not isinstance(data.get("current"), dict):
        raise WeatherAPIError(
            "Current weather information is unavailable."
        )

    return data
