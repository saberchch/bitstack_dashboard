import { useState } from 'react';

const MOCK_CANDIDATES = [
  {
    id: 'c1',
    name: 'Alex R.',
    role: 'Solidity Auditor',
    rating: 4.8,
    reputation: 98,
    availability: 'Immediate',
    skills: ['Web3', 'Security', 'Solidity'],
    portfolio: 'github.com/alex-r-audits',
    previousWork: 'Audited DeFi Nexus vaults and Liquity fork.',
    cv: {
      experience: [
        'Lead Solidity Auditor at BlockSec (2024-Present)',
        'Smart Contract Engineer at DeFi Vaults (2022-2024)'
      ],
      education: 'B.S. in Computer Science, Stanford University',
      certifications: ['ConsenSys Certified Blockchain Developer', 'Certified Information Systems Auditor (CISA)'],
      summary: 'Focused on protocol security, gas optimization, and logic audits. Shipped over 20+ smart contract audits with zero post-release exploits.'
    }
  },
  {
    id: 'c2',
    name: 'Maria K.',
    role: 'Security Researcher',
    rating: 4.9,
    reputation: 104,
    availability: 'Next week',
    skills: ['Security', 'Rust', 'EVM'],
    portfolio: 'mariak.security.io',
    previousWork: 'Identified critical bug in Curve pool.',
    cv: {
      experience: [
        'Independent Security Researcher (2023-Present)',
        'Systems Architect at RustLabs (2021-2023)'
      ],
      education: 'M.S. in Cybersecurity, ETH Zürich',
      certifications: ['Certified Rust Professional', 'Offensive Security Certified Professional (OSCP)'],
      summary: 'Specialized in system-level checks, zero-knowledge proofs verification, and EVM network protocol layers.'
    }
  }
];

