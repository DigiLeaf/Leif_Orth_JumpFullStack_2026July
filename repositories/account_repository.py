from database import db
from models import Account, Transaction


class AccountRepository:
    def __init__(self):
        self.accounts_col = db["accounts"]
        self.transactions_col = db["transactions"]
        self._seed_data_if_empty()

    def _seed_data_if_empty(self):
        """Seeds initial accounts if the database collection is empty."""
        if self.accounts_col.count_documents({}) == 0:
            initial_accounts = [
                {"_id": 101, "account_number": "ACC-12345", "balance": 5432.10, "account_type": "Checking"},
                {"_id": 102, "account_number": "ACC-67890", "balance": 120500.85, "account_type": "Savings"},
                {"_id": 103, "account_number": "ACC-55555", "balance": 250.00, "account_type": "Checking"}
            ]
            self.accounts_col.insert_many(initial_accounts)

    def get_by_id(self, account_id: int):
        doc = self.accounts_col.find_one({"_id": account_id})
        if not doc:
            return None
        return Account(doc["_id"], doc["account_number"], doc["balance"], doc["account_type"])

    def get_transactions_by_account_id(self, account_id: int):
        cursor = self.transactions_col.find({"account_id": account_id})
        return [Transaction(t["_id"], t["account_id"], t["transaction_type"], t["amount"]) for t in cursor]

    def create(self, user_id: int, account_type: str) -> Account:
        # Dynamically find the highest ID in MongoDB to auto-increment it
        last_account = self.accounts_col.find_one(sort=[("_id", -1)])
        new_id = last_account["_id"] + 1 if last_account else 101

        account_number = f"ACC-{new_id}00"

        account_doc = {
            "_id": new_id,
            "account_number": account_number,
            "balance": 0.00,
            "account_type": account_type
        }
        self.accounts_col.insert_one(account_doc)
        return Account(new_id, account_number, 0.00, account_type)

    def deposit(self, account_id: int, amount: float) -> Account:
        # 1. Update the account balance atomically in Mongo
        self.accounts_col.update_one({"_id": account_id}, {"$inc": {"balance": amount}})

        # 2. Log the transaction doc
        last_tx = self.transactions_col.find_one(sort=[("_id", -1)])
        tx_id = last_tx["_id"] + 1 if last_tx else 1

        self.transactions_col.insert_one({
            "_id": tx_id,
            "account_id": account_id,
            "transaction_type": "DEPOSIT",
            "amount": amount
        })
        return self.get_by_id(account_id)

    def withdraw(self, account_id: int, amount: float) -> Account:
        # 1. Decrease the balance atomically (amount passed is positive, so subtract via negative increment)
        self.accounts_col.update_one({"_id": account_id}, {"$inc": {"balance": -amount}})

        # 2. Log the transaction doc
        last_tx = self.transactions_col.find_one(sort=[("_id", -1)])
        tx_id = last_tx["_id"] + 1 if last_tx else 1

        self.transactions_col.insert_one({
            "_id": tx_id,
            "account_id": account_id,
            "transaction_type": "WITHDRAWAL",
            "amount": amount
        })
        return self.get_by_id(account_id)

    def delete(self, account_id: int) -> bool:
        result = self.accounts_col.delete_one({"_id": account_id})
        # Optional: Clean up associated transactions
        if result.deleted_count > 0:
            self.transactions_col.delete_many({"account_id": account_id})
            return True
        return False