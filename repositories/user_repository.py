from database import db
from models import User
from werkzeug.security import generate_password_hash


class UserRepository:
    def __init__(self):
        self.collection = db["users"]
        self._seed_data_if_empty()

    def _seed_data_if_empty(self):
        """Seeds the database with users and secure hashed passwords if empty."""
        if self.collection.count_documents({}) == 0:
            initial_users = [
                {
                    "_id": 1,
                    "username": "admin",
                    "email": "admin@bank.com",
                    "password_hash": generate_password_hash("supersecure123"),
                    "role": "ROLE_ADMIN"
                },
                {
                    "_id": 2,
                    "username": "alice_dev",
                    "email": "alice@example.com",
                    "password_hash": generate_password_hash("alicepass"),
                    "role": "ROLE_USER"
                }
            ]
            self.collection.insert_many(initial_users)

    def get_all(self):
        users_cursor = self.collection.find()
        return [User(u["_id"], u["username"], u["email"], u.get("role", "ROLE_USER")) for u in users_cursor]

    def find_by_username(self, username: str):
        """Looks up a raw database document by username."""
        return self.collection.find_one({"username": username})

    def create(self, username: str, email: str, role: str = "ROLE_USER") -> User:
        last_user = self.collection.find_one(sort=[("_id", -1)])
        new_id = last_user["_id"] + 1 if last_user else 1

        user_doc = {
            "_id": new_id,
            "username": username,
            "email": email,
            "role": role
        }
        self.collection.insert_one(user_doc)
        return User(new_id, username, email, role)
    def delete(self, user_id: int) -> bool:
        """Deletes a user from MongoDB. Returns True if successful, False otherwise."""
        result = self.collection.delete_one({"_id": user_id})
        return result.deleted_count > 0

    def update_email(self, user_id: int, new_email: str) -> User:
        """Updates a user's email in MongoDB and returns the updated User object."""
        # 1. Perform the update in MongoDB
        self.collection.update_one({"_id": user_id}, {"$set": {"email": new_email}})

        # 2. Fetch the updated document to construct and return our Model
        updated_doc = self.collection.find_one({"_id": user_id})
        if not updated_doc:
            return None
        return User(updated_doc["_id"], updated_doc["username"], updated_doc["email"])

