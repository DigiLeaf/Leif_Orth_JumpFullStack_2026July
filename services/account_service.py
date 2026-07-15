from repositories import AccountRepository
from database import db

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

    from database import db  # Imported to log transactions easily

    # Inside your AccountService class:

    def transfer(self, source_acc_num: str, dest_acc_num: str, amount: float) -> bool:
        """Transfers money from a source account to a destination account using account numbers."""
        if amount <= 0:
            raise ValueError("Transfer amount must be greater than zero")

        # 1. Fetch both accounts from the repository
        source_acc = self.account_repo.find_by_account_number(source_acc_num)
        dest_acc = self.account_repo.find_by_account_number(dest_acc_num)

        if not source_acc or not dest_acc:
            raise ValueError("One or both accounts do not exist")

        # 2. Check sufficient funds
        if source_acc["balance"] < amount:
            raise ValueError("Insufficient funds for this transfer")

        # 3. Calculate new balances
        new_source_balance = source_acc["balance"] - amount
        new_dest_balance = dest_acc["balance"] + amount

        # 4. Save updated balances back to database
        self.account_repo.update_balance(source_acc_num, new_source_balance)
        self.account_repo.update_balance(dest_acc_num, new_dest_balance)

        # 5. Record Transaction entries
        db["transactions"].insert_many([
            {
                "account_id": source_acc["_id"],
                "account_number": source_acc_num,
                "transaction_type": "WITHDRAWAL",
                "amount": amount,
                "description": f"Transfer to {dest_acc_num}"
            },
            {
                "account_id": dest_acc["_id"],
                "account_number": dest_acc_num,
                "transaction_type": "DEPOSIT",
                "amount": amount,
                "description": f"Transfer from {source_acc_num}"
            }
        ])

        return True