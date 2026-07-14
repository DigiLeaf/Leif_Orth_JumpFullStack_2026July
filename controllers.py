from flask import Blueprint, jsonify, request
from services import AccountService
from repositories import UserRepository  # We still need the user repo for the simple endpoint

# 1. Setup Blueprints
users_bp = Blueprint('users', __name__)
accounts_bp = Blueprint('accounts', __name__)

# 2. Setup Dependencies
user_repo = UserRepository()
account_service = AccountService()


# ==========================================
# USER ROUTES
# ==========================================
@users_bp.route('/users', methods=['GET'])
def get_users():
    users = user_repo.get_all()
    return jsonify([user.to_dict() for user in users]), 200


# ==========================================
# ACCOUNT ROUTES (The service layer endpoints)
# ==========================================
@accounts_bp.route('/accounts', methods=['POST'])
def create_account():
    data = request.get_json()
    if not data or 'userId' not in data or 'accountType' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    new_account = account_service.create_account(data['userId'], data['accountType'])
    return jsonify(new_account.to_dict()), 201


@accounts_bp.route('/accounts/<int:account_id>', methods=['GET'])
def get_account_details(account_id):
    account = account_service.get_account(account_id)
    if not account:
        return jsonify({"error": "Account not found"}), 404
    return jsonify(account.to_dict()), 200


@accounts_bp.route('/accounts/<int:account_id>/deposit', methods=['POST'])
def deposit_money(account_id):
    data = request.get_json()
    if not data or 'amount' not in data:
        return jsonify({"error": "Missing amount"}), 400

    try:
        updated_account = account_service.deposit(account_id, data['amount'])
        if not updated_account:
            return jsonify({"error": "Account not found"}), 404
        return jsonify(updated_account.to_dict()), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@accounts_bp.route('/accounts/<int:account_id>/withdraw', methods=['POST'])
def withdraw_money(account_id):
    data = request.get_json()
    if not data or 'amount' not in data:
        return jsonify({"error": "Missing amount"}), 400

    try:
        result = account_service.withdraw(account_id, data['amount'])
        if result is None:
            return jsonify({"error": "Account not found"}), 404
        if result == "INSUFFICIENT_FUNDS":
            return jsonify({"error": "Insufficient funds"}), 400
        return jsonify(result.to_dict()), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@accounts_bp.route('/accounts/<int:account_id>/transactions', methods=['GET'])
def get_transaction_history(account_id):
    transactions = account_service.get_transactions(account_id)
    if transactions is None:
        return jsonify({"error": "Account not found"}), 404

    return jsonify([tx.to_dict() for tx in transactions]), 200


@accounts_bp.route('/accounts/<int:account_id>', methods=['DELETE'])
def delete_account(account_id):
    # 1. Call the service layer to delete the account
    success = account_service.delete_account(account_id)

    # 2. If it wasn't found, return a 404
    if not success:
        return jsonify({"error": f"Account with ID {account_id} not found"}), 404

    # 3. Standard REST practice: Return 204 No Content on successful deletion
    return '', 204