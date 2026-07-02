import { useNavigate } from 'react-router-dom';

export default function ContinueWorking({ missions }) {
  const navigate = useNavigate();

  if (!missions || missions.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-extrabold text-brand-dark">Continue Working</h3>
          <p className="text-[11px] text-gray-400">Your active missions</p>
        </div>
        <button
          onClick={() => navigate('/d-lancer', { state: { tab: 'active' } })}
          className="text-[11px] font-extrabold text-bts-gold hover:text-brand-dark transition-colors"
        >
          View all →
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {missions.map(mission => {
          const pct = mission.myProgress || Math.round(
            ((mission.milestoneStatus || []).filter(s => s === 'completed').length /
              Math.max(1, (mission.milestones || []).length)) * 100
          );
          const isCreator = mission._role === 'creator';

          return (
            <div
              key={mission.id}
              onClick={() => navigate(`/d-lancer/workspace/${mission.id}`)}
              className="min-w-[280px] max-w-[280px] bg-white border border-gray-100 rounded-2xl p-4 cursor-pointer hover:shadow-lg hover:border-bts-gold/30 transition-all group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded ${
                  isCreator ? 'bg-bts-gold/10 text-bts-gold' : 'bg-blue-50 text-blue-600'
                }`}>
                  {isCreator ? 'Client' : 'Freelancer'}
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                  mission.status === 'In Review'
                    ? 'text-amber-700 bg-amber-50 border-amber-200'
                    : 'text-blue-700 bg-blue-50 border-blue-200'
                }`}>
                  {mission.status}
                </span>
              </div>

              <h4 className="text-sm font-extrabold text-brand-dark leading-snug mb-1 group-hover:text-bts-gold transition-colors line-clamp-2">
                {mission.title}
              </h4>
              <p className="text-[11px] text-gray-400 mb-3">{mission.client}</p>

              {/* Progress */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[10px] text-gray-400 font-bold">
                    {mission.myMilestone || (mission.milestones || [])[0] || 'In progress'}
                  </span>
                  <span className="text-[10px] font-extrabold text-blue-600">{pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-bts-gold to-brand-dark rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Escrow */}
              {mission.escrowReleasedAmount > 0 && (
                <p className="text-[10px] text-emerald-600 font-extrabold mt-2">
                  ◈ {mission.escrowReleasedAmount.toLocaleString()} released
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
