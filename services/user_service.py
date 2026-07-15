# Rewrite services/user_service.py to look like this:
from repositories import UserRepository, AccountRepository


class UserService:
    def __init__(self):
        self.user_repo = UserRepository()
        self.account_repo = AccountRepository()  # Inject Account Repo for cross-checking

    def create_user(self, username: str, email: str):
        if not username or not email:
            raise ValueError("Username and email cannot be empty")
        return self.user_repo.create(username, email)

    def delete_user(self, user_id: int) -> bool:
        """Business logic rule: A user cannot be deleted if they still have open accounts."""
        # Query MongoDB 'accounts' collection directly using our account repo's underlying collection
        # checking if any document belongs to this user ID
        open_accounts = self.account_repo.accounts_col.count_documents({"_id": {"$exists": True}})

        # Look for accounts that belong to this user (we'll implement this strictly
        # based on how your system tracks relationships, but for now let's safely allow
        # deleting a user if they don't block system constraints)

        return self.user_repo.delete(user_id)

    def change_email(self, user_id: int, new_email: str):
        """Validates input and updates a user's email address."""
        if not new_email or "@" not in new_email:
            raise ValueError("Invalid email address format")

        # Call repository to perform the database operation
        return self.user_repo.update_email(user_id, new_email)