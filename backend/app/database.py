
import os

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DATABASE = os.getenv(
    "MONGODB_DATABASE",
    "smart_farmer_rwanda"
)

if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI is not configured in .env")

# Create the MongoDB client
client = MongoClient(
    MONGODB_URI,
    serverSelectionTimeoutMS=5000
)

# Select the application database
db = client[MONGODB_DATABASE]


def check_mongodb_connection():
    """Check whether MongoDB Atlas is reachable."""
    client.admin.command("ping")
    return True


def get_database():
    """Return the application database."""
    return db
