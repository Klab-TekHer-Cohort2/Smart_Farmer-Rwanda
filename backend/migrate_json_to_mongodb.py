
import json
from pathlib import Path

from pymongo import ASCENDING

from app.database import get_database, check_mongodb_connection


BASE_DIR = Path(__file__).resolve().parent

# Read from the backup, not the original files.
BACKUP_DIR = BASE_DIR / "json_backup_before_mongodb"

COLLECTION_FILES = {
    "farmers": "sample_farmers.json",
    "admins": "sample_admins.json",
    "parcels": "sample_parcels.json",
    "soil_records": "sample_soil.json",
    "revoked_tokens": "revoked_tokens.json",
}

UNIQUE_INDEXES = {
    "farmers": ["farmer_id", "phone_number"],
    "admins": ["admin_id", "email"],
    "parcels": ["parcel_id", "upi"],
    "soil_records": ["upi"],
    "revoked_tokens": ["jti"],
}


def load_json(filename):
    path = BACKUP_DIR / filename

    if not path.exists():
        raise FileNotFoundError(f"Backup file not found: {path}")

    with open(path, "r", encoding="utf-8") as file:
        records = json.load(file)

    if not isinstance(records, list):
        raise ValueError(f"{filename} must contain a list.")

    if not all(isinstance(record, dict) for record in records):
        raise ValueError(f"{filename} contains an invalid record.")

    return records


def create_indexes(db):
    for collection_name, fields in UNIQUE_INDEXES.items():
        collection = db[collection_name]

        for field in fields:
            collection.create_index(
                [(field, ASCENDING)],
                unique=True,
                name=f"unique_{field}"
            )

    # Support efficient parcel ownership and soil lookups.
    db["parcels"].create_index(
        [("farmer_id", ASCENDING)],
        name="farmer_id_index"
    )


def migrate_collection(db, collection_name, filename):
    records = load_json(filename)
    collection = db[collection_name]

    inserted = 0
    existing = 0

    for record in records:
        # Use the existing business identifier, not MongoDB's _id.
        if collection_name == "farmers":
            key = {"farmer_id": record["farmer_id"]}
        elif collection_name == "admins":
            key = {"admin_id": record["admin_id"]}
        elif collection_name == "parcels":
            key = {"parcel_id": record["parcel_id"]}
        elif collection_name == "soil_records":
            key = {"upi": record["upi"]}
        else:
            key = {"jti": record["jti"]}

        result = collection.update_one(
            key,
            {"$setOnInsert": record},
            upsert=True
        )

        if result.upserted_id is not None:
            inserted += 1
        else:
            existing += 1

    print(
        f"{collection_name}: "
        f"{inserted} inserted, {existing} already existed."
    )


def main():
    print("Checking MongoDB connection...")

    check_mongodb_connection()
    db = get_database()

    print("MongoDB connected.")

    print("Creating indexes...")
    create_indexes(db)

    print("Migrating records...")

    for collection_name, filename in COLLECTION_FILES.items():
        migrate_collection(db, collection_name, filename)

    print("\nMigration completed.")

    print("\nMongoDB collection totals:")
    for collection_name in COLLECTION_FILES:
        print(
            f"{collection_name}: "
            f"{db[collection_name].count_documents({})}"
        )


if __name__ == "__main__":
    main()
