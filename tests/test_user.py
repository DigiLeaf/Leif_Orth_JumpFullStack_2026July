import pytest
from services.user_service import UserService
from database import db


def test_change_user_email_successfully():
    # 1. Arrange: Setup a test user in our database
    user_service = UserService()

    # We will temporarily insert a clean test user directly into MongoDB
    test_user_id = 999
    db["users"].delete_one({"_id": test_user_id})  # Clean up any leftovers
    db["users"].insert_one({
        "_id": test_user_id,
        "username": "test_developer",
        "email": "old_email@example.com"
    })

    # 2. Act: Call the method we WANT to exist
    new_email = "new_email@example.com"
    updated_user = user_service.change_email(test_user_id, new_email)

    # 3. Assert: Verify the returned object and DB state match our expectations
    assert updated_user is not None
    assert updated_user.email == new_email

    # Also double-check the database directly to ensure it actually saved
    db_doc = db["users"].find_one({"_id": test_user_id})
    assert db_doc["email"] == new_email

    # Clean up after ourselves
    db["users"].delete_one({"_id": test_user_id})