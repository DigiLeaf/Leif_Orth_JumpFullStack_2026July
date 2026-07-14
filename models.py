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


from datetime import datetime

# Append this to models.py
from datetime import datetime

class Transaction:
    def __init__(self, transaction_id: int, account_id: int, transaction_type: str, amount: float):
        self.id = transaction_id
        self.account_id = account_id
        self.transaction_type = transaction_type  # "DEPOSIT" or "WITHDRAWAL"
        self.amount = amount
        self.timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    def to_dict(self):
        return {
            "id": self.id,
            "account_id": self.account_id,
            "transaction_type": self.transaction_type,
            "amount": self.amount,
            "timestamp": self.timestamp
        }