import { useNavigate } from 'react-router-dom';
import MissionStatusBadge from '../shared/MissionStatusBadge';
import DifficultyBadge from '../shared/DifficultyBadge';

export default function MissionCard({ mission, isInterested, isBookmarked, onBookmark }) {
  const navigate = useNavigate();
  const interestedCount = (mission.proposals || []).length;

  return (
    <div
      onClick={() => navigate(`/d-lancer/mission/${mission.id}`)}
      className={`bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 group flex flex-col cursor-pointer ${
        isInterested ? 'border-emerald-200 ring-1 ring-emerald-50' : 'border-gray-100 hover:border-bts-gold/40'
      }`}
    >
      {/* Thumbnail */}
      <div className="relative h-36 overflow-hidden bg-gray-100 shrink-0">
        {mission.thumbnail ? (
          <img
            src={mission.thumbnail}
            alt={mission.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-dark to-gray-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Top overlay */}
        <div className="absolute top-3 left-3">
          <DifficultyBadge difficulty={mission.difficulty} />
        </div>
        <div className="absolute bottom-3 left-3">
          <MissionStatusBadge status={mission.status} />
        </div>

        {/* Bookmark button */}
        <button
          onClick={e => { e.stopPropagation(); onBookmark(mission.id); }}
          className={`absolute top-3 right-3 p-1.5 rounded-lg backdrop-blur-sm transition-all ${
            isBookmarked ? 'bg-yellow-400/90 text-white' : 'bg-white/80 text-gray-500 hover:bg-yellow-400/90 hover:text-white'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Client */}
        <div className="flex items-center gap-2 mb-2.5">
          <img src={mission.clientAvatar} alt={mission.client} className="w-5 h-5 rounded-full border border-gray-100" />
          <span className="text-[11px] font-bold text-gray-500 truncate">{mission.client}</span>
          <span className="text-gray-200">·</span>
          <span className="text-[10px] text-gray-400">{mission.postedDays === 0 ? 'Just now' : `${mission.postedDays}d ago`}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {mission.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-extrabold">
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-sm font-extrabold text-brand-dark leading-snug mb-1.5 group-hover:text-bts-gold transition-colors line-clamp-2">
          {mission.title}
        </h3>
        <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2 mb-4 flex-1">
          {mission.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-4">
          <span>{mission.deadline}d duration</span>
          <span className="text-gray-200">·</span>
          <span>{interestedCount} interested</span>
          <span className="text-gray-200">·</span>
          <span>{mission.teamSize} slots</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Budget</p>
            <p className="text-base font-extrabold text-brand-dark">
              <span className="text-bts-gold">◈</span> {mission.reward.toLocaleString()}
              <span className="text-xs text-gray-400 font-bold ml-1">BTS</span>
            </p>
          </div>
          <button
            onClick={e => { e.stopPropagation(); navigate(`/d-lancer/mission/${mission.id}`); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-dark text-white rounded-xl text-xs font-extrabold hover:bg-bts-gold hover:text-brand-dark transition-all shadow-sm"
          >
            {isInterested ? (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                </svg>
                Interested
              </>
            ) : 'View Mission'}
          </button>
        </div>
      </div>
    </div>
  );
}
