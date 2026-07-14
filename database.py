import os
import certifi
from pymongo import MongoClient
from dotenv import load_dotenv

# Load the environment variables from the .env file
load_dotenv()

# Pull the URI string dynamically using os.environ
MONGO_URI = os.environ.get("MONGO_URI")

if not MONGO_URI:
    raise ValueError("CRITICAL ERROR: MONGO_URI is not set in the environment variables!")

# Initialize the client securely
client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
db = client["banking_db"]