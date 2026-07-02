from backend.db import get_db_connection
from datetime import datetime

def notification_to_dict(row):
    if not row:
        return None
    d = dict(row)
    return {
        'id': d['id'],
        'category': d['category'],
        'title': d['title'],
        'description': d['description'],
        'route': d['route'],
        'read': bool(d['read']),
        'createdAt': d['created_at']
    }

def get_notifications(user_id):
    conn = get_db_connection()
    rows = conn.execute('''
        SELECT * FROM notifications WHERE user_id = ?
        ORDER BY created_at DESC
    ''', (user_id,)).fetchall()
    conn.close()
    return [notification_to_dict(r) for r in rows]

def save_notifications(user_id, notifications):
    conn = get_db_connection()
    conn.execute('DELETE FROM notifications WHERE user_id = ?', (user_id,))
    for n in notifications:
        conn.execute('''
            INSERT INTO notifications (id, user_id, category, title, description, route, read, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            n['id'],
            user_id,
            n.get('category', 'system'),
            n['title'],
            n.get('description'),
            n.get('route'),
            1 if n.get('read') else 0,
            n.get('createdAt', datetime.utcnow().isoformat())
        ))
    conn.commit()
    conn.close()
