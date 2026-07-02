import { useState, useEffect } from 'react';
import { getProfile } from '../utils/profileStorage';
import { getEnrollmentRecords } from '../utils/enrollmentStorage';
import { apiGet } from '../utils/api';

export default function StatsGrid() {
  const [profile, setProfile] = useState(() => getProfile());
  const [activeCoursesCount, setActiveCoursesCount] = useState(0);
  const [freelanceEarnings, setFreelanceEarnings] = useState(0);
  const [activeProjectsCount, setActiveProjectsCount] = useState(0);

  useEffect(() => {
    const updateStats = () => {
      // 1. Profile balance
      const prof = getProfile();
      setProfile(prof);

      // 2. Active Courses (enrollment records)
      const enrollments = getEnrollmentRecords();
      setActiveCoursesCount(enrollments.length);

      // 3. Freelance Earnings
      const rawTxs = localStorage.getItem('bts_transactions');
      let txsList = [];
      if (rawTxs) {
        try { txsList = JSON.parse(rawTxs); } catch (e) {}
      }
      const earnings = txsList
        .filter(t => t.type === 'Mission Payout')
        .reduce((sum, t) => {
          // Parse amount like "+880" or "+1,200"
          const cleanAmt = String(t.amount).replace('+', '').replace(/,/g, '');
          return sum + (parseFloat(cleanAmt) || 0);
        }, 0);
      setFreelanceEarnings(earnings);

      // 4. Active Projects (ongoing applications)
      const rawApps = localStorage.getItem('bts_lancer_applications');
      let appsList = [];
      if (rawApps) {
        try { appsList = JSON.parse(rawApps); } catch (e) {}
      }
      setActiveProjectsCount(appsList.length);
    };

    updateStats();

    // Listen for events
    window.addEventListener('bts_profile_change', updateStats);
    window.addEventListener('bts_enrollments_change', updateStats);
    window.addEventListener('bts_transactions_change', updateStats);
    window.addEventListener('storage', updateStats);

    return () => {
      window.removeEventListener('bts_profile_change', updateStats);
      window.removeEventListener('bts_enrollments_change', updateStats);
      window.removeEventListener('bts_transactions_change', updateStats);
      window.removeEventListener('storage', updateStats);
    };
  }, []);

  const isMentor = profile.profileType === 'Mentor';
  const [mentorBookingsCount, setMentorBookingsCount] = useState(0);
  const [mentorHours, setMentorHours] = useState(0);
  const [mentorReviewsCount, setMentorReviewsCount] = useState(0);

  useEffect(() => {
    const fetchMentorStats = async () => {
      if (!isMentor) return;
      try {
        const data = await apiGet('/api/bookings');
        if (data) {
          setMentorBookingsCount(data.length);
          const hrs = data.reduce((sum, b) => sum + (parseInt(b.duration) || 1), 0);
          setMentorHours(hrs);
        }

        const rawReviews = localStorage.getItem('bts_reviews');
        if (rawReviews) {
          try {
            const list = JSON.parse(rawReviews);
            setMentorReviewsCount(list.length);
          } catch (_) {}
        }
      } catch (_) {}
    };

    fetchMentorStats();
  }, [isMentor]);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-purpose="summary-stats">
      {/* Card 1: BTS Credits / Earnings Balance */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex items-start justify-between relative overflow-hidden">
        <div className="z-10">
          <p className="text-xs font-bold text-gray-400 mb-2">{isMentor ? 'BTS Earnings Balance' : 'BTS Credits Balance'}</p>
          <div className="mb-4">
            <span className="text-2xl font-extrabold">{(profile.balance || 0).toLocaleString()}</span>
            <span className="text-xs font-bold text-gray-400 ml-1 uppercase">BTS</span>
            <p className="text-[10px] text-gray-400 font-medium">
              {isMentor ? 'Redeemable tutor earnings' : 'Redeemable platform credits'}
            </p>
          </div>
          <div className="flex items-center text-green-500 font-bold text-xs">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path clipRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" fillRule="evenodd"></path></svg>
            12.5% <span className="text-gray-300 font-normal ml-1">this month</span>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-full">
          <svg fill="none" height="24" stroke="#d4a017" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
        </div>
      </div>

      {/* Card 2: Student Bookings / Active Courses */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex items-start justify-between relative overflow-hidden">
        <div className="z-10">
          <p className="text-xs font-bold text-gray-400 mb-2">{isMentor ? 'Student Bookings' : 'Active Courses'}</p>
          <div className="mb-4">
            <span className="text-2xl font-extrabold">{isMentor ? mentorBookingsCount : activeCoursesCount}</span>
            <p className="text-[10px] text-gray-400 font-medium">{isMentor ? 'Total reservations' : 'In Progress'}</p>
          </div>
          <div className="flex items-center text-green-500 font-bold text-xs">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path clipRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a.999 1.999 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" fillRule="evenodd"></path></svg>
            {(isMentor ? mentorBookingsCount : activeCoursesCount) > 0 ? 'Active' : 'None'} <span className="text-gray-300 font-normal ml-1 text-[10px]">registered</span>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-full">
          <svg fill="none" height="24" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M12 14l9-5-9-5-9 5 9 5z"></path><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
        </div>
      </div>

      {/* Card 3: Mentorship Hours / Freelance Earnings */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex items-start justify-between relative overflow-hidden">
        <div className="z-10">
          <p className="text-xs font-bold text-gray-400 mb-2">{isMentor ? 'Teaching Hours' : 'Freelance Earnings'}</p>
          <div className="mb-4">
            {isMentor ? (
              <>
                <span className="text-2xl font-extrabold">{mentorHours}</span>
                <span className="text-xs font-bold text-gray-400 ml-1 uppercase">hrs</span>
              </>
            ) : (
              <>
                <span className="text-2xl font-extrabold">{freelanceEarnings.toLocaleString()}</span>
                <span className="text-xs font-bold text-gray-400 ml-1 uppercase">BTS</span>
              </>
            )}
            <p className="text-[10px] text-gray-400 font-medium">
              {isMentor ? 'Completed call sessions' : 'From D-Lancer missions'}
            </p>
          </div>
          <div className="flex items-center text-green-500 font-bold text-xs">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path clipRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" fillRule="evenodd"></path></svg>
            {isMentor ? 'Live' : '18.6%'} <span className="text-gray-300 font-normal ml-1">{isMentor ? 'sessions scheduled' : 'this month'}</span>
          </div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-full">
          {isMentor ? (
            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
          ) : (
            <svg fill="none" height="24" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          )}
        </div>
      </div>

      {/* Card 4: Total Reviews / Active Projects */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex items-start justify-between relative overflow-hidden">
        <div className="z-10">
          <p className="text-xs font-bold text-gray-400 mb-2">{isMentor ? 'Tutor Reviews' : 'Active Projects'}</p>
          <div className="mb-4">
            <span className="text-2xl font-extrabold">{isMentor ? mentorReviewsCount : activeProjectsCount}</span>
            <p className="text-[10px] text-gray-400 font-medium">{isMentor ? 'Student reviews received' : 'Ongoing'}</p>
          </div>
          <div className="flex items-center text-green-500 font-bold text-xs">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path clipRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" fillRule="evenodd"></path></svg>
            {(isMentor ? mentorReviewsCount : activeProjectsCount) > 0 ? 'Active' : 'No entries'} <span className="text-gray-300 font-normal ml-1 text-[10px]">{isMentor ? 'recorded' : 'ongoing'}</span>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-full">
          {isMentor ? (
            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.247.577 1.802l-3.97 2.887a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.887a1 1 0 00-1.17 0l-3.97 2.887c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.97-2.888c-.784-.555-.386-1.802.578-1.802h4.907a1 1 0 00.95-.69l1.519-4.674z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
          ) : (
            <svg fill="none" height="24" stroke="#a855f7" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9l-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          )}
        </div>
      </div>
    </section>
  );
}
