import json
from backend.db import get_db_connection

def event_to_dict(row):
    if not row:
        return None
    d = dict(row)
    details = json.loads(d['details'] or '{}')
    
    res = {
        'id': d['id'],
        'userId': d['user_id'],
        'title': d['title'],
        'type': d['event_type'],
        'date': d['start_date'],
        'time': details.get('time'),
        'duration': details.get('duration'),
        'host': details.get('host'),
        'hostRole': details.get('hostRole'),
        'location': details.get('location'),
        'seats': details.get('seats'),
        'desc': details.get('desc'),
        'tags': details.get('tags', []),
        'avatar': details.get('avatar')
    }
    return res

def get_calendar_events(user_id):
    conn = get_db_connection()
    rows = conn.execute('SELECT * FROM calendar_events WHERE user_id = ?', (user_id,)).fetchall()
    conn.close()
    return [event_to_dict(r) for r in rows]

def get_events(user_id):
    return get_calendar_events(user_id)

def get_event(event_id):
    conn = get_db_connection()
    row = conn.execute('SELECT * FROM calendar_events WHERE id = ?', (event_id,)).fetchone()
    conn.close()
    return event_to_dict(row)

def save_event(evt):
    conn = get_db_connection()
    details = {
        'time': evt.get('time'),
        'duration': evt.get('duration'),
        'host': evt.get('host'),
        'hostRole': evt.get('hostRole'),
        'location': evt.get('location'),
        'seats': evt.get('seats'),
        'desc': evt.get('desc'),
        'tags': evt.get('tags', []),
        'avatar': evt.get('avatar')
    }
    user_id = evt.get('userId') or evt.get('user_id')
    conn.execute('''
        INSERT OR REPLACE INTO calendar_events (id, user_id, title, start_date, event_type, details)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        evt['id'],
        user_id,
        evt['title'],
        evt.get('date') or evt.get('start_date'),
        evt.get('type') or evt.get('event_type'),
        json.dumps(details)
    ))
    conn.commit()
    conn.close()
    return evt

def delete_event(event_id):
    conn = get_db_connection()
    conn.execute('DELETE FROM calendar_events WHERE id = ?', (event_id,))
    conn.commit()
    conn.close()

def save_calendar_events(user_id, sessions):
    conn = get_db_connection()
    conn.execute('DELETE FROM calendar_events WHERE user_id = ?', (user_id,))
    for s in sessions:
        details = {
            'time': s.get('time'),
            'duration': s.get('duration'),
            'host': s.get('host'),
            'hostRole': s.get('hostRole'),
            'location': s.get('location'),
            'seats': s.get('seats'),
            'desc': s.get('desc'),
            'tags': s.get('tags', []),
            'avatar': s.get('avatar')
        }
        conn.execute('''
            INSERT INTO calendar_events (id, user_id, title, start_date, event_type, details)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            s['id'],
            user_id,
            s['title'],
            s['date'],
            s['type'],
            json.dumps(details)
        ))
    conn.commit()
    conn.close()
