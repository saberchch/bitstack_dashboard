from flask import Blueprint, jsonify, request
from backend.auth import get_current_user_id, get_user_profile, requires_role
import backend.models.sessions as sessions_model
import backend.models.bookings as bookings_model
from backend.db import get_db_connection
import datetime

sessions_bp = Blueprint('sessions', __name__)

# ── Sessions ──────────────────────────────────────────────────────────────────

@sessions_bp.route('/sessions', methods=['GET'])
def list_sessions():
    return jsonify(sessions_model.get_all_sessions())

@sessions_bp.route('/sessions/<session_id>', methods=['GET'])
def get_session(session_id):
    s = sessions_model.get_session(session_id)
    if not s:
        return jsonify({'error': 'Session not found.'}), 404
    return jsonify(s)

@sessions_bp.route('/sessions', methods=['POST'])
@requires_role(allowed_types=['Mentor'], allowed_roles=None)
def create_session():
    data = request.get_json()
    if not data or not data.get('title'):
        return jsonify({'error': 'Missing required field: title'}), 400
    user_id = get_current_user_id()
    data['created_by'] = user_id
    return jsonify(sessions_model.save_session(data)), 201

# ── Enrollments ───────────────────────────────────────────────────────────────

@sessions_bp.route('/enrollments', methods=['GET'])
def list_enrollments():
    user_id = get_current_user_id()
    return jsonify(sessions_model.get_enrollments(user_id))

@sessions_bp.route('/enrollments', methods=['POST'])
def enroll_session():
    """Enroll the authenticated user in a public/premium-public session."""
    user_id = get_current_user_id()
    data = request.get_json()
    session_id = data.get('sessionId')
    if not session_id:
        return jsonify({'error': 'Missing sessionId'}), 400
    record = {
        'sessionId': session_id,
        'enrolled_at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'status': 'confirmed',
        'sessionType': data.get('sessionType', 'standard')
    }
    sessions_model.save_enrollments(user_id, sessions_model.get_enrollments(user_id) + [record])
    return jsonify({'status': 'enrolled', 'sessionId': session_id}), 201

# ── Bookings ──────────────────────────────────────────────────────────────────

@sessions_bp.route('/bookings', methods=['GET'])
def list_bookings():
    user_id = get_current_user_id()
    profile = get_user_profile(user_id)
    if profile and profile['profile_type'] == 'Mentor':
        return jsonify(bookings_model.get_mentor_bookings(user_id))
    return jsonify(bookings_model.get_bookings(user_id))

@sessions_bp.route('/bookings', methods=['POST'])
def create_booking():
    """Create a private booking request from a student to a mentor.
    The booking is stored under the student's user_id with the mentor's user_id in mentor_id.
    """
    user_id = get_current_user_id()
    data = request.get_json()
    if not data or not data.get('mentorId'):
        return jsonify({'error': 'Missing mentorId'}), 400
    import time
    data['id'] = data.get('id', f'booking-{int(time.time())}')
    # Ensure status starts as Pending for new bookings (mentor has to accept)
    if not data.get('status'):
        data['status'] = 'Pending'
    existing = bookings_model.get_bookings(user_id)
    bookings_model.save_bookings(user_id, existing + [data])
    return jsonify(data), 201

@sessions_bp.route('/bookings/<booking_id>', methods=['PATCH'])
def update_booking_status(booking_id):
    """Allow a Mentor to accept or decline a student booking request."""
    user_id = get_current_user_id()
    profile = get_user_profile(user_id)
    if not profile or profile['profile_type'] != 'Mentor':
        return jsonify({'error': 'Forbidden: Only mentors can update booking status.'}), 403

    data = request.get_json()
    new_status = data.get('status')
    if new_status not in ('Confirmed', 'Declined', 'Completed', 'Pending'):
        return jsonify({'error': 'Invalid status. Must be one of: Confirmed, Declined, Completed, Pending.'}), 400

    conn = get_db_connection()
    # Verify this booking belongs to this mentor
    booking = conn.execute(
        'SELECT * FROM bookings WHERE id = ? AND mentor_id = ?',
        (booking_id, user_id)
    ).fetchone()
    if not booking:
        conn.close()
        return jsonify({'error': 'Booking not found or access denied.'}), 404

    conn.execute(
        'UPDATE bookings SET status = ? WHERE id = ?',
        (new_status, booking_id)
    )
    conn.commit()
    conn.close()
    return jsonify({'id': booking_id, 'status': new_status}), 200

# ── Availability ──────────────────────────────────────────────────────────────

@sessions_bp.route('/availability', methods=['GET'])
def get_availability():
    """Return all availability slots for the authenticated mentor."""
    user_id = get_current_user_id()
    conn = get_db_connection()
    rows = conn.execute(
        'SELECT * FROM mentor_availability WHERE mentor_id = ? ORDER BY day_of_week, start_time',
        (user_id,)
    ).fetchall()
    conn.close()
    return jsonify([{
        'id': r['id'],
        'dayOfWeek': r['day_of_week'],
        'startTime': r['start_time'],
        'endTime': r['end_time'],
        'isActive': bool(r['is_active'])
    } for r in rows])

