"""
backend/db.py  –  BitStack Dashboard  –  Database Layer (v2)
=============================================================

Uses SQLAlchemy 2.x with a hybrid engine:
  • If DATABASE_URL is set  → PostgreSQL (production)
  • Otherwise               → SQLite file  (local dev, zero-config)

All table definitions live here.  Model functions import `get_session`
and use SQLAlchemy Core (text() queries) for compatibility with both
dialects without requiring a full ORM migration of every SQL statement.

SQL dialect notes
-----------------
  ON CONFLICT … DO UPDATE   → supported by SQLite 3.24+ AND PostgreSQL 9.5+
  AUTOINCREMENT             → PostgreSQL uses SERIAL / GENERATED ALWAYS AS IDENTITY
                             → we use server_default="nextval(…)" via Sequence for pg
                             → for SQLite the INTEGER PRIMARY KEY auto-increments
  datetime('now')           → SQLite only; we use func.now() / text("NOW()") per dialect
  BOOLEAN                   → mapped as Integer(0/1) on SQLite, native BOOLEAN on pg

To keep queries portable we use `text()` with named bind parameters throughout.
"""

import os
from sqlalchemy import create_engine, text, event
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.pool import SingletonThreadPool, NullPool

# ── Engine Configuration ───────────────────────────────────────────────────────

_DATABASE_URL = os.environ.get('DATABASE_URL')

if _DATABASE_URL:
    # Render/Heroku may give "postgres://" — SQLAlchemy 2.x needs "postgresql://"
    if _DATABASE_URL.startswith('postgres://'):
        _DATABASE_URL = _DATABASE_URL.replace('postgres://', 'postgresql://', 1)
    _engine = create_engine(
        _DATABASE_URL,
        pool_pre_ping=True,      # detect stale connections
        pool_size=5,
        max_overflow=10,
    )
    DIALECT = 'postgresql'
else:
    _db_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'database.db'
    )
    _engine = create_engine(
        f'sqlite:///{_db_path}',
        connect_args={
            'check_same_thread': False,
            # Wait up to 30 s when another thread/process holds the write lock
            # instead of immediately raising "database is locked".
            'timeout': 30,
        },
        poolclass=NullPool,
    )
    DIALECT = 'sqlite'

# Enable SQLite foreign keys on every new connection
if DIALECT == 'sqlite':
    @event.listens_for(_engine, 'connect')
    def _set_sqlite_pragma(dbapi_conn, _connection_record):
        dbapi_conn.execute('PRAGMA foreign_keys = ON')
        dbapi_conn.execute('PRAGMA journal_mode = WAL')  # concurrent reads

# ── Session factory ────────────────────────────────────────────────────────────

_SessionFactory = sessionmaker(bind=_engine, autocommit=False, autoflush=False)
_ScopedSession  = scoped_session(_SessionFactory)


def get_session():
    """
    Return a SQLAlchemy Session for the current thread/request.
    Use as a context manager:

        with get_session() as session:
            session.execute(text("SELECT 1"))
    """
    return _ScopedSession()


def remove_session():
    """Call at request teardown to return the session to the pool."""
    _ScopedSession.remove()


# ── Schema DDL ─────────────────────────────────────────────────────────────────

