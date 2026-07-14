from models import User

class UserRepository:
    def __init__(self):
        self._db = [
            User(1, "alice_dev", "alice@example.com"),
            User(2, "bob_ops", "bob@example.com")
        ]

    def get_all(self):
        return self._db