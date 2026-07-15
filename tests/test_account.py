import pytest
from services.account_service import AccountService
from database import db


def test_transfer_money_by_account_number_successfully():
    # 1. Arrange: Setup two clean test accounts in MongoDB with unique account numbers
    account_service = AccountService()

    source_acc_num = "ACC-TDD-SOURCE"
    dest_acc_num = "ACC-TDD-DEST"

    # Clean up leftovers from previous runs
    db["accounts"].delete_many({"account_number": {"$in": [source_acc_num, dest_acc_num]}})
    db["transactions"].delete_many({"account_number": {"$in": [source_acc_num, dest_acc_num]}})

    # Insert source account with $500 balance
    db["accounts"].insert_one({
        "_id": 888,
        "account_number": source_acc_num,
        "balance": 500.00,
        "account_type": "Checking"
    })

    # Insert destination account with $100 balance
    db["accounts"].insert_one({
        "_id": 999,
        "account_number": dest_acc_num,
        "balance": 100.00,
        "account_type": "Savings"
    })

    # 2. Act: Call the transfer method using ACCOUNT NUMBERS instead of IDs
    transfer_amount = 150.00
    success = account_service.transfer(source_acc_num, dest_acc_num, transfer_amount)

    # 3. Assert
    assert success is True

    # Check source account balance has decreased ($500 -> $350)
    source_doc = db["accounts"].find_one({"account_number": source_acc_num})
    assert source_doc["balance"] == 350.00

    # Check destination account balance has increased ($100 -> $250)
    dest_doc = db["accounts"].find_one({"account_number": dest_acc_num})
    assert dest_doc["balance"] == 250.00

    # Clean up our test documents
    db["accounts"].delete_many({"account_number": {"$in": [source_acc_num, dest_acc_num]}})