import MissionStatusBadge from '../shared/MissionStatusBadge';
import DifficultyBadge from '../shared/DifficultyBadge';

export default function MissionHeader({ title, budget, status, difficulty }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-150 pb-6 mb-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <MissionStatusBadge status={status} />
          <DifficultyBadge difficulty={difficulty} />
        </div>
        <h1 className="text-2xl font-black text-brand-dark tracking-tight leading-tight">
          {title}
        </h1>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-end shrink-0">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Project Budget</span>
        <p className="text-xl font-extrabold text-brand-dark mt-1">
          <span className="text-bts-gold">◈</span> {budget.toLocaleString()} <span className="text-xs text-gray-400 font-bold">BTS</span>
        </p>
      </div>
    </div>
  );
}
