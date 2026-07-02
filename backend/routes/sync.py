from flask import Blueprint, request, jsonify
from backend.auth import get_current_user_id, get_user_profile, requires_role
from backend.db import get_db_connection
import backend.models.profile as profile_model
import backend.models.sessions as sessions_model
import backend.models.bookings as bookings_model
import backend.models.library as library_model
import backend.models.missions as missions_model
import backend.models.messages as messages_model
import backend.models.notifications as notifications_model
import backend.models.reviews as reviews_model
import backend.models.calendar as calendar_model
import backend.models.transactions as transactions_model
import json

sync_bp = Blueprint('sync', __name__)

@sync_bp.route('/sync', methods=['GET'])
def get_sync_state():
    user_id = get_current_user_id()
    
    # Ensure user profile exists (create an empty one on first access)
    profile = profile_model.get_profile(user_id)
    if not profile:
        profile = profile_model.save_profile(user_id, {
            'name': '',
            'email': '',
            'phone': '',
            'role': 'Member',
            'profileType': 'Student',
            'verificationStatus': 'New User',
            'avatar': '',
            'bio': '',
            'skillLevel': 'Beginner',
            'topicInterests': [],
            'linkedin': '',
            'github': '',
            'website': '',
            'platformRole': 'member',
            'balance': 0
        })
        
    # 2. Fetch settings
    settings = profile_model.get_settings(user_id)
    if not settings:
        settings = profile_model.save_settings(user_id, {
            'uiLanguage': 'English',
            'twoFactor': False,
            'notifications': {'email': True, 'push': True, 'marketing': False},
            'payoutMethod': 'bank',
            'payoutDetails': 'TN59 0804 1000 0001 2345 6789',
            'autoRenewSub': True,
            'autoStakeReputation': False,
            'mentorHourlyRate': 80,
            'mentorSessionDuration': 60,
            'mentorSchedulingMode': 'manual',
            'mentorCalendarSync': False,
            'mentorCalendarLink': ''
        })

    # 3. Fetch relations
    saved_library = library_model.get_library_relations(user_id, 'saved')
    purchased_library = library_model.get_library_relations(user_id, 'purchased')
    
    # Uploaded items (full objects list)
    uploaded_ids = library_model.get_library_relations(user_id, 'uploaded')
    all_lib_items = library_model.get_library_items()
    uploaded_library = [item for item in all_lib_items if item['id'] in uploaded_ids]

    # Lancer relations
    applied_missions = missions_model.get_mission_relations(user_id, 'applied')
    bookmarked_missions = missions_model.get_mission_relations(user_id, 'bookmarked')
    
    # Explore & Created missions
    all_missions = missions_model.get_missions()
    my_posts = [m for m in all_missions if m['isMyPost']]
    seed_missions = [m for m in all_missions if not m['isMyPost']]

    # Institute registrations
    conn = get_db_connection()
    inst_rows = conn.execute('SELECT session_id FROM enrollments WHERE user_id = ? AND session_type = "institute"', (user_id,)).fetchall()
    institute_registrations = [r['session_id'] for r in inst_rows]
    conn.close()

    # Build the full state dictionary mapping to localStorage keys
    state = {
        'bts_user_profile': profile,
        'bts_conversations': messages_model.get_conversations(user_id),
        'bts_notifications': notifications_model.get_notifications(user_id),
        'bts_private_bookings': bookings_model.get_bookings(user_id),
        'bts_public_enrollment_records': sessions_model.get_enrollments(user_id),
        'bts_premium_public_sessions': [s for s in sessions_model.get_all_sessions() if s['sessionType'] == 'premium_public'],
        'bts_reviews': reviews_model.get_reviews(user_id),
        'bts_library_saved': saved_library,
        'bts_library_purchased': purchased_library,
        'bts_library_uploads': uploaded_library,
        'bts_lancer_applications': applied_missions,
        'bts_lancer_bookmarks': bookmarked_missions,
        'bts_lancer_my_posts': my_posts,
        'bts_lancer_created_missions': my_posts,
        'bts_lancer_seed_missions': seed_missions,
        'bts_institute_registrations': institute_registrations,
        'bts_calendar_events': calendar_model.get_calendar_events(user_id),
        'bts_transactions': transactions_model.get_transactions(user_id),

        # Individual Settings keys
        'bts_settings_ui_language': settings.get('uiLanguage', 'English'),
        'bts_settings_2fa': str(settings.get('twoFactor', False)).lower(),
        'bts_settings_notifications': settings.get('notifications', {}),
        'bts_settings_payout_method': settings.get('payoutMethod', 'bank'),
        'bts_settings_payout_details': settings.get('payoutDetails', ''),
        'bts_settings_auto_renew_sub': str(settings.get('autoRenewSub', True)).lower(),
        'bts_settings_auto_stake_reputation': str(settings.get('autoStakeReputation', False)).lower(),
        'bts_mentor_hourly_rate': str(settings.get('mentorHourlyRate', 80)),
        'bts_mentor_session_duration': str(settings.get('mentorSessionDuration', 60)),
        'bts_mentor_scheduling_mode': settings.get('mentorSchedulingMode', 'manual'),
        'bts_mentor_calendar_sync': str(settings.get('mentorCalendarSync', False)).lower(),
        'bts_mentor_calendar_link': settings.get('mentorCalendarLink', '')
    }
    req_key = request.args.get('key')
    if req_key:
        val = state.get(req_key)
        return jsonify({'key': req_key, 'value': val})

    return jsonify(state)

