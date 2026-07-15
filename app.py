from flask import Flask
from controllers import users_bp, accounts_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Register Blueprints with appropriate prefixes
app.register_blueprint(users_bp)
app.register_blueprint(accounts_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)