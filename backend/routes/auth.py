from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import random
import string
from backend.db import get_db_connection
import backend.models.profile as profile_model

auth_bp = Blueprint('auth', __name__)

def generate_user_id():
    digits = "".join(random.choices(string.digits, k=4))
    letters = "".join(random.choices(string.ascii_uppercase + string.digits, k=3))
    return f"BTS-{digits}-{letters}"

def generate_jwt(user_id, email, role):
    payload = {
        'user_id': user_id,
        'email': email,
        'role': role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7) # Token valid for 7 days
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not all(k in data for k in ['name', 'email', 'password', 'role']):
        return jsonify({'error': 'Missing required fields: name, email, password, role.'}), 400

    name = data['name'].strip()
    email = data['email'].strip().lower()
    password = data['password']
    role = data['role']  # 'Student' or 'Mentor'

    if role not in ['Student', 'Mentor']:
        return jsonify({'error': 'Invalid role. Must be Student or Mentor.'}), 400

    if '@' not in email:
        return jsonify({'error': 'Invalid email address format.'}), 400

    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters long.'}), 400

    conn = get_db_connection()
    # Check if user already exists
    existing = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    if existing:
        conn.close()
        return jsonify({'error': 'An account with this email already exists.'}), 409

    # Insert credentials
    user_id = generate_user_id()
    password_hash = generate_password_hash(password)
    created_at = datetime.datetime.utcnow().isoformat()

    conn.execute('''
        INSERT INTO users (user_id, email, password_hash, name, role, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (user_id, email, password_hash, name, role, created_at))
    conn.commit()
    conn.close()

    # Create associated Profile
    profile_model.save_profile(user_id, {
        'name': name,
        'email': email,
        'phone': '',
        'role': 'Scholar' if role == 'Student' else 'Mentor',
        'profileType': role,
        'verificationStatus': 'Verified Scholar' if role == 'Student' else 'New Mentor',
        'avatar': f'https://ui-avatars.com/api/?name={name.replace(" ", "+")}&background=d4a017&color=0b1121&size=100',
        'bio': '',
        'skillLevel': 'Beginner' if role == 'Student' else 'Expert',
        'topicInterests': [],
        'linkedin': '',
        'github': '',
        'website': '',
        'platformRole': 'member',
        'balance': 1000 if role == 'Student' else 2500
    })

    # Create associated Settings
    profile_model.save_settings(user_id, {
        'uiLanguage': 'English',
        'twoFactor': False,
        'notifications': {'email': True, 'push': True, 'marketing': False},
        'payoutMethod': 'bank',
        'payoutDetails': '',
        'autoRenewSub': True,
        'autoStakeReputation': False,
        'mentorHourlyRate': 80 if role == 'Mentor' else 0,
        'mentorSessionDuration': 60 if role == 'Mentor' else 0,
        'mentorSchedulingMode': 'manual' if role == 'Mentor' else '',
        'mentorCalendarSync': False,
        'mentorCalendarLink': ''
    })

    token = generate_jwt(user_id, email, role)
    return jsonify({
        'token': token,
        'user': {
            'userId': user_id,
            'email': email,
            'name': name,
            'role': role
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not all(k in data for k in ['email', 'password']):
        return jsonify({'error': 'Missing email or password.'}), 400

    email = data['email'].strip().lower()
    password = data['password']

    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()

    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({'error': 'Invalid email or password.'}), 401

    token = generate_jwt(user['user_id'], user['email'], user['role'])
    return jsonify({
        'token': token,
        'user': {
            'userId': user['user_id'],
            'email': user['email'],
            'name': user['name'],
            'role': user['role']
        }
    }), 200

@auth_bp.route('/verify', methods=['GET'])
def verify():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Missing authorization header.'}), 401

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return jsonify({
            'userId': payload['user_id'],
            'email': payload['email'],
            'role': payload['role']
        }), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired.'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token.'}), 401
