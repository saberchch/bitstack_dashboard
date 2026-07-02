from flask import Blueprint, jsonify, request
from backend.auth import get_current_user_id, get_user_profile, requires_role
import backend.models.profile as profile_model

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/profile', methods=['GET'])
def get_user_profile_endpoint():
    user_id = get_current_user_id()
    profile = profile_model.get_profile(user_id)
    if not profile:
        return jsonify({'error': 'Profile not found.'}), 404
    return jsonify(profile)

@profile_bp.route('/profile', methods=['PUT'])
def update_user_profile_endpoint():
    user_id = get_current_user_id()
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid payload.'}), 400
    
    # Sanitization and validation
    if 'email' in data and '@' not in data['email']:
        return jsonify({'error': 'Invalid email format.'}), 400
        
    profile = profile_model.save_profile(user_id, data)
    return jsonify(profile)

@profile_bp.route('/settings', methods=['GET'])
def get_user_settings_endpoint():
    user_id = get_current_user_id()
    settings = profile_model.get_settings(user_id)
    return jsonify(settings)

@profile_bp.route('/settings', methods=['PUT'])
def update_user_settings_endpoint():
    user_id = get_current_user_id()
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid payload.'}), 400
        
    # Enforce role safety: Only Mentors can set scheduling modes and rates
    profile = get_user_profile(user_id)
    is_mentor_setting = any(k in data for k in ['mentorHourlyRate', 'mentorSchedulingMode', 'mentorCalendarLink'])
    if is_mentor_setting and profile['profile_type'] != 'Mentor':
        return jsonify({'error': 'Forbidden: Only Mentors can configure mentoring settings.'}), 403
        
    settings = profile_model.save_settings(user_id, data)
    return jsonify(settings)
