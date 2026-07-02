import { useState } from 'react';
import MilestoneProgressCard from '../milestones/MilestoneProgressCard';

const MOCK_FREELANCER = {
  name: 'Diego F.',
  role: 'Lead Blockchain Engineer',
  rating: 5.0,
  reputation: 120,
  skills: ['Solidity', 'Rust', 'EVM', 'TypeScript'],
  portfolio: 'github.com/diego-dev',
  cv: {
    experience: [
      'Lead Blockchain Engineer at BitStack (2025-Present)',
      'Smart Contract Engineer at SolidityLab (2023-2025)'
    ],
    education: 'B.S. in Software Engineering, MIT',
    certifications: ['Certified Smart Contract Auditor', 'Advanced Rust Developer Certification'],
    summary: 'Expert systems developer with deep EVM protocol knowledge and secure contract deployment experience.'
  }
};

export default function StepActiveWork({ mission, isCreator, isReadOnly, onUpdateWorkflow, onUpdateMission }) {
  const [activeTab, setActiveTab] = useState('milestones');
  const [notes, setNotes] = useState('');
  const [showFreelancerCv, setShowFreelancerCv] = useState(false);
  
  const milestones = mission.milestones || ['Milestone 1: Project Initiation / Down Payment', 'Milestone 2: Beta Prototype Development', 'Milestone 3: Final Deployment Verification'];
  const milestoneAmounts = mission.milestoneAmounts || [
    Math.round(mission.reward * 0.1),
    Math.round(mission.reward * 0.4),
    Math.round(mission.reward * 0.5),
  ];
  const milestoneStatus = mission.milestoneStatus || ['completed', 'pending', 'pending'];

  const handleUpdateStatus = (index, newStatus) => {
    const updatedStatus = [...milestoneStatus];
    updatedStatus[index] = newStatus;

    let releasedAmount = mission.escrowReleasedAmount || 0;
    if (index === 0 && newStatus === 'completed' && isCreator) {
      const downPaymentVal = milestoneAmounts[0] || Math.round(mission.reward * 0.1);
      releasedAmount = downPaymentVal;
      alert(`First milestone completed! Down payment of ◈ ${downPaymentVal} BTS has been released to the freelancer.`);
    }

    onUpdateMission?.({
      ...mission,
      milestoneStatus: updatedStatus,
      escrowReleasedAmount: releasedAmount,
    });
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
      {/* Sidebar navigation & Partner Card */}
      <div className="lg:col-span-4 space-y-6">
        {/* Workspace Navigation */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-2">
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest px-2 mb-2">
            {isCreator ? 'Client Workspace' : 'Freelancer Workspace'}
          </p>
          {[
            { id: 'milestones', label: 'Milestones & Reviews', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2' },
            { id: 'messages', label: 'Discussion Thread', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
            { id: 'sessions', label: 'Private Sessions', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
            { id: 'notes', label: 'Scratchpad Notes', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all text-left ${
                activeTab === tab.id ? 'bg-brand-dark text-white' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}

          {!isReadOnly && (
            <div className="pt-4 mt-4 border-t border-gray-150">
              <button
                onClick={() => onUpdateWorkflow?.()}
                className="w-full py-2.5 bg-bts-gold text-brand-dark rounded-xl text-xs font-extrabold hover:bg-brand-dark hover:text-white transition-all shadow-sm"
              >
                Go to Handoff →
              </button>
            </div>
          )}
        </div>

        {/* Partner Details Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
            {isCreator ? 'Freelancer Contract Profile' : 'Client Profile'}
          </p>
          {isCreator ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-dark text-bts-gold flex items-center justify-center font-extrabold text-sm shrink-0">
                  DF
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-brand-dark">{MOCK_FREELANCER.name}</h4>
                  <p className="text-[10px] text-gray-400">{MOCK_FREELANCER.role}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {MOCK_FREELANCER.skills.slice(0, 3).map(skill => (
                  <span key={skill} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[9px] font-bold">
                    {skill}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowFreelancerCv(true)}
                className="w-full py-2 bg-bts-gold/10 text-brand-dark border border-bts-gold/20 rounded-xl text-[10px] font-extrabold hover:bg-bts-gold transition-all text-center"
              >
                📄 View Credentials & CV
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={mission.clientAvatar}
                  alt={mission.client}
                  className="w-10 h-10 rounded-full border border-gray-100 shrink-0"
                />
                <div>
                  <h4 className="text-xs font-extrabold text-brand-dark">{mission.client}</h4>
                  <p className="text-[10px] text-gray-400">Escrow Locked Verified</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-55">
                <div>
                  <p className="text-[9px] text-gray-400">Total Budget</p>
                  <p className="text-xs font-extrabold text-brand-dark">◈ {mission.reward?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400">Escrow Released</p>
                  <p className="text-xs font-extrabold text-emerald-600">◈ {mission.escrowReleasedAmount || 0}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="lg:col-span-8 space-y-6">
        {activeTab === 'milestones' && (
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-base font-extrabold text-brand-dark">Milestones & Calendar Reviews</h3>
                <p className="text-xs text-gray-400">
                  Every milestone is reviewed via a private progress demo session synced with the Calendar. No file uploads or individual milestone payouts are performed here; remaining budget is released upon final handoff approval.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {milestones.map((title, index) => (
                <MilestoneProgressCard
                  key={index}
                  title={title}
                  amount={milestoneAmounts[index]}
                  status={milestoneStatus[index]}
                  index={index}
                  isCreator={isCreator}
                  isReadOnly={isReadOnly}
                  onUpdateStatus={handleUpdateStatus}
                  expectations={mission.milestones[index]?.expectations || mission.milestones[index]}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm h-[400px] flex flex-col justify-between">
            <div>
              <h3 className="text-base font-extrabold text-brand-dark mb-1">Secure Discussion</h3>
              <p className="text-xs text-gray-400">Directly synchronized with Messages module.</p>
            </div>
            
            <div className="flex-1 overflow-y-auto my-4 space-y-3 bg-gray-50 rounded-2xl p-4 flex flex-col justify-end">
              <div className="bg-white border border-gray-100 rounded-xl p-3 max-w-sm self-start shadow-sm">
                <p className="text-[10px] text-gray-400 font-extrabold">Client</p>
                <p className="text-xs text-brand-dark mt-0.5">Let me know when the first milestone is ready for a call.</p>
              </div>
              <div className="bg-brand-dark text-white rounded-xl p-3 max-w-sm self-end shadow-sm">
                <p className="text-[10px] text-bts-gold font-extrabold">You</p>
                <p className="text-xs mt-0.5">Working on the security specs, will book a review session tomorrow.</p>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Send a secure message..."
                disabled={isReadOnly}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl text-xs text-brand-dark focus:outline-none focus:border-bts-gold focus:bg-white transition-all pr-12"
              />
              <button
                disabled={isReadOnly}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-brand-dark text-white flex items-center justify-center hover:bg-bts-gold hover:text-brand-dark transition-all disabled:opacity-50"
              >
                ➔
              </button>
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-brand-dark">Private Sessions</h3>
              <p className="text-xs text-gray-400">Conduct your progress review and demo sessions via private calls.</p>
            </div>

            <div className="border border-gray-100 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-extrabold text-brand-dark">Bi-Weekly Sync Call</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">July 3, 2026 at 15:00 UTC</p>
              </div>
              <button className="px-4 py-2 bg-brand-dark text-white rounded-xl text-xs font-bold hover:bg-bts-gold hover:text-brand-dark transition-all shadow-sm">
                Join Call
              </button>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-brand-dark">Shared Scratchpad</h3>
              <p className="text-xs text-gray-400">Jot down temporary notes, specs, or action lists here.</p>
            </div>
            <textarea
              rows="8"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              disabled={isReadOnly}
              placeholder="Start writing notes shared with the other party..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl text-xs text-brand-dark focus:outline-none focus:border-bts-gold focus:bg-white transition-all resize-none"
            />
          </div>
        )}
      </div>

      {/* Freelancer CV Modal (Client Perspective) */}
      {showFreelancerCv && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto space-y-5 relative">
            <button
              onClick={() => setShowFreelancerCv(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-brand-dark text-lg font-bold"
            >
              ×
            </button>

            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-bts-gold bg-brand-dark px-2 py-0.5 rounded">
                Developer Credentials
              </span>
              <h3 className="text-lg font-extrabold text-brand-dark mt-2">{MOCK_FREELANCER.name}</h3>
              <p className="text-xs text-gray-400">{MOCK_FREELANCER.role}</p>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Professional Summary</h4>
                <p className="text-xs text-gray-600 leading-relaxed mt-1 font-medium">
                  {MOCK_FREELANCER.cv.summary}
                </p>
              </div>

              <div>
                <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Experience</h4>
                <ul className="list-disc list-inside text-xs text-gray-600 space-y-1.5 mt-1">
                  {MOCK_FREELANCER.cv.experience.map((exp, idx) => (
                    <li key={idx} className="font-medium">{exp}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Education</h4>
                  <p className="text-xs text-gray-600 mt-1 font-semibold">
                    {MOCK_FREELANCER.cv.education}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Rating & Stats</h4>
                  <p className="text-xs text-brand-dark mt-1 font-semibold">
                    {MOCK_FREELANCER.rating} ★ Rating · {MOCK_FREELANCER.reputation} REP
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Certifications</h4>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {MOCK_FREELANCER.cv.certifications.map(cert => (
                    <span key={cert} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-extrabold">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-50">
              <button
                onClick={() => setShowFreelancerCv(false)}
                className="w-full py-2.5 bg-brand-dark text-white rounded-xl text-xs font-bold hover:bg-bts-gold hover:text-brand-dark transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