@sessions_bp.route('/availability', methods=['POST'])
@requires_role(allowed_types=['Mentor'])
def add_availability():
    """Add a new availability slot."""
    user_id = get_current_user_id()
    data = request.get_json()
    day = data.get('dayOfWeek')
    start = data.get('startTime')
    end = data.get('endTime')
    if day is None or not start or not end:
        return jsonify({'error': 'Missing dayOfWeek, startTime, or endTime.'}), 400

    conn = get_db_connection()
    try:
        conn.execute(
            'INSERT INTO mentor_availability (mentor_id, day_of_week, start_time, end_time, is_active) VALUES (?, ?, ?, ?, 1)',
            (user_id, int(day), start, end)
        )
        conn.commit()
        row = conn.execute(
            'SELECT * FROM mentor_availability WHERE mentor_id = ? AND day_of_week = ? AND start_time = ? AND end_time = ?',
            (user_id, int(day), start, end)
        ).fetchone()
        conn.close()
        return jsonify({
            'id': row['id'],
            'dayOfWeek': row['day_of_week'],
            'startTime': row['start_time'],
            'endTime': row['end_time'],
            'isActive': bool(row['is_active'])
        }), 201
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 409

@sessions_bp.route('/availability/<int:slot_id>', methods=['DELETE'])
@requires_role(allowed_types=['Mentor'])
def delete_availability(slot_id):
    """Delete an availability slot."""
    user_id = get_current_user_id()
    conn = get_db_connection()
    conn.execute(
        'DELETE FROM mentor_availability WHERE id = ? AND mentor_id = ?',
        (slot_id, user_id)
    )
    conn.commit()
    conn.close()
    return jsonify({'deleted': slot_id}), 200

@sessions_bp.route('/availability/<int:slot_id>/toggle', methods=['PATCH'])
@requires_role(allowed_types=['Mentor'])
def toggle_availability(slot_id):
    """Toggle a slot's is_active state."""
    user_id = get_current_user_id()
    conn = get_db_connection()
    row = conn.execute(
        'SELECT * FROM mentor_availability WHERE id = ? AND mentor_id = ?',
        (slot_id, user_id)
    ).fetchone()
    if not row:
        conn.close()
        return jsonify({'error': 'Slot not found.'}), 404
    new_active = 0 if row['is_active'] else 1
    conn.execute('UPDATE mentor_availability SET is_active = ? WHERE id = ?', (new_active, slot_id))
    conn.commit()
    conn.close()
    return jsonify({'id': slot_id, 'isActive': bool(new_active)}), 200

# ── Attendance ────────────────────────────────────────────────────────────────

@sessions_bp.route('/attendance/<session_id>', methods=['GET'])
def get_attendance(session_id):
    """Return attendance list for a session (mentor only)."""
    user_id = get_current_user_id()
    profile = get_user_profile(user_id)
    if not profile or profile['profile_type'] != 'Mentor':
        return jsonify({'error': 'Forbidden.'}), 403
    conn = get_db_connection()
    rows = conn.execute(
        'SELECT * FROM session_attendance WHERE session_id = ? AND mentor_id = ?',
        (session_id, user_id)
    ).fetchall()
    conn.close()
    return jsonify([{
        'id': r['id'],
        'studentId': r['student_id'],
        'studentName': r['student_name'],
        'studentAvatar': r['student_avatar'],
        'attended': bool(r['attended']),
        'markedAt': r['marked_at']
    } for r in rows])

@sessions_bp.route('/attendance/<session_id>', methods=['POST'])
@requires_role(allowed_types=['Mentor'])
def save_attendance(session_id):
    """Bulk upsert attendance for a session."""
    user_id = get_current_user_id()
    data = request.get_json()
    attendances = data.get('attendances', [])
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()

    conn = get_db_connection()
    for a in attendances:
        student_id = a.get('studentId')
        attended = 1 if a.get('attended') else 0
        name = a.get('studentName', 'Student')
        avatar = a.get('studentAvatar', '')

        existing = conn.execute(
            'SELECT id FROM session_attendance WHERE session_id = ? AND student_id = ?',
            (session_id, student_id)
        ).fetchone()

        if existing:
            conn.execute(
                'UPDATE session_attendance SET attended = ?, marked_at = ? WHERE session_id = ? AND student_id = ?',
                (attended, now, session_id, student_id)
            )
        else:
            conn.execute(
                'INSERT INTO session_attendance (session_id, mentor_id, student_id, student_name, student_avatar, attended, marked_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
                (session_id, user_id, student_id, name, avatar, attended, now)
            )
    conn.commit()
    conn.close()
    return jsonify({'saved': len(attendances)}), 200

