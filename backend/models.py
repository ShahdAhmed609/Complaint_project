from extensions import db
from datetime import datetime

class Student(db.Model):
    tablename = "students"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)  # مطابق لـ ALTER

    


class Complaint(db.Model):
    tablename = "complaints"
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    suggestion = db.Column(db.Text)
    file_path = db.Column(db.String(255))
    status = db.Column(db.String(20), default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # إضافة وقت الإنشاء


class Admin(db.Model):
    tablename = "admins"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)