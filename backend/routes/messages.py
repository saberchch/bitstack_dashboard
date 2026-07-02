from flask import Blueprint, jsonify, request
from backend.auth import get_current_user_id
import backend.models.messages as messages_model
import backend.models.notifications as notifs_model
import time

messages_bp = Blueprint('messages', __name__)

# ─── Conversations ────────────────────────────────────────────────
@messages_bp.route('/conversations', methods=['GET'])
def list_conversations():
    user_id = get_current_user_id()
    return jsonify(messages_model.get_conversations(user_id))

@messages_bp.route('/conversations', methods=['POST'])
def create_conversation():
    user_id = get_current_user_id()
    data = request.get_json()
    peer_id = data.get('peerId')
    if not peer_id:
        return jsonify({'error': 'peerId is required'}), 400
    convo = messages_model.get_or_create_conversation(user_id, peer_id, data)
    return jsonify(convo), 201

# ─── Messages within a conversation ───────────────────────────────
@messages_bp.route('/conversations/<convo_id>/messages', methods=['GET'])
def get_messages(convo_id):
    return jsonify(messages_model.get_messages(convo_id))

@messages_bp.route('/conversations/<convo_id>/messages', methods=['POST'])
def send_message(convo_id):
    user_id = get_current_user_id()
    data = request.get_json()
    content = data.get('content')
    if not content:
        return jsonify({'error': 'content is required'}), 400
    msg = {
        'id': f'msg-{int(time.time()*1000)}',
        'conversationId': convo_id,
        'senderId': user_id,
        'content': content,
        'type': data.get('type', 'text'),
        'timestamp': __import__('datetime').datetime.utcnow().isoformat() + 'Z',
        'read': False,
    }
    saved = messages_model.save_message(msg)
    return jsonify(saved), 201

@messages_bp.route('/conversations/<convo_id>/messages/<msg_id>/read', methods=['PATCH'])
def mark_read(convo_id, msg_id):
    messages_model.mark_message_read(msg_id)
    return jsonify({'read': True})

# ─── Notifications ─────────────────────────────────────────────────
@messages_bp.route('/notifications', methods=['GET'])
def list_notifications():
    user_id = get_current_user_id()
    return jsonify(notifs_model.get_notifications(user_id))

@messages_bp.route('/notifications/<notif_id>/read', methods=['PATCH'])
def mark_notif_read(notif_id):
    notifs_model.mark_read(notif_id)
    return jsonify({'read': True})
