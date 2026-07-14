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