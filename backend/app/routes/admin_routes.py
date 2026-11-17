from fastapi import APIRouter, HTTPException, status

from app.models.admin import AdminLogin, AdminResponse
from app.services.admin_service import (
    get_admin_by_email,
    verify_admin_password
)
from app.services.auth_service import create_access_token


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.post("/login")
def admin_login(request: AdminLogin):

    admin = get_admin_by_email(str(request.email).lower())

    if (
        admin is None
        or admin.get("is_active") is not True
        or not verify_admin_password(admin, request.password)
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    access_token = create_access_token(
        user_id=admin["admin_id"],
        role="admin"
    )

    return {
        "message": "Admin login successful.",
        "access_token": access_token,
        "token_type": "bearer",
        "admin": AdminResponse(**admin)
    }