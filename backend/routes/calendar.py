from flask import Blueprint, jsonify, request
from backend.auth import get_current_user_id
import backend.models.calendar as calendar_model
import time

calendar_bp = Blueprint('calendar', __name__)

@calendar_bp.route('/calendar', methods=['GET'])
def list_events():
    user_id = get_current_user_id()
    return jsonify(calendar_model.get_events(user_id))

@calendar_bp.route('/calendar', methods=['POST'])
def create_event():
    user_id = get_current_user_id()
    data = request.get_json()
    if not data or not data.get('title'):
        return jsonify({'error': 'title is required'}), 400
    data['id'] = data.get('id', f'evt-{int(time.time())}')
    data['userId'] = user_id
    return jsonify(calendar_model.save_event(data)), 201

@calendar_bp.route('/calendar/<event_id>', methods=['PATCH'])
def update_event(event_id):
    user_id = get_current_user_id()
    evt = calendar_model.get_event(event_id)
    if not evt:
        return jsonify({'error': 'Event not found.'}), 404
    if evt.get('userId') != user_id:
        return jsonify({'error': 'Forbidden'}), 403
    evt.update(request.get_json() or {})
    return jsonify(calendar_model.save_event(evt))

@calendar_bp.route('/calendar/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    user_id = get_current_user_id()
    evt = calendar_model.get_event(event_id)
    if not evt:
        return jsonify({'error': 'Not found.'}), 404
    if evt.get('userId') != user_id:
        return jsonify({'error': 'Forbidden'}), 403
    calendar_model.delete_event(event_id)
    return jsonify({'deleted': True})
