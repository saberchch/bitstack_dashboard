import { useState } from 'react';

const DOWN_PCT_OPTIONS = [10, 15, 20, 25, 30];

function formatDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + (days || 7));
  return d.toISOString().split('T')[0];
}

export default function MilestoneDefinitionForm({
  initialMilestones,
  missionBudget,        // the originally posted budget (for reference only)
  isCreator,            // true = client, false = freelancer
  isReadOnly,           // locked after client approves
  onSave,               // (proposal) => void — called by freelancer
}) {
  const [agreedAmount, setAgreedAmount] = useState(
    initialMilestones?.[0]?.agreedAmount ?? missionBudget ?? 0
  );
  const [downPaymentPct, setDownPaymentPct] = useState(
    initialMilestones?.[0]?.downPaymentPct ?? 20
  );

  const [milestones, setMilestones] = useState(() => {
    if (initialMilestones && initialMilestones.length > 0) {
      return initialMilestones.map((m, idx) => ({
        title: m.title || (idx === 0 ? 'Milestone 1 — Initial Progress Demo' : `Milestone ${idx + 1}`),
        expectations: m.expectations || '',
        meetingDate: m.meetingDate || formatDate((idx + 1) * 7),
        fixed: idx === 0,
      }));
    }
    return [
      {
        title: 'Milestone 1 — Initial Progress Demo',
        expectations: 'Show initial working setup, dev stack, and preliminary architecture via a private video call.',
        meetingDate: formatDate(7),
        fixed: true,
      },
    ];
  });

  const add = () =>
    setMilestones(p => [
      ...p,
      {
        title: `Milestone ${p.length + 1}`,
        expectations: '',
        meetingDate: formatDate((p.length + 1) * 7),
        fixed: false,
      },
    ]);

  const remove = (i) => {
    if (milestones[i].fixed) return;
    setMilestones(p => p.filter((_, idx) => idx !== i));
  };

  const change = (i, field, val) => {
    const updated = [...milestones];
    updated[i] = { ...updated[i], [field]: val };
    setMilestones(updated);
  };

  const downPaymentBTS = Math.round(agreedAmount * (downPaymentPct / 100));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      agreedAmount: Number(agreedAmount),
      downPaymentPct: Number(downPaymentPct),
      downPaymentBTS,
      milestones: milestones.map((m, idx) => ({
        ...m,
        agreedAmount: Number(agreedAmount),
        downPaymentPct: Number(downPaymentPct),
      })),
    });
  };

  // ─── READ-ONLY: shared view (client waiting / locked) ──────────────────────
  if (isReadOnly) {
    return (
      <div className="space-y-5">
        {/* Financials summary */}
        <div className="bg-bts-gold/5 border border-bts-gold/30 rounded-2xl p-5 space-y-3">
          <p className="text-[9px] font-extrabold text-brand-dark uppercase tracking-widest">
            Agreed Financial Terms
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Original Budget</p>
              <p className="text-sm font-extrabold text-gray-400 line-through">◈ {missionBudget} BTS</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Agreed Total</p>
              <p className="text-base font-extrabold text-brand-dark">◈ {agreedAmount} BTS</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Down Payment (M1)</p>
              <p className="text-sm font-extrabold text-bts-gold">◈ {downPaymentBTS} BTS ({downPaymentPct}%)</p>
            </div>
          </div>
        </div>

        {/* Milestones list */}
        <div className="space-y-3">
          {milestones.map((m, i) => (
            <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-extrabold text-brand-dark">{m.title}</p>
                  {i === 0 && (
                    <span className="text-[9px] font-extrabold text-bts-gold bg-bts-gold/10 border border-bts-gold/20 rounded px-1.5 py-0.5">
                      Down Payment ◈ {downPaymentBTS} BTS on approval
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[10px] text-gray-500 font-semibold">{m.meetingDate}</span>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">{m.expectations}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-extrabold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Private demo call — calendar invite will be sent
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── CLIENT VIEW: review proposal before approving ─────────────────────────
  if (isCreator) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
          <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-amber-700 font-semibold">
            The freelancer has submitted their proposal. Review it below and approve or request changes.
          </p>
        </div>

        {/* Financials */}
        <div className="bg-bts-gold/5 border border-bts-gold/30 rounded-2xl p-5 space-y-3">
          <p className="text-[9px] font-extrabold text-brand-dark uppercase tracking-widest">Proposed Financial Terms</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[9px] text-gray-400 font-semibold uppercase mb-0.5">Your Posted Budget</p>
              <p className="text-sm font-extrabold text-gray-400 line-through">◈ {missionBudget} BTS</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 font-semibold uppercase mb-0.5">Proposed Total</p>
              <p className="text-base font-extrabold text-brand-dark">◈ {agreedAmount} BTS</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 font-semibold uppercase mb-0.5">Down Payment (M1)</p>
              <p className="text-sm font-extrabold text-bts-gold">◈ {downPaymentBTS} BTS ({downPaymentPct}%)</p>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="space-y-3">
          {milestones.map((m, i) => (
            <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-extrabold text-brand-dark">{m.title}</p>
                <div className="flex items-center gap-1.5 shrink-0">
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[10px] text-gray-500 font-semibold">{m.meetingDate}</span>
                </div>
              </div>
              {i === 0 && (
                <span className="text-[9px] font-extrabold text-bts-gold bg-bts-gold/10 border border-bts-gold/20 rounded px-1.5 py-0.5">
                  Down Payment ◈ {downPaymentBTS} BTS released after this milestone
                </span>
              )}
              <p className="text-[11px] text-gray-500 leading-relaxed">{m.expectations}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-extrabold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Private demo call — calendar invite will be sent
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── FREELANCER VIEW: fill in / edit the proposal ──────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Agreed amount */}
      <div className="bg-white border border-gray-150 rounded-2xl p-5 space-y-4">
        <div>
          <p className="text-[9px] font-extrabold text-brand-dark uppercase tracking-widest mb-1">
            Agreed Total Amount (BTS)
          </p>
          <p className="text-[10px] text-gray-400 mb-3">
            The originally posted budget was <span className="font-bold text-gray-500">◈ {missionBudget} BTS</span>.
            Enter the amount you and the client have agreed on after the alignment meeting.
          </p>
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-bts-gold font-extrabold text-sm">◈</span>
            <input
              type="number"
              min="1"
              value={agreedAmount}
              onChange={e => setAgreedAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-150 rounded-xl text-sm font-extrabold text-brand-dark focus:outline-none focus:border-bts-gold focus:bg-white transition-all"
              required
            />
          </div>
        </div>

        {/* Down payment % */}
        <div>
          <p className="text-[9px] font-extrabold text-brand-dark uppercase tracking-widest mb-1">
            Down Payment — Released After Milestone 1
          </p>
          <p className="text-[10px] text-gray-400 mb-3">
            This percentage will be unlocked from escrow once the client approves the first milestone demo. The rest stays locked until final handoff.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {DOWN_PCT_OPTIONS.map(pct => (
              <button
                type="button"
                key={pct}
                onClick={() => setDownPaymentPct(pct)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  downPaymentPct === pct
                    ? 'bg-brand-dark text-white border-brand-dark'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-brand-dark'
                }`}
              >
                {pct}% — ◈ {Math.round(agreedAmount * (pct / 100))} BTS
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest">Milestone Plan</p>
          <button
            type="button"
            onClick={add}
            className="text-xs font-bold text-bts-gold hover:text-brand-dark transition-colors"
          >
            + Add Milestone
          </button>
        </div>

        {milestones.map((m, i) => (
          <div key={i} className="bg-gray-50 border border-gray-150 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-dark text-white text-[9px] font-extrabold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="text-[9px] font-extrabold text-bts-gold bg-bts-gold/10 border border-bts-gold/20 rounded px-1.5 py-0.5 uppercase">
                  {i === 0 ? `Down Payment: ◈ ${downPaymentBTS} BTS (${downPaymentPct}%)` : 'Progress Demo'}
                </span>
              </div>
              {!m.fixed && (
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="text-gray-300 hover:text-rose-500 text-sm transition-colors"
                >
                  ×
                </button>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-[9px] font-extrabold text-gray-400 uppercase mb-1">Milestone Title</label>
              <input
                type="text"
                value={m.title}
                disabled={m.fixed}
                onChange={e => change(i, 'title', e.target.value)}
                placeholder="e.g. Milestone 2 — Core Features Demo"
                className="w-full px-3 py-2 bg-white border border-gray-150 rounded-xl text-xs text-brand-dark focus:outline-none focus:border-bts-gold transition-all disabled:text-gray-400"
                required
              />
            </div>

            {/* Expectations */}
            <div>
              <label className="block text-[9px] font-extrabold text-gray-400 uppercase mb-1">What you will show (Demo Expectations)</label>
              <textarea
                rows="2"
                value={m.expectations}
                onChange={e => change(i, 'expectations', e.target.value)}
                placeholder="Describe what you will demonstrate during the private progress call..."
                className="w-full px-3 py-2 bg-white border border-gray-150 rounded-xl text-xs text-brand-dark focus:outline-none focus:border-bts-gold transition-all resize-none"
                required
              />
            </div>

            {/* Meeting date */}
            <div>
              <label className="block text-[9px] font-extrabold text-gray-400 uppercase mb-1">
                Scheduled Demo Date
              </label>
              <input
                type="date"
                value={m.meetingDate}
                onChange={e => change(i, 'meetingDate', e.target.value)}
                className="px-3 py-2 bg-white border border-gray-150 rounded-xl text-xs text-brand-dark focus:outline-none focus:border-bts-gold transition-all"
                required
              />
            </div>

            {/* Calendar sync indicator */}
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-extrabold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Calendar invite will be auto-sent on client approval
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full py-3.5 bg-brand-dark text-white rounded-2xl text-xs font-extrabold hover:bg-bts-gold hover:text-brand-dark transition-all shadow-md"
      >
        Submit Proposal to Client →
      </button>
    </form>
  );
}
