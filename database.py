import certifi
from pymongo import MongoClient

# Replace this string with your actual connection string from Atlas
MONGO_URI = "mongodb+srv://leiforth01_db_user:4cP2N7mCS3aX3AEt@cluster0.7qguqoj.mongodb.net/"

# Initialize the client with the SSL certificate fix
client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())

# Select your database (Atlas will create this automatically if it doesn't exist)
db = client["banking_db"]