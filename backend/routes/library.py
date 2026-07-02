from flask import Blueprint, jsonify, request
from backend.auth import get_current_user_id
import backend.models.library as library_model
import time

library_bp = Blueprint('library', __name__)

@library_bp.route('/library', methods=['GET'])
def list_resources():
    filters = {
        'type': request.args.get('type'),
        'tag': request.args.get('tag'),
    }
    return jsonify(library_model.get_all_resources(filters))

@library_bp.route('/library/<resource_id>', methods=['GET'])
def get_resource(resource_id):
    r = library_model.get_resource(resource_id)
    if not r:
        return jsonify({'error': 'Resource not found.'}), 404
    return jsonify(r)

@library_bp.route('/library', methods=['POST'])
def create_resource():
    user_id = get_current_user_id()
    data = request.get_json()
    if not data or not data.get('title'):
        return jsonify({'error': 'title is required'}), 400
    data['id'] = data.get('id', f'res-{int(time.time())}')
    data['uploadedBy'] = user_id
    return jsonify(library_model.save_resource(data)), 201

@library_bp.route('/library/<resource_id>', methods=['DELETE'])
def delete_resource(resource_id):
    user_id = get_current_user_id()
    r = library_model.get_resource(resource_id)
    if not r:
        return jsonify({'error': 'Not found.'}), 404
    if r.get('uploadedBy') != user_id:
        return jsonify({'error': 'Forbidden'}), 403
    library_model.delete_resource(resource_id)
    return jsonify({'deleted': True})

# User bookmarks / progress
@library_bp.route('/library/progress', methods=['GET'])
def get_progress():
    user_id = get_current_user_id()
    return jsonify(library_model.get_progress(user_id))

@library_bp.route('/library/progress', methods=['POST'])
def save_progress():
    user_id = get_current_user_id()
    data = request.get_json()
    library_model.save_progress(user_id, data)
    return jsonify({'saved': True})
