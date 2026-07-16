import os
from flask import Flask
from controllers.admin_controller import admin_bp
from controllers import users_bp, accounts_bp
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
jwt = JWTManager(app)
# Register Blueprints with appropriate prefixes
app.register_blueprint(admin_bp)
app.register_blueprint(users_bp)
app.register_blueprint(accounts_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)