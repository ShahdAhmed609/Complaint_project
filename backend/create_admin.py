from extensions import db
from models import Admin
from werkzeug.security import generate_password_hash
from app import create_app


app = create_app()

with app.app_context():
   
    name = "Super Admin"
    email = "admin33@example.com"
    password = "123456"  

  
    if Admin.query.filter_by(email=email).first():
        print(" Admin with this email already exists")
    else:
        new_admin = Admin(
            name=name,
            email=email,
            password=generate_password_hash(password)
        )
        db.session.add(new_admin)
        db.session.commit()
        print(" Admin created successfully!")
