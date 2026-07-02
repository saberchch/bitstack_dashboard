from functools import wraps
from flask import request, jsonify
from backend.db import get_db_connection

import jwt
from flask import current_app, request
from werkzeug.exceptions import Unauthorized

DEFAULT_USER_ID = 'BTS-8839-E4A'

def get_current_user_id():
    """
    Returns the authenticated user_id from the JWT token.
    Falls back to the X-User-Id header for diagnostic/system integration test compatibility.
    """
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            return payload['user_id']
        except jwt.ExpiredSignatureError:
            raise Unauthorized("Session expired. Please log in again.")
        except jwt.InvalidTokenError:
            raise Unauthorized("Invalid session token. Please log in again.")

    # Backward-compatible check for test suites or diagnostic CLI tools
    user_id = request.headers.get('X-User-Id')
    if user_id:
        return user_id

    raise Unauthorized("Authentication credentials missing or invalid.")

def get_user_profile(user_id):
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM profile WHERE user_id = ?', (user_id,)).fetchone()
    conn.close()
    return user

def requires_role(allowed_types=None, allowed_roles=None):
    """
    Decorator to restrict endpoint access based on profile_type or platform_role.
    :param allowed_types: List of allowed profile types (e.g. ['Student', 'Mentor', 'Freelancer'])
    :param allowed_roles: List of allowed platform roles (e.g. ['admin', 'member'])
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user_id = get_current_user_id()
            profile = get_user_profile(user_id)
            
            if not profile:
                return jsonify({'error': 'Unauthorized: Profile not found.'}), 401

            # Check Platform-level Admin/Member roles if specified
            if allowed_roles:
                if profile['platform_role'] not in allowed_roles:
                    return jsonify({'error': f"Forbidden: Requires role {allowed_roles}."}), 403
            
            # Check Module-level Profile Type (Student/Mentor/Freelancer) if specified
            if allowed_types:
                if profile['profile_type'] not in allowed_types:
                    return jsonify({'error': f"Forbidden: Restricted to {allowed_types}."}), 403
                    
            return f(*args, **kwargs)
        return decorated_function
    return decorator
