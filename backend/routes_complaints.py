from flask import Blueprint, request, jsonify, current_app, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Complaint
from werkzeug.utils import secure_filename
import os

complaints_bp = Blueprint("complaints", __name__)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "pdf", "docx", "txt"}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Student: create complaint
@complaints_bp.route("/create", methods=["POST"])
@jwt_required()
def create_complaint():
    identity = get_jwt_identity()
    if identity["role"] != "student":
        return jsonify({"msg": "Only students can create complaints"}), 403

    data = request.form  # changed to form to support file upload
    comp = Complaint(
        student_id=identity["id"],
        title=data["title"],
        department=data["department"],
        description=data["description"],
        suggestion=data.get("suggestion")
    )

    # handle file upload
    if "file" in request.files:
        file = request.files["file"]
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            upload_folder = current_app.config.get("UPLOAD_FOLDER", "uploads")
            os.makedirs(upload_folder, exist_ok=True)
            file.save(os.path.join(upload_folder, filename))
            comp.file_path = os.path.join(upload_folder, filename)

    db.session.add(comp)
    db.session.commit()
    return jsonify({"msg": "Complaint created", "id": comp.id}), 201

# Student: my complaints
@complaints_bp.route("/my", methods=["GET"])
@jwt_required()
def my_complaints():
    identity = get_jwt_identity()
    if identity["role"] != "student":
        return jsonify({"msg": "Only students can view this"}), 403
    comps = Complaint.query.filter_by(student_id=identity["id"]).all()
    return jsonify([
        {
            "id": c.id,
            "title": c.title,
            "department": c.department,
            "description": c.description,
            "suggestion": c.suggestion,
            "file_path": c.file_path,
            "status": c.status,
            "reply": c.reply
        } for c in comps
    ])

# Admin: all complaints
@complaints_bp.route("/all", methods=["GET"])
@jwt_required()
def all_complaints():
    identity = get_jwt_identity()
    if identity["role"] != "admin":
        return jsonify({"msg": "Only admins"}), 403
    comps = Complaint.query.all()
    return jsonify([
        {
            "id": c.id,
            "title": c.title,
            "student_id": c.student_id,
            "department": c.department,
            "description": c.description,
            "suggestion": c.suggestion,
            "file_path": c.file_path,
            "status": c.status,
            "reply": c.reply
        } for c in comps
    ])

# Admin: reply to complaint
@complaints_bp.route("/<int:id>/reply", methods=["POST"])
@jwt_required()
def reply(id):
    identity = get_jwt_identity()
    if identity["role"] != "admin":
        return jsonify({"msg": "Only admins"}), 403

    comp = Complaint.query.get_or_404(id)
    data = request.json
    reply_text = data.get("reply")
    status = data.get("status", comp.status)

    # validate status
    if status not in ["pending", "resolved", "terminated"]:
        return jsonify({"msg": "Invalid status"}), 400

    comp.reply = reply_text
    comp.status = status
    db.session.commit()
    return jsonify({"msg": "Reply saved"})

# Serve uploaded files
@complaints_bp.route("/files/<filename>", methods=["GET"])
def get_file(filename):
    return send_from_directory(current_app.config.get("UPLOAD_FOLDER", "uploads"), filename)
