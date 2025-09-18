from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    # Config (simple)
    app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://user:password@localhost:5432/complaints_db"
    app.config["SECRET_KEY"] = "dev_secret"
    app.config["JWT_SECRET_KEY"] = "jwt_secret"
    app.config["UPLOAD_FOLDER"] = "uploads"

    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    # create tables once
    with app.app_context():
        db.create_all()

    # register routes
    from auth import auth_bp
    from complaints import complaints_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(complaints_bp, url_prefix="/api/complaints")

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
