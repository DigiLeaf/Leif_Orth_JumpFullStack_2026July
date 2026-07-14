from flask import Flask
from controllers import users_bp

app = Flask(__name__)

# Register the controller blueprint
app.register_blueprint(users_bp)

if __name__ == '__main__':
    app.run(debug=True, port=5000)