import json
from backend.db import get_db_connection

def library_item_to_dict(row):
    if not row:
        return None
    d = dict(row)
    return {
        'id': d['id'],
        'title': d['title'],
        'description': d['description'],
        'author': d['author_name'],
        'authorRole': d['author_role'],
        'authorAvatar': d['author_avatar'],
        'category': d['category'],
        'type': d['type'],
        'price': d['price'],
        'size': d['size'],
        'rating': d['rating'],
        'reviews': d['reviews'],
        'downloads': d['downloads'],
        'featured': bool(d['featured']),
        'tags': json.loads(d['tags'] or '[]'),
        'thumbnail': d['thumbnail'],
        'difficulty': d['difficulty'],
        'fileType': d['file_type'],
        'uploadedAt': d['uploaded_at']
    }

def get_library_items():
    conn = get_db_connection()
    # Check if columns author_role, author_avatar, tags, price, size, rating, reviews, featured, thumbnail, file_type, category exist.
    # To be safe and handle schema evolution, we check the tables. We will ensure db.py initializes these.
    try:
        rows = conn.execute('SELECT * FROM library_items').fetchall()
        items = [library_item_to_dict(r) for r in rows]
    except Exception:
        # Fallback if table doesn't have the new schema columns yet (handled by DB migrate)
        items = []
    conn.close()
    return items

def save_library_item(item):
    conn = get_db_connection()
    conn.execute('''
        INSERT INTO library_items (
            id, title, description, author_name, author_role, author_avatar,
            category, type, price, size, rating, reviews, downloads, featured,
            tags, thumbnail, difficulty, file_type, uploaded_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            title=excluded.title,
            description=excluded.description,
            author_name=excluded.author_name,
            author_role=excluded.author_role,
            author_avatar=excluded.author_avatar,
            category=excluded.category,
            type=excluded.type,
            price=excluded.price,
            size=excluded.size,
            rating=excluded.rating,
            reviews=excluded.reviews,
            downloads=excluded.downloads,
            featured=excluded.featured,
            tags=excluded.tags,
            thumbnail=excluded.thumbnail,
            difficulty=excluded.difficulty,
            file_type=excluded.file_type,
            uploaded_at=excluded.uploaded_at
    ''', (
        item['id'],
        item['title'],
        item.get('description'),
        item.get('author', 'You'),
        item.get('authorRole', 'Contributor'),
        item.get('authorAvatar'),
        item.get('category'),
        item.get('type'),
        int(item.get('price', 0)),
        item.get('size'),
        float(item.get('rating', 0.0)),
        int(item.get('reviews', 0)),
        int(item.get('downloads', 0)),
        1 if item.get('featured') else 0,
        json.dumps(item.get('tags', [])),
        item.get('thumbnail'),
        item.get('difficulty'),
        item.get('fileType'),
        item.get('uploadedAt')
    ))
    conn.commit()
    conn.close()

def get_library_relations(user_id, relation_type):
    conn = get_db_connection()
    rows = conn.execute('''
        SELECT item_id FROM library_relations
        WHERE user_id = ? AND relation_type = ?
    ''', (user_id, relation_type)).fetchall()
    conn.close()
    return [r['item_id'] for r in rows]

def save_library_relations(user_id, relation_type, item_ids):
    conn = get_db_connection()
    conn.execute('''
        DELETE FROM library_relations
        WHERE user_id = ? AND relation_type = ?
    ''', (user_id, relation_type))
    for item_id in item_ids:
        conn.execute('''
            INSERT OR IGNORE INTO library_relations (user_id, item_id, relation_type)
            VALUES (?, ?, ?)
        ''', (user_id, item_id, relation_type))
    conn.commit()
    conn.close()
