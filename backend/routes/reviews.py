from flask import Blueprint, jsonify, request
from backend.auth import get_current_user_id
import backend.models.reviews as reviews_model
import time

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('/reviews', methods=['GET'])
def list_reviews():
    target_id = request.args.get('targetId')
    return jsonify(reviews_model.get_reviews(target_id))

@reviews_bp.route('/reviews', methods=['POST'])
def create_review():
    user_id = get_current_user_id()
    data = request.get_json()
    if not data or not data.get('targetId'):
        return jsonify({'error': 'targetId is required'}), 400
    data['id'] = data.get('id', f'rev-{int(time.time())}')
    data['reviewerId'] = user_id
    return jsonify(reviews_model.save_review(data)), 201

@reviews_bp.route('/reviews/<review_id>', methods=['DELETE'])
def delete_review(review_id):
    user_id = get_current_user_id()
    r = reviews_model.get_review(review_id)
    if not r:
        return jsonify({'error': 'Not found.'}), 404
    if r.get('reviewerId') != user_id:
        return jsonify({'error': 'Forbidden'}), 403
    reviews_model.delete_review(review_id)
    return jsonify({'deleted': True})
