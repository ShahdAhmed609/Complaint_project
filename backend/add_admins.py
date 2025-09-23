# add_admins.py
# شغّلي هذا الملف من داخل virtualenv: python add_admins.py

from werkzeug.security import generate_password_hash
from app import create_app  # دالة create_app في app.py
from app import db as _db  # لو في app.py عملتي db = SQLAlchemy() واستدعاء create_app() بعدها
from models import Admin  # جدول الـ Admin في models.py

ADMINS = [
    ("Admin One", "admin1@example.com", "123456"),
    ("Admin Two", "admin2@example.com", "abcdef"),
]

def main():
    app = create_app()
    with app.app_context():
        for name, email, plain in ADMINS:
            # لو فيه سجل بنفس الايميل نتخطاه
            existing = Admin.query.filter_by(email=email).first()
            if existing:
                print(f"exists: {email}")
                continue

            hashed = generate_password_hash(plain)  # يستخدم pbkdf2:sha256 افتراضياً
            admin = Admin(name=name, email=email, password=hashed)
            _db.session.add(admin)
        _db.session.commit()
        print("done - admins added (if not existed)")

if __name__ == "main":
    main()