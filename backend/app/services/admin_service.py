
import uuid

from pwdlib import PasswordHash
from pymongo.errors import DuplicateKeyError

from app.database import get_database
from app.models.admin import AdminResponse


password_hash = PasswordHash.recommended()


def get_collection():
    return get_database()["admins"]


def get_admin_by_email(email: str):
    """Find an Admin using their email address."""

    if not isinstance(email, str):
        return None

    return get_collection().find_one(
        {"email": email.strip().lower()},
        {"_id": 0}
    )


def get_admin_by_id(admin_id: str):
    """Find an Admin using their unique ID."""

    return get_collection().find_one(
        {"admin_id": admin_id},
        {"_id": 0}
    )


def verify_admin_password(admin: dict, submitted_password: str):
    """Verify a submitted password against its stored Argon2 hash."""

    if not isinstance(admin, dict):
        return False

    stored_hash = admin.get("password_hash")

    if not isinstance(stored_hash, str) or not stored_hash:
        return False

    if not isinstance(submitted_password, str):
        return False

    try:
        return password_hash.verify(submitted_password, stored_hash)
    except (ValueError, TypeError):
        return False


def create_admin(full_name: str, email: str, password: str):
    """Create an Admin account with a securely hashed password."""

    if not isinstance(full_name, str):
        raise ValueError("Admin name cannot be empty.")

    if not isinstance(email, str):
        raise ValueError("Admin email cannot be empty.")

    full_name = full_name.strip()
    email = email.strip().lower()

    if not full_name:
        raise ValueError("Admin name cannot be empty.")

    if not email:
        raise ValueError("Admin email cannot be empty.")

    if not isinstance(password, str) or len(password) < 12:
        raise ValueError(
            "Admin password must contain at least 12 characters."
        )

    new_admin = {
        "admin_id": f"ADMIN-{uuid.uuid4().hex[:12].upper()}",
        "full_name": full_name,
        "email": email,
        "password_hash": password_hash.hash(password),
        "is_active": True,
    }

    try:
        get_collection().insert_one(new_admin)
    except DuplicateKeyError:
        raise ValueError(
            "An Admin with this email already exists."
        )

    # Never return the password hash to API callers.
    return AdminResponse(**new_admin).model_dump()
