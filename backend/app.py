import os
import sys

# Make sure backend dir is in path so imports work
sys.path.insert(0, os.path.dirname(__file__))

from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

from database.db import init_db
from routes.chat import chat_bp
from routes.memory import memory_bp
from routes.profile import profile_bp

app = Flask(__name__)

# Security: reject payloads larger than 64KB
app.config['MAX_CONTENT_LENGTH'] = 64 * 1024

# BUG-7 fix: read CORS origins from env so deployment works outside localhost
_cors_origins = os.environ.get(
    'CORS_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000'
).split(',')
CORS(app, origins=[o.strip() for o in _cors_origins])

# Register blueprints
app.register_blueprint(chat_bp)
app.register_blueprint(memory_bp)
app.register_blueprint(profile_bp)

# Always initialise DB, regardless of how the app is started
init_db()


@app.route("/api/health")
def health():
    return {"status": "ok", "app": "kai"}


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug_mode = os.environ.get("FLASK_DEBUG", "True").lower() in ("true", "1")
    print(f"Kai backend starting on port {port} (debug={debug_mode})")
    app.run(host="0.0.0.0", port=port, debug=debug_mode)
