"""
app.py  –  BitStack Dashboard  –  Flask Application Entry-Point
================================================================
Architecture "puzzle" layout:
  backend/db.py          ← database bootstrap & schema
  backend/auth.py        ← RBAC decorators & JWT helpers
  backend/models/*.py    ← one module per domain (profile, sessions…)
  backend/routes/*.py    ← one Blueprint per domain
  app.py                 ← assembles all pieces + serves the SPA

Rate-limiting: flask-limiter with an in-memory store (swap for Redis
               in production by changing the LIMITER_STORAGE_URI env var).
CORS: only /api/* is opened; SPA assets stay same-origin.
"""

import os
import sys

# Load .env file for local development (python-dotenv is optional — install
# it with `pip install python-dotenv` or add it to requirements.txt).
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # dotenv not installed — rely on real environment variables
from flask import Flask, render_template, send_from_directory, jsonify, g
from flask_cors import CORS

# ── Rate Limiter ──────────────────────────────────────────────────────────────
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE_DIR, 'frontend', 'dist')
ASSETS_DIR = os.path.join(DIST_DIR, 'assets')

app = Flask(
    __name__,
    static_folder=ASSETS_DIR,
    static_url_path='/assets',
    template_folder=DIST_DIR,
)

# ── Security ──────────────────────────────────────────────────────────────────
# SECRET_KEY must be set via environment variable.
# For local development: copy .env.example to .env and fill it in.
# For production (Render/Heroku): set the SECRET_KEY environment variable
#   in your hosting dashboard — never hardcode it here.
_secret_key = os.environ.get('SECRET_KEY', '')
if not _secret_key:
    if os.environ.get('FLASK_ENV') == 'production' or os.environ.get('RENDER'):
        # Hard-fail: refuse to start in production without a real secret.
        print('FATAL: SECRET_KEY environment variable is not set.', file=sys.stderr)
        print('Set it in your hosting dashboard or .env file.', file=sys.stderr)
        sys.exit(1)
    else:
        # Dev fallback — warn clearly so developers notice immediately.
        import secrets
        _secret_key = secrets.token_hex(32)
        print(
            '\n[WARNING] SECRET_KEY is not set in your environment.\n'
            '  A random key has been generated for this session only.\n'
            '  Sessions will be lost on every restart.\n'
            '  Copy .env.example to .env and set a real SECRET_KEY.\n',
            file=sys.stderr
        )
app.config['SECRET_KEY'] = _secret_key

# CORS: only /api/* endpoints are opened for cross-origin calls (Vite dev proxy)
CORS(app, resources={r'/api/*': {'origins': '*'}})

# Rate limiting: 200 req/day global, 60/minute per IP, overridable per route
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=['200 per day', '60 per minute'],
    storage_uri=os.environ.get('LIMITER_STORAGE_URI', 'memory://'),
)

# ── Database bootstrap ────────────────────────────────────────────────────────
from backend.db import init_db, remove_session
init_db()

@app.teardown_appcontext
def shutdown_session(exception=None):
    """Return SQLAlchemy session to pool after every request."""
    remove_session()

# ── Register Blueprints ───────────────────────────────────────────────────────
from backend.routes.sync       import sync_bp
from backend.routes.profile    import profile_bp
from backend.routes.sessions   import sessions_bp
from backend.routes.missions   import missions_bp
from backend.routes.messages   import messages_bp
from backend.routes.library    import library_bp
from backend.routes.reviews    import reviews_bp
from backend.routes.calendar   import calendar_bp
from backend.routes.auth       import auth_bp

API_PREFIX = '/api'

app.register_blueprint(sync_bp,      url_prefix=API_PREFIX)
limiter.exempt(sync_bp)
app.register_blueprint(profile_bp,   url_prefix=API_PREFIX)
app.register_blueprint(sessions_bp,  url_prefix=API_PREFIX)
app.register_blueprint(missions_bp,  url_prefix=API_PREFIX)
app.register_blueprint(messages_bp,  url_prefix=API_PREFIX)
app.register_blueprint(library_bp,   url_prefix=API_PREFIX)
app.register_blueprint(reviews_bp,   url_prefix=API_PREFIX)
app.register_blueprint(calendar_bp,  url_prefix=API_PREFIX)
app.register_blueprint(auth_bp,      url_prefix=f'{API_PREFIX}/auth')

# ── Health / status endpoint ──────────────────────────────────────────────────
@app.route('/api/health')
@limiter.exempt  # health checks must never be rate-limited
def health():
    return jsonify({'status': 'ok', 'version': '1.0.0'})

# ── SPA catch-all ─────────────────────────────────────────────────────────────
def dist_ready():
    return os.path.isfile(os.path.join(DIST_DIR, 'index.html'))

def build_instructions():
    return (
        'Frontend build missing. On Render, set Build Command to: '
        'chmod +x build.sh && ./build.sh'
    ), 503

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if not dist_ready():
        return build_instructions()

    if path:
        file_path = os.path.join(DIST_DIR, path)
        if os.path.isfile(file_path):
            return send_from_directory(DIST_DIR, path)

    return render_template('index.html')


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=True, use_reloader=False, host='0.0.0.0', port=port)
