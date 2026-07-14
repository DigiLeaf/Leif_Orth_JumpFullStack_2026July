from database import db
from models import User

class UserRepository:
    def __init__(self):
        # Target the 'users' collection in MongoDB
        self.collection = db["users"]
        self._seed_data_if_empty()

    def _seed_data_if_empty(self):
        """Seeds initial data if the database collection is empty."""
        if self.collection.count_documents({}) == 0:
            initial_users = [
                {"_id": 1, "username": "alice_dev", "email": "alice@example.com"},
                {"_id": 2, "username": "bob_ops", "email": "bob@example.com"}
            ]
            self.collection.insert_many(initial_users)

    def get_all(self):
        users_cursor = self.collection.find()
        # Map the Mongo documents back into our User models
        return [User(user_id=u["_id"], username=u["username"], email=u["email"]) for u in users_cursor]

    def create(self, username: str, email: str) -> User:
        """Finds the highest current ID, increments it, and inserts a new user."""
        last_user = self.collection.find_one(sort=[("_id", -1)])
        new_id = last_user["_id"] + 1 if last_user else 1

        user_doc = {
            "_id": new_id,
            "username": username,
            "email": email
        }
        self.collection.insert_one(user_doc)
        return User(new_id, username, email)

    def delete(self, user_id: int) -> bool:
        """Deletes a user from MongoDB. Returns True if successful, False otherwise."""
        result = self.collection.delete_one({"_id": user_id})
        return result.deleted_count > 0

