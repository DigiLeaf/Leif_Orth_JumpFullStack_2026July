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


class Account:
    def __init__(self, account_id: int, account_number: str, balance: float, account_type: str):
        self.id = account_id
        self.account_number = account_number
        self.balance = balance
        self.account_type = account_type

    def to_dict(self):
        return {
            "id": self.id,
            "account_number": self.account_number,
            "balance": self.balance,
            "account_type": self.account_type
        }