from flask import Blueprint, jsonify, request
from backend.auth import get_current_user_id, requires_role
import backend.models.missions as missions_model
import time

missions_bp = Blueprint('missions', __name__)

@missions_bp.route('/missions', methods=['GET'])
def list_missions():
    filters = {
        'category': request.args.get('category'),
        'status': request.args.get('status'),
        'posted_by': request.args.get('posted_by')
    }
    return jsonify(missions_model.get_all_missions(filters))

@missions_bp.route('/missions/<mission_id>', methods=['GET'])
def get_mission(mission_id):
    m = missions_model.get_mission(mission_id)
    if not m:
        return jsonify({'error': 'Mission not found.'}), 404
    return jsonify(m)

@missions_bp.route('/missions', methods=['POST'])
@requires_role(allowed_types=['Freelancer', 'admin'])
def create_mission():
    user_id = get_current_user_id()
    data = request.get_json()
    if not data or not data.get('title'):
        return jsonify({'error': 'title is required'}), 400
    data['id'] = data.get('id', f'mission-{int(time.time())}')
    data['posted_by'] = user_id
    return jsonify(missions_model.save_mission(data)), 201

@missions_bp.route('/missions/<mission_id>', methods=['PATCH'])
@requires_role(allowed_types=['Freelancer', 'admin'])
def update_mission(mission_id):
    user_id = get_current_user_id()
    m = missions_model.get_mission(mission_id)
    if not m:
        return jsonify({'error': 'Mission not found.'}), 404
    if m.get('posted_by') != user_id:
        return jsonify({'error': 'Forbidden – not the owner'}), 403
    m.update(request.get_json() or {})
    return jsonify(missions_model.save_mission(m))

@missions_bp.route('/missions/<mission_id>', methods=['DELETE'])
@requires_role(allowed_types=['Freelancer', 'admin'])
def delete_mission(mission_id):
    user_id = get_current_user_id()
    m = missions_model.get_mission(mission_id)
    if not m:
        return jsonify({'error': 'Mission not found.'}), 404
    if m.get('posted_by') != user_id:
        return jsonify({'error': 'Forbidden'}), 403
    missions_model.delete_mission(mission_id)
    return jsonify({'deleted': True})
