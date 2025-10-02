from flask import Blueprint, request, jsonify, current_app, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from extensions import db
from models import Suggestion
from werkzeug.utils import secure_filename
import os

suggestions_bp = Blueprint("suggestions", __name__)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "pdf", "docx", "txt"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@suggestions_bp.route("/create", methods=["POST"])
@jwt_required()
def create_suggestion():
    identity = get_jwt_identity()
    claims = get_jwt()

    if claims.get("role") != "student":
        return jsonify({"msg": "Only students can create suggestions"}), 403

    title = request.form.get("title")
    department = request.form.get("department")
    description = request.form.get("description")

    if not title or not department or not description:
        return jsonify({"msg": "Missing required fields"}), 400

    sug = Suggestion(
        student_id=int(identity),
        title=title,
        department=department,
        description=description
    )

    file = request.files.get("file")
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        upload_folder = current_app.config.get("UPLOAD_FOLDER", "uploads")
        os.makedirs(upload_folder, exist_ok=True)
        file.save(os.path.join(upload_folder, filename))
        sug.file_path = filename

    db.session.add(sug)
    db.session.commit()

    return jsonify({"msg": "Suggestion created", "id": sug.id}), 201

@suggestions_bp.route("/my", methods=["GET"])
@jwt_required()
def my_suggestions():
    identity = get_jwt_identity()
    claims = get_jwt()

    if claims.get("role") != "student":
        return jsonify({"msg": "Only students can view this"}), 403

    sugs = Suggestion.query.filter_by(student_id=int(identity)).all()
    return jsonify([
        {
            "id": s.id,
            "title": s.title,
            "department": s.department,
            "description": s.description,
            "file_path": s.file_path,
            "status": s.status,
            "admin_reply": s.admin_reply,
            "created_at": s.created_at.isoformat()
        } for s in sugs
    ])

@suggestions_bp.route("/all", methods=["GET"])
@jwt_required()
def all_suggestions():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"msg": "Only admins can view this"}), 403

    sugs = Suggestion.query.all()
    return jsonify([
        {
            "id": s.id,
            "title": s.title,
            "student_id": s.student_id,
            "department": s.department,
            "description": s.description,
            "file_path": s.file_path,
            "status": s.status,
            "admin_reply": s.admin_reply,
            "created_at": s.created_at
        } for s in sugs
    ])

@suggestions_bp.route("/<int:id>/reply", methods=["POST"])
@jwt_required()
def reply_suggestion(id):
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"msg": "Only admins can reply"}), 403

    sug = Suggestion.query.get_or_404(id)
    data = request.json
    reply_text = data.get("admin_reply")
    status = data.get("status", sug.status)

    if status in ["accepted", "rejected"] and not reply_text:
        return jsonify({"msg": "Admin reply is required when accepting or rejecting"}), 400


    sug.admin_reply = reply_text
    sug.status = status
    db.session.commit()
    return jsonify({"msg": "Reply saved"})

@suggestions_bp.route("/files/<filename>", methods=["GET"])
def get_suggestion_file(filename):
    upload_folder = current_app.config.get("UPLOAD_FOLDER", "uploads")
    return send_from_directory(upload_folder, filename)