@sync_bp.route('/sync', methods=['POST'])
def save_sync_key():
    user_id = get_current_user_id()
    data = request.get_json()
    
    if not data or 'key' not in data:
        return jsonify({'error': 'Invalid payload, missing "key"'}), 400
        
    key = data['key']
    print(f"[SYNC] POST key={key}", flush=True)
    val = data.get('value')
    
    # Auto-create an empty profile if none exists (instead of blocking with 401)
    profile = get_user_profile(user_id)
    if not profile:
        profile_model.save_profile(user_id, {
            'name': '', 'email': '', 'phone': '', 'role': 'Member',
            'profileType': 'Student', 'verificationStatus': 'New User',
            'avatar': '', 'bio': '', 'skillLevel': 'Beginner',
            'topicInterests': [], 'linkedin': '', 'github': '', 'website': '',
            'platformRole': 'member', 'balance': 0
        })
        profile = get_user_profile(user_id)
    if not profile:
        return jsonify({'error': 'Unauthorized: Could not initialize profile'}), 500
        
    # Check admin privileges for sensitive keys
    if key in ['bts_premium_public_sessions'] and profile['platform_role'] != 'admin':
        return jsonify({'error': 'Forbidden: Admin access required'}), 403

    # Check Mentor privileges for hourly rates/calendar sync
    if key in ['bts_mentor_hourly_rate', 'bts_mentor_calendar_link'] and profile['profile_type'] != 'Mentor':
        return jsonify({'error': 'Forbidden: Mentor profile type required'}), 403

    # 2. Parse and save keys
    try:
        # Settings operations
        if key.startswith('bts_settings_') or key.startswith('bts_mentor_'):
            conn = get_db_connection()
            # Fetch existing settings to update
            current_settings = conn.execute('SELECT * FROM settings WHERE user_id = ?', (user_id,)).fetchone()
            conn.close()
            
            settings_map = {
                'bts_settings_ui_language': 'uiLanguage',
                'bts_settings_2fa': 'twoFactor',
                'bts_settings_notifications': 'notifications',
                'bts_settings_payout_method': 'payoutMethod',
                'bts_settings_payout_details': 'payoutDetails',
                'bts_settings_auto_renew_sub': 'autoRenewSub',
                'bts_settings_auto_stake_reputation': 'autoStakeReputation',
                'bts_mentor_hourly_rate': 'mentorHourlyRate',
                'bts_mentor_session_duration': 'mentorSessionDuration',
                'bts_mentor_scheduling_mode': 'mentorSchedulingMode',
                'bts_mentor_calendar_sync': 'mentorCalendarSync',
                'bts_mentor_calendar_link': 'mentorCalendarLink'
            }
            
            # Map database keys
            settings_data = {}
            if current_settings:
                # Convert row to frontend naming schema
                settings_data = {
                    'uiLanguage': current_settings['ui_language'],
                    'twoFactor': bool(current_settings['two_factor']),
                    'notifications': json.loads(current_settings['notifications'] or '{}'),
                    'payoutMethod': current_settings['payout_method'],
                    'payoutDetails': current_settings['payout_details'],
                    'autoRenewSub': bool(current_settings['auto_renew_sub']),
                    'autoStakeReputation': bool(current_settings['auto_stake_reputation']),
                    'mentorHourlyRate': current_settings['mentor_hourly_rate'],
                    'mentorSessionDuration': current_settings['mentor_session_duration'],
                    'mentorSchedulingMode': current_settings['mentor_scheduling_mode'],
                    'mentorCalendarSync': bool(current_settings['mentor_calendar_sync']),
                    'mentorCalendarLink': current_settings['mentor_calendar_link']
                }
            
            field = settings_map.get(key)
            if field:
                # Type conversions
                if field in ['twoFactor', 'autoRenewSub', 'autoStakeReputation', 'mentorCalendarSync']:
                    settings_data[field] = str(val).lower() == 'true'
                elif field in ['mentorHourlyRate', 'mentorSessionDuration']:
                    settings_data[field] = int(val) if val else 0
                else:
                    settings_data[field] = val
                    
                profile_model.save_settings(user_id, settings_data)
                
        # Main entities
        elif key == 'bts_user_profile':
            profile_model.save_profile(user_id, val)
        elif key == 'bts_conversations':
            messages_model.save_conversations(user_id, val)
        elif key == 'bts_notifications':
            notifications_model.save_notifications(user_id, val)
        elif key == 'bts_private_bookings':
            bookings_model.save_bookings(user_id, val)
        elif key == 'bts_public_enrollment_records':
            sessions_model.save_enrollments(user_id, val)
        elif key == 'bts_premium_public_sessions':
            for s in val:
                sessions_model.save_session(s)
        elif key == 'bts_reviews':
            reviews_model.save_reviews_bulk(user_id, val)
            
        # Library relations
        elif key == 'bts_library_saved':
            library_model.save_library_relations(user_id, 'saved', val)
        elif key == 'bts_library_purchased':
            library_model.save_library_relations(user_id, 'purchased', val)
        elif key == 'bts_library_uploads':
            # Save uploaded items first
            item_ids = []
            for item in val:
                library_model.save_library_item(item)
                item_ids.append(item['id'])
            library_model.save_library_relations(user_id, 'uploaded', item_ids)
            
        # Lancer relations
        elif key == 'bts_lancer_applications':
            missions_model.save_mission_relations(user_id, 'applied', val)
        elif key == 'bts_lancer_bookmarks':
            missions_model.save_mission_relations(user_id, 'bookmarked', val)
        elif key in ['bts_lancer_my_posts', 'bts_lancer_created_missions']:
            mids = []
            for m in val:
                missions_model.save_mission(m)
                mids.append(m['id'])
            # Relation as posted
            missions_model.save_mission_relations(user_id, 'posted', mids)
        elif key == 'bts_lancer_seed_missions':
            for m in val:
                missions_model.save_mission(m)
                
        # Institute registrations
        elif key == 'bts_institute_registrations':
            from sqlalchemy.exc import IntegrityError, OperationalError
            try:
                with get_db_connection() as conn:
                    conn.execute(
                        'DELETE FROM enrollments WHERE user_id = ? AND session_type = "institute"',
                        (user_id,)
                    )
                    for sid in val:
                        conn.execute('''
                            INSERT OR IGNORE INTO enrollments
                                (user_id, session_id, enrolled_at, session_type, status)
                            VALUES (?, ?, datetime('now'), 'institute', 'confirmed')
                        ''', (user_id, sid))
            except (IntegrityError, OperationalError) as db_err:
                import logging
                logging.getLogger(__name__).warning('institute_registrations sync: %s', db_err)
            
        # Calendar
        elif key == 'bts_calendar_events':
            calendar_model.save_calendar_events(user_id, val)

        # Transactions (BTS credit history)
        elif key == 'bts_transactions':
            transactions_model.save_transactions(user_id, val)

        return jsonify({'status': 'success', 'key': key})
        
    except Exception as e:
        from sqlalchemy.exc import IntegrityError, OperationalError
        if isinstance(e, (IntegrityError, OperationalError)):
            # FK not yet synced or transient write lock — data is safe in IndexedDB.
            # Return 200 so the frontend doesn't retry aggressively.
            import logging
            logging.getLogger(__name__).warning('sync soft-skip [%s]: %s', key, e)
            return jsonify({'status': 'queued', 'key': key}), 200
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Failed to parse sync value: {str(e)}'}), 500

