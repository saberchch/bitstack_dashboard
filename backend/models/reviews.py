import json
from datetime import datetime, timezone
from backend.db import get_db_connection


def review_to_dict(row):
    if not row:
        return None
    d = dict(row)
    return {
        'id': d['id'],
        'authorId': d['user_id'],
        'authorName': d['reviewer_name'],
        'rating': d['rating'],
        'text': d['comment'],
        'entityId': d['entity_id'],
        'entityType': d['entity_type'],
        'createdAt': d['created_at'],
        'isSeed': False
    }


def get_reviews(target_id=None):
    """Return all reviews, optionally filtered by entity_id (targetId)."""
    conn = get_db_connection()
    if target_id:
        rows = conn.execute(
            'SELECT * FROM reviews WHERE entity_id = ? ORDER BY created_at DESC',
            (target_id,)
        ).fetchall()
    else:
        rows = conn.execute('SELECT * FROM reviews ORDER BY created_at DESC').fetchall()
    conn.close()
    return [review_to_dict(r) for r in rows]


def get_review(review_id):
    conn = get_db_connection()
    row = conn.execute('SELECT * FROM reviews WHERE id = ?', (review_id,)).fetchone()
    conn.close()
    return review_to_dict(row)


def save_review(r):
    """Insert or update a single review record."""
    conn = get_db_connection()
    now = datetime.now(timezone.utc).isoformat()
    conn.execute('''
        INSERT INTO reviews (id, user_id, rating, comment, reviewer_name, entity_id, entity_type, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            rating=excluded.rating,
            comment=excluded.comment,
            reviewer_name=excluded.reviewer_name,
            entity_id=excluded.entity_id,
            entity_type=excluded.entity_type
    ''', (
        r['id'],
        r.get('reviewerId', r.get('authorId', 'unknown')),
        int(r.get('rating', 5)),
        r.get('text', ''),
        r.get('authorName', 'Anonymous'),
        r.get('targetId', r.get('entityId', '')),
        r.get('entityType', 'general'),
        r.get('createdAt', now),
    ))
    conn.commit()
    conn.close()
    return get_review(r['id'])


def delete_review(review_id):
    conn = get_db_connection()
    conn.execute('DELETE FROM reviews WHERE id = ?', (review_id,))
    conn.commit()
    conn.close()


def save_reviews_bulk(user_id, reviews):
    """Bulk-replace all reviews (used by sync endpoint)."""
    conn = get_db_connection()
    conn.execute('DELETE FROM reviews')
    now = datetime.now(timezone.utc).isoformat()
    for r in reviews:
        conn.execute('''
            INSERT OR REPLACE INTO reviews
                (id, user_id, rating, comment, reviewer_name, entity_id, entity_type, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            r.get('id', f'rev-bulk-{id(r)}'),
            r.get('authorId', user_id),
            int(r.get('rating', 5)),
            r.get('text', ''),
            r.get('authorName', 'Anonymous'),
            r.get('entityId', ''),
            r.get('entityType', 'general'),
            r.get('createdAt', now),
        ))
    conn.commit()
    conn.close()
