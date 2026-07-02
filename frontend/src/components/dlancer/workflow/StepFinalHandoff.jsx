import { useState } from 'react';
import FileSubmissionForm from '../files/FileSubmissionForm';

export default function StepFinalHandoff({ mission, isCreator, isReadOnly, onUpdateWorkflow, onUpdateMission }) {
  const [submissions, setSubmissions] = useState(mission.submissions || []);
  const [approved, setApproved] = useState(mission.status === 'Completed');
  const [meetingScheduled, setMeetingScheduled] = useState(true);

  const handleSubmitDeliverable = (deliverable) => {
    const newSubmission = {
      id: `s-${Date.now()}`,
      title: deliverable.name || 'Deliverable Item',
      link: deliverable.url || '#',
      submittedBy: isCreator ? 'Client' : 'You',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      status: 'pending',
    };
    const updatedSubmissions = [...submissions, newSubmission];
    setSubmissions(updatedSubmissions);
    onUpdateMission?.({
      ...mission,
      submissions: updatedSubmissions,
      status: 'In Review',
    });
    alert('Handoff deliverables submitted successfully! Final Demonstration Meeting automatically scheduled.');
  };

  const handleApproveHandoff = () => {
    setApproved(true);
    onUpdateMission?.({
      ...mission,
      status: 'Completed',
      escrowReleasedAmount: mission.reward,
      milestoneReleased: new Array(mission.milestones?.length || 3).fill(true),
    });
    alert('Handoff approved! The remaining escrow funds have been released. A 24-hour dispute window has initiated.');
    onUpdateWorkflow?.();
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Configuration Column */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-extrabold text-brand-dark mb-2">Final Project Handoff</h3>
          <p className="text-xs text-gray-400 mb-6">
            Upload files or link externally hosted deliverables. The client will evaluate these items during the final demo call.
          </p>

          {!isCreator ? (
            <FileSubmissionForm
              onSubmit={handleSubmitDeliverable}
              isReadOnly={isReadOnly || approved}
            />
          ) : (
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-center text-xs text-gray-500 italic mb-6">
              Awaiting final deliverable uploads from the developer.
            </div>
          )}

          {submissions.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="text-xs font-extrabold text-brand-dark">Submitted Deliverables</h4>
              <div className="space-y-2">
                {submissions.map((sub) => (
                  <div key={sub.id} className="border border-gray-100 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-brand-dark">{sub.title}</p>
                      <a href={sub.link} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 hover:underline">
                        {sub.link}
                      </a>
                    </div>
                    <span className="text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full uppercase">
                      {sub.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Control Actions / Meeting status */}
      <div className="space-y-6">
        {meetingScheduled && (
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold text-brand-dark">Final Demo Call</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Auto-scheduled sync calendar invitation for reviewing the finalized handoff.
            </p>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
              <p className="text-xs font-extrabold text-brand-dark">Demo & Review Meeting</p>
              <p className="text-[10px] text-gray-400 mt-0.5">July 8, 2026 at 11:00 UTC</p>
            </div>
          </div>
        )}

        {isCreator && !approved && submissions.length === 0 && (
          <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold text-gray-400">Evaluation Panel</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed italic">
              Awaiting deliverables from the freelancer. Once uploaded, they will appear here for your review and approval.
            </p>
          </div>
        )}

        {isCreator && !approved && submissions.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold text-brand-dark">Evaluation Panel</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Approve deliverables after verification. This releases remaining locked funds.
            </p>
            <button
              onClick={handleApproveHandoff}
              className="w-full py-3 bg-brand-dark text-white rounded-xl text-xs font-extrabold hover:bg-bts-gold hover:text-brand-dark transition-all shadow-md"
            >
              Approve & Complete
            </button>
          </div>
        )}

        {!isCreator && !approved && submissions.length > 0 && (
          <div className="bg-white border border-emerald-100 rounded-3xl p-5 shadow-sm space-y-3 bg-emerald-50/20">
            <h4 className="text-xs font-extrabold text-emerald-800">Pending Approval</h4>
            <p className="text-[11px] text-emerald-600/80 leading-relaxed">
              Awaiting client approval. Once approved, the remaining budget is unlocked.
            </p>
          </div>
        )}

        {approved && (
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold text-emerald-600">Handoff Approved</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Escrow released. Dispute countdown initiated:
            </p>
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl p-3 text-center text-xs font-extrabold">
              23h 59m remaining
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
