import { useState, useEffect, useCallback } from 'react';
import Topbar from '../components/Topbar';
import { isPlatformAdmin } from '../utils/profileStorage';
import {
  enrollInPublicSession,
  getMyEnrollmentsWithDetails,
  isEnrolledInPublic,
} from '../utils/enrollmentStorage';
import PublicSessionsHero from '../components/PublicSessionsHero';
import PublicSessionsFilters, { PUBLIC_SESSION_TABS } from '../components/PublicSessionsFilters';
import SessionsGrid from '../components/SessionsGrid';
import CreatePremiumSessionModal from '../components/CreatePremiumSessionModal';

export default function PublicSessionsPage() {
  const [activeTab, setActiveTab] = useState(PUBLIC_SESSION_TABS.ALL);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [enrollmentDetails, setEnrollmentDetails] = useState([]);
  const [enrollmentIds, setEnrollmentIds] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const isAdmin = isPlatformAdmin();

  const refreshEnrollments = useCallback(() => {
    const details = getMyEnrollmentsWithDetails();
    setEnrollmentDetails(details);
    setEnrollmentIds(details.map((d) => d.sessionId));
  }, []);

  useEffect(() => {
    refreshEnrollments();
    const onChange = () => refreshEnrollments();
    window.addEventListener('bts_enrollments_change', onChange);
    window.addEventListener('bts_sessions_change', onChange);
    window.addEventListener('bts_public_sessions_tab', (e) => setActiveTab(e.detail));
    return () => {
      window.removeEventListener('bts_enrollments_change', onChange);
      window.removeEventListener('bts_sessions_change', onChange);
      window.removeEventListener('bts_public_sessions_tab', () => {});
    };
  }, [refreshEnrollments]);

  const handleEnroll = (sessionId) => {
    enrollInPublicSession(sessionId);
    refreshEnrollments();
  };

  return (
    <>
      <Topbar searchPlaceholder="Search sessions, topics, or instructors..." />
      <div className="max-w-7xl mx-auto animate-fade-in px-4 pb-12">
      <PublicSessionsHero
        isAdmin={isAdmin}
        onCreatePremium={() => setShowCreateModal(true)}
      />
      <PublicSessionsFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        enrollmentCount={enrollmentIds.length}
        search={search}
        onSearchChange={setSearch}
        levelFilter={levelFilter}
        onLevelFilterChange={setLevelFilter}
      />
      <SessionsGrid
        activeTab={activeTab}
        enrollments={enrollmentIds}
        enrollmentDetails={enrollmentDetails}
        onEnroll={handleEnroll}
        isEnrolled={isEnrolledInPublic}
        search={search}
        levelFilter={levelFilter}
      />

      {showCreateModal && (
        <CreatePremiumSessionModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setActiveTab(PUBLIC_SESSION_TABS.PREMIUM_PUBLIC);
          }}
        />
      )}
      </div>
    </>
  );
}
