from flask import Blueprint, jsonify, request
from repositories import UserRepository
from services import UserService

users_bp = Blueprint('users', __name__)
user_repo = UserRepository()
user_service = UserService()  # <-- Initialize the service


@users_bp.route('/users', methods=['GET'])
def get_users():
    users = user_repo.get_all()
    return jsonify([user.to_dict() for user in users]), 200


@users_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()

    # 1. Input Validation
    if not data or 'username' not in data or 'email' not in data:
        return jsonify({"error": "Missing required fields: username and email"}), 400

    try:
        # 2. Process via Service Layer
        new_user = user_service.create_user(data['username'], data['email'])
        # 3. Return serialized user model with 201 Created
        return jsonify(new_user.to_dict()), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@users_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    # 1. Call the service layer to handle the execution
    success = user_service.delete_user(user_id)

    # 2. If user wasn't found in MongoDB, return 404
    if not success:
        return jsonify({"error": f"User with ID {user_id} not found"}), 404

    # 3. Return 204 No Content on success
    return '', 204