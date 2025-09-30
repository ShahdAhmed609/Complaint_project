from flask import Flask
from extensions import db  
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from sqlalchemy import text 
from routes_complaints import complaints_bp
from routes_auth import auth_bp
from routes_suggestions import suggestions_bp

jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    # Config
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:2025@localhost:5432/complaint_db'
    app.config["SECRET_KEY"] = "dev_secret"
    app.config["JWT_SECRET_KEY"] = "jwt_secret"
    app.config["UPLOAD_FOLDER"] = "uploads"

    db.init_app(app)
    jwt.init_app(app)
    CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:3000"}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"]
     )


    # create tables once and test connection
    with app.app_context():
        try:
            db.session.execute(text("SELECT 1"))
            print("✅ Database connected successfully!")
            db.create_all()
        except Exception as e:
            print("❌ Database connection failed:", e)

    # register routes
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(complaints_bp, url_prefix="/api/complaints")
    app.register_blueprint(suggestions_bp, url_prefix="/api/suggestions")

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
