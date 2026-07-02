import json
from backend.db import get_db_connection

def session_to_dict(row):
    if not row:
        return None
    d = dict(row)
    return {
        'id': d['id'],
        'title': d['title'],
        'level': d['level'],
        'duration': d['duration'],
        'date': d['date'],
        'time': d['time'],
        'timeInfo': d['time_info'],
        'price': d['price'],
        'sessionType': d['session_type'],
        'instituteId': d['institute_id'],
        'topic': d['topic'],
        'image': d['image'],
        'overview': d['overview'],
        'instructor': {
            'name': d['instructor_name'],
            'role': d['instructor_role'],
            'avatar': d['instructor_avatar'],
            'mentorId': d['instructor_mentor_id']
        },
        'curriculum': json.loads(d['curriculum'] or '[]'),
        'prerequisites': json.loads(d['prerequisites'] or '[]'),
        'benefits': json.loads(d['benefits'] or '[]'),
        'createdAt': d['created_at'],
        'createdBy': d['created_by']
    }

def get_session(session_id):
    conn = get_db_connection()
    row = conn.execute('SELECT * FROM sessions WHERE id = ?', (session_id,)).fetchone()
    conn.close()
    return session_to_dict(row)

def get_all_sessions():
    conn = get_db_connection()
    rows = conn.execute('SELECT * FROM sessions').fetchall()
    conn.close()
    return [session_to_dict(r) for r in rows]

def save_session(data):
    conn = get_db_connection()
    inst = data.get('instructor', {})
    conn.execute('''
        INSERT INTO sessions (
            id, title, level, duration, date, time, time_info, price, session_type,
            institute_id, topic, image, overview, instructor_name, instructor_role,
            instructor_avatar, instructor_mentor_id, curriculum, prerequisites, benefits,
            created_at, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            title=excluded.title,
            level=excluded.level,
            duration=excluded.duration,
            date=excluded.date,
            time=excluded.time,
            time_info=excluded.time_info,
            price=excluded.price,
            session_type=excluded.session_type,
            institute_id=excluded.institute_id,
            topic=excluded.topic,
            image=excluded.image,
            overview=excluded.overview,
            instructor_name=excluded.instructor_name,
            instructor_role=excluded.instructor_role,
            instructor_avatar=excluded.instructor_avatar,
            instructor_mentor_id=excluded.instructor_mentor_id,
            curriculum=excluded.curriculum,
            prerequisites=excluded.prerequisites,
            benefits=excluded.benefits,
            created_at=excluded.created_at,
            created_by=excluded.created_by
    ''', (
        data['id'],
        data['title'],
        data.get('level', 'Intermediate'),
        data.get('duration'),
        data.get('date'),
        data.get('time'),
        data.get('timeInfo'),
        int(data.get('price', 0)),
        data.get('sessionType', 'standard'),
        data.get('instituteId'),
        data.get('topic'),
        data.get('image'),
        data.get('overview'),
        inst.get('name'),
        inst.get('role'),
        inst.get('avatar'),
        inst.get('mentorId'),
        json.dumps(data.get('curriculum', [])),
        json.dumps(data.get('prerequisites', [])),
        json.dumps(data.get('benefits', [])),
        data.get('createdAt'),
        data.get('createdBy')
    ))
    conn.commit()
    conn.close()
    return get_session(data['id'])

def get_enrollments(user_id):
    conn = get_db_connection()
    rows = conn.execute('SELECT * FROM enrollments WHERE user_id = ?', (user_id,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]

def save_enrollments(user_id, records):
    import datetime as _dt
    from sqlalchemy.exc import IntegrityError, OperationalError

    try:
        with get_db_connection() as conn:
            # Delete old enrollments for this user and rewrite
            conn.execute('DELETE FROM enrollments WHERE user_id = ?', (user_id,))
            for r in records:
                # Accept both camelCase (frontend) and snake_case (backend/DB)
                enrolled_at = (
                    r.get('enrolledAt')        # camelCase from sync.js
                    or r.get('enrolled_at')    # snake_case from DB read
                    or _dt.datetime.utcnow().isoformat()
                )
                session_id = r.get('sessionId') or r.get('session_id')
                if not session_id:
                    continue
                conn.execute('''
                    INSERT OR IGNORE INTO enrollments
                        (user_id, session_id, enrolled_at, session_type, status)
                    VALUES (?, ?, ?, ?, ?)
                ''', (user_id, session_id, enrolled_at,
                      r.get('sessionType') or r.get('session_type') or 'standard',
                      r.get('status', 'confirmed')))
    except IntegrityError:
        # FK violation: profile not yet synced to server.
        # Data is safe in IndexedDB and will retry on next debounce cycle.
        pass
    except OperationalError as e:
        # "database is locked" under heavy concurrent load — log and skip.
        import logging
        logging.getLogger(__name__).warning('save_enrollments lock: %s', e)

