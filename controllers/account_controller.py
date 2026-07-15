from flask import Blueprint, jsonify, request
from services import AccountService

accounts_bp = Blueprint('accounts', __name__)
account_service = AccountService()

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
    success = account_service.delete_account(account_id)
    if not success:
        return jsonify({"error": f"Account with ID {account_id} not found"}), 404
    return '', 204


@accounts_bp.route('/accounts/transfer', methods=['POST'])
def transfer_money():
    """Endpoint to transfer money between two accounts using account numbers."""
    data = request.get_json()

    # 1. Validate that the request body contains the required fields
    if not data:
        return jsonify({"error": "Missing request body"}), 400

    source_acc_num = data.get("source_account")
    dest_acc_num = data.get("destination_account")
    amount = data.get("amount")

    if not source_acc_num or not dest_acc_num or amount is None:
        return jsonify({"error": "Missing required fields: source_account, destination_account, amount"}), 400

    # 2. Try to perform the transfer using the service layer
    try:
        # Convert amount to float to ensure we don't pass string numbers
        transfer_amount = float(amount)

        success = account_service.transfer(source_acc_num, dest_acc_num, transfer_amount)

        if success:
            return jsonify({
                "message": "Transfer completed successfully!",
                "details": {
                    "source": source_acc_num,
                    "destination": dest_acc_num,
                    "amount_transferred": transfer_amount
                }
            }), 200

    except ValueError as e:
        # Catch validation errors (e.g., insufficient funds, negative amount, accounts not found)
        return jsonify({"error": str(e)}), 400

    except Exception as e:
        # Catch unexpected errors to prevent the API from completely crashing
        return jsonify({"error": "An unexpected server error occurred"}), 500