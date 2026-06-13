import { Link } from 'react-router-dom';
import PublicSessionCard from './PublicSessionCard';
import MyEnrollmentsPanel from './MyEnrollmentsPanel';
import { PUBLIC_SESSION_TABS } from './PublicSessionsFilters';
import {
  getPublicSessions,
  getPremiumPublicSessions,
  getPremiumPrivateSessions,
  SESSION_TYPES,
} from '../utils/sessionsStorage';

function filterSessions(sessions, search, levelFilter) {
  const q = search.toLowerCase().trim();
  return sessions.filter((s) => {
    const matchLevel = levelFilter === 'all' || s.level === levelFilter;
    if (!q) return matchLevel;
    const matchSearch =
      s.title.toLowerCase().includes(q) ||
      s.instituteName?.toLowerCase().includes(q) ||
      s.instructor?.name?.toLowerCase().includes(q) ||
      s.level.toLowerCase().includes(q);
    return matchLevel && matchSearch;
  });
}

export default function SessionsGrid({
  activeTab,
  enrollments = [],
  enrollmentDetails = [],
  onEnroll,
  isEnrolled,
  search = '',
  levelFilter = 'all',
}) {
  const publicSessions = getPublicSessions();
  const premiumPublic = getPremiumPublicSessions();
  const premiumPrivate = getPremiumPrivateSessions();

  const filteredAll = filterSessions(publicSessions, search, levelFilter);
  const filteredPremiumPublic = filterSessions(premiumPublic, search, levelFilter);
  const filteredPremiumPrivate = filterSessions(premiumPrivate, search, levelFilter);

  if (activeTab === PUBLIC_SESSION_TABS.ENROLLMENTS) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <MyEnrollmentsPanel enrollments={enrollmentDetails} />
      </div>
    );
  }

  if (activeTab === PUBLIC_SESSION_TABS.PREMIUM_PRIVATE) {
    return (
      <div className="space-y-6">
        <div className="bg-brand-dark text-white rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-bts-gold/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="bg-bts-gold text-white px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider">PFE Guidance Institute</span>
              <h3 className="text-xl font-extrabold mt-3 mb-2">Premium Private Mentoring</h3>
              <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
                1-on-1 thesis coaching, prototype reviews, and defense preparation — exclusive to PFE Guidance Institute scholars.
              </p>
            </div>
            <Link
              to="/institute/pfe-guidance"
              className="shrink-0 px-5 py-3 bg-white text-brand-dark rounded-xl text-xs font-extrabold hover:bg-bts-gold hover:text-white transition-all text-center"
            >
              View PFE Institute
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPremiumPrivate.length === 0 ? (
            <p className="col-span-full text-center text-sm text-gray-400 py-12">No premium private sessions available.</p>
          ) : (
            filteredPremiumPrivate.map((session) => (
              <PublicSessionCard
                key={session.id}
                session={session}
                isEnrolled={isEnrolled(session.id)}
                onEnroll={onEnroll}
              />
            ))
          )}
        </div>
      </div>
    );
  }

  if (activeTab === PUBLIC_SESSION_TABS.PREMIUM_PUBLIC) {
    const featured = filteredPremiumPublic[0];
    const rest = filteredPremiumPublic.slice(1);

    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-100 rounded-2xl px-5 py-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-bts-gold">workspace_premium</span>
          <div>
            <p className="text-sm font-extrabold text-brand-dark">Premium Public Sessions</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Institute-backed workshops published platform-wide. Only platform admins can create new premium sessions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPremiumPublic.length === 0 ? (
            <p className="col-span-full text-center text-sm text-gray-400 py-12">No premium public sessions yet.</p>
          ) : (
            <>
              {featured && (
                <PublicSessionCard
                  session={featured}
                  isEnrolled={isEnrolled(featured.id)}
                  onEnroll={onEnroll}
                  featured
                />
              )}
              {rest.map((session) => (
                <PublicSessionCard
                  key={session.id}
                  session={session}
                  isEnrolled={isEnrolled(session.id)}
                  onEnroll={onEnroll}
                />
              ))}
            </>
          )}
        </div>
      </div>
    );
  }

  // ALL sessions tab
  const standard = filteredAll.filter((s) => s.sessionType === SESSION_TYPES.STANDARD);
  const premiumInAll = filteredAll.filter((s) => s.sessionType === SESSION_TYPES.PREMIUM_PUBLIC);
  const featuredPremium = premiumInAll[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {featuredPremium && (
        <PublicSessionCard
          session={featuredPremium}
          isEnrolled={isEnrolled(featuredPremium.id)}
          onEnroll={onEnroll}
          featured
        />
      )}

      {standard.map((session) => (
        <PublicSessionCard
          key={session.id}
          session={session}
          isEnrolled={isEnrolled(session.id)}
          onEnroll={onEnroll}
        />
      ))}

      {premiumInAll.slice(1).map((session) => (
        <PublicSessionCard
          key={session.id}
          session={session}
          isEnrolled={isEnrolled(session.id)}
          onEnroll={onEnroll}
        />
      ))}

      {filteredAll.length === 0 && (
        <p className="col-span-full text-center text-sm text-gray-400 py-12">No sessions match your filters.</p>
      )}

      {/* Private mentoring CTA card */}
      <div className="session-card group bg-brand-dark p-8 border border-gray-100 rounded-2xl flex flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-32 h-32 bg-bts-gold/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <span className="bg-purple-500/30 text-purple-200 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-purple-400/30">PFE Premium</span>
            <span className="material-symbols-outlined text-bts-gold">stars</span>
          </div>
          <h3 className="text-xl font-bold mb-4">PFE Private Mentoring</h3>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            Book premium 1-on-1 thesis and prototype reviews from PFE Guidance Institute faculty.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('bts_public_sessions_tab', { detail: PUBLIC_SESSION_TABS.PREMIUM_PRIVATE }))}
          className="w-full py-3 bg-white text-brand-dark font-extrabold rounded-xl text-xs hover:bg-bts-gold hover:text-white transition-all shadow-md relative z-10 text-center cursor-pointer"
        >
          View PFE Premium Sessions
        </button>
      </div>
    </div>
  );
}
