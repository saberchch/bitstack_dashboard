export default function MilestoneProgressCard({
  title,
  amount,
  status,
  index,
  isCreator,
  isReadOnly,
  onUpdateStatus,
  expectations,
}) {
  const isFirst = index === 0;
  const isCompleted = status === 'completed' || (isFirst && isReadOnly);
  const isInReview = status === 'in_review';
  const isPending = status === 'pending';

  // Fallback default expectations if not set
  const expectationText = expectations || (
    isFirst 
      ? 'Show initial dev setup, dashboard mocks, and workflow parameters via private demo call.' 
      : 'Demonstrate active components, integrated styling modules, and custom routing checks.'
  );

  return (
    <div className={`border rounded-2xl p-5 transition-all flex flex-col justify-between gap-4 ${
      isCompleted
        ? 'bg-emerald-50/20 border-emerald-100'
        : isInReview
        ? 'bg-amber-50/20 border-amber-100 ring-1 ring-amber-50'
        : 'bg-white border-gray-100'
    }`}>
      {/* Upper info section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">
            Milestone {index + 1}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
            isCompleted
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : isInReview
              ? 'text-amber-700 bg-amber-50 border-amber-200'
              : 'text-gray-500 bg-gray-50 border-gray-200'
          }`}>
            {isCompleted ? 'Progress Verified' : isInReview ? 'In Progress Demo Call' : 'Pending review'}
          </span>
          <span className="text-[8px] font-extrabold uppercase tracking-wider text-bts-gold bg-brand-dark px-1.5 py-0.5 rounded">
            Private Session Demo Only
          </span>
        </div>

        <h4 className="text-sm font-extrabold text-brand-dark leading-snug">{title}</h4>
        
        {/* Expectations block */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs text-gray-500">
          <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400 mb-1">What we expect</p>
          <p className="leading-relaxed font-medium">{expectationText}</p>
        </div>
      </div>

      {/* Action / Sync meeting footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Meeting sync arranged: July {4 + index * 3}, 2026</span>
        </div>

        <div className="flex items-center gap-3 justify-end">
          {isFirst && (
            <div className="text-right shrink-0 mr-2">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Down Payment</p>
              <p className="text-xs font-extrabold text-emerald-600">◈ {amount?.toLocaleString()} BTS</p>
            </div>
          )}

          {isCreator && !isReadOnly && isPending && (
            <button
              type="button"
              onClick={() => onUpdateStatus(index, 'in_review')}
              className="px-4 py-2 border border-gray-200 text-brand-dark rounded-xl text-xs font-bold hover:border-brand-dark transition-all"
            >
              Start Review Call
            </button>
          )}

          {isCreator && !isReadOnly && isInReview && (
            <button
              type="button"
              onClick={() => onUpdateStatus(index, 'completed')}
              className="px-4 py-2 bg-brand-dark text-white rounded-xl text-xs font-bold hover:bg-bts-gold hover:text-brand-dark transition-all"
            >
              Approve Milestone Progress
            </button>
          )}

          {!isCreator && !isReadOnly && isPending && (
            <button
              type="button"
              onClick={() => onUpdateStatus(index, 'in_review')}
              className="px-4 py-2 bg-brand-dark text-white rounded-xl text-xs font-bold hover:bg-bts-gold hover:text-brand-dark transition-all"
            >
              Request Progress Demo Call
            </button>
          )}

          {isCompleted && (
            <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
              ✓ Verified & Synced
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
