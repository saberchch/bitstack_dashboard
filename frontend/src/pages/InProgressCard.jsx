export default function InProgressCard({ mission, onOpen }) {
  const partner = mission.activeContract || {};
  const isCreator = mission._role === 'creator';
  const pct = mission.myProgress || Math.round(
    ((mission.milestoneStatus || []).filter(s => s === 'completed').length / Math.max(1, (mission.milestones || []).length)) * 100
  );

  return (
    <div
      onClick={onOpen}
      className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-200 transition-all group flex flex-col cursor-pointer ring-1 ring-blue-50"
    >
      {mission.thumbnail && (
        <div className="relative h-32 overflow-hidden bg-gray-100 shrink-0">
          <img src={mission.thumbnail} alt={mission.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-3 left-3 bg-brand-dark/80 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase text-white tracking-wider">
            {mission.status}
          </div>
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-600 text-white uppercase tracking-wider">
              {isCreator ? 'Client' : 'Freelancer'}
            </span>
          </div>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-sm font-extrabold text-brand-dark leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {mission.title}
        </h3>

        <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-brand-dark flex items-center justify-center text-bts-gold text-xs font-extrabold shrink-0">
            {(isCreator ? (partner.freelancerName || '?') : mission.client).charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">
              {isCreator ? 'Working With' : 'Client'}
            </p>
            <p className="text-xs font-extrabold text-brand-dark truncate">
              {isCreator ? `${partner.freelancerName || 'Developer'} · ${partner.freelancerRole || ''}` : mission.client}
            </p>
          </div>
          <p className="text-xs font-extrabold text-brand-dark shrink-0">
            <span className="text-bts-gold">◈</span> {(partner.bid || mission.reward)?.toLocaleString()}
          </p>
        </div>

        <div className="mb-4">
          <div className="flex justify-between mb-1.5">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Milestone Progress</span>
            <span className="text-[10px] font-extrabold text-blue-600">{pct}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-bts-gold to-brand-dark rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-[10px] text-gray-400 mt-1 font-semibold">{mission.myMilestone || (mission.milestones || [])[0] || 'In progress'}</p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
          <p className="text-[10px] text-gray-400 font-bold">
            Escrow: <span className="text-emerald-600 font-extrabold">◈ {(mission.escrowReleasedAmount || 0).toLocaleString()}</span> released
          </p>
          <button
            onClick={e => { e.stopPropagation(); onOpen(); }}
            className="px-4 py-2 bg-brand-dark text-white rounded-xl text-xs font-extrabold hover:bg-bts-gold hover:text-brand-dark transition-all shadow-sm"
          >
            Open Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
