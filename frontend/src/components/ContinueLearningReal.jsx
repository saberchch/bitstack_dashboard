import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyEnrollmentsWithDetails } from '../utils/enrollmentStorage';

// Progress is derived from enrollment date — older = further along
function deriveProgress(enrolledAt) {
  if (!enrolledAt) return 15;
  const daysSince = (Date.now() - new Date(enrolledAt)) / (1000 * 60 * 60 * 24);
  return Math.min(95, Math.max(5, Math.round(daysSince * 4)));
}

const ICON_COLORS = [
  { bg: 'bg-indigo-50', icon: 'text-indigo-500', bar: 'bg-indigo-500' },
  { bg: 'bg-blue-50',   icon: 'text-blue-500',   bar: 'bg-blue-500' },
  { bg: 'bg-violet-50', icon: 'text-violet-500',  bar: 'bg-violet-500' },
  { bg: 'bg-cyan-50',   icon: 'text-cyan-600',    bar: 'bg-cyan-500' },
];

function CourseIcon({ colors }) {
  return (
    <div className={`${colors.bg} p-3 rounded-xl shrink-0`}>
      <svg className={`w-5 h-5 ${colors.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    </div>
  );
}

export default function ContinueLearningReal() {
  const [enrollments, setEnrollments] = useState(() => getMyEnrollmentsWithDetails().slice(0, 3));

  useEffect(() => {
    const refresh = () => setEnrollments(getMyEnrollmentsWithDetails().slice(0, 3));
    window.addEventListener('bts_enrollments_change', refresh);
    return () => window.removeEventListener('bts_enrollments_change', refresh);
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-[10px] font-extrabold text-bts-gold uppercase tracking-widest block mb-0.5">
            Your Learning
          </span>
          <h3 className="font-extrabold text-lg text-brand-dark">Continue Learning</h3>
        </div>
        <Link to="/d-institute" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
          Browse Courses →
        </Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">No courses enrolled yet</p>
            <p className="text-xs text-gray-400 mt-0.5">Explore the d-Institute to get started</p>
          </div>
          <Link
            to="/d-institute"
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
          >
            Enroll in a Course
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {enrollments.map((record, idx) => {
            const session = record.session;
            const colors = ICON_COLORS[idx % ICON_COLORS.length];
            const progress = deriveProgress(record.enrolledAt);
            return (
              <Link
                key={record.sessionId}
                to={`/public-session/${record.sessionId}`}
                className="flex items-center gap-4 group"
              >
                <CourseIcon colors={colors} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1.5">
                    <h5 className="text-sm font-bold text-brand-dark truncate group-hover:text-indigo-600 transition-colors">
                      {session.title}
                    </h5>
                    <span className="text-xs font-bold text-gray-400 ml-2 shrink-0">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`${colors.bar} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {session.instituteName} · {session.level || 'All Levels'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
