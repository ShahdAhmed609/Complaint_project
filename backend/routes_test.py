# routes_test.py
from flask import Blueprint
from models import db, Student

test_bp = Blueprint("test_bp", __name__)

@test_bp.route("/test-long-password")
def test_long_password():
    try:
        long_password = "a" * 200
        student = Student(
            name="LongPassUser",
            email=" nouran223@example.com",
            password=long_password
        )
        db.session.add(student)
        db.session.commit()
        return "Data inserted successfully with long password!"
    except Exception as e:
        return f"Error: {e}"
