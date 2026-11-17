
import secrets
from datetime import datetime, timedelta, timezone

from pwdlib import PasswordHash


password_hash = PasswordHash.recommended()

# Development-only in-memory storage.
otp_storage = {}
otp_request_history = {}

OTP_EXPIRY_MINUTES = 5
MAX_ATTEMPTS = 5
RESEND_COOLDOWN_SECONDS = 60
MAX_REQUESTS_PER_HOUR = 3

# Allowed OTP purposes.
OTP_PURPOSES = {"setup_pin", "reset_pin"}


class OTPRateLimitError(Exception):
    def __init__(self, retry_after: int):
        self.retry_after = retry_after
        super().__init__("OTP request limit exceeded.")


def generate_otp(phone_number: str, purpose: str = "setup_pin"):
    """Generate an OTP for a specific phone number and purpose."""

    if purpose not in OTP_PURPOSES:
        raise ValueError("Invalid OTP purpose.")

    now = datetime.now(timezone.utc)

    requests = otp_request_history.get(phone_number, [])

    requests = [
        timestamp for timestamp in requests
        if now - timestamp < timedelta(hours=1)
    ]

    if requests:
        elapsed = (now - requests[-1]).total_seconds()

        if elapsed < RESEND_COOLDOWN_SECONDS:
            retry_after = int(RESEND_COOLDOWN_SECONDS - elapsed) + 1
            otp_request_history[phone_number] = requests
            raise OTPRateLimitError(retry_after)

    if len(requests) >= MAX_REQUESTS_PER_HOUR:
        remaining = timedelta(hours=1) - (now - requests[0])
        retry_after = max(1, int(remaining.total_seconds()) + 1)

        otp_request_history[phone_number] = requests
        raise OTPRateLimitError(retry_after)

    otp = str(secrets.randbelow(900000) + 100000)

    otp_storage[phone_number] = {
        "hashed_otp": password_hash.hash(otp),
        "expires_at": now + timedelta(minutes=OTP_EXPIRY_MINUTES),
        "attempts": 0,
        "purpose": purpose
    }

    requests.append(now)
    otp_request_history[phone_number] = requests

    return otp


def verify_otp(
    phone_number: str,
    submitted_otp: str,
    purpose: str = "setup_pin"
):
    """Verify and consume an OTP for its intended purpose."""

    if purpose not in OTP_PURPOSES:
        return False

    record = otp_storage.get(phone_number)

    if record is None:
        return False

    # Do not allow an OTP issued for another operation.
    if record.get("purpose") != purpose:
        return False

    now = datetime.now(timezone.utc)

    if now >= record["expires_at"]:
        del otp_storage[phone_number]
        return False

    if record["attempts"] >= MAX_ATTEMPTS:
        del otp_storage[phone_number]
        return False

    if not isinstance(submitted_otp, str):
        record["attempts"] += 1
        return False

    if len(submitted_otp) != 6 or not submitted_otp.isdigit():
        record["attempts"] += 1
        return False

    if password_hash.verify(
        submitted_otp,
        record["hashed_otp"]
    ):
        del otp_storage[phone_number]
        return True

    record["attempts"] += 1

    if record["attempts"] >= MAX_ATTEMPTS:
        del otp_storage[phone_number]

    return False


def invalidate_otp(phone_number: str, purpose: str):
    """Remove an OTP if it belongs to the specified operation."""

    record = otp_storage.get(phone_number)

    if record is not None and record.get("purpose") == purpose:
        del otp_storage[phone_number]
