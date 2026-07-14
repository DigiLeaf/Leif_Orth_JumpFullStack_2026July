from flask import Blueprint, jsonify
from repositories import UserRepository

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