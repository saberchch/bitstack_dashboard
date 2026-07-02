import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import PlatformHero from '../components/PlatformHero';
import PublicSessions from '../components/PublicSessions';
import PrivateSessions from '../components/PrivateSessions';
import MentorPlatformView from '../components/MentorPlatformView';
import { getProfile } from '../utils/profileStorage';

export default function DPlatform() {
  const [profileType, setProfileType] = useState(() => getProfile().profileType);

  useEffect(() => {
    const refresh = (e) => setProfileType(e.detail?.profileType);
    window.addEventListener('bts_profile_change', refresh);
    return () => window.removeEventListener('bts_profile_change', refresh);
  }, []);

  if (profileType === 'Mentor') {
    return (
      <>
        <Topbar searchPlaceholder="Search sessions, students..." />
        <div className="mb-6">
          <p className="text-[10px] font-extrabold text-bts-gold uppercase tracking-widest mb-0.5">d-Platform</p>
          <h2 className="text-2xl font-extrabold text-brand-dark">Mentor Hub</h2>
          <p className="text-sm text-gray-400 mt-0.5">Create sessions, manage bookings and take attendance</p>
        </div>
        <MentorPlatformView />
      </>
    );
  }

  return (
    <>
      <Topbar searchPlaceholder="Search ecosystem..." />
      <PlatformHero />
      <div className="space-y-8">
        <PublicSessions />
        <PrivateSessions />
      </div>
    </>
  );
}
