import Topbar from '../components/Topbar';
import StatsGrid from '../components/StatsGrid';
import ActivityOverview from '../components/ActivityOverview';
import ContinueLearningReal from '../components/ContinueLearningReal';
import UpcomingEvents from '../components/UpcomingEvents';
import RecommendedMentorsStrip from '../components/RecommendedMentorsStrip';
import RecentActivity from '../components/RecentActivity';
import ResourceLibrary from '../components/ResourceLibrary';
import { useState, useEffect } from 'react';
import { getProfile } from '../utils/profileStorage';
import { Link } from 'react-router-dom';
import { getPrivateBookings } from '../utils/enrollmentStorage';

function PrivateBookingsBanner() {
  const [bookings, setBookings] = useState(() => getPrivateBookings());

  useEffect(() => {
    const refresh = () => setBookings(getPrivateBookings());
    window.addEventListener('bts_private_bookings_change', refresh);
    return () => window.removeEventListener('bts_private_bookings_change', refresh);
  }, []);

  if (bookings.length === 0) return null;

  const next = bookings[0];
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="bg-bts-gold/10 p-2.5 rounded-xl shrink-0">
          <svg className="w-5 h-5 text-bts-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-extrabold text-brand-dark">
            Upcoming Mentorship: <span className="text-bts-gold">{next.mentorName}</span>
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">
            {next.topic} · {next.slot} · {next.duration}h · {next.cost} BTS
          </p>
        </div>
      </div>
      <Link
        to="/calendar"
        className="shrink-0 text-xs font-bold text-bts-gold hover:text-yellow-600 border border-yellow-300 px-3 py-1.5 rounded-lg hover:border-yellow-400 transition-colors"
      >
        View Calendar
      </Link>
    </div>
  );
}

export default function StudentDashboard() {
  const [profile, setProfile] = useState(() => getProfile());

  useEffect(() => {
    const refresh = (e) => setProfile(e.detail);
    window.addEventListener('bts_profile_change', refresh);
    return () => window.removeEventListener('bts_profile_change', refresh);
  }, []);

  return (
    <>
      <Topbar searchPlaceholder="Search sessions, mentors, courses..." />

      {/* Welcome header */}
      <div className="mb-6">
        <p className="text-[10px] font-extrabold text-bts-gold uppercase tracking-widest mb-0.5">
          Welcome back
        </p>
        <h2 className="text-2xl font-extrabold text-brand-dark">
          {profile.name ? `Hey, ${profile.name.split(' ')[0]} 👋` : 'Student Dashboard'}
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">Here's your learning overview for today</p>
      </div>

      {/* Private booking banner */}
      <PrivateBookingsBanner />

      {/* Stats row */}
      <StatsGrid />

      {/* Hero row: Events + Recommended Mentors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 items-stretch">
        <UpcomingEvents />
        <RecommendedMentorsStrip />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Left 2/3: activity + learning */}
        <div className="col-span-2 space-y-6">
          <ActivityOverview />
          <ContinueLearningReal />
        </div>
        {/* Right 1/3: activity feed + library */}
        <div className="col-span-1 space-y-6">
          <RecentActivity />
          <ResourceLibrary />

          {/* Quick explore card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-bts-gold/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Explore</p>
            <h4 className="text-sm font-extrabold text-white mb-3">Find Expert Mentors</h4>
            <p className="text-[10px] text-gray-400 mb-4 leading-relaxed">
              Book 1-on-1 private sessions with verified blockchain experts matched to your interests.
            </p>
            <Link
              to="/expert-mentors"
              className="inline-flex items-center gap-1.5 bg-bts-gold hover:bg-yellow-500 text-gray-950 text-xs font-extrabold px-4 py-2 rounded-lg transition-colors"
            >
              Browse Mentors
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
