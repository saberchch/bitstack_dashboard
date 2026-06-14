import { Link } from 'react-router-dom';
import { mentors } from '../data/mentors';

const TOP_MENTORS = [...mentors]
  .filter(m => m.verified !== false)
  .sort((a, b) => b.rating - a.rating || b.sessions - a.sessions)
  .slice(0, 3);

const CARD_CLASS =
  'flex flex-col h-full min-h-[148px] bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm';

function MentorRow({ mentor }) {
  const specialty = mentor.skills?.[0] || mentor.role?.split('&')[0]?.trim() || 'Mentor';

  return (
    <Link
      to={`/mentor/${mentor.id}`}
      className="group flex items-center gap-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <img
        src={mentor.avatar}
        alt={mentor.name}
        className="w-8 h-8 rounded-full border border-gray-100 object-cover group-hover:border-bts-gold/30 transition-colors shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-brand-dark truncate">{mentor.name}</p>
        <p className="text-[10px] text-gray-400 truncate">{specialty}</p>
      </div>
      <div className="flex items-center gap-0.5 text-[10px] font-bold text-bts-gold shrink-0">
        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        {mentor.rating.toFixed(1)}
      </div>
    </Link>
  );
}

export default function RecommendedMentorsStrip() {
  return (
    <div className={CARD_CLASS} data-purpose="recommended-mentors-strip">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-extrabold text-bts-gold uppercase tracking-wider">
          Recommended Mentors
        </span>
        <Link
          to="/expert-mentors"
          className="text-[10px] font-bold text-brand-dark border border-gray-200 px-3 py-1 rounded-lg hover:bg-bts-gold/10 hover:border-bts-gold/30 transition-colors whitespace-nowrap"
        >
          View all
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center divide-y divide-gray-50">
        {TOP_MENTORS.map(mentor => (
          <MentorRow key={mentor.id} mentor={mentor} />
        ))}
      </div>
    </div>
  );
}
