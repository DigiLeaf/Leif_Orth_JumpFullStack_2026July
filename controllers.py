
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