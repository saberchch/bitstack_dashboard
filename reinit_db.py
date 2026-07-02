import os
import json
import datetime
from werkzeug.security import generate_password_hash
from backend.db import _engine, init_db
from sqlalchemy import text

def reinit():
    print("Re-initializing database...")
    
    # 1. Drop all tables if they exist
    tables = [
        "session_attendance", "mentor_availability", "transactions", "reviews",
        "notifications", "messages", "conversations", "calendar_events",
        "mission_relations", "missions", "library_relations", "library_items",
        "bookings", "enrollments", "sessions", "settings", "profile", "users"
    ]
    
    with _engine.begin() as conn:
        for table in tables:
            try:
                conn.execute(text(f"DROP TABLE IF EXISTS {table}"))
                print(f"Dropped table {table}")
            except Exception as e:
                print(f"Error dropping table {table}: {e}")
                
    # 2. Re-create all tables
    init_db()
    print("Re-created all tables cleanly.")
    
    # Clear default seeded entries to avoid duplicates
    with _engine.begin() as conn:
        conn.execute(text("DELETE FROM users"))
        conn.execute(text("DELETE FROM profile"))
        conn.execute(text("DELETE FROM settings"))
        conn.execute(text("DELETE FROM sessions"))
        conn.execute(text("DELETE FROM enrollments"))
    
    # 3. Seed data
    with _engine.begin() as conn:
        # User IDs
        student_uid = 'BTS-BOB-001'
        mentor_uid = 'BTS-MENTOR-001'
        
        student_email = 'bob@bitstacks.io'
        mentor_email = 'alice@bitstacks.io'
        
        pw_hash = generate_password_hash('password')
        now_iso = datetime.datetime.utcnow().isoformat()
        
        # --- Users ---
        conn.execute(text("""
            INSERT INTO users (user_id, email, password_hash, name, role, created_at)
            VALUES (:uid, :email, :pw_hash, :name, :role, :created)
        """), {
            'uid': student_uid, 'email': student_email, 'pw_hash': pw_hash,
            'name': 'Bob Student', 'role': 'Student', 'created': now_iso
        })
        conn.execute(text("""
            INSERT INTO users (user_id, email, password_hash, name, role, created_at)
            VALUES (:uid, :email, :pw_hash, :name, :role, :created)
        """), {
            'uid': mentor_uid, 'email': mentor_email, 'pw_hash': pw_hash,
            'name': 'Alice Mentor', 'role': 'Mentor', 'created': now_iso
        })
        
        # --- Profiles ---
        student_avatar = 'https://ui-avatars.com/api/?name=Bob+Student&background=1d4ed8&color=ffffff&size=120'
        mentor_avatar = 'https://ui-avatars.com/api/?name=Alice+Mentor&background=d4a017&color=0b1121&size=120'
        
        conn.execute(text("""
            INSERT INTO profile (
                user_id, name, email, role, profile_type, verification_status,
                avatar, bio, skill_level, topic_interests, platform_role, balance
            ) VALUES (
                :uid, 'Bob Student', :email, 'Premium Member', 'Student', 'Verified Scholar',
                :avatar, 'Aspiring Web3 developer learning smart contract engineering.',
                'Intermediate', '["solidity", "defi", "web3"]', 'member', 1200
            )
        """), {'uid': student_uid, 'email': student_email, 'avatar': student_avatar})
        
        conn.execute(text("""
            INSERT INTO profile (
                user_id, name, email, role, profile_type, verification_status,
                avatar, bio, skill_level, topic_interests, platform_role, balance
            ) VALUES (
                :uid, 'Alice Mentor', :email, 'Verified Mentor', 'Mentor', 'Verified Scholar',
                :avatar, 'Lead ZK Architect. 5+ years of smart contract audits. Ex-Ethereum Foundation.',
                'Expert', '["solidity", "cryptography", "zero-knowledge"]', 'member', 2500
            )
        """), {'uid': mentor_uid, 'email': mentor_email, 'avatar': mentor_avatar})
        
        # --- Settings ---
        conn.execute(text("""
            INSERT INTO settings (
                user_id, ui_language, two_factor, notifications, payout_method,
                auto_renew_sub, auto_stake_reputation
            ) VALUES (:uid, 'English', 0, '{}', 'bank', 1, 0)
        """), {'uid': student_uid})
        
        conn.execute(text("""
            INSERT INTO settings (
                user_id, ui_language, two_factor, notifications, payout_method,
                auto_renew_sub, auto_stake_reputation, mentor_hourly_rate,
                mentor_session_duration, mentor_scheduling_mode
            ) VALUES (:uid, 'English', 0, '{}', 'bank', 1, 0, 120, 60, 'manual')
        """), {'uid': mentor_uid})
        
        # --- Sessions (Workshops) ---
        conn.execute(text("""
            INSERT INTO sessions (
                id, title, level, duration, date, time, time_info, price, session_type,
                institute_id, topic, image, overview, instructor_name, instructor_role,
                instructor_avatar, instructor_mentor_id, curriculum, prerequisites, benefits,
                created_at, created_by
            ) VALUES (
                'smart-contract-auditing', 'Smart Contract Auditing Masterclass', 'Advanced', '2h', '2026-07-10', '14:00',
                'Starts Jul 10, 2026', 200, 'premium_public', 'rocwell', 'Solidity Security',
                'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop',
                'Deep dive into Solidity auditing patterns, reentrancy detection, and protocol design security.',
                'Alice Mentor', 'Lead Security Architect', :avatar, :mentor_uid,
                '[]', '["Solidity Basics", "ERC-20/721 standard knowledge"]', '[]', :now, :mentor_uid
            )
        """), {'avatar': mentor_avatar, 'mentor_uid': mentor_uid, 'now': now_iso})
        
        conn.execute(text("""
            INSERT INTO sessions (
                id, title, level, duration, date, time, time_info, price, session_type,
                institute_id, topic, image, overview, instructor_name, instructor_role,
                instructor_avatar, instructor_mentor_id, curriculum, prerequisites, benefits,
                created_at, created_by
            ) VALUES (
                'intro-zkp', 'Introduction to Zero Knowledge Proofs', 'Expert', '3h', '2026-07-15', '16:00',
                'Starts Jul 15, 2026', 150, 'premium_public', 'bitstacks', 'Cryptography',
                'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=400&fit=crop',
                'Learn ZK-SNARKs and PLONK basics, building arithmetic circuits, and writing verification code.',
                'Alice Mentor', 'Lead Security Architect', :avatar, :mentor_uid,
                '[]', '["Basic cryptography", "Python or Rust programming"]', '[]', :now, :mentor_uid
            )
        """), {'avatar': mentor_avatar, 'mentor_uid': mentor_uid, 'now': now_iso})
        
        # --- Enrollments ---
        conn.execute(text("""
            INSERT INTO enrollments (user_id, session_id, enrolled_at, session_type, status)
            VALUES (:uid, 'smart-contract-auditing', :now, 'premium_public', 'confirmed')
        """), {'uid': student_uid, 'now': now_iso})
        conn.execute(text("""
            INSERT INTO enrollments (user_id, session_id, enrolled_at, session_type, status)
            VALUES (:uid, 'intro-zkp', :now, 'premium_public', 'confirmed')
        """), {'uid': student_uid, 'now': now_iso})
        
        # --- Bookings ---
        conn.execute(text("""
            INSERT INTO bookings (
                id, user_id, mentor_id, mentor_name, mentor_avatar, date, slot, topic,
                duration, cost, status
            ) VALUES (
                'booking-1', :student_uid, :mentor_uid, 'Alice Mentor', :mentor_avatar,
                28, '04:00 PM EST', 'Solidity Gas Optimization Review', 1, 120, 'Confirmed'
            )
        """), {'student_uid': student_uid, 'mentor_uid': mentor_uid, 'mentor_avatar': mentor_avatar})
        
        conn.execute(text("""
            INSERT INTO bookings (
                id, user_id, mentor_id, mentor_name, mentor_avatar, date, slot, topic,
                duration, cost, status
            ) VALUES (
                'booking-2', :student_uid, :mentor_uid, 'Alice Mentor', :mentor_avatar,
                15, '10:00 AM EST', 'ZK Rollups Deep Dive', 2, 240, 'Pending'
            )
        """), {'student_uid': student_uid, 'mentor_uid': mentor_uid, 'mentor_avatar': mentor_avatar})
        
        # --- Calendar Events ---
        # Bob's events
        conn.execute(text("""
            INSERT INTO calendar_events (id, user_id, title, start_date, event_type, details)
            VALUES (
                'evt-session-1-bob', :uid, 'Smart Contract Auditing Masterclass', '2026-07-10', 'workshop',
                '{"time": "14:00", "duration": "2h", "host": "Alice Mentor", "location": "Online", "desc": "Auditing Masterclass"}'
            )
        """), {'uid': student_uid})
        
        conn.execute(text("""
            INSERT INTO calendar_events (id, user_id, title, start_date, event_type, details)
            VALUES (
                'evt-booking-1-bob', :uid, 'Private session with Alice', '2026-06-28', 'private',
                '{"time": "16:00", "duration": "1h", "host": "Alice Mentor", "location": "Zoom", "desc": "Solidity Gas Optimization Review"}'
            )
        """), {'uid': student_uid})
        
        # Alice's events
        conn.execute(text("""
            INSERT INTO calendar_events (id, user_id, title, start_date, event_type, details)
            VALUES (
                'evt-session-1-alice', :uid, 'Host: Smart Contract Auditing Masterclass', '2026-07-10', 'workshop',
                '{"time": "14:00", "duration": "2h", "host": "Alice Mentor", "location": "Online", "desc": "Host Auditing Masterclass"}'
            )
        """), {'uid': mentor_uid})
        
        conn.execute(text("""
            INSERT INTO calendar_events (id, user_id, title, start_date, event_type, details)
            VALUES (
                'evt-booking-1-alice', :uid, 'Private Session: Bob Student', '2026-06-28', 'private',
                '{"time": "16:00", "duration": "1h", "host": "Bob Student", "location": "Zoom", "desc": "Solidity Gas Optimization Review"}'
            )
        """), {'uid': mentor_uid})
        
        # --- Conversations & Messages ---
        # Bob's conversation list
        conn.execute(text("""
            INSERT INTO conversations (
                id, user_id, category, contact_name, contact_role, contact_avatar,
                contact_online, unread, shared_files, meta_json
            ) VALUES (
                'convo-bob-alice', :uid, 'direct', 'Alice Mentor', 'Verified Mentor', :avatar,
                1, 0, '[]', '{}'
            )
        """), {'uid': student_uid, 'avatar': mentor_avatar})
        
        # Alice's conversation list
        conn.execute(text("""
            INSERT INTO conversations (
                id, user_id, category, contact_name, contact_role, contact_avatar,
                contact_online, unread, shared_files, meta_json
            ) VALUES (
                'convo-alice-bob', :uid, 'direct', 'Bob Student', 'Premium Member', :avatar,
                1, 0, '[]', '{}'
            )
        """), {'uid': mentor_uid, 'avatar': student_avatar})
        
        # Messages from Bob's perspective:
        # Msg 1: Bob (me) -> Alice
        conn.execute(text("""
            INSERT INTO messages (id, conversation_id, sender, text, ts, date)
            VALUES ('m1-bob', 'convo-bob-alice', 'me', 'Hi Alice! I have some questions on ZK-Rollups coding challenges.', '10:05', 'Today')
        """))
        # Msg 2: Alice (other) -> Bob
        conn.execute(text("""
            INSERT INTO messages (id, conversation_id, sender, text, ts, date)
            VALUES ('m2-bob', 'convo-bob-alice', 'other', "Hi Bob! Sure, let's discuss it in our private session on June 28th.", '10:15', 'Today')
        """))
        
        # Messages from Alice's perspective:
        # Msg 1: Bob (other) -> Alice
        conn.execute(text("""
            INSERT INTO messages (id, conversation_id, sender, text, ts, date)
            VALUES ('m1-alice', 'convo-alice-bob', 'other', 'Hi Alice! I have some questions on ZK-Rollups coding challenges.', '10:05', 'Today')
        """))
        # Msg 2: Alice (me) -> Bob
        conn.execute(text("""
            INSERT INTO messages (id, conversation_id, sender, text, ts, date)
            VALUES ('m2-alice', 'convo-alice-bob', 'me', "Hi Bob! Sure, let's discuss it in our private session on June 28th.", '10:15', 'Today')
        """))
        
        # --- Notifications ---
        conn.execute(text("""
            INSERT INTO notifications (id, user_id, category, title, description, route, read, created_at)
            VALUES (
                'n1-bob', :uid, 'mentorship', 'Private Session Booked',
                'Your session on Solidity Gas Optimization with Alice Mentor is confirmed.', '/calendar', 0, :now
            )
        """), {'uid': student_uid, 'now': now_iso})
        conn.execute(text("""
            INSERT INTO notifications (id, user_id, category, title, description, route, read, created_at)
            VALUES (
                'n2-bob', :uid, 'system', 'Welcome to BitStacks',
                'Start learning smart contract development today.', '/', 1, :now
            )
        """), {'uid': student_uid, 'now': now_iso})
        
        conn.execute(text("""
            INSERT INTO notifications (id, user_id, category, title, description, route, read, created_at)
            VALUES (
                'n3-alice', :uid, 'mentorship', 'New Booking Request',
                'Bob Student requested a private session on ZK Rollups.', '/calendar', 0, :now
            )
        """), {'uid': mentor_uid, 'now': now_iso})
        
        # --- Transactions ---
        conn.execute(text("""
            INSERT INTO transactions (id, user_id, category, type, description, amount, positive, date, icon, icon_bg, created_at)
            VALUES ('tx1-bob', :uid, 'spent', 'Subscription', 'BitStacks Premium Membership', 100, 0, '2026-06-25', '💳', 'bg-red-500', :now)
        """), {'uid': student_uid, 'now': now_iso})
        conn.execute(text("""
            INSERT INTO transactions (id, user_id, category, type, description, amount, positive, date, icon, icon_bg, created_at)
            VALUES ('tx2-bob', :uid, 'spent', 'Booking Payout', 'Private Session Booking (Gas Optimization)', 120, 0, '2026-06-26', '🎓', 'bg-purple-500', :now)
        """), {'uid': student_uid, 'now': now_iso})
        
        conn.execute(text("""
            INSERT INTO transactions (id, user_id, category, type, description, amount, positive, date, icon, icon_bg, created_at)
            VALUES ('tx3-alice', :uid, 'earned', 'Earning', 'Private Session Booking (Gas Optimization)', 120, 1, '2026-06-26', '💰', 'bg-green-500', :now)
        """), {'uid': mentor_uid, 'now': now_iso})
        
        # --- Reviews ---
        conn.execute(text("""
            INSERT INTO reviews (id, user_id, rating, comment, reviewer_name, reviewer_avatar, entity_id, entity_type, created_at)
            VALUES (
                'rev-1', :uid, 5, 'Alice is an incredibly knowledgeable mentor. The session on ZK-Rollups was very helpful.',
                'Bob Student', :avatar, :mentor_uid, 'mentor', :now
            )
        """), {'uid': student_uid, 'avatar': student_avatar, 'mentor_uid': mentor_uid, 'now': now_iso})
        
        # --- Mentor Availability ---
        # Mon (1), Wed (3), Fri (5)
        for day in [1, 3, 5]:
            conn.execute(text("""
                INSERT INTO mentor_availability (mentor_id, day_of_week, start_time, end_time, is_active)
                VALUES (:uid, :day, '09:00', '17:00', 1)
            """), {'uid': mentor_uid, 'day': day})
            
    print("Database seeding completed successfully.")

if __name__ == '__main__':
    reinit()