export default function StepConnection({ mission, isCreator, isReadOnly, onUpdateWorkflow }) {
  const [meetingScheduled, setMeetingScheduled] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeTab, setActiveTab] = useState('candidates');

  const handleSchedule = () => {
    setMeetingScheduled(true);
    alert('Meeting scheduled! Invitation sent and sync\'d with Calendar.');
  };

  const handleAccept = (candidate) => {
    alert(`Accepted ${candidate.name} for Alignment! Transitioning workflow step.`);
    onUpdateWorkflow?.();
  };

  if (!isCreator) {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm max-w-3xl mx-auto space-y-6">
        <h3 className="text-lg font-extrabold text-brand-dark">Connection Pending</h3>
        <p className="text-xs text-gray-400">
          The client is reviewing interested candidates. If they accept you for discussion, a secure messaging channel and meeting schedule will be established.
        </p>

        <div className="border border-yellow-100 bg-yellow-50/50 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-extrabold text-xs">
              !
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-brand-dark">Status Check</h4>
              <p className="text-[11px] text-gray-500">Waiting for client actions</p>
            </div>
          </div>
          <div className="text-[11px] text-gray-500 leading-relaxed pl-11">
            Once connected, you will gain access to direct messages and private scheduling integrations.
          </div>
        </div>

        {/* Action shortcut to simulate next phase for user convenience */}
        {!isReadOnly && (
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => onUpdateWorkflow?.()}
              className="px-5 py-2.5 bg-brand-dark text-white rounded-xl text-xs font-bold hover:bg-bts-gold hover:text-brand-dark transition-all"
            >
              Demo: Proceed to Alignment Step
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b border-gray-50 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-brand-dark">Evaluate Candidates</h3>
          <p className="text-xs text-gray-400">Review profiles, credentials, CVs, schedule calls, and initiate alignment.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${activeTab === 'candidates' ? 'bg-brand-dark text-white' : 'text-gray-400 hover:text-brand-dark'}`}
          >
            Candidates
          </button>
          <button
            onClick={() => setActiveTab('meetings')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${activeTab === 'meetings' ? 'bg-brand-dark text-white' : 'text-gray-400 hover:text-brand-dark'}`}
          >
            Calendar & Chat
          </button>
        </div>
      </div>

      {activeTab === 'candidates' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_CANDIDATES.map(candidate => (
            <div key={candidate.id} className="border border-gray-100 rounded-2xl p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-sm font-extrabold text-brand-dark">{candidate.name}</h4>
                    <p className="text-[11px] text-gray-400">{candidate.role}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-extrabold text-bts-gold">{candidate.rating} ★</span>
                    <p className="text-[9px] text-gray-400 font-bold">{candidate.reputation} REP</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {candidate.skills.map(s => (
                    <span key={s} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[9px] font-bold">{s}</span>
                  ))}
                </div>

                <p className="text-[11px] text-gray-500 leading-relaxed mb-1">
                  <span className="font-extrabold">Portfolio:</span> {candidate.portfolio}
                </p>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  <span className="font-extrabold">Previous Work:</span> {candidate.previousWork}
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-3 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => setSelectedCandidate(candidate)}
                  className="w-full py-2 bg-bts-gold/10 text-brand-dark border border-bts-gold/20 rounded-xl text-[11px] font-extrabold hover:bg-bts-gold hover:text-brand-dark transition-all text-center"
                >
                  📄 View Profile & CV Credentials
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={handleSchedule}
                    disabled={isReadOnly}
                    className="flex-1 py-2 border border-gray-200 text-brand-dark rounded-xl text-[11px] font-extrabold hover:border-brand-dark transition-all"
                  >
                    Schedule Meet
                  </button>
                  <button
                    onClick={() => handleAccept(candidate)}
                    disabled={isReadOnly}
                    className="flex-1 py-2 bg-brand-dark text-white rounded-xl text-[11px] font-extrabold hover:bg-bts-gold hover:text-brand-dark transition-all"
                  >
                    Accept & Connect
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-gray-100 rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-extrabold text-brand-dark">Calendar & Discussions</h4>
          <p className="text-xs text-gray-400">Secure message thread and calendar sync are automated once interest is expressed.</p>
          <div className="bg-gray-50 rounded-xl p-4 text-center text-xs text-gray-400">
            {meetingScheduled ? 'Meeting Scheduled on July 2, 2026, at 14:00 UTC' : 'No calls scheduled yet.'}
          </div>
        </div>
      )}

      {/* Candidate Profile / CV Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto space-y-5 relative">
            <button
              onClick={() => setSelectedCandidate(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-brand-dark text-lg font-bold"
            >
              ×
            </button>

            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-bts-gold bg-brand-dark px-2 py-0.5 rounded">
                Candidate Profile
              </span>
              <h3 className="text-lg font-extrabold text-brand-dark mt-2">{selectedCandidate.name}</h3>
              <p className="text-xs text-gray-400">{selectedCandidate.role} · {selectedCandidate.availability}</p>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Professional Summary</h4>
                <p className="text-xs text-gray-600 leading-relaxed mt-1 font-medium">
                  {selectedCandidate.cv.summary}
                </p>
              </div>

              <div>
                <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Experience</h4>
                <ul className="list-disc list-inside text-xs text-gray-600 space-y-1.5 mt-1">
                  {selectedCandidate.cv.experience.map((exp, idx) => (
                    <li key={idx} className="font-medium">{exp}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Education</h4>
                  <p className="text-xs text-gray-600 mt-1 font-semibold">
                    {selectedCandidate.cv.education}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Ratings & Stats</h4>
                  <p className="text-xs text-brand-dark mt-1 font-semibold">
                    {selectedCandidate.rating} ★ Rating · {selectedCandidate.reputation} REP
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Certifications</h4>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedCandidate.cv.certifications.map(cert => (
                    <span key={cert} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-extrabold">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-50">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:border-brand-dark transition-all"
              >
                Close Profile
              </button>
              <button
                onClick={() => {
                  handleAccept(selectedCandidate);
                  setSelectedCandidate(null);
                }}
                className="flex-1 py-2.5 bg-brand-dark text-white rounded-xl text-xs font-bold hover:bg-bts-gold hover:text-brand-dark transition-all"
              >
                Accept Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
