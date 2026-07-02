import { useNavigate } from 'react-router-dom';
import DifficultyBadge from '../shared/DifficultyBadge';
import MissionStatusBadge from '../shared/MissionStatusBadge';

export default function TrendingSection({ missions, isInterested, isBookmarked, onBookmark }) {
  const navigate = useNavigate();
  if (!missions || missions.length < 3) return null;

  const [featured, ...rest] = missions;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">🔥</span>
        <h3 className="text-sm font-extrabold text-brand-dark">Trending Now</h3>
        <span className="text-[10px] font-bold text-gray-400">Most competitive open missions</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Featured large card */}
        <div
          className="md:col-span-3 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col md:flex-row"
          onClick={() => navigate(`/d-lancer/mission/${featured.id}`)}
        >
          <div className="md:w-2/5 relative h-52 md:h-auto overflow-hidden bg-gray-100">
            {featured.thumbnail && (
              <img src={featured.thumbnail} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute top-3 left-3 bg-rose-500/90 backdrop-blur-md text-white px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider">
              🔥 #1 Trending
            </div>
            <div className="absolute top-3 right-3">
              <DifficultyBadge difficulty={featured.difficulty} />
            </div>
          </div>
          <div className="md:w-3/5 p-7 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <MissionStatusBadge status={featured.status} />
              <h4 className="text-base font-extrabold text-brand-dark leading-snug group-hover:text-bts-gold transition-colors line-clamp-2">
                {featured.title}
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{featured.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {featured.tags.slice(0, 3).map(t => (
                  <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-extrabold">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <img src={featured.clientAvatar} alt={featured.client} className="w-8 h-8 rounded-full border border-gray-100" />
                <div>
                  <p className="text-xs font-bold text-brand-dark">{featured.client}</p>
                  <p className="text-[10px] text-gray-400">{featured.deadline}d duration</p>
                </div>
              </div>
              <p className="text-lg font-extrabold text-brand-dark">
                <span className="text-bts-gold">◈</span> {featured.reward.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Two small cards */}
        <div className="md:col-span-2 flex flex-col gap-4">
          {rest.slice(0, 2).map((mission, i) => (
            <div
              key={mission.id}
              onClick={() => navigate(`/d-lancer/mission/${mission.id}`)}
              className="flex-1 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-bts-gold/40 transition-all group cursor-pointer flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <img src={mission.thumbnail} alt="" className="w-10 h-10 rounded-xl object-cover border border-gray-100" />
                  <MissionStatusBadge status={mission.status} />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-extrabold text-gray-400 bg-gray-100 rounded px-1.5 py-0.5">#{i + 2}</span>
                  <button
                    onClick={e => { e.stopPropagation(); onBookmark(mission.id); }}
                    className={`p-1 rounded transition-all ${isBookmarked(mission.id) ? 'text-bts-gold' : 'text-gray-300 hover:text-bts-gold'}`}
                  >
                    <svg className="w-3.5 h-3.5" fill={isBookmarked(mission.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <div className="flex flex-wrap gap-1 mb-1.5">
                  {mission.tags.slice(0, 2).map(t => (
                    <span key={t} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-extrabold">{t}</span>
                  ))}
                </div>
                <h5 className="text-sm font-extrabold text-brand-dark group-hover:text-bts-gold transition-colors line-clamp-2">{mission.title}</h5>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-[10px] text-gray-400">{mission.deadline}d · {mission.client}</span>
                <p className="text-sm font-extrabold text-brand-dark">
                  <span className="text-bts-gold">◈</span> {mission.reward.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
