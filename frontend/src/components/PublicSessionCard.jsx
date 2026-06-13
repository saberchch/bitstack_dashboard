import { Link } from 'react-router-dom';
import { SESSION_TYPES } from '../utils/sessionsStorage';
import { formatEnrollmentDate } from '../utils/enrollmentStorage';

function typeBadge(sessionType) {
  if (sessionType === SESSION_TYPES.PREMIUM_PUBLIC) {
    return (
      <span className="bg-yellow-50 text-bts-gold border border-yellow-100 px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wide">
        Premium Public
      </span>
    );
  }
  if (sessionType === SESSION_TYPES.PREMIUM_PRIVATE) {
    return (
      <span className="bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wide">
        Premium Private
      </span>
    );
  }
  return (
    <span className="bg-gray-50 text-gray-500 border border-gray-100 px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wide">
      Workshop
    </span>
  );
}

export default function PublicSessionCard({
  session,
  isEnrolled,
  onEnroll,
  featured = false,
}) {
  const capacityPercent = Math.round((session.attendees / session.maxCapacity) * 100);
  const isPrivate = session.sessionType === SESSION_TYPES.PREMIUM_PRIVATE;

  if (featured && session.sessionType === SESSION_TYPES.PREMIUM_PUBLIC) {
    return (
      <div className="session-card group bg-white border border-yellow-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col xl:col-span-2 ring-1 ring-yellow-50">
        <div className="flex flex-col md:flex-row h-full">
          <Link to={`/public-session/${session.id}`} className="relative w-full md:w-5/12 overflow-hidden h-64 md:h-auto block">
            <img className="session-image w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={session.title} src={session.image} />
            <div className="absolute top-4 left-4">
              <span className="bg-brand-dark/90 text-bts-gold px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                Premium Public
              </span>
            </div>
          </Link>
          <div className="p-8 w-full md:w-7/12 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{session.timeInfo}</span>
              <span className="text-[10px] font-bold text-bts-gold uppercase">{session.instituteName}</span>
            </div>
            <Link to={`/public-session/${session.id}`}>
              <h3 className="text-2xl font-extrabold text-brand-dark mb-3 hover:text-bts-gold transition-colors">{session.title}</h3>
            </Link>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed line-clamp-3">{session.shortDescription || session.overview}</p>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <img className="w-10 h-10 rounded-lg object-cover border border-gray-100" alt={session.instructor.name} src={session.instructor.avatar} />
                <div>
                  <p className="text-sm font-bold text-brand-dark">{session.instructor.name}</p>
                  <p className="text-[10px] text-gray-400">{session.instructor.role}</p>
                </div>
              </div>
              <p className="text-[10px] font-bold text-gray-500">{session.attendees}/{session.maxCapacity} joined</p>
            </div>
            <button
              onClick={() => onEnroll(session.id)}
              disabled={isEnrolled}
              className={`w-full py-3 font-bold rounded-xl text-xs transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 ${
                isEnrolled
                  ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-default'
                  : 'bg-bts-gold text-white hover:opacity-90'
              }`}
            >
              {isEnrolled ? (
                <>
                  <span className="material-symbols-outlined !text-[14px]">check_circle</span>
                  Enrolled
                </>
              ) : 'Reserve My Spot'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="session-card group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
      <Link to={`/public-session/${session.id}`} className="relative h-48 overflow-hidden block group/img">
        <img className="session-image w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" alt={session.title} src={session.image} />
        <div className="absolute inset-0 bg-brand-dark/0 group-hover/img:bg-brand-dark/20 transition-all duration-300 flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-3xl opacity-0 group-hover/img:opacity-100 transition-opacity">play_circle</span>
        </div>
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          {typeBadge(session.sessionType)}
          <span className="bg-brand-dark/80 text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">{session.level}</span>
          <span className="bg-bts-gold/90 text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">{session.duration}</span>
        </div>
      </Link>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3 text-gray-400 flex-wrap">
            <span className="material-symbols-outlined !text-[14px]">event</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{session.timeInfo}</span>
            <span className="text-[10px] font-bold text-bts-gold uppercase">{session.instituteName}</span>
          </div>
          <Link to={`/public-session/${session.id}`}>
            <h3 className="text-lg font-bold text-brand-dark mb-2 line-clamp-2 hover:text-bts-gold transition-colors">{session.title}</h3>
          </Link>
          <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">{session.shortDescription || session.overview}</p>
        </div>
        <div>
          <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <img className="w-8 h-8 rounded-lg object-cover border border-gray-100 shrink-0" alt={session.instructor.name} src={session.instructor.avatar} />
              <div className="min-w-0">
                <p className="text-xs font-bold text-brand-dark leading-none truncate">{session.instructor.name}</p>
                <p className="text-[10px] text-gray-400 mt-1 truncate">{isPrivate ? 'PFE Premium Mentor' : session.instructor.role}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] font-bold text-gray-500">{session.attendees}/{session.maxCapacity}</p>
              <div className="w-16 h-1.5 bg-gray-50 rounded-full mt-1 overflow-hidden">
                <div className="bg-bts-gold h-full" style={{ width: `${capacityPercent}%` }} />
              </div>
            </div>
          </div>
          {isPrivate && session.price > 0 && (
            <p className="text-[10px] font-extrabold text-brand-dark mt-3">
              <span className="text-bts-gold">◈</span> {session.price} BTS · 1-on-1
            </p>
          )}
          <button
            onClick={() => onEnroll(session.id)}
            disabled={isEnrolled}
            className={`mt-4 w-full py-2.5 font-bold rounded-xl text-xs transition-all shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 ${
              isEnrolled
                ? 'bg-gray-100 text-gray-400 border border-gray-200 shadow-none cursor-default'
                : isPrivate
                  ? 'bg-brand-dark text-white hover:bg-bts-gold hover:text-brand-dark'
                  : 'bg-bts-gold text-white hover:bg-opacity-95'
            }`}
          >
            {isEnrolled ? (
              <>
                <span className="material-symbols-outlined !text-[14px]">check_circle</span>
                {isPrivate ? 'Booked' : 'Enrolled'}
              </>
            ) : isPrivate ? 'Book Premium Session' : 'Enroll Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