_SQLITE_TABLES = [
    # 0. Users
    """
    CREATE TABLE IF NOT EXISTS users (
        user_id       TEXT PRIMARY KEY,
        email         TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name          TEXT NOT NULL,
        role          TEXT NOT NULL,
        created_at    TEXT NOT NULL
    )
    """,
    # 1. Profile
    """
    CREATE TABLE IF NOT EXISTS profile (
        user_id             TEXT PRIMARY KEY,
        name                TEXT NOT NULL DEFAULT '',
        email               TEXT UNIQUE NOT NULL DEFAULT '',
        phone               TEXT,
        role                TEXT DEFAULT 'Scholar',
        profile_type        TEXT DEFAULT 'Student',
        verification_status TEXT DEFAULT 'New User',
        avatar              TEXT,
        bio                 TEXT,
        skill_level         TEXT DEFAULT 'Beginner',
        topic_interests     TEXT DEFAULT '[]',
        linkedin            TEXT,
        github              TEXT,
        website             TEXT,
        platform_role       TEXT DEFAULT 'member',
        balance             INTEGER DEFAULT 0
    )
    """,
    # 2. Settings
    """
    CREATE TABLE IF NOT EXISTS settings (
        user_id                  TEXT PRIMARY KEY REFERENCES profile(user_id) ON DELETE CASCADE,
        ui_language              TEXT DEFAULT 'English',
        two_factor               INTEGER DEFAULT 0,
        notifications            TEXT DEFAULT '{}',
        payout_method            TEXT DEFAULT 'bank',
        payout_details           TEXT,
        auto_renew_sub           INTEGER DEFAULT 1,
        auto_stake_reputation    INTEGER DEFAULT 0,
        mentor_hourly_rate       INTEGER DEFAULT 80,
        mentor_session_duration  INTEGER DEFAULT 60,
        mentor_scheduling_mode   TEXT DEFAULT 'manual',
        mentor_calendar_sync     INTEGER DEFAULT 0,
        mentor_calendar_link     TEXT
    )
    """,
    # 3. Sessions (workshops)
    """
    CREATE TABLE IF NOT EXISTS sessions (
        id                  TEXT PRIMARY KEY,
        title               TEXT NOT NULL,
        level               TEXT DEFAULT 'Intermediate',
        duration            TEXT,
        date                TEXT,
        time                TEXT,
        time_info           TEXT,
        price               INTEGER DEFAULT 0,
        session_type        TEXT DEFAULT 'standard',
        institute_id        TEXT,
        topic               TEXT,
        image               TEXT,
        overview            TEXT,
        instructor_name     TEXT,
        instructor_role     TEXT,
        instructor_avatar   TEXT,
        instructor_mentor_id TEXT,
        curriculum          TEXT DEFAULT '[]',
        prerequisites       TEXT DEFAULT '[]',
        benefits            TEXT DEFAULT '[]',
        created_at          TEXT,
        created_by          TEXT
    )
    """,
    # 4. Enrollments
    """
    CREATE TABLE IF NOT EXISTS enrollments (
        id           INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id      TEXT NOT NULL REFERENCES profile(user_id) ON DELETE CASCADE,
        session_id   TEXT NOT NULL,
        enrolled_at  TEXT NOT NULL,
        session_type TEXT DEFAULT 'standard',
        status       TEXT DEFAULT 'confirmed',
        UNIQUE(user_id, session_id)
    )
    """,
    # 5. Bookings
    """
    CREATE TABLE IF NOT EXISTS bookings (
        id            TEXT PRIMARY KEY,
        user_id       TEXT NOT NULL REFERENCES profile(user_id) ON DELETE CASCADE,
        mentor_id     TEXT NOT NULL,
        mentor_name   TEXT,
        mentor_avatar TEXT,
        date          INTEGER,
        slot          TEXT,
        topic         TEXT,
        duration      INTEGER DEFAULT 1,
        cost          INTEGER DEFAULT 0,
        status        TEXT DEFAULT 'Confirmed'
    )
    """,
    # 6. Library Items
    """
    CREATE TABLE IF NOT EXISTS library_items (
        id            TEXT PRIMARY KEY,
        title         TEXT NOT NULL,
        description   TEXT,
        author_name   TEXT,
        author_role   TEXT,
        author_avatar TEXT,
        category      TEXT,
        type          TEXT DEFAULT 'pdf',
        price         INTEGER DEFAULT 0,
        size          TEXT,
        rating        REAL DEFAULT 0.0,
        reviews       INTEGER DEFAULT 0,
        downloads     INTEGER DEFAULT 0,
        featured      INTEGER DEFAULT 0,
        tags          TEXT DEFAULT '[]',
        thumbnail     TEXT,
        difficulty    TEXT,
        file_type     TEXT,
        uploaded_at   TEXT
    )
    """,
    # 7. Library Relations
    """
    CREATE TABLE IF NOT EXISTS library_relations (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id       TEXT NOT NULL REFERENCES profile(user_id) ON DELETE CASCADE,
        item_id       TEXT NOT NULL,
        relation_type TEXT NOT NULL,
        UNIQUE(user_id, item_id, relation_type)
    )
    """,
    # 8. Missions
    """
    CREATE TABLE IF NOT EXISTS missions (
        id        TEXT PRIMARY KEY,
        title     TEXT NOT NULL,
        client    TEXT NOT NULL DEFAULT '',
        reward    INTEGER DEFAULT 0,
        status    TEXT DEFAULT 'Open',
        difficulty TEXT,
        meta_json TEXT
    )
    """,
    # 9. Mission Relations
    """
    CREATE TABLE IF NOT EXISTS mission_relations (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id       TEXT NOT NULL REFERENCES profile(user_id) ON DELETE CASCADE,
        mission_id    TEXT NOT NULL,
        relation_type TEXT NOT NULL,
        UNIQUE(user_id, mission_id, relation_type)
    )
    """,
    # 10. Calendar Events
    """
    CREATE TABLE IF NOT EXISTS calendar_events (
        id         TEXT PRIMARY KEY,
        user_id    TEXT NOT NULL REFERENCES profile(user_id) ON DELETE CASCADE,
        title      TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date   TEXT,
        event_type TEXT DEFAULT 'mentorship',
        details    TEXT DEFAULT '{}'
    )
    """,
    # 11. Conversations
    """
    CREATE TABLE IF NOT EXISTS conversations (
        id              TEXT PRIMARY KEY,
        user_id         TEXT NOT NULL REFERENCES profile(user_id) ON DELETE CASCADE,
        category        TEXT DEFAULT 'general',
        contact_name    TEXT,
        contact_role    TEXT,
        contact_avatar  TEXT,
        contact_online  INTEGER DEFAULT 0,
        unread          INTEGER DEFAULT 0,
        shared_files    TEXT DEFAULT '[]',
        meta_json       TEXT
    )
    """,
    # 12. Messages
    """
    CREATE TABLE IF NOT EXISTS messages (
        id              TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        sender          TEXT NOT NULL,
        text            TEXT NOT NULL,
        ts              TEXT,
        date            TEXT
    )
    """,
    # 13. Notifications
    """
    CREATE TABLE IF NOT EXISTS notifications (
        id          TEXT PRIMARY KEY,
        user_id     TEXT NOT NULL REFERENCES profile(user_id) ON DELETE CASCADE,
        category    TEXT DEFAULT 'system',
        title       TEXT NOT NULL,
        description TEXT,
        route       TEXT,
        read        INTEGER DEFAULT 0,
        created_at  TEXT NOT NULL
    )
    """,
    # 14. Reviews
    """
    CREATE TABLE IF NOT EXISTS reviews (
        id              TEXT PRIMARY KEY,
        user_id         TEXT NOT NULL REFERENCES profile(user_id) ON DELETE CASCADE,
        rating          INTEGER DEFAULT 5,
        comment         TEXT,
        reviewer_name   TEXT,
        reviewer_avatar TEXT,
        entity_id       TEXT NOT NULL,
        entity_type     TEXT NOT NULL,
        created_at      TEXT NOT NULL
    )
    """,
    # 15. Transactions
    """
    CREATE TABLE IF NOT EXISTS transactions (
        id          TEXT PRIMARY KEY,
        user_id     TEXT NOT NULL REFERENCES profile(user_id) ON DELETE CASCADE,
        category    TEXT DEFAULT 'earned',
        type        TEXT NOT NULL,
        description TEXT,
        amount      INTEGER NOT NULL,
        positive    INTEGER DEFAULT 1,
        date        TEXT,
        icon        TEXT,
        icon_bg     TEXT,
        created_at  TEXT
    )
    """,
    # 16. Mentor Availability Slots
    """
    CREATE TABLE IF NOT EXISTS mentor_availability (
        id           INTEGER PRIMARY KEY AUTOINCREMENT,
        mentor_id    TEXT NOT NULL REFERENCES profile(user_id) ON DELETE CASCADE,
        day_of_week  INTEGER NOT NULL,
        start_time   TEXT NOT NULL,
        end_time     TEXT NOT NULL,
        is_active    INTEGER DEFAULT 1,
        UNIQUE(mentor_id, day_of_week, start_time, end_time)
    )
    """,
    # 17. Session Attendance
    """
    CREATE TABLE IF NOT EXISTS session_attendance (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id     TEXT NOT NULL,
        mentor_id      TEXT NOT NULL REFERENCES profile(user_id) ON DELETE CASCADE,
        student_id     TEXT NOT NULL,
        student_name   TEXT,
        student_avatar TEXT,
        attended       INTEGER DEFAULT 0,
        marked_at      TEXT,
        UNIQUE(session_id, student_id)
    )
    """,
]

