export default function StepCompleted({ mission }) {
  const milestones = mission.milestones || ['Initiation', 'Beta Prototype', 'Production Integration'];
  const status = mission.milestoneStatus || ['completed', 'completed', 'completed'];
  const submissions = mission.submissions || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Overview Block */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Contract Fulfilled
          </span>
          <h3 className="text-lg font-extrabold text-brand-dark mt-2">{mission.title}</h3>
          <p className="text-xs text-gray-400">All escrow disbursed. Archive record is locked as read-only.</p>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-right">
          <p className="text-[10px] text-gray-400 font-bold uppercase">Total Escrow Disbursed</p>
          <p className="text-xl font-extrabold text-brand-dark">◈ {mission.reward.toLocaleString()} BTS</p>
        </div>
      </div>

      {/* Record Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Milestones & Submissions */}
        <div className="space-y-6">
          {/* Milestones */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold text-brand-dark uppercase tracking-widest">Milestones & History</h4>
            <div className="space-y-3">
              {milestones.map((m, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                    <span className="text-gray-600">{m}</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase">Released</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submissions */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold text-brand-dark uppercase tracking-widest">Delivered Artifacts</h4>
            {submissions.length === 0 ? (
              <p className="text-xs text-gray-300 italic">No artifacts uploaded.</p>
            ) : (
              <div className="space-y-2">
                {submissions.map((sub, idx) => (
                  <div key={idx} className="text-xs flex justify-between items-center">
                    <span className="text-gray-600 truncate max-w-[200px]">{sub.title}</span>
                    <a href={sub.link} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                      Link ➔
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Discussions / Review Logs */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold text-brand-dark uppercase tracking-widest">Discussions Log</h4>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 leading-relaxed">
                <span className="font-extrabold text-brand-dark">System: </span>
                Chat session closed and archived on completion.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
