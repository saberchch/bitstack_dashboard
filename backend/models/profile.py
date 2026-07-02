import json
from backend.db import get_db_connection

def profile_to_dict(row):
    if not row:
        return None
    d = dict(row)
    return {
        'name': d['name'],
        'email': d['email'],
        'phone': d['phone'],
        'role': d['role'],
        'profileType': d['profile_type'],
        'verificationStatus': d['verification_status'],
        'avatar': d['avatar'],
        'bio': d['bio'],
        'skillLevel': d['skill_level'],
        'topicInterests': json.loads(d['topic_interests'] or '[]'),
        'linkedin': d['linkedin'],
        'github': d['github'],
        'website': d['website'],
        'userId': d['user_id'],
        'platformRole': d['platform_role'],
        'balance': d['balance']
    }

def get_profile(user_id):
    conn = get_db_connection()
    row = conn.execute('SELECT * FROM profile WHERE user_id = ?', (user_id,)).fetchone()
    conn.close()
    return profile_to_dict(row)

def save_profile(user_id, data):
    conn = get_db_connection()
    conn.execute('''
        INSERT INTO profile (
            user_id, name, email, phone, role, profile_type, verification_status,
            avatar, bio, skill_level, topic_interests, linkedin, github, website,
            platform_role, balance
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            name=excluded.name,
            email=excluded.email,
            phone=excluded.phone,
            role=excluded.role,
            profile_type=excluded.profile_type,
            verification_status=excluded.verification_status,
            avatar=excluded.avatar,
            bio=excluded.bio,
            skill_level=excluded.skill_level,
            topic_interests=excluded.topic_interests,
            linkedin=excluded.linkedin,
            github=excluded.github,
            website=excluded.website,
            platform_role=excluded.platform_role,
            balance=excluded.balance
    ''', (
        user_id,
        data.get('name', 'John Doe'),
        data.get('email', 'john.doe@bitstacks.edu'),
        data.get('phone'),
        data.get('role', 'Premium Member'),
        data.get('profileType', 'Student'),
        data.get('verificationStatus', 'Verified Scholar'),
        data.get('avatar'),
        data.get('bio'),
        data.get('skillLevel', 'Advanced'),
        json.dumps(data.get('topicInterests', [])),
        data.get('linkedin'),
        data.get('github'),
        data.get('website'),
        data.get('platformRole', 'member'),
        data.get('balance', 1000)
    ))
    conn.commit()
    conn.close()
    return get_profile(user_id)

def get_settings(user_id):
    conn = get_db_connection()
    row = conn.execute('SELECT * FROM settings WHERE user_id = ?', (user_id,)).fetchone()
    conn.close()
    if not row:
        return {}
    d = dict(row)
    return {
        'uiLanguage': d['ui_language'],
        'twoFactor': bool(d['two_factor']),
        'notifications': json.loads(d['notifications'] or '{}'),
        'payoutMethod': d['payout_method'],
        'payoutDetails': d['payout_details'],
        'autoRenewSub': bool(d['auto_renew_sub']),
        'autoStakeReputation': bool(d['auto_stake_reputation']),
        'mentorHourlyRate': d['mentor_hourly_rate'],
        'mentorSessionDuration': d['mentor_session_duration'],
        'mentorSchedulingMode': d['mentor_scheduling_mode'],
        'mentorCalendarSync': bool(d['mentor_calendar_sync']),
        'mentorCalendarLink': d['mentor_calendar_link']
    }

def save_settings(user_id, data):
    conn = get_db_connection()
    conn.execute('''
        INSERT INTO settings (
            user_id, ui_language, two_factor, notifications, payout_method, payout_details,
            auto_renew_sub, auto_stake_reputation, mentor_hourly_rate, mentor_session_duration,
            mentor_scheduling_mode, mentor_calendar_sync, mentor_calendar_link
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            ui_language=excluded.ui_language,
            two_factor=excluded.two_factor,
            notifications=excluded.notifications,
            payout_method=excluded.payout_method,
            payout_details=excluded.payout_details,
            auto_renew_sub=excluded.auto_renew_sub,
            auto_stake_reputation=excluded.auto_stake_reputation,
            mentor_hourly_rate=excluded.mentor_hourly_rate,
            mentor_session_duration=excluded.mentor_session_duration,
            mentor_scheduling_mode=excluded.mentor_scheduling_mode,
            mentor_calendar_sync=excluded.mentor_calendar_sync,
            mentor_calendar_link=excluded.mentor_calendar_link
    ''', (
        user_id,
        data.get('uiLanguage', 'English'),
        1 if data.get('twoFactor') else 0,
        json.dumps(data.get('notifications', {})),
        data.get('payoutMethod', 'bank'),
        data.get('payoutDetails'),
        1 if data.get('autoRenewSub', True) else 0,
        1 if data.get('autoStakeReputation') else 0,
        int(data.get('mentorHourlyRate', 80)),
        int(data.get('mentorSessionDuration', 60)),
        data.get('mentorSchedulingMode', 'manual'),
        1 if data.get('mentorCalendarSync') else 0,
        data.get('mentorCalendarLink')
    ))
    conn.commit()
    conn.close()
    return get_settings(user_id)
