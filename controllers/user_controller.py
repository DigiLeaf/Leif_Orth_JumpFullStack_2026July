from flask import Blueprint, jsonify
from repositories import UserRepository

users_bp = Blueprint('users', __name__)
user_repo = UserRepository()

@users_bp.route('/users', methods=['GET'])
def get_users():
    users = user_repo.get_all()
    return jsonify([user.to_dict() for user in users]), 200