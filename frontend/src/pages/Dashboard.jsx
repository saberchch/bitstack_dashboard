import { useState, useEffect } from 'react';
import { getProfile } from '../utils/profileStorage';
import StudentDashboard from './StudentDashboard';
import MentorDashboard from './MentorDashboard';

/**
 * Dashboard — Role Router
 * -----------------------
 * Reads the user's profileType and renders the appropriate
 * purpose-built dashboard. Reactive to profile changes.
 */
export default function Dashboard() {
  const [profileType, setProfileType] = useState(() => getProfile().profileType);

  useEffect(() => {
    const refresh = (e) => setProfileType(e.detail?.profileType);
    window.addEventListener('bts_profile_change', refresh);
    return () => window.removeEventListener('bts_profile_change', refresh);
  }, []);

  if (profileType === 'Mentor') {
    return <MentorDashboard />;
  }

  return <StudentDashboard />;
}
