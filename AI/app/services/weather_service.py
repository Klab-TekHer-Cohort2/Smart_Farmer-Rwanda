
import json
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import urlopen


WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast"


def get_farm_weather(latitude: float, longitude: float):
    """
    Retrieve current weather and a 7-day forecast
    for a farm's GPS coordinates.
    """

    if not -90 <= latitude <= 90:
        raise ValueError("Invalid latitude.")

    if not -180 <= longitude <= 180:
        raise ValueError("Invalid longitude.")

    parameters = {
        "latitude": latitude,
        "longitude": longitude,
        "current": (
            "temperature_2m,"
            "relative_humidity_2m,"
            "precipitation,"
            "rain,"
            "weather_code,"
            "wind_speed_10m"
        ),
        "daily": (
            "temperature_2m_max,"
            "temperature_2m_min,"
            "precipitation_sum,"
            "precipitation_probability_max,"
            "wind_speed_10m_max"
        ),
        "forecast_days": 7,
        "timezone": "auto"
    }

    url = f"{WEATHER_API_URL}?{urlencode(parameters)}"

    try:
        with urlopen(url, timeout=20) as response:
            weather_data = json.loads(response.read().decode("utf-8"))

    except HTTPError as error:
        raise RuntimeError(
            f"Weather API returned an error: {error.code}"
        ) from error

    except (URLError, TimeoutError) as error:
        raise RuntimeError(
            "Unable to connect to the weather service."
        ) from error

    return {
        "location": {
            "latitude": weather_data.get("latitude"),
            "longitude": weather_data.get("longitude"),
            "timezone": weather_data.get("timezone")
        },
        "current_weather": weather_data.get("current", {}),
        "current_weather_units": weather_data.get(
            "current_units", {}
        ),
        "daily_forecast": weather_data.get("daily", {}),
        "daily_forecast_units": weather_data.get(
            "daily_units", {}
        ),
        "source": "Open-Meteo",
        "forecast_days": 7
    }
