import { useState, useEffect, useCallback } from 'react';
import { getPremiumPublicSessions } from '../utils/sessionsStorage';
import { getProfile } from '../utils/profileStorage';
import CreatePremiumSessionModal from './CreatePremiumSessionModal';
import AttendanceModal from './AttendanceModal';
import BookingRequestsPanel from './BookingRequestsPanel';

const TABS = [
  { id: 'sessions', label: 'My Sessions', icon: 'M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
  { id: 'requests', label: 'Booking Requests', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
];

function getSessionStatus(session) {
  const now = new Date();
  const sessionDate = session.scheduleDate ? new Date(session.scheduleDate) : null;
  if (!sessionDate) return { key: 'draft', label: 'Draft', style: 'bg-gray-100 text-gray-500 border-gray-200' };
  const diff = (sessionDate - now) / (1000 * 60 * 60 * 24);
  if (diff < 0) return { key: 'past', label: 'Completed', style: 'bg-blue-50 text-blue-700 border-blue-200' };
  if (diff < 3) return { key: 'live', label: 'Live Soon', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  return { key: 'upcoming', label: 'Upcoming', style: 'bg-amber-50 text-amber-700 border-amber-200' };
}

export default function MentorPlatformView() {
  const [activeTab, setActiveTab] = useState('sessions');
  const [profile, setProfile] = useState(() => getProfile());
  const [sessions, setSessions] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [attendanceSession, setAttendanceSession] = useState(null);
  const [search, setSearch] = useState('');

  const loadSessions = useCallback(() => {
    const p = getProfile();
    setProfile(p);
    const all = getPremiumPublicSessions();
    const mine = all.filter(s => {
      const mentorName = s.instructor?.name?.toLowerCase() || '';
      const profileName = p.name?.toLowerCase() || '';
      return (
        s.createdBy === p.userId ||
        (profileName && mentorName && mentorName.includes(profileName.split(' ')[0].toLowerCase()))
      );
    });
    setSessions(mine);
  }, []);

  useEffect(() => {
    loadSessions();
    window.addEventListener('bts_sessions_change', loadSessions);
    window.addEventListener('bts_profile_change', loadSessions);
    return () => {
      window.removeEventListener('bts_sessions_change', loadSessions);
      window.removeEventListener('bts_profile_change', loadSessions);
    };
  }, [loadSessions]);

  const filtered = sessions.filter(s =>
    !search || s.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Tab header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === t.id
                  ? 'bg-white text-brand-dark shadow-sm border border-gray-100'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d={t.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              {t.label}
            </button>
          ))}
        </div>
        {activeTab === 'sessions' && (
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 bg-bts-gold hover:bg-yellow-500 text-gray-950 text-xs font-extrabold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
            Create Session
          </button>
        )}
      </div>

      {/* Sessions tab */}
      {activeTab === 'sessions' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50 p-6">
          {/* Search + stats */}
          <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[10px] font-extrabold text-bts-gold uppercase tracking-widest block mb-0.5">Manage</span>
                <h3 className="font-extrabold text-lg text-brand-dark">My Sessions ({sessions.length})</h3>
              </div>
            </div>
            <div className="relative">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <input
                type="text"
                placeholder="Search sessions..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs font-medium border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bts-gold/20 focus:border-bts-gold/40 bg-gray-50 w-52"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-bts-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
              <div>
                <p className="text-base font-extrabold text-gray-600">No sessions yet</p>
                <p className="text-xs text-gray-400 mt-1">Create your first premium session to start teaching</p>
              </div>
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 bg-bts-gold hover:bg-yellow-500 text-gray-950 text-xs font-extrabold px-5 py-2.5 rounded-xl transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                </svg>
                Create Your First Session
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(session => {
                const status = getSessionStatus(session);
                const enrolled = session.attendees || 0;
                const cap = session.maxCapacity || 100;
                const fillPct = Math.min(100, Math.round((enrolled / cap) * 100));
                return (
                  <div key={session.id} className="group border border-gray-100 rounded-2xl overflow-hidden hover:border-bts-gold/20 hover:shadow-md transition-all">
                    {/* Session image */}
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={session.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop'}
                        alt={session.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className={`absolute top-2.5 right-2.5 text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${status.style}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="p-4">
                      <h4 className="text-sm font-extrabold text-brand-dark truncate mb-1 group-hover:text-bts-gold transition-colors">
                        {session.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[10px] text-gray-400 mb-3 flex-wrap">
                        <span>{session.level || 'All Levels'}</span>
                        <span>·</span>
                        <span className="font-bold text-emerald-600">{session.price || 0} BTS</span>
                        <span>·</span>
                        <span>{enrolled}/{cap} enrolled</span>
                      </div>

                      {/* Capacity bar */}
                      <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden mb-3">
                        <div
                          className="bg-bts-gold h-full rounded-full transition-all"
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setAttendanceSession(session)}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-brand-dark text-[10px] font-extrabold py-2 rounded-lg transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          </svg>
                          Attendance
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1.5 bg-brand-dark hover:bg-gray-700 text-white text-[10px] font-extrabold py-2 rounded-lg transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          </svg>
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Requests tab */}
      {activeTab === 'requests' && <BookingRequestsPanel />}

      {/* Modals */}
      {showCreate && (
        <CreatePremiumSessionModal
          onClose={() => setShowCreate(false)}
          onCreated={(s) => { loadSessions(); setShowCreate(false); }}
        />
      )}
      {attendanceSession && (
        <AttendanceModal
          session={attendanceSession}
          onClose={() => setAttendanceSession(null)}
        />
      )}
    </div>
  );
}
