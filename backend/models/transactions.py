"""
transactions.py  –  BTS Credit transaction history model
=========================================================
Handles persisting and retrieving transaction records for each user.
Each transaction tracks earned / spent / redeemed BTS credits.
"""

import json
from backend.db import get_db_connection


def tx_to_dict(row):
    if not row:
        return None
    return {
        'id': row['id'],
        'category': row['category'],
        'type': row['type'],
        'description': row['description'],
        'amount': str(row['amount']),
        'positive': bool(row['positive']),
        'date': row['date'],
        'icon': row['icon'],
        'iconBg': row['icon_bg'],
    }


def get_transactions(user_id):
    """Return all transactions for a user, newest first."""
    conn = get_db_connection()
    try:
        rows = conn.execute(
            'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC',
            (user_id,)
        ).fetchall()
        txs = [tx_to_dict(r) for r in rows]
    except Exception:
        txs = []
    conn.close()
    return txs


def save_transactions(user_id, transactions):
    """
    Bulk-upsert a list of transaction dicts.
    Existing rows (same id) are replaced; new rows are inserted.
    """
    if not isinstance(transactions, list):
        return
    conn = get_db_connection()
    for tx in transactions:
        if not tx or not isinstance(tx, dict) or not tx.get('id'):
            continue
        amount_raw = tx.get('amount', '0')
        # Amount may come as '+880', '-120', '880' etc.
        try:
            amount = int(str(amount_raw).replace('+', ''))
        except (ValueError, TypeError):
            amount = 0
        positive = tx.get('positive', amount >= 0)
        conn.execute('''
            INSERT INTO transactions
                (id, user_id, category, type, description, amount, positive, date, icon, icon_bg)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                category    = excluded.category,
                type        = excluded.type,
                description = excluded.description,
                amount      = excluded.amount,
                positive    = excluded.positive,
                date        = excluded.date,
                icon        = excluded.icon,
                icon_bg     = excluded.icon_bg
        ''', (
            tx['id'],
            user_id,
            tx.get('category', 'earned'),
            tx.get('type', ''),
            tx.get('description', ''),
            amount,
            1 if positive else 0,
            tx.get('date', ''),
            tx.get('icon', ''),
            tx.get('iconBg', ''),
        ))
    conn.commit()
    conn.close()


def add_transaction(user_id, tx):
    """Insert a single transaction, skip if id already exists."""
    save_transactions(user_id, [tx])
