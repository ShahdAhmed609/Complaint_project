from extensions import db
from datetime import datetime


class Student(db.Model):
    __tablename__ = "students"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)


    complaints = db.relationship("Complaint", backref="student", lazy=True)



class Admin(db.Model):
    __tablename__ = "admins"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)



class Complaint(db.Model):
    __tablename__ = "complaints"
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    suggestion = db.Column(db.Text)
    file_path = db.Column(db.String(255))
    status = db.Column(db.String(20), default="pending")  # pending / resolved
    reply = db.Column(db.Text)  # رد الأدمن
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
