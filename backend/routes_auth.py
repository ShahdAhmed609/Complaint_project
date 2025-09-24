from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, Student, Admin
import datetime
from flask_jwt_extended import create_access_token

# blueprint for authentication
auth_bp = Blueprint("auth", __name__)

# route for register a new student
@auth_bp.route("/register", methods=["POST"])
def register_student():
    data = request.json

    # check if email already exists
    if Student.query.filter_by(email=data["email"]).first():
        return jsonify({"msg": "email already exists"}), 400

    # create new student
    user = Student(
        name=data["name"],
        email=data["email"],
        password=generate_password_hash(data["password"])
    )

    # add to database
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "Student registered"}), 201


# route for login student 
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email, password = data["email"], data["password"]

    user = Student.query.filter_by(email=email).first()
    role = "student"
    if not user:
        user = Admin.query.filter_by(email=email).first()
        role = "admin"

    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Invalid credentials"}), 401

   
    token = create_access_token(
        identity=str(user.id),  # sub = "21"
        additional_claims={"role": role},
        expires_delta=datetime.timedelta(days=1)  # token valid for 1 day
    )

    # return token + role
    return jsonify({"token": token, "role": role}), 200

# route for admin login only
@auth_bp.route("/admin/login", methods=["POST"])
def admin_login():
    data = request.json
    email, password = data["email"], data["password"]

    # check admin
    admin_user = Admin.query.filter_by(email=email).first()
    if not admin_user or not check_password_hash(admin_user.password, password):
        return jsonify({"msg": "Invalid admin credentials"}), 401

    # token fo the admin
    token = create_access_token(
        identity=str(admin_user.id),
        additional_claims={"role": "admin"},
        expires_delta=datetime.timedelta(days=1)
    )

    return jsonify({"token": token, "role": "admin"}), 200

# route for testing protected route
@auth_bp.route("/test-db")
def test_db():
    try:
        student = Student(name="TestUser", email="testuser@example.com", password="12345")
        db.session.add(student)
        db.session.commit()
        return "Database connected and data inserted successfully!"
    except Exception as e:
        return f"Error: {e}"
