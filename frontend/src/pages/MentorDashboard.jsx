import Topbar from '../components/Topbar';
import StatsGrid from '../components/StatsGrid';
import UpcomingEvents from '../components/UpcomingEvents';
import MyStudentBookings from '../components/MyStudentBookings';
import MentorEarningsChart from '../components/MentorEarningsChart';
import MentorActiveSessions from '../components/MentorActiveSessions';
import MentorQuickActions from '../components/MentorQuickActions';
import MentorPayoutSummary from '../components/MentorPayoutSummary';
import { useState, useEffect } from 'react';
import { getProfile } from '../utils/profileStorage';
import { Link } from 'react-router-dom';

function MentorWelcomeBanner({ profile }) {
  const verificationStatus = profile.verificationStatus || 'Verified Mentor';
  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 mb-6 relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-bts-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl translate-y-1/2" />

      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'Mentor')}&background=d4a017&color=0b1121`}
            alt={profile.name}
            className="w-14 h-14 rounded-2xl border-2 border-bts-gold/30 object-cover shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Mentor Dashboard</p>
              <span className="text-[9px] font-extrabold bg-bts-gold/20 text-bts-gold border border-bts-gold/30 px-1.5 py-0.5 rounded-full">
                {verificationStatus}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              {profile.name ? `Welcome back, ${profile.name.split(' ')[0]}` : 'Mentor Dashboard'}
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {profile.bio ? profile.bio.slice(0, 80) + (profile.bio.length > 80 ? '...' : '') : 'Manage your sessions, track earnings, and connect with students.'}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-end gap-2">
          <Link
            to="/d-platform"
            className="inline-flex items-center gap-1.5 bg-bts-gold hover:bg-yellow-500 text-gray-950 text-xs font-extrabold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-yellow-500/10"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            Create Session
          </Link>
          <Link
            to="/profile"
            className="text-[10px] text-gray-400 hover:text-white font-semibold transition-colors"
          >
            Edit Profile →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MentorDashboard() {
  const [profile, setProfile] = useState(() => getProfile());

  useEffect(() => {
    const refresh = (e) => setProfile(e.detail);
    window.addEventListener('bts_profile_change', refresh);
    return () => window.removeEventListener('bts_profile_change', refresh);
  }, []);

  return (
    <>
      <Topbar searchPlaceholder="Search students, sessions, earnings..." />

      {/* Welcome banner */}
      <MentorWelcomeBanner profile={profile} />

      {/* Stats row */}
      <StatsGrid />

      {/* Hero row: Upcoming schedule + Student bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 items-stretch">
        <UpcomingEvents />
        <MyStudentBookings />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Left 2/3: earnings chart + active sessions */}
        <div className="col-span-2 space-y-6">
          <MentorEarningsChart />
          <MentorActiveSessions />
        </div>
        {/* Right 1/3: quick actions + payout */}
        <div className="col-span-1 space-y-6">
          <MentorQuickActions />
          <MentorPayoutSummary />
        </div>
      </div>
    </>
  );
}
