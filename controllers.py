
from flask import Blueprint, jsonify, request
from repositories import UserRepository, AccountRepository

# Create a blueprint for user routes
users_bp = Blueprint('users', __name__)
user_repo = UserRepository()


@users_bp.route('/users', methods=['GET'])
def get_users():
    # 1. Ask the repository for the data
    users = user_repo.get_all()

    # 2. Format the data into JSON dictionaries
    serialized_users = [user.to_dict() for user in users]

    # 3. Return the HTTP response
    return jsonify(serialized_users), 200



accounts_bp = Blueprint('accounts', __name__)
account_repo = AccountRepository()


@accounts_bp.route('/accounts/<int:account_id>', methods=['GET'])
def get_account_details(account_id):
    # 1. Ask repository for the specific account
    account = account_repo.get_by_id(account_id)

    # 2. If it doesn't exist, return a 404 error
    if not account:
        return jsonify({"error": f"Account with ID {account_id} not found"}), 404

    # 3. Otherwise, return the account details
    return jsonify(account.to_dict()), 200


@accounts_bp.route('/accounts', methods=['POST'])
def create_account():
    # 1. Parse the incoming JSON data
    data = request.get_json()

    # 2. Basic validation: ensure required keys exist
    if not data or 'userId' not in data or 'accountType' not in data:
        return jsonify({"error": "Missing required fields: userId and accountType"}), 400

    user_id = data['userId']
    account_type = data['accountType']

    # 3. Call the repository to save the new account
    new_account = account_repo.create(user_id, account_type)

    # 4. Return the created account and an HTTP 201 Created status code
    return jsonify(new_account.to_dict()), 201

@accounts_bp.route('/accounts/<int:account_id>/deposit', methods=['POST'])
def deposit_money(account_id):
    data = request.get_json()

    # 1. Validation: Ensure amount is provided and is a valid number
    if not data or 'amount' not in data:
        return jsonify({"error": "Missing required field: amount"}), 400

    amount = data['amount']

    # Simple business logic rule: no negative deposits!
    if amount <= 0:
        return jsonify({"error": "Deposit amount must be greater than zero"}), 400

    # 2. Call the repository to update the balance
    updated_account = account_repo.deposit(account_id, amount)

    # 3. If account doesn't exist, return a 404
    if not updated_account:
        return jsonify({"error": f"Account with ID {account_id} not found"}), 404

    # 4. Return the updated account details with a 200 OK
    return jsonify(updated_account.to_dict()), 200


@accounts_bp.route('/accounts/<int:account_id>/withdraw', methods=['POST'])
def withdraw_money(account_id):
    data = request.get_json()

    # 1. Validation: Ensure amount is provided and valid
    if not data or 'amount' not in data:
        return jsonify({"error": "Missing required field: amount"}), 400

    amount = data['amount']

    if amount <= 0:
        return jsonify({"error": "Withdrawal amount must be greater than zero"}), 400

    # 2. Call the repository to attempt the withdrawal
    result = account_repo.withdraw(account_id, amount)

    # 3. Handle the repository responses
    if result is None:
        return jsonify({"error": f"Account with ID {account_id} not found"}), 404

    if result == "INSUFFICIENT_FUNDS":
        return jsonify({"error": "Insufficient funds to complete this withdrawal"}), 400

    # 4. Return the updated account details on success
    return jsonify(result.to_dict()), 200



@accounts_bp.route('/accounts/<int:account_id>/transactions', methods=['GET'])
def get_transaction_history(account_id):
    # 1. Verify the account actually exists first
    account = account_repo.get_by_id(account_id)
    if not account:
        return jsonify({"error": f"Account with ID {account_id} not found"}), 404

    # 2. Fetch all transactions for this account from the repository
    transactions = account_repo.get_transactions_by_account_id(account_id)

    # 3. Serialize and return the list
    serialized_txs = [tx.to_dict() for tx in transactions]
    return jsonify(serialized_txs), 200