import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PublicSessionCard from './PublicSessionCard';
import MyEnrollmentsPanel from './MyEnrollmentsPanel';
import PublicSessionsPagination from './PublicSessionsPagination';
import { PUBLIC_SESSION_TABS } from './PublicSessionsFilters';
import {
  getPublicSessions,
  getPremiumPublicSessions,
  getPremiumPrivateSessions,
  SESSION_TYPES,
} from '../utils/sessionsStorage';
import { paginateItems } from '../utils/publicSessionsPagination';

function filterSessions(sessions, search, levelFilter) {
  const q = search.toLowerCase().trim();
  return sessions.filter((s) => {
    const matchLevel = levelFilter === 'all' || s.level === levelFilter;
    if (!q) return matchLevel;
    const matchSearch =
      s.title.toLowerCase().includes(q) ||
      s.instituteName?.toLowerCase().includes(q) ||
      s.instructor?.name?.toLowerCase().includes(q) ||
      s.level.toLowerCase().includes(q) ||
      s.topic?.toLowerCase().includes(q);
    return matchLevel && matchSearch;
  });
}

function SectionHeader({ icon, label, title, description, count }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
      <div>
        <span className="text-[10px] font-extrabold text-bts-gold uppercase tracking-wider flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px]!">{icon}</span>
          {label}
        </span>
        <h3 className="text-lg font-extrabold text-brand-dark mt-1">{title}</h3>
        {description && <p className="text-xs text-gray-500 mt-1 max-w-2xl">{description}</p>}
      </div>
      {count != null && (
        <span className="text-[10px] font-bold text-gray-400 uppercase shrink-0">
          {count} session{count !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
}

function SessionCardsGrid({ sessions, isEnrolled, onEnroll, featuredFirst = false, emptyMessage }) {
  if (sessions.length === 0) {
    return emptyMessage ? (
      <p className="text-center text-sm text-gray-400 py-10">{emptyMessage}</p>
    ) : null;
  }

  const featured = featuredFirst && sessions[0]?.sessionType === SESSION_TYPES.PREMIUM_PUBLIC
    ? sessions[0]
    : null;
  const rest = featured ? sessions.slice(1) : sessions;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
    </div>
  );
}

function PfeBanner() {
  return (
    <div className="bg-brand-dark text-white rounded-2xl p-5 md:p-6 relative overflow-hidden mb-5">
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-bts-gold/10 rounded-full blur-3xl" />
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="bg-purple-500/30 text-purple-200 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-purple-400/30">
            PFE Guidance Institute
          </span>
          <p className="text-sm text-gray-300 mt-2 max-w-xl leading-relaxed">
            Premium 1-on-1 thesis coaching, prototype reviews, and defense preparation for final-year scholars.
          </p>
        </div>
        <Link
          to="/institute/pfe-guidance"
          className="shrink-0 px-4 py-2.5 bg-white text-brand-dark rounded-xl text-xs font-extrabold hover:bg-bts-gold hover:text-white transition-all text-center"
        >
          View PFE Institute
        </Link>
      </div>
    </div>
  );
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
  const [currentPage, setCurrentPage] = useState(1);

  const publicSessions = getPublicSessions();
  const premiumPublic = getPremiumPublicSessions();
  const premiumPrivate = getPremiumPrivateSessions();

  const filteredAll = filterSessions(publicSessions, search, levelFilter);
  const filteredPremiumPublic = filterSessions(premiumPublic, search, levelFilter);
  const filteredPremiumPrivate = filterSessions(premiumPrivate, search, levelFilter);
  const filteredStandard = filteredAll.filter((s) => s.sessionType === SESSION_TYPES.STANDARD);

  const paginatedList = useMemo(() => {
    if (activeTab === PUBLIC_SESSION_TABS.PREMIUM_PUBLIC) {
      return paginateItems(filteredPremiumPublic, currentPage);
    }
    if (activeTab === PUBLIC_SESSION_TABS.PREMIUM_PRIVATE) {
      return paginateItems(filteredPremiumPrivate, currentPage);
    }
    if (activeTab === PUBLIC_SESSION_TABS.ALL) {
      return paginateItems(filteredStandard, currentPage);
    }
    return paginateItems([], currentPage);
  }, [activeTab, filteredPremiumPublic, filteredPremiumPrivate, filteredStandard, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search, levelFilter]);

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
        <PfeBanner />
        {filteredPremiumPrivate.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-12">No PFE premium sessions match your filters.</p>
        ) : (
          <>
            <SessionCardsGrid
              sessions={paginatedList.items}
              isEnrolled={isEnrolled}
              onEnroll={onEnroll}
            />
            <PublicSessionsPagination
              currentPage={paginatedList.currentPage}
              totalPages={paginatedList.totalPages}
              totalItems={paginatedList.totalItems}
              rangeStart={paginatedList.rangeStart}
              rangeEnd={paginatedList.rangeEnd}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    );
  }

  if (activeTab === PUBLIC_SESSION_TABS.PREMIUM_PUBLIC) {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-100 rounded-2xl px-5 py-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-bts-gold">workspace_premium</span>
          <div>
            <p className="text-sm font-extrabold text-brand-dark">Premium Public Workshops</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Institute-backed workshops published platform-wide. Only platform admins can create new premium sessions.
            </p>
          </div>
        </div>
        {filteredPremiumPublic.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-12">No premium public sessions match your filters.</p>
        ) : (
          <>
            <SessionCardsGrid
              sessions={paginatedList.items}
              isEnrolled={isEnrolled}
              onEnroll={onEnroll}
              featuredFirst
            />
            <PublicSessionsPagination
              currentPage={paginatedList.currentPage}
              totalPages={paginatedList.totalPages}
              totalItems={paginatedList.totalItems}
              rangeStart={paginatedList.rangeStart}
              rangeEnd={paginatedList.rangeEnd}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    );
  }

  // ALL sessions — premium & PFE spotlight, then paginated open workshops
  const hasSpotlight =
    filteredPremiumPublic.length > 0 || filteredPremiumPrivate.length > 0;

  return (
    <div className="space-y-10">
      {hasSpotlight && (
        <div className="space-y-8">
          {filteredPremiumPublic.length > 0 && (
            <section>
              <SectionHeader
                icon="workspace_premium"
                label="Premium"
                title="Premium Public Workshops"
                description="Institute-backed sessions with platform-wide visibility and recorded archives."
                count={filteredPremiumPublic.length}
              />
              <SessionCardsGrid
                sessions={filteredPremiumPublic}
                isEnrolled={isEnrolled}
                onEnroll={onEnroll}
                featuredFirst
              />
            </section>
          )}

          {filteredPremiumPrivate.length > 0 && (
            <section>
              <SectionHeader
                icon="person_pin"
                label="PFE"
                title="PFE Premium Private Sessions"
                description="1-on-1 mentoring for thesis defense, prototype review, and submission readiness."
                count={filteredPremiumPrivate.length}
              />
              <PfeBanner />
              <SessionCardsGrid
                sessions={filteredPremiumPrivate}
                isEnrolled={isEnrolled}
                onEnroll={onEnroll}
              />
            </section>
          )}
        </div>
      )}

      <section>
        <SectionHeader
          icon="school"
          label="Open access"
          title="Public Workshops"
          description="Standard group sessions open to all Bitstacks members."
          count={filteredStandard.length}
        />
        <SessionCardsGrid
          sessions={paginatedList.items}
          isEnrolled={isEnrolled}
          onEnroll={onEnroll}
          emptyMessage="No open workshops match your filters."
        />
        {filteredStandard.length === 0 && !hasSpotlight && (
          <p className="text-center text-sm text-gray-400 py-12">No sessions match your filters.</p>
        )}
        <PublicSessionsPagination
          currentPage={paginatedList.currentPage}
          totalPages={paginatedList.totalPages}
          totalItems={paginatedList.totalItems}
          rangeStart={paginatedList.rangeStart}
          rangeEnd={paginatedList.rangeEnd}
          onPageChange={setCurrentPage}
        />
      </section>
    </div>
  );
}