# PostgreSQL uses slightly different DDL for serial PKs and booleans
_PG_TABLES = [
    # 0. Users
    """
    CREATE TABLE IF NOT EXISTS users (
        user_id       TEXT PRIMARY KEY,
        email         TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name          TEXT NOT NULL,
        role          TEXT NOT NULL,
        created_at    TEXT NOT NULL
    )
    """,
    # 1. Profile
    """
    CREATE TABLE IF NOT EXISTS profile (
        user_id             TEXT PRIMARY KEY,
        name                TEXT NOT NULL DEFAULT '',
        email               TEXT UNIQUE NOT NULL DEFAULT '',
        phone               TEXT,
        role                TEXT DEFAULT 'Scholar',
        profile_type        TEXT DEFAULT 'Student',
        verification_status TEXT DEFAULT 'New User',
        avatar              TEXT,
        bio                 TEXT,
        skill_level         TEXT DEFAULT 'Beginner',
        topic_interests     TEXT DEFAULT '[]',
        linkedin            TEXT,
        github              TEXT,
        website             TEXT,
        platform_role       TEXT DEFAULT 'member',
        balance             INTEGER DEFAULT 0
    )
    """,
    # 2. Settings
    """
    CREATE TABLE IF NOT EXISTS settings (
        user_id                  TEXT PRIMARY KEY REFERENCES profile(user_id) ON DELETE CASCADE,
        ui_language              TEXT DEFAULT 'English',
        two_factor               BOOLEAN DEFAULT FALSE,
        notifications            TEXT DEFAULT '{}',
        payout_method            TEXT DEFAULT 'bank',
        payout_details           TEXT,
        auto_renew_sub           BOOLEAN DEFAULT TRUE,
        auto_stake_reputation    BOOLEAN DEFAULT FALSE,
        mentor_hourly_rate       INTEGER DEFAULT 80,
        mentor_session_duration  INTEGER DEFAULT 60,
        mentor_scheduling_mode   TEXT DEFAULT 'manual',
        mentor_calendar_sync     BOOLEAN DEFAULT FALSE,
        mentor_calendar_link     TEXT
    )
    """,
    # 3. Sessions
    """
    CREATE TABLE IF NOT EXISTS sessions (
        id                   TEXT PRIMARY KEY,
        title                TEXT NOT NULL,
        level                TEXT DEFAULT 'Intermediate',
        duration             TEXT,
        date                 TEXT,
        time                 TEXT,
        time_info            TEXT,
        price                INTEGER DEFAULT 0,
        session_type         TEXT DEFAULT 'standard',
        institute_id         TEXT,
        topic                TEXT,
        image                TEXT,
        overview             TEXT,
        instructor_name      TEXT,
        instructor_role      TEXT,
        instructor_avatar    TEXT,
        instructor_mentor_id TEXT,
        curriculum           TEXT DEFAULT '[]',
        prerequisites        TEXT DEFAULT '[]',
        benefits             TEXT DEFAULT '[]',
        created_at           TEXT,
        created_by           TEXT
    )
    """,
    # 4. Enrollments
    """
    CREATE TABLE IF NOT EXISTS enrollments (
        id           SERIAL PRIMARY KEY,
        user_id      TEXT NOT NULL REFERENCES profile(user_id) ON DELETE CASCADE,
        session_id   TEXT NOT NULL,
        enrolled_at  TEXT NOT NULL,
        session_type TEXT DEFAULT 'standard',
        status       TEXT DEFAULT 'confirmed',
        UNIQUE(user_id, session_id)
    )
    """,
    # 5. Bookings
    """
    CREATE TABLE IF NOT EXISTS bookings (
        id            TEXT PRIMARY KEY,
        user_id       TEXT NOT NULL REFERENCES profile(user_id) ON DELETE CASCADE,
        mentor_id     TEXT NOT NULL,
        mentor_name   TEXT,
        mentor_avatar TEXT,
        date          INTEGER,
        slot          TEXT,
        topic         TEXT,
        duration      INTEGER DEFAULT 1,
        cost          INTEGER DEFAULT 0,
        status        TEXT DEFAULT 'Confirmed'
    )
    """,
    # 6. Library Items
    """
    CREATE TABLE IF NOT EXISTS library_items (
        id            TEXT PRIMARY KEY,
        title         TEXT NOT NULL,
        description   TEXT,
        author_name   TEXT,
        author_role   TEXT,
        author_avatar TEXT,
        category      TEXT,
        type          TEXT DEFAULT 'pdf',
        price         INTEGER DEFAULT 0,
        size          TEXT,
        rating        REAL DEFAULT 0.0,
        reviews       INTEGER DEFAULT 0,
        downloads     INTEGER DEFAULT 0,
        featured      BOOLEAN DEFAULT FALSE,
        tags          TEXT DEFAULT '[]',
        thumbnail     TEXT,
        difficulty    TEXT,
        file_type     TEXT,
        uploaded_at   TEXT
    )
    """,
    # 7. Library Relations
    """
    CREATE TABLE IF NOT EXISTS library_relations (
        id            SERIAL PRIMARY KEY,
        user_id       TEXT NOT NULL REFERENCES profile(user_id) ON DELETE CASCADE,
        item_id       TEXT NOT NULL,
        relation_type TEXT NOT NULL,
        UNIQUE(user_id, item_id, relation_type)
    )
    """,
    # 8. Missions
    """
    CREATE TABLE IF NOT EXISTS missions (
        id         TEXT PRIMARY KEY,
        title      TEXT NOT NULL,
        client     TEXT NOT NULL DEFAULT '',
        reward     INTEGER DEFAULT 0,
        status     TEXT DEFAULT 'Open',
        difficulty TEXT,
        meta_json  TEXT
    )
    """,
    # 9. Mission Relations
    """
    CREATE TABLE IF NOT EXISTS mission_relations (
        id            SERIAL PRIMARY KEY,
        user_id       TEXT NOT NULL REFERENCES profile(user_id) ON DELETE CASCADE,
        mission_id    TEXT NOT NULL,
        relation_type TEXT NOT NULL,
        UNIQUE(user_id, mission_id, relation_type)
    )
    """,
    # 10. Calendar Events
    """
    CREATE TABLE IF NOT EXISTS calendar_events (
        id         TEXT PRIMARY KEY,
        user_id    TEXT NOT NULL REFERENCES profile(user_id) ON DELETE CASCADE,
        title      TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date   TEXT,
        event_type TEXT DEFAULT 'mentorship',
        details    TEXT DEFAULT '{}'
    )
    """,
    # 11. Conversations
    """
    CREATE TABLE IF NOT EXISTS conversations (
        id             TEXT PRIMARY KEY,
        user_id        TEXT NOT NULL REFERENCES profile(user_id) ON DELETE CASCADE,
        category       TEXT DEFAULT 'general',
        contact_name   TEXT,
        contact_role   TEXT,
        contact_avatar TEXT,
        contact_online BOOLEAN DEFAULT FALSE,
        unread         INTEGER DEFAULT 0,
        shared_files   TEXT DEFAULT '[]',
        meta_json      TEXT
    )
    """,
    # 12. Messages
    """
    CREATE TABLE IF NOT EXISTS messages (
        id              TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        sender          TEXT NOT NULL,
        text            TEXT NOT NULL,
        ts              TEXT,
        date            TEXT
    )
    """,
    # 13. Notifications
    """
    CREATE TABLE IF NOT EXISTS notifications (
        id          TEXT PRIMARY KEY,
        user_id     TEXT NOT NULL REFERENCES profile(user_id) ON DELETE CASCADE,
        category    TEXT DEFAULT 'system',
        title       TEXT NOT NULL,
        description TEXT,
        route       TEXT,
        read        BOOLEAN DEFAULT FALSE,
        created_at  TEXT NOT NULL
    )
    """,
    # 14. Reviews
    """
    CREATE TABLE IF NOT EXISTS reviews (
        id              TEXT PRIMARY KEY,
        user_id         TEXT NOT NULL REFERENCES profile(user_id) ON DELETE CASCADE,
        rating          INTEGER DEFAULT 5,
        comment         TEXT,
        reviewer_name   TEXT,
        reviewer_avatar TEXT,
        entity_id       TEXT NOT NULL,
        entity_type     TEXT NOT NULL,
        created_at      TEXT NOT NULL
    )
    """,
    # 15. Transactions
    # 15. Transactions
    """
    CREATE TABLE IF NOT EXISTS transactions (
        id          TEXT PRIMARY KEY,
        user_id     TEXT NOT NULL REFERENCES profile(user_id) ON DELETE CASCADE,
        category    TEXT DEFAULT 'earned',
        type        TEXT NOT NULL,
        description TEXT,
        amount      INTEGER NOT NULL,
        positive    BOOLEAN DEFAULT TRUE,
        date        TEXT,
        icon        TEXT,
        icon_bg     TEXT,
        created_at  TEXT
    )
    """,
    # 16. Mentor Availability Slots
    """
    CREATE TABLE IF NOT EXISTS mentor_availability (
        id           SERIAL PRIMARY KEY,
        mentor_id    TEXT NOT NULL REFERENCES profile(user_id) ON DELETE CASCADE,
        day_of_week  INTEGER NOT NULL,
        start_time   TEXT NOT NULL,
        end_time     TEXT NOT NULL,
        is_active    BOOLEAN DEFAULT TRUE,
        UNIQUE(mentor_id, day_of_week, start_time, end_time)
    )
    """,
    # 17. Session Attendance
    """
    CREATE TABLE IF NOT EXISTS session_attendance (
        id             SERIAL PRIMARY KEY,
        session_id     TEXT NOT NULL,
        mentor_id      TEXT NOT NULL REFERENCES profile(user_id) ON DELETE CASCADE,
        student_id     TEXT NOT NULL,
        student_name   TEXT,
        student_avatar TEXT,
        attended       BOOLEAN DEFAULT FALSE,
        marked_at      TEXT,
        UNIQUE(session_id, student_id)
    )
    """,
]



