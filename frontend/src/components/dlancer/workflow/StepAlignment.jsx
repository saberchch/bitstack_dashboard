import { useState } from 'react';
import MilestoneDefinitionForm from '../milestones/MilestoneDefinitionForm';

/**
 * Alignment Step — two-party workflow:
 *
 *  Freelancer side:
 *    - Fills in agreed total, down payment %, milestones (title, expectations, meeting date)
 *    - Submits proposal → locked from editing
 *    - Can recall/edit BEFORE the client approves
 *
 *  Client side:
 *    - Sees the proposal in read-only
 *    - Can Approve (locks escrow + advances to Active Work) or Request Changes
 *
 * State stored in mission:
 *   alignmentProposal      — the submitted proposal object (or null)
 *   alignmentApproved      — bool
 *   alignmentChangeRequest — string message (if client asks for changes)
 */
export default function StepAlignment({ mission, isCreator, isReadOnly, onUpdateWorkflow, onUpdateMission }) {
  const [changeNote, setChangeNote] = useState('');
  const [requestingChange, setRequestingChange] = useState(false);

  const proposal = mission?.alignmentProposal || null;
  const approved = mission?.alignmentApproved || false;
  const changeRequest = mission?.alignmentChangeRequest || null;

  // ── Freelancer submits a proposal ──────────────────────────────────────────
  const handleSubmitProposal = (proposal) => {
    const updated = {
      ...mission,
      alignmentProposal: proposal,
      alignmentApproved: false,
      alignmentChangeRequest: null,
      // Pre-populate milestones data from proposal so rest of app can read it
      milestones: proposal.milestones.map(m => m.title),
      milestoneStatus: proposal.milestones.map(() => 'pending'),
      milestoneReleased: proposal.milestones.map(() => false),
      milestoneDates: proposal.milestones.map(m => m.meetingDate),
      milestoneExpectations: proposal.milestones.map(m => m.expectations),
      downPaymentPct: proposal.downPaymentPct,
      downPaymentBTS: proposal.downPaymentBTS,
      // The agreed amount becomes the authoritative project value
      reward: proposal.agreedAmount,
    };
    onUpdateMission?.(updated);
  };

  // ── Freelancer recalls (edits) proposal before approval ───────────────────
  const handleRecallProposal = () => {
    onUpdateMission?.({ ...mission, alignmentProposal: null, alignmentApproved: false });
  };

  // ── Client approves → lock escrow + advance ────────────────────────────────
  const handleApprove = () => {
    const updated = {
      ...mission,
      alignmentApproved: true,
      alignmentChangeRequest: null,
      escrowLocked: true,
      escrowReleasedAmount: 0,
    };
    onUpdateMission?.(updated);
    setTimeout(() => onUpdateWorkflow?.(), 400);
  };

  // ── Client requests changes ────────────────────────────────────────────────
  const handleRequestChange = () => {
    if (!changeNote.trim()) return;
    const updated = {
      ...mission,
      alignmentProposal: null,       // clear proposal so freelancer can resubmit
      alignmentApproved: false,
      alignmentChangeRequest: changeNote.trim(),
    };
    onUpdateMission?.(updated);
    setChangeNote('');
    setRequestingChange(false);
  };

  // ─────────────────────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

      {/* ── Left: main form/proposal column ── */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">

          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-extrabold text-brand-dark">Milestone Agreement</h3>
            {!isCreator && proposal && !approved && (
              <button
                onClick={handleRecallProposal}
                className="text-xs font-bold text-rose-500 hover:text-rose-700 border border-rose-200 hover:border-rose-400 px-3 py-1.5 rounded-xl transition-all"
              >
                ✏️ Edit Proposal
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400 mb-6">
            {isCreator
              ? proposal
                ? 'The freelancer has submitted their alignment proposal. Review and approve or request changes.'
                : 'Waiting for the freelancer to submit the alignment proposal.'
              : proposal
                ? 'Your proposal has been submitted and is awaiting client approval.'
                : 'Define the agreed terms: total amount, down payment, milestones, and scheduled demo dates.'
            }
          </p>

          {/* Change request banner (shown to freelancer after client asks for changes) */}
          {!isCreator && changeRequest && !proposal && (
            <div className="mb-5 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
              <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-xs font-extrabold text-amber-700">Client requested changes</p>
                <p className="text-xs text-amber-600 mt-0.5 italic">"{changeRequest}"</p>
              </div>
            </div>
          )}

          {/* No proposal yet — show who should act */}
          {!proposal && isCreator && (
            <div className="flex flex-col items-center justify-center py-12 gap-3 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl">⏳</div>
              <p className="text-xs font-extrabold text-gray-500">Waiting for freelancer's proposal</p>
              <p className="text-[10px] text-gray-300 text-center max-w-xs">
                The freelancer will define the agreed amount, milestones, and meeting dates.
                You'll be notified when they submit.
              </p>
            </div>
          )}

          {/* Freelancer fills in / edits proposal */}
          {!proposal && !isCreator && (
            <MilestoneDefinitionForm
              initialMilestones={mission?.milestones && mission.milestones.length > 0 ? mission.milestones.map((t, i) => ({
                title: t,
                expectations: mission.milestoneExpectations?.[i] || '',
                meetingDate: mission.milestoneDates?.[i] || '',
                downPaymentPct: mission.downPaymentPct,
                agreedAmount: mission.reward,
              })) : []}
              missionBudget={mission?.reward || 0}
              isCreator={false}
              isReadOnly={false}
              onSave={handleSubmitProposal}
            />
          )}

          {/* Proposal submitted — read-only view */}
          {proposal && (
            <MilestoneDefinitionForm
              initialMilestones={proposal.milestones}
              missionBudget={mission?.reward || 0}
              isCreator={isCreator}
              isReadOnly={true}
              onSave={() => {}}
            />
          )}
        </div>
      </div>

      {/* ── Right: status / action column ── */}
      <div className="space-y-5">

        {/* Escrow status card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-brand-dark">Escrow Status</h3>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${
            approved ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${approved ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
            {approved ? '🔒 Funds Locked in Escrow' : 'Pending approval — not yet locked'}
          </div>

          {approved && (
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Total Locked</span>
                <span className="font-extrabold text-brand-dark">◈ {mission?.reward} BTS</span>
              </div>
              <div className="flex justify-between">
                <span>Down Payment (M1)</span>
                <span className="font-extrabold text-bts-gold">◈ {mission?.downPaymentBTS} BTS</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining (Final)</span>
                <span className="font-extrabold text-brand-dark">
                  ◈ {(mission?.reward || 0) - (mission?.downPaymentBTS || 0)} BTS
                </span>
              </div>
            </div>
          )}

          {!approved && proposal && (
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Escrow will lock <strong className="text-brand-dark">◈ {proposal.agreedAmount} BTS</strong> automatically
              once the client approves this proposal.
            </p>
          )}
        </div>

        {/* Client approval actions */}
        {isCreator && proposal && !approved && !isReadOnly && (
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold text-brand-dark">Client Review</h4>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Once you approve, the agreed amount will be locked into escrow and the project moves to Active Work. This action is final.
            </p>

            <button
              onClick={handleApprove}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-extrabold hover:bg-emerald-700 transition-all shadow-sm"
            >
              ✅ Approve & Lock Escrow
            </button>

            {!requestingChange ? (
              <button
                onClick={() => setRequestingChange(true)}
                className="w-full py-2.5 border border-amber-300 text-amber-600 rounded-xl text-xs font-bold hover:bg-amber-50 transition-all"
              >
                🔁 Request Changes
              </button>
            ) : (
              <div className="space-y-2">
                <textarea
                  rows="3"
                  value={changeNote}
                  onChange={e => setChangeNote(e.target.value)}
                  placeholder="Explain what needs to be revised..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-xl text-xs text-brand-dark focus:outline-none focus:border-bts-gold transition-all resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleRequestChange}
                    className="flex-1 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-all"
                  >
                    Send Feedback
                  </button>
                  <button
                    onClick={() => setRequestingChange(false)}
                    className="px-3 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs hover:border-brand-dark transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Approved + advance button (client sees) */}
        {approved && !isReadOnly && (
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold text-brand-dark">Ready to Proceed</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Proposal approved and escrow locked. Active work can now begin.
            </p>
            <button
              onClick={() => onUpdateWorkflow?.()}
              className="w-full py-3 bg-brand-dark text-white rounded-xl text-xs font-extrabold hover:bg-bts-gold hover:text-brand-dark transition-all"
            >
              Start Active Work →
            </button>
          </div>
        )}

        {/* Freelancer: waiting for approval */}
        {!isCreator && proposal && !approved && (
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h4 className="text-xs font-extrabold text-brand-dark">Awaiting Client Approval</h4>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Your proposal is under review. Once the client approves, escrow will be locked and work begins.
              You can still recall and edit the proposal until they approve.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
