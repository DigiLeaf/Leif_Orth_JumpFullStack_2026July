from models import User

class UserRepository:
    def __init__(self):
        # Moving the hardcoded data here, mocked as User model objects
        self._db = [
            User(1, "Alice Smith", "alice@example.com"),
            User(2, "Bob Jones", "bob@example.com"),
            User(3, "Charlie Brown", "charlie@example.com")
        ]

    def get_all(self):
        """Fetches all users from the 'database'."""
        return self._db


from models import Account

class AccountRepository:
    def __init__(self):
        self._db = [
            Account(101, "ACC-12345", 5432.10, "Checking"),
            Account(102, "ACC-67890", 120500.85, "Savings"),
            Account(103, "ACC-55555", 250.00, "Checking")
        ]

    def get_by_id(self, account_id: int):
        """Finds an account by ID or returns None if not found."""
        for account in self._db:
            if account.id == account_id:
                return account
        return None

    def create(self, user_id: int, account_type: str) -> Account:
        """Generates a new account, appends it to the list, and returns it."""
        # Dynamic ID generation: find the highest current ID and add 1
        new_id = self._db[-1].id + 1 if self._db else 101

        # Mocking an account number generation
        account_number = f"ACC-{new_id}00"

        # New accounts start with a 0.00 balance
        # Note: In a real database, you'd associate this with the user_id via a foreign key
        new_account = Account(
            account_id=new_id,
            account_number=account_number,
            balance=0.00,
            account_type=account_type
        )

        self._db.append(new_account)
        return new_account