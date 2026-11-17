from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.services.auth_service import decode_access_token
from app.services.farmer_service import get_farmer_by_id
from app.services.admin_service import get_admin_by_id
from app.services.token_service import is_token_revoked

bearer_scheme = HTTPBearer(auto_error=False)



def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
):
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required."
        )

    payload = decode_access_token(credentials.credentials)

    if not isinstance(payload, dict):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token."
        )

    token_id = payload.get("jti")

    if not token_id or is_token_revoked(token_id):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has been logged out. Please log in again."
        )

    user_id = payload.get("sub")
    role = payload.get("role")

    if not isinstance(user_id, str) or not user_id.strip():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token."
        )

    if role == "farmer":
        user = get_farmer_by_id(user_id)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Farmer account not found."
            )

        if not user.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account is inactive."
            )

        if not user.get("phone_verified", False):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Phone number is not verified."
            )

    elif role == "admin":
        user = get_admin_by_id(user_id)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Admin account not found."
            )

        if not user.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Admin account is inactive."
            )

    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user role."
        )

    token_auth_version = payload.get("auth_version", 0)
    current_auth_version = user.get("auth_version", 0)

    if (
        isinstance(token_auth_version, bool)
        or not isinstance(token_auth_version, int)
        or isinstance(current_auth_version, bool)
        or not isinstance(current_auth_version, int)
        or token_auth_version != current_auth_version
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired. Please log in again."
        )

    return user, role


def require_admin(
    current_user=Depends(get_current_user)
):
    """Allow access only to authenticated Admin accounts."""

    user, role = current_user

    if role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required."
        )

    return user


def get_current_farmer(
    current_user=Depends(get_current_user)
):
    """Allow access only to verified, active farmer accounts."""

    user, role = current_user

    if role != "farmer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Farmer access required."
        )

    return user
