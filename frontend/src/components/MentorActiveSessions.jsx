import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPremiumPublicSessions } from '../utils/sessionsStorage';
import { getProfile } from '../utils/profileStorage';

const STATUS_COLORS = {
  live: { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700', label: 'Live' },
  upcoming: { dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700', label: 'Upcoming' },
  draft: { dot: 'bg-gray-300', badge: 'bg-gray-50 text-gray-500', label: 'Draft' },
};

function getSessionStatus(session) {
  const now = new Date();
  const sessionDate = session.scheduleDate ? new Date(session.scheduleDate) : null;
  if (!sessionDate) return 'draft';
  const diff = (sessionDate - now) / (1000 * 60 * 60 * 24);
  if (diff < 0) return 'live';
  if (diff < 7) return 'upcoming';
  return 'upcoming';
}

export default function MentorActiveSessions() {
  const [sessions, setSessions] = useState([]);
  const [profile, setProfile] = useState(() => getProfile());

  useEffect(() => {
    const load = () => {
      const p = getProfile();
      setProfile(p);
      // Show sessions created by this mentor (by name match or createdBy)
      const all = getPremiumPublicSessions();
      const mine = all.filter(s => {
        const mentorName = s.instructor?.name?.toLowerCase() || '';
        const profileName = p.name?.toLowerCase() || '';
        return (
          s.createdBy === p.userId ||
          (profileName && mentorName && mentorName.includes(profileName.split(' ')[0]))
        );
      });
      setSessions(mine.slice(0, 4));
    };
    load();
    window.addEventListener('bts_sessions_change', load);
    window.addEventListener('bts_profile_change', load);
    return () => {
      window.removeEventListener('bts_sessions_change', load);
      window.removeEventListener('bts_profile_change', load);
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-[10px] font-extrabold text-bts-gold uppercase tracking-widest block mb-0.5">
            My Sessions
          </span>
          <h3 className="font-extrabold text-lg text-brand-dark">Active Sessions</h3>
        </div>
        <Link
          to="/d-platform"
          className="inline-flex items-center gap-1.5 bg-brand-dark hover:bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          New Session
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
          <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center">
            <svg className="w-6 h-6 text-bts-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">No sessions created yet</p>
            <p className="text-xs text-gray-400 mt-0.5">Create a premium session to start teaching</p>
          </div>
          <Link
            to="/d-platform"
            className="inline-flex items-center gap-1.5 bg-bts-gold hover:bg-yellow-500 text-gray-950 text-xs font-bold px-4 py-2 rounded-lg transition-colors"
          >
            Create Your First Session
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const statusKey = getSessionStatus(session);
            const sc = STATUS_COLORS[statusKey];
            const enrolled = session.attendees || 0;
            const cap = session.maxCapacity || 100;
            const pct = Math.round((enrolled / cap) * 100);
            return (
              <Link
                key={session.id}
                to={`/public-session/${session.id}`}
                className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:border-bts-gold/30 hover:bg-gray-50/50 transition-all group"
              >
                <img
                  src={session.image || 'https://ui-avatars.com/api/?name=Session&background=d4a017&color=0b1121'}
                  alt={session.title}
                  className="w-11 h-11 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-bold text-brand-dark truncate group-hover:text-bts-gold transition-colors">
                      {session.title}
                    </p>
                    <span className={`shrink-0 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${sc.badge}`}>
                      {sc.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-gray-400">
                    <span>{enrolled}/{cap} enrolled</span>
                    <span>·</span>
                    <span>{session.price || 0} BTS</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="bg-bts-gold h-full rounded-full"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
