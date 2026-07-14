from models import Account, Transaction

class AccountRepository:
    def __init__(self):
        self._db = [
            Account(101, "ACC-12345", 5432.10, "Checking"),
            Account(102, "ACC-67890", 120500.85, "Savings"),
            Account(103, "ACC-55555", 250.00, "Checking")
        ]
        self._transactions = []

    def get_by_id(self, account_id: int):
        for account in self._db:
            if account.id == account_id:
                return account
        return None

    def get_transactions_by_account_id(self, account_id: int):
        return [t for t in self._transactions if t.account_id == account_id]

    def create(self, user_id: int, account_type: str) -> Account:
        new_id = self._db[-1].id + 1 if self._db else 101
        account_number = f"ACC-{new_id}00"
        new_account = Account(new_id, account_number, 0.00, account_type)
        self._db.append(new_account)
        return new_account

    def deposit(self, account_id: int, amount: float) -> Account:
        account = self.get_by_id(account_id)
        account.balance += amount
        tx_id = len(self._transactions) + 1
        self._transactions.append(Transaction(tx_id, account_id, "DEPOSIT", amount))
        return account

    def withdraw(self, account_id: int, amount: float) -> Account:
        account = self.get_by_id(account_id)
        account.balance -= amount
        tx_id = len(self._transactions) + 1
        self._transactions.append(Transaction(tx_id, account_id, "WITHDRAWAL", amount))
        return account

    def delete(self, account_id: int) -> bool:
        account = self.get_by_id(account_id)
        if account:
            self._db.remove(account)
            return True
        return False