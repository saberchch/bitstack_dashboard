import json
from backend.db import get_db_connection

def conversation_to_dict(row, messages):
    d = dict(row)
    
    # Reconstruct the frontend schema for contact
    contact = {
        'name': d['contact_name'],
        'role': d['contact_role'],
        'avatar': d['contact_avatar'],
        'online': bool(d['contact_online'])
    }
    
    meta = json.loads(d['meta_json'] or '{}')
    
    res = {
        'id': d['id'],
        'category': d['category'],
        'contact': contact,
        'unread': d['unread'],
        'sharedFiles': json.loads(d['shared_files'] or '[]'),
        'messages': messages
    }
    
    # Inject metadata dictionary keys like proposalMeta, requestMeta, disputeMeta
    for k, v in meta.items():
        res[k] = v
        
    return res

def get_conversations(user_id):
    conn = get_db_connection()
    conv_rows = conn.execute('SELECT * FROM conversations WHERE user_id = ?', (user_id,)).fetchall()
    
    convs = []
    for crow in conv_rows:
        msg_rows = conn.execute('''
            SELECT * FROM messages WHERE conversation_id = ?
            ORDER BY rowid ASC
        ''', (crow['id'],)).fetchall()
        
        messages = []
        for mrow in msg_rows:
            messages.append({
                'id': mrow['id'],
                'from': mrow['sender'],
                'text': mrow['text'],
                'ts': mrow['ts'],
                'date': mrow['date']
            })
            
        convs.append(conversation_to_dict(crow, messages))
        
    conn.close()
    return convs

def save_conversations(user_id, convos):
    conn = get_db_connection()
    # Delete old conversations and cascade deletes messages
    conn.execute('DELETE FROM conversations WHERE user_id = ?', (user_id,))
    
    for c in convos:
        contact = c.get('contact', {})
        
        # Pull extra metadata fields to serialize
        meta = {}
        for key in ['proposalMeta', 'requestMeta', 'disputeMeta']:
            if key in c:
                meta[key] = c[key]
                
        conn.execute('''
            INSERT INTO conversations (
                id, user_id, category, contact_name, contact_role, contact_avatar,
                contact_online, unread, shared_files, meta_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            c['id'],
            user_id,
            c.get('category', 'general'),
            contact.get('name'),
            contact.get('role'),
            contact.get('avatar'),
            1 if contact.get('online') else 0,
            int(c.get('unread', 0)),
            json.dumps(c.get('sharedFiles', [])),
            json.dumps(meta)
        ))
        
        for m in c.get('messages', []):
            conn.execute('''
                INSERT INTO messages (id, conversation_id, sender, text, ts, date)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                m['id'],
                c['id'],
                m['from'],
                m['text'],
                m.get('ts'),
                m.get('date')
            ))
            
    conn.commit()
    conn.close()
