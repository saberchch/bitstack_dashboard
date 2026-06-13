import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getPublicSessions } from '../utils/sessionsStorage';
import {
  getMyEnrollmentsWithDetails,
  formatEnrollmentDate,
  isEnrolledInPublic,
} from '../utils/enrollmentStorage';
import { PUBLIC_SESSION_TABS } from './PublicSessionsFilters';

export default function PublicSessions() {
  const [activeTab, setActiveTab] = useState(PUBLIC_SESSION_TABS.ALL);
  const [search, setSearch] = useState('');
  const [enrollmentDetails, setEnrollmentDetails] = useState([]);

  const refresh = useCallback(() => {
    setEnrollmentDetails(getMyEnrollmentsWithDetails());
  }, []);

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener('bts_enrollments_change', onChange);
    window.addEventListener('bts_sessions_change', onChange);
    return () => window.removeEventListener('bts_enrollments_change', onChange);
  }, [refresh]);

  const allSessions = getPublicSessions();
  const q = search.toLowerCase();

  const filteredSessions = (activeTab === PUBLIC_SESSION_TABS.ENROLLMENTS
    ? enrollmentDetails.map((e) => e.session).filter(Boolean)
    : allSessions
  ).filter((session) => {
    if (!q) return true;
    return (
      session.title.toLowerCase().includes(q) ||
      session.level.toLowerCase().includes(q) ||
      session.instituteName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50" data-purpose="public-sessions-widget">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h3 className="font-bold text-lg text-brand-dark">Public Sessions</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Live learning and group workshops</p>
        </div>
        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
          <button
            onClick={() => setActiveTab(PUBLIC_SESSION_TABS.ALL)}
            className={`font-bold px-4 py-1.5 rounded-lg text-[10px] transition-all cursor-pointer ${
              activeTab === PUBLIC_SESSION_TABS.ALL
                ? 'bg-white text-bts-gold shadow-sm'
                : 'text-gray-400 hover:text-brand-dark'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab(PUBLIC_SESSION_TABS.ENROLLMENTS)}
            className={`font-bold px-4 py-1.5 rounded-lg text-[10px] transition-all cursor-pointer ${
              activeTab === PUBLIC_SESSION_TABS.ENROLLMENTS
                ? 'bg-white text-bts-gold shadow-sm'
                : 'text-gray-400 hover:text-brand-dark'
            }`}
          >
            My Enrollments {enrollmentDetails.length > 0 && `(${enrollmentDetails.length})`}
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          <span className="material-symbols-outlined !text-[18px]">search</span>
        </span>
        <input
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-xs focus:ring-1 focus:ring-yellow-400 outline-none text-brand-dark font-medium"
          placeholder="Search sessions, topics..."
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-200">
            <span className="material-symbols-outlined text-gray-300 text-3xl mb-1">school</span>
            <p className="text-xs text-gray-400 font-semibold">
              {activeTab === PUBLIC_SESSION_TABS.ENROLLMENTS
                ? "You haven't enrolled in any public workshops yet."
                : 'No public sessions match your search.'}
            </p>
          </div>
        ) : activeTab === PUBLIC_SESSION_TABS.ENROLLMENTS ? (
          enrollmentDetails
            .filter((e) => {
              if (!q) return true;
              return e.session?.title?.toLowerCase().includes(q);
            })
            .map(({ sessionId, enrolledAt, session }) => (
              <Link
                key={sessionId}
                to={`/public-session/${sessionId}`}
                className="flex items-center gap-4 p-4 bg-[#fffdfa]/50 rounded-xl hover:bg-white border border-yellow-50 hover:border-gray-100 transition-all group"
              >
                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white shadow-sm">
                  <img alt={session.title} className="w-full h-full object-cover" src={session.image} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1 gap-2">
                    <span className="text-[10px] font-bold text-bts-gold uppercase truncate">{session.scheduleDate || session.date}</span>
                    <span className="bg-green-50 text-green-600 text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-green-100 uppercase shrink-0">Enrolled</span>
                  </div>
                  <h4 className="text-sm font-bold text-brand-dark group-hover:text-bts-gold transition-colors leading-tight line-clamp-1">
                    {session.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[10px] text-gray-400 font-medium">
                    <span>Enrolled {formatEnrollmentDate(enrolledAt)}</span>
                    <span>{session.scheduleTime || session.time}</span>
                    <span>{session.duration}</span>
                  </div>
                </div>
              </Link>
            ))
        ) : (
          filteredSessions.map((session) => {
            const enrolled = isEnrolledInPublic(session.id);
            return (
              <Link
                key={session.id}
                to={`/public-session/${session.id}`}
                className={`flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-white border hover:border-gray-100 transition-all group ${
                  enrolled ? 'border-yellow-50 bg-[#fffdfa]/50' : 'border-transparent'
                }`}
              >
                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white shadow-sm">
                  <img alt={session.title} className="w-full h-full object-cover" src={session.image} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1 gap-2">
                    <span className="text-[10px] font-bold text-bts-gold uppercase truncate">{session.timeInfo}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      {enrolled && (
                        <span className="bg-green-50 text-green-600 text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-green-100 uppercase">Enrolled</span>
                      )}
                      <span className="bg-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm text-gray-400">{session.level}</span>
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-brand-dark group-hover:text-bts-gold transition-colors leading-tight line-clamp-1">
                    {session.title}
                  </h4>
                  <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-400 font-medium">
                    <span>{session.instituteName}</span>
                    <span>{session.duration}</span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      <Link className="mt-6 block text-center text-[10px] font-bold text-gray-400 hover:text-brand-dark flex items-center justify-center gap-2 transition-colors" to="/public-sessions">
        View all public sessions
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
      </Link>
    </div>
  );
}
