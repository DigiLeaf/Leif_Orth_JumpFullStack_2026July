class User:
    def __init__(self, user_id: int, name: str, email: str):
        self.id = user_id
        self.name = name
        self.email = email

    def to_dict(self):
        """Helper to convert the object to a dictionary for JSON serialization."""
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email
        }
