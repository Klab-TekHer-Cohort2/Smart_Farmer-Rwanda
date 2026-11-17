
from datetime import datetime, timezone

from pymongo.errors import DuplicateKeyError

from app.database import get_database


def get_collection():
    return get_database()["revoked_tokens"]


def load_revoked_tokens():
    """Load token revocation records from MongoDB."""

    records = list(
        get_collection().find({}, {"_id": 0})
    )

    for record in records:
        if (
            not isinstance(record, dict)
            or not isinstance(record.get("jti"), str)
            or isinstance(record.get("expires_at"), bool)
            or not isinstance(record.get("expires_at"), (int, float))
        ):
            raise RuntimeError(
                "Revoked tokens collection contains invalid records."
            )

    return records


def save_revoked_tokens(records):
    """Replace revocation records in MongoDB."""

    collection = get_collection()

    collection.delete_many({})

    if records:
        try:
            collection.insert_many(records, ordered=True)
        except DuplicateKeyError as error:
            raise RuntimeError(
                "Duplicate token IDs found in revocation records."
            ) from error


def remove_expired_tokens(records):
    """Remove revocation records for expired JWTs."""

    now = datetime.now(timezone.utc).timestamp()

    return [
        record for record in records
        if record["expires_at"] > now
    ]


def revoke_token(jti: str, expires_at: int):
    """Add a token ID to the revocation list."""

    if not isinstance(jti, str) or not jti.strip():
        raise ValueError("A valid token ID is required.")

    if (
        isinstance(expires_at, bool)
        or not isinstance(expires_at, (int, float))
    ):
        raise ValueError("A valid token expiration is required.")

    collection = get_collection()

    now = datetime.now(timezone.utc).timestamp()

    # Remove expired records before adding the new revocation.
    collection.delete_many({
        "expires_at": {"$lte": now}
    })

    try:
        collection.insert_one({
            "jti": jti,
            "expires_at": expires_at
        })
    except DuplicateKeyError:
        # The token is already revoked; no duplicate is needed.
        pass


def is_token_revoked(jti: str) -> bool:
    """Check whether a token has been revoked."""

    if not isinstance(jti, str):
        return False

    now = datetime.now(timezone.utc).timestamp()

    return get_collection().find_one({
        "jti": jti,
        "expires_at": {"$gt": now}
    }) is not None