def init_db():
    """Create all tables (idempotent — safe to run on every startup)."""
    ddl_list = _PG_TABLES if DIALECT == 'postgresql' else _SQLITE_TABLES
    with _engine.begin() as conn:
        for ddl in ddl_list:
            conn.execute(text(ddl.strip()))

    # Seed default Student & Mentor credentials if users table is empty
    from werkzeug.security import generate_password_hash
    import datetime

    with _engine.begin() as conn:
        res = conn.execute(text("SELECT COUNT(*) FROM users")).fetchone()
        if res and res[0] == 0:
            # 1. Seed Student Bob Student
            student_uid = 'BTS-BOB-001'
            student_email = 'bob@bitstacks.io'
            student_pwd = generate_password_hash('password')

            conn.execute(text("""
                INSERT INTO users (user_id, email, password_hash, name, role, created_at)
                VALUES (:uid, :email, :pw_hash, :name, :role, :created)
            """), {
                'uid': student_uid,
                'email': student_email,
                'pw_hash': student_pwd,
                'name': 'Bob Student',
                'role': 'Student',
                'created': datetime.datetime.utcnow().isoformat()
            })

            # Ensure the profile also exists for student
            profile_res = conn.execute(text("SELECT COUNT(*) FROM profile WHERE user_id = :uid"), {'uid': student_uid}).fetchone()
            if profile_res and profile_res[0] == 0:
                conn.execute(text("""
                    INSERT INTO profile (
                        user_id, name, email, role, profile_type, verification_status,
                        skill_level, topic_interests, platform_role, balance
                    ) VALUES (
                        :uid, 'Bob Student', :email, 'Premium Member', 'Student', 'Verified Scholar',
                        'Advanced', '[]', 'member', 1200
                    )
                """), {'uid': student_uid, 'email': student_email})

            # Ensure settings exist
            settings_res = conn.execute(text("SELECT COUNT(*) FROM settings WHERE user_id = :uid"), {'uid': student_uid}).fetchone()
            if settings_res and settings_res[0] == 0:
                conn.execute(text("""
                    INSERT INTO settings (
                        user_id, ui_language, two_factor, notifications, payout_method,
                        auto_renew_sub, auto_stake_reputation
                    ) VALUES (
                        :uid, 'English', 0, '{}', 'bank', 1, 0
                    )
                """), {'uid': student_uid})

            # 2. Seed Mentor Alice Mentor
            mentor_uid = 'BTS-MENTOR-001'
            mentor_email = 'alice@bitstacks.io'
            mentor_pwd = generate_password_hash('password')

            conn.execute(text("""
                INSERT INTO users (user_id, email, password_hash, name, role, created_at)
                VALUES (:uid, :email, :pw_hash, :name, :role, :created)
            """), {
                'uid': mentor_uid,
                'email': mentor_email,
                'pw_hash': mentor_pwd,
                'name': 'Alice Mentor',
                'role': 'Mentor',
                'created': datetime.datetime.utcnow().isoformat()
            })

            # Ensure profile exists for mentor
            profile_res_m = conn.execute(text("SELECT COUNT(*) FROM profile WHERE user_id = :uid"), {'uid': mentor_uid}).fetchone()
            if profile_res_m and profile_res_m[0] == 0:
                conn.execute(text("""
                    INSERT INTO profile (
                        user_id, name, email, role, profile_type, verification_status,
                        skill_level, topic_interests, platform_role, balance
                    ) VALUES (
                        :uid, 'Alice Mentor', :email, 'Verified Mentor', 'Mentor', 'Verified Scholar',
                        'Expert', '["solidity", "cryptography", "zero-knowledge"]', 'member', 2500
                    )
                """), {'uid': mentor_uid, 'email': mentor_email})

            # Ensure settings exist for mentor
            settings_res_m = conn.execute(text("SELECT COUNT(*) FROM settings WHERE user_id = :uid"), {'uid': mentor_uid}).fetchone()
            if settings_res_m and settings_res_m[0] == 0:
                conn.execute(text("""
                    INSERT INTO settings (
                        user_id, ui_language, two_factor, notifications, payout_method,
                        auto_renew_sub, auto_stake_reputation, mentor_hourly_rate,
                        mentor_session_duration, mentor_scheduling_mode
                    ) VALUES (
                        :uid, 'English', 0, '{}', 'bank', 1, 0, 80, 60, 'manual'
                    )
                """), {'uid': mentor_uid})


