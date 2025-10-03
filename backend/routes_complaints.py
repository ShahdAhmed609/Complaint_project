from flask import Blueprint, request, jsonify, current_app, send_from_directory, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from extensions import db
from models import Complaint
from werkzeug.utils import secure_filename
import os

complaints_bp = Blueprint("complaints", __name__)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "pdf", "docx", "txt"}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Create Complaint
@complaints_bp.route("/create", methods=["POST"])
@jwt_required()
def create_complaint():
    identity = get_jwt_identity()
    claims = get_jwt()

    if claims.get("role") != "student":
        return jsonify({"msg": "Only students can create complaints"}), 403

    title = request.form.get("title")
    department = request.form.get("department")
    description = request.form.get("description")
    suggestion = request.form.get("suggestion")

    if not title or not department or not description:
        return jsonify({"msg": "Missing required fields"}), 400

    comp = Complaint(
        student_id=int(identity),
        title=title,
        department=department,
        description=description,
        suggestion=suggestion
    )

    # Handle file upload
    file = request.files.get("file")
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        upload_folder = current_app.config.get("UPLOAD_FOLDER", "uploads")
        os.makedirs(upload_folder, exist_ok=True)
        file.save(os.path.join(upload_folder, filename))
        comp.file_path = filename

    db.session.add(comp)
    db.session.commit()

    return jsonify({"msg": "Complaint created", "id": comp.id}), 201

# Student Complaints 
@complaints_bp.route("/my", methods=["GET"])
@jwt_required()
def my_complaints():
    identity = get_jwt_identity()
    claims = get_jwt()

    if claims.get("role") != "student":
        return jsonify({"msg": "Only students can view this"}), 403

    comps = Complaint.query.filter_by(student_id=int(identity)).all()
    response = make_response(jsonify([
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
    ]))
    # cach control for 1 minute
    response.headers["Cache-Control"] = "public, max-age=60"
    return response

# Admin: All Complaints
@complaints_bp.route("/all", methods=["GET"])
@jwt_required()
def all_complaints():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"msg": "Only admins"}), 403

    comps = Complaint.query.all()
    response = make_response(jsonify([
        {
            "id": c.id,
            "title": c.title,
            "student_id": c.student_id,
            "department": c.department,
            "description": c.description,
            "suggestion": c.suggestion,
            "file_path": c.file_path,
            "status": c.status,
            "reply": c.reply,
            "created_at": c.created_at.isoformat() 
        } for c in comps
    ]))
    # cach control for 1 minute
    response.headers["Cache-Control"] = "public, max-age=60"
    return response

#  Admin: Reply
@complaints_bp.route("/<int:id>/reply", methods=["POST"])
@jwt_required()
def reply(id):
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"msg": "Only admins"}), 403

    comp = Complaint.query.get_or_404(id)
    data = request.json
    reply_text = data.get("reply")
    status = data.get("status", comp.status)

    if status not in ["pending", "resolved", "terminated"]:
        return jsonify({"msg": "Invalid status"}), 400

    comp.reply = reply_text
    comp.status = status
    db.session.commit()
    return jsonify({"msg": "Reply saved"})

# Serve complaint files
@complaints_bp.route("/files/<filename>", methods=["GET"])
def get_file(filename):
    upload_folder = current_app.config.get("UPLOAD_FOLDER", "uploads")
    response = make_response(send_from_directory(upload_folder, filename))
    # cach control for 1 day
    response.headers["Cache-Control"] = "public, max-age=86400"
    return response
