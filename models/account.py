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
