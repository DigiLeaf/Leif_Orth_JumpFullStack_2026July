from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, verify_jwt_in_request, get_jwt
from functools import wraps
from services import UserService


admin_bp = Blueprint('admin', __name__)
user_service = UserService()

def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            # 1. Verify the request has a valid JWT
            verify_jwt_in_request()
            # 2. Extract the custom claims from the verified JWT
            claims = get_jwt()
            # 3. Check if the role matches ROLE_ADMIN
            if claims.get("role") != "ROLE_ADMIN":
                return jsonify({"error": "Forbidden: ADMIN_ROLE required; Your role is: " + claims.get("role")}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper



@admin_bp.route('/admin', methods=['GET'])
def get_admin_dashboard():
    """Placeholder admin endpoint for future JWT protection."""
    return jsonify({
        "message": "Welcome to the Admin Dashboard!",
        "status": "Unsecured",
        "info": "This endpoint will be protected with JWT in the next step."
    }), 200


from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/login', methods=['POST'])
def login():
    """Authenticates users via MongoDB and issues a role-specific JWT."""
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"error": "Missing username or password"}), 400

    username = data.get("username")
    password = data.get("password")

    # 1. Query MongoDB and securely verify the password
    user = user_service.authenticate_user(username, password)

    if user:
        # 2. Issue JWT with the specific user's database role
        access_token = create_access_token(
            identity=user["username"],
            additional_claims={"role": user.get("role", "ROLE_USER")}
        )
        return jsonify(access_token=access_token), 200

    return jsonify({"error": "Invalid credentials"}), 401

@admin_bp.route('/admin', methods=['GET'])
@admin_required()
def get_admin_dashboard():
    current_user = get_jwt_identity()
    return jsonify({
        "message": f"Welcome, {current_user}! You have successfully bypassed the database authorization barrier.",
        "status": "Secured"
    }), 200