# ── Backward-compat helper ─────────────────────────────────────────────────────
# Some existing routes still call get_db_connection() for ad-hoc queries.
# We provide a thin wrapper that returns a SQLAlchemy Connection that exposes
# a .execute() compatible with the old sqlite3.Row interface via mappings.

class _CompatConn:
    """
    Wraps a SQLAlchemy connection to mimic the old sqlite3 Connection API.

    Key safety rule for SQLite:
      - close() always rolls back any uncommitted transaction first.
        This prevents the 'database is locked' error that occurs when an
        exception path skips commit() but the connection still holds a
        write-intent lock.
      - Implements the context-manager protocol so callers can use
          with get_db_connection() as conn: ...
    """

    def __init__(self, conn):
        self._conn = conn
        self._committed = False

    def execute(self, sql, params=()):
        if isinstance(params, (list, tuple)):
            named = {f'p{i}': v for i, v in enumerate(params)}
            sql_named = _positional_to_named(sql, len(params))
            result = self._conn.execute(text(sql_named), named)
        else:
            result = self._conn.execute(text(sql), params)
        return _CompatResult(result)

    def commit(self):
        self._conn.commit()
        self._committed = True

    def close(self):
        try:
            if not self._committed:
                # Roll back any dangling write transaction before releasing
                # the connection so SQLite does not stay locked.
                try:
                    self._conn.rollback()
                except Exception:
                    pass
        finally:
            self._conn.close()

    # Context-manager support
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is None and not self._committed:
            self.commit()
        self.close()
        return False  # never suppress exceptions


class _CompatResult:
    """Wraps SQLAlchemy CursorResult to behave like sqlite3.Cursor."""

    def __init__(self, result):
        self._result = result

    def fetchone(self):
        row = self._result.fetchone()
        return dict(row._mapping) if row else None

    def fetchall(self):
        return [dict(r._mapping) for r in self._result.fetchall()]

    def __iter__(self):
        for row in self._result:
            yield dict(row._mapping)


def _positional_to_named(sql, count):
    """Replace ? placeholders with :p0, :p1, … for SQLAlchemy text()."""
    for i in range(count):
        sql = sql.replace('?', f':p{i}', 1)
    return sql


def get_db_connection():
    """
    Backward-compatible helper used by any route that hasn't been migrated yet.
    Returns a _CompatConn that mimics the sqlite3 Connection interface.

    Recommended usage with automatic cleanup:
        with get_db_connection() as conn:
            rows = conn.execute('SELECT ...').fetchall()
            conn.commit()   # optional — __exit__ auto-commits on success
    """
    conn = _engine.connect()
    return _CompatConn(conn)
