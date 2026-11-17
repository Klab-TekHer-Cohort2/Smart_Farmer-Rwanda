
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)
from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)

from app.dependencies import get_current_user
from app.services.auth_service import decode_access_token
from app.services.token_service import revoke_token


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

bearer_scheme = HTTPBearer(auto_error=False)


@router.post("/logout")
def logout(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    current_user=Depends(get_current_user)
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

    revoke_token(
        payload["jti"],
        payload["exp"]
    )

    return {
        "message": "Successfully logged out."
    }
