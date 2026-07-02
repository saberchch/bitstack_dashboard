import { useNavigate } from 'react-router-dom';
import DifficultyBadge from '../shared/DifficultyBadge';

export default function RecommendedMissions({ missions }) {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-extrabold text-brand-dark">Recommended for You</h3>
          <p className="text-[11px] text-gray-400">Based on your skill profile</p>
        </div>
        <button
          onClick={() => navigate('/d-lancer/marketplace')}
          className="text-[11px] font-extrabold text-bts-gold hover:text-brand-dark transition-colors"
        >
          Browse all →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {missions.slice(0, 3).map(mission => (
          <div
            key={mission.id}
            onClick={() => navigate(`/d-lancer/mission/${mission.id}`)}
            className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-bts-gold/30 transition-all group cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="relative h-28 bg-gray-100 overflow-hidden">
              {mission.thumbnail ? (
                <img
                  src={mission.thumbnail}
                  alt={mission.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-brand-dark to-gray-700" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute top-2 left-2">
                <DifficultyBadge difficulty={mission.difficulty} />
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex flex-wrap gap-1 mb-2">
                {mission.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-extrabold">
                    {tag}
                  </span>
                ))}
              </div>
              <h4 className="text-sm font-extrabold text-brand-dark leading-snug group-hover:text-bts-gold transition-colors line-clamp-2 mb-2">
                {mission.title}
              </h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <img src={mission.clientAvatar} alt={mission.client} className="w-5 h-5 rounded-full" />
                  <span className="text-[10px] text-gray-400 font-semibold">{mission.client}</span>
                </div>
                <p className="text-sm font-extrabold text-brand-dark">
                  <span className="text-bts-gold">◈</span> {mission.reward.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
