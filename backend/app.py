from flask import Flask
from extensions import db  
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from sqlalchemy import text 
from routes_test import test_bp




jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    # Config (simple)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:2023@localhost:5432/complaint_db'


    app.config["SECRET_KEY"] = "dev_secret"
    app.config["JWT_SECRET_KEY"] = "jwt_secret"
    app.config["UPLOAD_FOLDER"] = "uploads"

    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

   
        # create tables once and test connection
    with app.app_context():
        try:
            # اختبار الاتصال
            db.session.execute(text("SELECT 1"))  # <<< هنا صح
            print("✅ Database connected successfully!")
            # إنشاء الجداول
            db.create_all()
        except Exception as e:
            print("❌ Database connection failed:", e)


            


            # register routes
    from routes_complaints import complaints_bp
    from routes_auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(test_bp)
  
    app.register_blueprint(complaints_bp, url_prefix="/api/complaints")

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
