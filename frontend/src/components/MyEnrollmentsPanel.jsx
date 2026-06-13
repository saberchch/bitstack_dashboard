import { Link } from 'react-router-dom';
import { formatEnrollmentDate } from '../utils/enrollmentStorage';
import { SESSION_TYPES } from '../utils/sessionsStorage';

export default function MyEnrollmentsPanel({ enrollments = [] }) {
  if (enrollments.length === 0) {
    return (
      <div className="col-span-full bg-gray-50 rounded-2xl p-12 text-center border border-dashed border-gray-200">
        <span className="material-symbols-outlined text-gray-300 text-5xl mb-3 block">school</span>
        <h3 className="text-lg font-extrabold text-brand-dark mb-2">No Enrollments Yet</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
          Browse public workshops or premium sessions and reserve your spot. Your schedule and enrollment details will appear here.
        </p>
        <Link
          to="/public-sessions"
          onClick={() => window.scrollTo(0, 0)}
          className="inline-flex items-center gap-2 bg-bts-gold text-white px-5 py-2.5 rounded-xl text-xs font-extrabold hover:opacity-90 transition-all"
        >
          Explore Sessions
        </Link>
      </div>
    );
  }

  return (
    <div className="col-span-full space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-extrabold text-brand-dark uppercase tracking-wider">
          {enrollments.length} Active Enrollment{enrollments.length !== 1 ? 's' : ''}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {enrollments.map(({ sessionId, enrolledAt, sessionType, status, session }) => (
          <div
            key={sessionId}
            className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-5"
          >
            <div className="w-full md:w-40 h-28 md:h-auto rounded-xl overflow-hidden bg-gray-100 shrink-0">
              <img src={session.image} alt={session.title} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wide ${
                  status === 'confirmed'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    : 'bg-gray-50 text-gray-500 border border-gray-100'
                }`}>
                  {status || 'confirmed'}
                </span>
                {sessionType === SESSION_TYPES.PREMIUM_PUBLIC && (
                  <span className="bg-yellow-50 text-bts-gold border border-yellow-100 px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase">Premium Public</span>
                )}
                {sessionType === SESSION_TYPES.PREMIUM_PRIVATE && (
                  <span className="bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase">Premium Private · PFE</span>
                )}
                <span className="text-[10px] font-bold text-gray-400 uppercase">{session.instituteName}</span>
              </div>

              <Link to={`/public-session/${session.id}`} className="text-lg font-extrabold text-brand-dark hover:text-bts-gold transition-colors line-clamp-1">
                {session.title}
              </Link>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                <div className="bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                  <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider mb-0.5">Enrolled On</p>
                  <p className="text-xs font-bold text-brand-dark">{formatEnrollmentDate(enrolledAt)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                  <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider mb-0.5">Scheduled Date</p>
                  <p className="text-xs font-bold text-brand-dark">{session.scheduleDate || session.date}</p>
                </div>
                <div className="bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                  <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider mb-0.5">Time</p>
                  <p className="text-xs font-bold text-brand-dark">{session.scheduleTime || session.time}</p>
                </div>
                <div className="bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                  <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider mb-0.5">Duration</p>
                  <p className="text-xs font-bold text-brand-dark">{session.duration}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-bts-gold !text-sm">person</span>
                  {session.instructor.name}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-bts-gold !text-sm">signal_cellular_alt</span>
                  {session.level}
                </span>
              </div>
            </div>

            <div className="flex md:flex-col gap-2 shrink-0 md:justify-center">
              <Link
                to={`/public-session/${session.id}`}
                className="px-4 py-2.5 bg-brand-dark text-white rounded-xl text-xs font-extrabold hover:bg-bts-gold hover:text-brand-dark transition-all text-center"
              >
                View Details
              </Link>
              {session.instructor?.mentorId && (
                <Link
                  to={`/mentor/${session.instructor.mentorId}`}
                  className="px-4 py-2.5 bg-gray-50 text-gray-600 border border-gray-100 rounded-xl text-xs font-bold hover:border-bts-gold hover:text-bts-gold transition-all text-center"
                >
                  Mentor Profile
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
