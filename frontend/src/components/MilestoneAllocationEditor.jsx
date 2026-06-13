import { useState, useEffect } from 'react';

export default function MilestoneAllocationEditor({ reward, initialMilestones, onLock }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    if (initialMilestones && initialMilestones.length > 0) {
      // Initialize with split reward and default dates
      const count = initialMilestones.length;
      const baseAmt = Math.round(reward / count);
      setList(initialMilestones.map((m, idx) => ({
        title: typeof m === 'string' ? m : (m.title || `Milestone ${idx + 1}`),
        amount: typeof m === 'string' ? baseAmt : (m.amount || baseAmt),
        days: typeof m === 'string' ? (idx + 1) * 7 : (m.days || (idx + 1) * 7)
      })));
    } else {
      // Default initial milestone
      setList([{ title: 'Initial setup & setup scope', amount: reward, days: 7 }]);
    }
  }, [initialMilestones, reward]);

  const handleUpdateField = (idx, field, value) => {
    const next = [...list];
    next[idx] = { ...next[idx], [field]: value };
    setList(next);
  };

  const handleAddMilestone = () => {
    const count = list.length + 1;
    const nextDays = count * 7;
    setList([...list, { title: `New Milestone Deliverable ${count}`, amount: 0, days: nextDays }]);
  };

  const handleDeleteMilestone = (idx) => {
    if (list.length <= 1) return;
    setList(list.filter((_, i) => i !== idx));
  };

  const sumTotal = list.reduce((s, m) => s + (Number(m.amount) || 0), 0);
  const isValid = sumTotal === reward;

  return (
    <div className="bg-white border border-yellow-100 p-5 rounded-2xl shadow-sm space-y-4 text-left animate-fadeIn">
      <div>
        <h3 className="text-xs font-extrabold text-brand-dark uppercase tracking-wider">Deconstruct Project Milestones</h3>
        <p className="text-[11px] text-gray-400 font-semibold mt-0.5">Divide project scope into specific milestones, specify deliverables, allocate milestone funds, and agree on target time steps (in days).</p>
      </div>

      <div className="space-y-3">
        {list.map((m, idx) => (
          <div key={idx} className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3 relative group">
            {/* Delete button */}
            {list.length > 1 && (
              <button
                type="button"
                onClick={() => handleDeleteMilestone(idx)}
                className="absolute right-3 top-3 text-gray-300 hover:text-rose-500 transition-colors"
                title="Remove Milestone"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              {/* Milestone Title */}
              <div className="md:col-span-6">
                <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Milestone {idx + 1} Deliverable *</label>
                <input
                  type="text"
                  required
                  value={m.title}
                  onChange={e => handleUpdateField(idx, 'title', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-brand-dark focus:outline-none focus:border-bts-gold transition-all"
                />
              </div>

              {/* Fund split */}
              <div className="md:col-span-3">
                <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Escrow Payout (BTS) *</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-bts-gold font-extrabold text-xs">◈</span>
                  <input
                    type="number"
                    min="0"
                    required
                    value={m.amount}
                    onChange={e => handleUpdateField(idx, 'amount', Number(e.target.value) || 0)}
                    className="w-full pl-6 pr-2 py-2 bg-white border border-gray-200 rounded-xl text-xs font-extrabold text-brand-dark focus:outline-none focus:border-bts-gold transition-all"
                  />
                </div>
              </div>

              {/* Target Days */}
              <div className="md:col-span-3">
                <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Target steps (Days) *</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">📅</span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={m.days}
                    onChange={e => handleUpdateField(idx, 'days', Number(e.target.value) || 0)}
                    className="w-full pl-7 pr-2 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-brand-dark focus:outline-none focus:border-bts-gold transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddMilestone}
          className="w-full py-2.5 bg-white border border-dashed border-gray-200 hover:border-brand-dark text-gray-400 hover:text-brand-dark rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          Add Another Milestone
        </button>
      </div>

      {/* Verification & Lock */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 flex-wrap gap-2">
        <p className="text-xs font-bold text-gray-500">
          Escrow Distribution: <span className={isValid ? "text-emerald-600 font-extrabold" : "text-rose-500 font-extrabold"}>◈ {sumTotal.toLocaleString()}</span> / ◈ {reward.toLocaleString()} BTS
        </p>
        <button
          disabled={!isValid}
          onClick={() => onLock({
            milestones: list.map(m => m.title),
            milestoneAmounts: list.map(m => m.amount),
            milestoneDays: list.map(m => m.days),
            milestoneStatus: list.map(() => 'pending'),
            milestoneReleased: list.map(() => false),
            deadline: list.reduce((max, m) => Math.max(max, m.days), 0)
          })}
          className="px-5 py-2.5 bg-brand-dark hover:bg-bts-gold text-white hover:text-brand-dark rounded-xl text-xs font-extrabold disabled:opacity-50 transition-all shadow-sm"
        >
          🔒 Lock Milestones & Activate Contract
        </button>
      </div>
    </div>
  );
}
