from models import User

class UserRepository:
    def __init__(self):
        # Moving the hardcoded data here, mocked as User model objects
        self._db = [
            User(1, "Alice Smith", "alice@example.com"),
            User(2, "Bob Jones", "bob@example.com"),
            User(3, "Charlie Brown", "charlie@example.com")
        ]

    def get_all(self):
        """Fetches all users from the 'database'."""
        return self._db