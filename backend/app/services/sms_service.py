
import os

import httpx
from dotenv import load_dotenv

load_dotenv()

TEXTBEE_API_KEY = os.getenv("TEXTBEE_API_KEY")
TEXTBEE_BASE_URL = os.getenv(
    "TEXTBEE_BASE_URL",
    "https://api.textbee.dev/api/v1"
)


class SMSDeliveryError(Exception):
    """Raised when an SMS cannot be submitted to TextBee."""


async def send_sms(phone_number: str, message: str) -> dict:
    """Send an SMS using the connected TextBee Android gateway."""

    if not TEXTBEE_API_KEY:
        raise SMSDeliveryError("SMS service is not configured.")

    url = f"{TEXTBEE_BASE_URL}/gateway/send-sms"

    headers = {
        "x-api-key": TEXTBEE_API_KEY,
        "Content-Type": "application/json",
    }

    payload = {
        "recipients": [phone_number],
        "message": message,
    }

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(
                url,
                headers=headers,
                json=payload,
            )

            response.raise_for_status()
            result = response.json()

        if result.get("data", {}).get("success") is not True:
            raise SMSDeliveryError("SMS submission was unsuccessful.")

        return result

    except SMSDeliveryError:
        raise

    except (httpx.HTTPError, ValueError) as error:
        raise SMSDeliveryError("SMS provider request failed.") from error
