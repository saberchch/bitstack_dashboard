from backend.db import get_db_connection

def booking_to_dict(row):
    if not row:
        return None
    d = dict(row)
    return {
        'id': d['id'],
        'mentorId': d['mentor_id'],
        'mentorName': d['mentor_name'],
        'mentorAvatar': d['mentor_avatar'],
        'date': d['date'],
        'slot': d['slot'],
        'topic': d['topic'],
        'duration': d['duration'],
        'cost': d['cost'],
        'status': d['status']
    }

def get_bookings(user_id):
    conn = get_db_connection()
    rows = conn.execute('SELECT * FROM bookings WHERE user_id = ?', (user_id,)).fetchall()
    conn.close()
    return [booking_to_dict(r) for r in rows]

def get_mentor_bookings(mentor_id):
    conn = get_db_connection()
    rows = conn.execute('''
        SELECT b.*, p.name AS student_name, p.avatar AS student_avatar
        FROM bookings b
        LEFT JOIN profile p ON b.user_id = p.user_id
        WHERE b.mentor_id = ?
    ''', (mentor_id,)).fetchall()
    conn.close()
    return [{
        'id': r['id'],
        'studentId': r['user_id'],
        'studentName': r['student_name'] or 'Student',
        'studentAvatar': r['student_avatar'] or 'https://ui-avatars.com/api/?name=Student',
        'date': r['date'],
        'slot': r['slot'],
        'topic': r['topic'],
        'duration': r['duration'],
        'cost': r['cost'],
        'status': r['status']
    } for r in rows]

def save_bookings(user_id, bookings):
    conn = get_db_connection()
    # Delete old bookings for this user and rewrite
    conn.execute('DELETE FROM bookings WHERE user_id = ?', (user_id,))
    for b in bookings:
        conn.execute('''
            INSERT INTO bookings (
                id, user_id, mentor_id, mentor_name, mentor_avatar, date, slot, topic,
                duration, cost, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            b.get('id'),
            user_id,
            b.get('mentorId') or b.get('mentor_id'),
            b.get('mentorName') or b.get('mentor_name'),
            b.get('mentorAvatar') or b.get('mentor_avatar'),
            int(b.get('date')) if b.get('date') is not None else 0,
            b.get('slot'),
            b.get('topic'),
            int(b.get('duration', 1)),
            int(b.get('cost', 0)),
            b.get('status', 'Confirmed')
        ))
    conn.commit()
    conn.close()
