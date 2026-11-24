
import uuid
import os
from datetime import datetime, timedelta, timezone

import jwt
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# JWT configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
)

# Token identification
ISSUER = "smart-farmer-rwanda"
AUDIENCE = "smart-farmer-rwanda-api"


# Validate configuration
if not SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY is missing from .env")

if len(SECRET_KEY.encode("utf-8")) < 32:
    raise RuntimeError("JWT secret must contain at least 32 bytes")

if ACCESS_TOKEN_EXPIRE_MINUTES <= 0:
    raise RuntimeError("JWT expiration must be greater than zero")



def create_access_token(
    user_id: str,
    role: str,
    auth_version: int = 0
):
    if not isinstance(user_id, str) or not user_id.strip():
        raise ValueError("A valid user ID is required.")

    if role not in {"admin", "farmer"}:
        raise ValueError("Role must be admin or farmer.")

    if (
        isinstance(auth_version, bool)
        or not isinstance(auth_version, int)
        or auth_version < 0
    ):
        raise ValueError("A valid authentication version is required.")

    now = datetime.now(timezone.utc)
    expiration = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    payload = {
    "sub": user_id,
    "role": role,
    "auth_version": auth_version,
    "jti": str(uuid.uuid4()),
    "iat": now,
    "exp": expiration,
    "iss": ISSUER,
    "aud": AUDIENCE
}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)




def decode_access_token(token: str):
    """
    Verify and decode an access token.
    """

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
            issuer=ISSUER,
            audience=AUDIENCE,
            options={
                "require": [
                    "sub",
                    "role",
                    "auth_version",
                    "jti",
                    "iat",
                    "exp",
                    "iss",
                    "aud"
                ]
            }
        )

        user_id = payload.get("sub")
        role = payload.get("role")
        auth_version = payload.get("auth_version")
        jti = payload.get("jti")

        if not isinstance(user_id, str) or not user_id.strip():
            return None

        if role not in {"admin", "farmer"}:
            return None

        if (
            isinstance(auth_version, bool)
            or not isinstance(auth_version, int)
            or auth_version < 0
        ):
            return None

        if not isinstance(jti, str) or not jti.strip():
            return None

        return payload

    except jwt.InvalidTokenError:
        return None
