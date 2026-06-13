import { useState } from 'react';

function statusLabel(status, isReleased, isFinal) {
  if (status === 'completed' && isReleased) return { text: 'Paid & Released', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  if (status === 'completed' && isFinal && !isReleased) return { text: '24h Payout Window', cls: 'bg-amber-50 text-amber-700 border-amber-200' };
  if (status === 'in_review') return { text: 'Awaiting Client Review', cls: 'bg-blue-50 text-blue-700 border-blue-200' };
  if (status === 'completed') return { text: 'Completed', cls: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
  return { text: 'Upcoming', cls: 'bg-gray-50 text-gray-400 border-gray-200' };
}

export default function MilestoneStepPanel({
  milestones,
  milestoneAmounts,
  milestoneStatus,
  milestoneReleased,
  milestoneDays,
  submissions,
  isCreator,
  isHired,
  onSubmitDeliverable,
  onApproveMilestone,
  onRequestRevision,
}) {
  const [forms, setForms] = useState({});
  const [submittingIdx, setSubmittingIdx] = useState(null);

  const activeIndex = milestoneStatus.findIndex(s => s !== 'completed');
  const currentIdx = activeIndex === -1 ? milestones.length - 1 : activeIndex;

  const getForm = (idx) => forms[idx] || { title: '', link: '', notes: '' };
  const setFormField = (idx, field, value) => {
    setForms(prev => ({ ...prev, [idx]: { ...getForm(idx), [field]: value } }));
  };

  const handleSubmit = (e, idx) => {
    e.preventDefault();
    const form = getForm(idx);
    if (!form.title.trim()) return;
    setSubmittingIdx(idx);
    onSubmitDeliverable(idx, form);
    setTimeout(() => {
      setSubmittingIdx(null);
      setForms(prev => ({ ...prev, [idx]: { title: '', link: '', notes: '' } }));
    }, 800);
  };

  const getSubmissionForMilestone = (idx) =>
    submissions.find(s => s.milestoneIndex === idx && s.status === 'pending');

  return (
    <div className="space-y-4">
      <p className="text-[11px] text-gray-500 font-semibold">
        Work proceeds <span className="font-extrabold text-brand-dark">one milestone at a time</span>.
        {isCreator
          ? ' Review each deliverable and release escrow funds before the next milestone unlocks.'
          : ' Submit the active milestone deliverable — the next one unlocks after client approval.'}
      </p>

      {milestones.map((title, idx) => {
        const status = milestoneStatus[idx] || 'pending';
        const isReleased = milestoneReleased[idx];
        const amount = milestoneAmounts[idx] || 0;
        const days = milestoneDays?.[idx];
        const isFinal = idx === milestones.length - 1;
        const isActive = idx === currentIdx;
        const isLocked = idx > currentIdx;
        const badge = statusLabel(status, isReleased, isFinal);
        const pendingSub = getSubmissionForMilestone(idx);
        const approvedSub = submissions.find(s => s.milestoneIndex === idx && s.status === 'approved');
        const canFreelancerSubmit = isHired && !isCreator && isActive && status === 'pending';
        const canClientReview = isCreator && status === 'in_review' && pendingSub;

        return (
          <div
            key={idx}
            className={`rounded-2xl border p-4 transition-all ${
              isActive
                ? 'border-bts-gold/40 bg-amber-50/30 ring-1 ring-bts-gold/20 shadow-sm'
                : isLocked
                ? 'border-gray-100 bg-gray-50/40 opacity-70'
                : 'border-gray-100 bg-white shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
                  status === 'completed' ? 'bg-emerald-500 text-white' :
                  isActive ? 'bg-brand-dark text-bts-gold' : 'bg-gray-200 text-gray-500'
                }`}>
                  {status === 'completed' ? '✓' : idx + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-brand-dark">{title}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[10px] text-bts-gold font-extrabold">◈ {amount.toLocaleString()} BTS</span>
                    {days && <span className="text-[10px] text-gray-400 font-bold">· {days} days target</span>}
                    {isActive && <span className="text-[9px] font-extrabold text-bts-gold uppercase tracking-wider">● Active Step</span>}
                  </div>
                </div>
              </div>
              <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full border shrink-0 ${badge.cls}`}>
                {badge.text}
              </span>
            </div>

            {/* Approved submission summary */}
            {approvedSub && (
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 mb-3 text-xs">
                <p className="font-extrabold text-emerald-800">✓ Approved: {approvedSub.title}</p>
                <p className="text-gray-500 font-semibold mt-0.5">Submitted by {approvedSub.submittedBy} · {approvedSub.date}</p>
              </div>
            )}

            {/* Pending submission — client review */}
            {pendingSub && (
              <div className="bg-white border border-blue-100 rounded-xl p-4 mb-3 space-y-3">
                <div>
                  <p className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">Deliverable Submitted</p>
                  <p className="text-sm font-extrabold text-brand-dark mt-0.5">{pendingSub.title}</p>
                  <p className="text-[11px] text-gray-500 font-semibold">By {pendingSub.submittedBy} · {pendingSub.date}</p>
                  {pendingSub.notes && <p className="text-xs text-gray-500 mt-2 italic">"{pendingSub.notes}"</p>}
                  {pendingSub.link && pendingSub.link !== '#' && (
                    <a href={pendingSub.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-brand-dark hover:text-bts-gold">
                      Open deliverable link →
                    </a>
                  )}
                </div>
                {canClientReview && (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => onApproveMilestone(idx, pendingSub.id)}
                      className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-sm"
                    >
                      Approve & Release ◈ {amount.toLocaleString()} BTS
                    </button>
                    <button
                      onClick={() => onRequestRevision(idx, pendingSub.id)}
                      className="px-4 py-2 bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 rounded-xl text-xs font-extrabold transition-all"
                    >
                      Request Revision
                    </button>
                  </div>
                )}
                {!isCreator && status === 'in_review' && (
                  <p className="text-[11px] text-blue-600 font-bold">Waiting for client to review this deliverable…</p>
                )}
              </div>
            )}

            {/* Freelancer submit form — active milestone only */}
            {canFreelancerSubmit && (
              <form onSubmit={e => handleSubmit(e, idx)} className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
                <p className="text-[10px] font-extrabold text-brand-dark uppercase tracking-wider">Submit Milestone {idx + 1} Deliverable</p>
                <input
                  type="text"
                  required
                  placeholder="Deliverable title (e.g. Audit Report v1)"
                  value={getForm(idx).title}
                  onChange={e => setFormField(idx, 'title', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-brand-dark outline-none focus:border-bts-gold"
                />
                <input
                  type="url"
                  placeholder="Repository / file link (optional)"
                  value={getForm(idx).link}
                  onChange={e => setFormField(idx, 'link', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-brand-dark outline-none focus:border-bts-gold"
                />
                <textarea
                  rows={2}
                  placeholder="Handoff notes for the client"
                  value={getForm(idx).notes}
                  onChange={e => setFormField(idx, 'notes', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-brand-dark outline-none focus:border-bts-gold resize-none"
                />
                <button
                  type="submit"
                  disabled={submittingIdx === idx}
                  className="w-full py-2.5 bg-brand-dark hover:bg-bts-gold hover:text-brand-dark text-white rounded-xl text-xs font-extrabold transition-all disabled:opacity-60"
                >
                  {submittingIdx === idx ? 'Submitting…' : `Submit Milestone ${idx + 1} for Review`}
                </button>
              </form>
            )}

            {isLocked && !isCreator && (
              <p className="text-[11px] text-gray-400 font-semibold italic">Unlocks after previous milestones are approved.</p>
            )}
            {isLocked && isCreator && status === 'pending' && (
              <p className="text-[11px] text-gray-400 font-semibold italic">Developer must complete prior milestones first.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
