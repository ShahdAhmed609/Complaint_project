from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, Student, Admin
import datetime
from flask_jwt_extended import create_access_token

# blueprint for authentication
auth_bp = Blueprint("auth", __name__)

# --------------------------
# route for register a new student
# --------------------------
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


# --------------------------
# route for login student 
# --------------------------
@auth_bp.route("/login", methods=["POST"])
def student_login():
    data = request.json
    email, password = data["email"], data["password"]

    # check student only
    student = Student.query.filter_by(email=email).first()
    if not student or not check_password_hash(student.password, password):
        return jsonify({"msg": "Invalid student credentials"}), 401

    token = create_access_token(
        identity=str(student.id),
        additional_claims={"role": "student"},
        expires_delta=datetime.timedelta(days=1)
    )

    return jsonify({"token": token, "role": "student"}), 200


# --------------------------
# route for admin login only
# --------------------------
@auth_bp.route("/admin/login", methods=["POST"])
def admin_login():
    data = request.json
    email, password = data["email"], data["password"]

    # check admin only
    admin_user = Admin.query.filter_by(email=email).first()
    if not admin_user or not check_password_hash(admin_user.password, password):
        return jsonify({"msg": "Invalid admin credentials"}), 401

    token = create_access_token(
        identity=str(admin_user.id),
        additional_claims={"role": "admin"},
        expires_delta=datetime.timedelta(days=1)
    )

    return jsonify({"token": token, "role": "admin"}), 200

