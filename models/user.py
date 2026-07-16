class User:
    def __init__(self, user_id: int, username: str, email: str, role:str = "ROLE_USER"):
        self.id = user_id
        self.username = username
        self.email = email
        self.role = role

    def to_dict(self):
        """Helper to convert the object to a dictionary for JSON serialization."""
        return {
            "id": self.id,
            "name": self.username,
            "email": self.email,
            "role": self.role
        }