@sync_bp.route('/sync/initialize', methods=['POST'])
def initialize_sync_state():
    """
    Called when the client local storage needs to overwrite the database initially
    (typically on first startup when the database tables are empty).
    """
    user_id = get_current_user_id()
    payload = request.get_json()
    
    if not payload or not isinstance(payload, dict):
        return jsonify({'error': 'Invalid initialization payload'}), 400
        
    try:
        # Run key updates
        for key, val in payload.items():
            # Mock requests are processed via existing logic
            req_data = {'key': key, 'value': val}
            # We can invoke logic directly
            # Update settings keys if needed
            if key == 'bts_user_profile':
                profile_model.save_profile(user_id, val)
            elif key == 'bts_conversations':
                messages_model.save_conversations(user_id, val)
            elif key == 'bts_notifications':
                notifications_model.save_notifications(user_id, val)
            elif key == 'bts_private_bookings':
                bookings_model.save_bookings(user_id, val)
            elif key == 'bts_public_enrollment_records':
                sessions_model.save_enrollments(user_id, val)
            elif key == 'bts_premium_public_sessions':
                for s in val:
                    sessions_model.save_session(s)
            elif key == 'bts_reviews':
                reviews_model.save_reviews_bulk(user_id, val)
            elif key == 'bts_library_saved':
                library_model.save_library_relations(user_id, 'saved', val)
            elif key == 'bts_library_purchased':
                library_model.save_library_relations(user_id, 'purchased', val)
            elif key == 'bts_library_uploads':
                item_ids = []
                for item in val:
                    library_model.save_library_item(item)
                    item_ids.append(item['id'])
                library_model.save_library_relations(user_id, 'uploaded', item_ids)
            elif key == 'bts_lancer_applications':
                missions_model.save_mission_relations(user_id, 'applied', val)
            elif key == 'bts_lancer_bookmarks':
                missions_model.save_mission_relations(user_id, 'bookmarked', val)
            elif key in ['bts_lancer_my_posts', 'bts_lancer_created_missions']:
                mids = []
                for m in val:
                    missions_model.save_mission(m)
                    mids.append(m['id'])
                missions_model.save_mission_relations(user_id, 'posted', mids)
            elif key == 'bts_lancer_seed_missions':
                for m in val:
                    missions_model.save_mission(m)
            elif key == 'bts_institute_registrations':
                conn = get_db_connection()
                conn.execute('DELETE FROM enrollments WHERE user_id = ? AND session_type = "institute"', (user_id,))
                for sid in val:
                    conn.execute('''
                        INSERT OR IGNORE INTO enrollments (user_id, session_id, enrolled_at, session_type, status)
                        VALUES (?, ?, datetime('now'), 'institute', 'confirmed')
                    ''', (user_id, sid))
                conn.commit()
                conn.close()
            elif key == 'bts_calendar_events':
                calendar_model.save_calendar_events(user_id, val)
            elif key == 'bts_transactions':
                transactions_model.save_transactions(user_id, val)
            elif key.startswith('bts_settings_') or key.startswith('bts_mentor_'):
                # Handle individual settings keys
                conn = get_db_connection()
                current_settings = conn.execute('SELECT * FROM settings WHERE user_id = ?', (user_id,)).fetchone()
                conn.close()
                settings_map = {
                    'bts_settings_ui_language': 'uiLanguage',
                    'bts_settings_2fa': 'twoFactor',
                    'bts_settings_notifications': 'notifications',
                    'bts_settings_payout_method': 'payoutMethod',
                    'bts_settings_payout_details': 'payoutDetails',
                    'bts_settings_auto_renew_sub': 'autoRenewSub',
                    'bts_settings_auto_stake_reputation': 'autoStakeReputation',
                    'bts_mentor_hourly_rate': 'mentorHourlyRate',
                    'bts_mentor_session_duration': 'mentorSessionDuration',
                    'bts_mentor_scheduling_mode': 'mentorSchedulingMode',
                    'bts_mentor_calendar_sync': 'mentorCalendarSync',
                    'bts_mentor_calendar_link': 'mentorCalendarLink'
                }
                settings_data = {}
                if current_settings:
                    settings_data = {
                        'uiLanguage': current_settings['ui_language'],
                        'twoFactor': bool(current_settings['two_factor']),
                        'notifications': json.loads(current_settings['notifications'] or '{}'),
                        'payoutMethod': current_settings['payout_method'],
                        'payoutDetails': current_settings['payout_details'],
                        'autoRenewSub': bool(current_settings['auto_renew_sub']),
                        'autoStakeReputation': bool(current_settings['auto_stake_reputation']),
                        'mentorHourlyRate': current_settings['mentor_hourly_rate'],
                        'mentorSessionDuration': current_settings['mentor_session_duration'],
                        'mentorSchedulingMode': current_settings['mentor_scheduling_mode'],
                        'mentorCalendarSync': bool(current_settings['mentor_calendar_sync']),
                        'mentorCalendarLink': current_settings['mentor_calendar_link']
                    }
                field = settings_map.get(key)
                if field:
                    if field in ['twoFactor', 'autoRenewSub', 'autoStakeReputation', 'mentorCalendarSync']:
                        settings_data[field] = str(val).lower() == 'true'
                    elif field in ['mentorHourlyRate', 'mentorSessionDuration']:
                        settings_data[field] = int(val) if val else 0
                    else:
                        settings_data[field] = val
                    profile_model.save_settings(user_id, settings_data)
                    
        return jsonify({'status': 'success', 'message': 'State initialized successfully.'})
    except Exception as e:
        return jsonify({'error': f'Failed to initialize database: {str(e)}'}), 500
