import json
from backend.db import get_db_connection

def mission_to_dict(row):
    if not row:
        return None
    d = dict(row)
    meta = json.loads(d['meta_json'] or '{}')
    
    # Merge DB columns with meta JSON fields, prioritizing columns
    result = {
        'id': d['id'],
        'title': d['title'],
        'client': d['client'],
        'reward': d['reward'],
        'status': d['status'],
        'difficulty': d['difficulty'],
        'tags': meta.get('tags', []),
        'deadline': meta.get('deadline', 14),
        'teamSize': meta.get('teamSize', 1),
        'appliedCount': meta.get('appliedCount', 0),
        'clientAvatar': meta.get('clientAvatar'),
        'milestones': meta.get('milestones', []),
        'milestoneAmounts': meta.get('milestoneAmounts', []),
        'milestoneDays': meta.get('milestoneDays', []),
        'milestoneStatus': meta.get('milestoneStatus', []),
        'milestoneReleased': meta.get('milestoneReleased', []),
        'escrowLocked': meta.get('escrowLocked', False),
        'escrowReleasedAmount': meta.get('escrowReleasedAmount', 0),
        'proposals': meta.get('proposals', []),
        'activeContract': meta.get('activeContract'),
        'submissions': meta.get('submissions', []),
        'reviews': meta.get('reviews', []),
        'thumbnail': meta.get('thumbnail'),
        'isMyPost': bool(meta.get('isMyPost', False)),
        'postedDays': meta.get('postedDays', 0),
        'disputeActive': meta.get('disputeActive', False),
        'myProgress': meta.get('myProgress'),
        'myMilestone': meta.get('myMilestone'),
        'myRole': meta.get('myRole'),
        'myBid': meta.get('myBid')
    }
    return result

def get_all_missions(filters=None):
    """Return missions, optionally filtered by category/status/posted_by."""
    conn = get_db_connection()
    query = 'SELECT * FROM missions'
    params = []
    conditions = []
    if filters:
        if filters.get('status'):
            conditions.append('status = ?')
            params.append(filters['status'])
        if filters.get('posted_by'):
            conditions.append("json_extract(meta_json, '$.posted_by') = ?")
            params.append(filters['posted_by'])
    if conditions:
        query += ' WHERE ' + ' AND '.join(conditions)
    query += ' ORDER BY rowid DESC'
    try:
        rows = conn.execute(query, params).fetchall()
        missions = [mission_to_dict(r) for r in rows]
    except Exception:
        missions = []
    conn.close()
    return missions


def get_missions():
    """Alias kept for backward-compat."""
    return get_all_missions()


def get_mission(mission_id):
    conn = get_db_connection()
    row = conn.execute('SELECT * FROM missions WHERE id = ?', (mission_id,)).fetchone()
    conn.close()
    return mission_to_dict(row)

def save_mission(m):
    conn = get_db_connection()
    
    # Construct meta payload containing all fields not in basic queryable columns
    meta = {
        'tags': m.get('tags', []),
        'deadline': m.get('deadline', 14),
        'teamSize': m.get('teamSize', 1),
        'appliedCount': m.get('appliedCount', 0),
        'clientAvatar': m.get('clientAvatar'),
        'milestones': m.get('milestones', []),
        'milestoneAmounts': m.get('milestoneAmounts', []),
        'milestoneDays': m.get('milestoneDays', []),
        'milestoneStatus': m.get('milestoneStatus', []),
        'milestoneReleased': m.get('milestoneReleased', []),
        'escrowLocked': m.get('escrowLocked', False),
        'escrowReleasedAmount': m.get('escrowReleasedAmount', 0),
        'proposals': m.get('proposals', []),
        'activeContract': m.get('activeContract'),
        'submissions': m.get('submissions', []),
        'reviews': m.get('reviews', []),
        'thumbnail': m.get('thumbnail'),
        'isMyPost': bool(m.get('isMyPost', False)),
        'postedDays': m.get('postedDays', 0),
        'disputeActive': m.get('disputeActive', False),
        'myProgress': m.get('myProgress'),
        'myMilestone': m.get('myMilestone'),
        'myRole': m.get('myRole'),
        'myBid': m.get('myBid')
    }
    
    conn.execute('''
        INSERT INTO missions (id, title, client, reward, status, difficulty, meta_json)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            title=excluded.title,
            client=excluded.client,
            reward=excluded.reward,
            status=excluded.status,
            difficulty=excluded.difficulty,
            meta_json=excluded.meta_json
    ''', (
        m['id'],
        m['title'],
        m.get('client', 'You'),
        int(m.get('reward', 0)),
        m.get('status', 'Open'),
        m.get('difficulty', 'Intermediate'),
        json.dumps(meta)
    ))
    conn.commit()
    conn.close()
    return get_mission(m['id'])

def get_mission_relations(user_id, relation_type):
    conn = get_db_connection()
    rows = conn.execute('''
        SELECT mission_id FROM mission_relations
        WHERE user_id = ? AND relation_type = ?
    ''', (user_id, relation_type)).fetchall()
    conn.close()
    return [r['mission_id'] for r in rows]

def save_mission_relations(user_id, relation_type, mission_ids):
    conn = get_db_connection()
    conn.execute('''
        DELETE FROM mission_relations
        WHERE user_id = ? AND relation_type = ?
    ''', (user_id, relation_type))
    for mid in mission_ids:
        conn.execute('''
            INSERT OR IGNORE INTO mission_relations (user_id, mission_id, relation_type)
            VALUES (?, ?, ?)
        ''', (user_id, mid, relation_type))
    conn.commit()
    conn.close()


def delete_mission(mission_id):
    conn = get_db_connection()
    conn.execute('DELETE FROM missions WHERE id = ?', (mission_id,))
    conn.execute('DELETE FROM mission_relations WHERE mission_id = ?', (mission_id,))
    conn.commit()
    conn.close()
