from repositories import AccountRepository

class AccountService:
    def __init__(self):
        self.account_repo = AccountRepository()

    def create_account(self, user_id: int, account_type: str):
        return self.account_repo.create(user_id, account_type)

    def get_account(self, account_id: int):
        return self.account_repo.get_by_id(account_id)

    def deposit(self, account_id: int, amount: float):
        if amount <= 0:
            raise ValueError("Deposit amount must be greater than zero")
        account = self.account_repo.get_by_id(account_id)
        if not account:
            return None
        return self.account_repo.deposit(account_id, amount)

    def withdraw(self, account_id: int, amount: float):
        if amount <= 0:
            raise ValueError("Withdrawal amount must be greater than zero")
        account = self.account_repo.get_by_id(account_id)
        if not account:
            return None
        if account.balance < amount:
            return "INSUFFICIENT_FUNDS"
        return self.account_repo.withdraw(account_id, amount)

    def get_transactions(self, account_id: int):
        account = self.account_repo.get_by_id(account_id)
        if not account:
            return None
        return self.account_repo.get_transactions_by_account_id(account_id)

    def delete_account(self, account_id: int) -> bool:
        return self.account_repo.delete(account_id)