import { useState, useEffect } from 'react';
import { addProposalConvo, addDisputeConvo } from '../utils/messagesStorage';
import PrivateSessionSchedulerModal from './PrivateSessionSchedulerModal';
import EscrowStatusCard from './EscrowStatusCard';
import MilestoneAllocationEditor from './MilestoneAllocationEditor';
import MissionWorkflowProgress from './MissionWorkflowProgress';
import MilestoneStepPanel from './MilestoneStepPanel';
import { getWorkflowState, getNextAction } from '../utils/missionWorkflow';
import ReviewSection from './ReviewSection';
import { REVIEW_ENTITY_TYPES } from '../utils/reviewsStorage';


const STATUS_COLOR = {
  Open: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  'In Progress': 'text-blue-700 bg-blue-50 border-blue-200',
  'In Review': 'text-amber-700 bg-amber-50 border-amber-200',
  Completed: 'text-gray-500 bg-gray-100 border-gray-200',
};

const TAG_COLOR = {
  Web3: 'bg-brand-dark text-white', Security: 'bg-rose-600 text-white',
  Solidity: 'bg-purple-600 text-white', Rust: 'bg-orange-500 text-white',
  'AI/ML': 'bg-indigo-600 text-white', 'UI/UX': 'bg-pink-500 text-white',
  Python: 'bg-blue-600 text-white', React: 'bg-cyan-500 text-white',
  DeFi: 'bg-bts-gold text-brand-dark', Strategy: 'bg-emerald-600 text-white',
  Blockchain: 'bg-brand-dark text-bts-gold', Networking: 'bg-slate-600 text-white',
  Automation: 'bg-teal-600 text-white', Economics: 'bg-yellow-600 text-white',
  GameFi: 'bg-violet-600 text-white',
};

const tagClass = (t) => TAG_COLOR[t] || 'bg-gray-200 text-gray-700';

const FREELANCER_TABS = [
  { key: 'details', label: 'Overview', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0' },
  { key: 'milestones', label: 'Milestones & Payouts', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { key: 'submissions', label: 'Submit Work', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
  { key: 'negotiate', label: 'Negotiate Bid', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { key: 'messages', label: 'Discussion chat', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { key: 'reviews', label: 'Client Feedback', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  { key: 'dispute', label: 'File Dispute', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
];

const CREATOR_TABS = [
  { key: 'details', label: 'Overview', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0' },
  { key: 'proposals', label: 'Proposals Feed', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', badge: 'proposals' },
  { key: 'team', label: 'Team Developers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { key: 'submissions', label: 'Handoff Artifacts', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12', badge: 'submissions' },
  { key: 'messages', label: 'Developer chat', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { key: 'reviews', label: 'Leave Feedback', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  { key: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { key: 'dispute', label: 'File Dispute', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
];

const DEFAULT_MESSAGES_FREELANCER = [
  { from: 'client', name: 'DeFi Nexus Support', text: 'Hi! We are excited to have skilled applicants. Can you share your portfolio?', time: '3d ago' },
  { from: 'you', name: 'You (Freelancer)', text: 'Of course! Here is my GitHub with relevant projects. Looking forward to this.', time: '3d ago' },
  { from: 'client', name: 'DeFi Nexus Support', text: 'Great, we will review and get back to you soon.', time: '2d ago' },
];

const DEFAULT_MESSAGES_CREATOR = [
  { from: 'applicant', name: 'Alex R. (Auditor)', text: 'Hi, I am very interested in this mission. I have 3 years of Solidity auditing experience.', time: '2d ago' },
  { from: 'you', name: 'You (Client)', text: 'Thanks Alex! Could you share your previous audit reports?', time: '2d ago' },
  { from: 'applicant', name: 'Alex R. (Auditor)', text: 'Sure, here are links to my last 3 audit reports on GitHub.', time: '1d ago' },
];

export default function MissionWorkspace({
  mission,
  role = 'freelancer',
  isApplied,
  isApplying,
  isBookmarked,
  onApply,
  onBookmark,
  onBack,
  onUpdateMission,
}) {
  const isCreator = role === 'creator';
  const tabs = isCreator ? CREATOR_TABS : FREELANCER_TABS;
  const [activeTab, setActiveTab] = useState('details');

  // Input fields for forms
  const [messageText, setMessageText] = useState('');
  const [negotiateAmount, setNegotiateAmount] = useState('');
  const [negotiateNote, setNegotiateNote] = useState('');
  const [offerSent, setOfferSent] = useState(false);

  // Proposal Submission Form states (freelancer applying)
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [proposalForm, setProposalForm] = useState({
    bid: mission.reward || '',
    roleTitle: '',
    coverNote: '',
  });
  const [proposalFormSubmitted, setProposalFormSubmitted] = useState(false);

  // Dispute Form states
  const [disputeForm, setDisputeForm] = useState({
    disputeType: 'payment',
    amount: mission.reward || '',
    priority: 'medium',
    description: '',
  });
  const [disputeFormSubmitted, setDisputeFormSubmitted] = useState(false);
  const [showDisputeSuccess, setShowDisputeSuccess] = useState(false);

  // Deliverable Submission Form states (freelancer hired submitting work)
  const [deliverableForm, setDeliverableForm] = useState({
    title: '',
    link: '',
    notes: '',
  });
  const [deliverableSubmitted, setDeliverableSubmitted] = useState(false);

  // Read data attributes from the mission model
  const proposals = mission.proposals || [];
  const submissions = mission.submissions || [];
  const missionStatus = mission.status || 'Open';
  const messages = mission.messages || (isCreator ? DEFAULT_MESSAGES_CREATOR : DEFAULT_MESSAGES_FREELANCER);
  
  // Milestones only exist after alignment + escrow lock
  const escrowLocked = !!mission.escrowLocked;
  const milestones = escrowLocked ? (mission.milestones || []) : [];
  const milestonesDefined = escrowLocked && milestones.length > 0;
  const milestoneAmounts = milestonesDefined
    ? (mission.milestoneAmounts || milestones.map(() => Math.round((mission.reward || 0) / milestones.length)))
    : [];
  const milestoneStatus = milestonesDefined
    ? (mission.milestoneStatus || milestones.map(() => 'pending'))
    : [];
  const milestoneReleased = milestonesDefined
    ? (mission.milestoneReleased || milestones.map(() => false))
    : [];
  const milestoneDays = milestonesDefined ? (mission.milestoneDays || []) : [];
  const escrowReleasedAmount = mission.escrowReleasedAmount || 0;
  const disputeActive = mission.disputeActive || false;
  const finalMilestoneUploadedAt = mission.finalMilestoneUploadedAt || null;

  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState(0);
  const [schedulerProposalId, setSchedulerProposalId] = useState(null);
  const [milestoneConfigProposalId, setMilestoneConfigProposalId] = useState(null);

  const pendingProposals = proposals.filter(p => p.status === 'pending' || p.status === 'scheduled').length;
  const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;

  // Check if I have an active proposal or if I am hired
  const myProposal = proposals.find(p => p.name === 'You');
  const myProposalStatus = myProposal ? myProposal.status : null; // 'pending' | 'accepted' | 'rejected'
  const isHired = myProposalStatus === 'accepted';

  const isFull = (mission.appliedCount || 0) >= mission.teamSize && !isHired;

  const hasHired = proposals.some(p => p.status === 'accepted');
  const hasScheduled = proposals.some(p => p.status === 'scheduled');
  const hasActiveContract = isCreator ? hasHired : isHired;
  const hiredProposal = proposals.find(p => p.status === 'accepted');
  const activeFreelancer = mission.activeContract || (hiredProposal ? {
    name: hiredProposal.name,
    role: hiredProposal.role,
    bid: hiredProposal.bid,
  } : null);

  const workflow = getWorkflowState({
    mission,
    isCreator,
    myProposal,
    isHired,
    escrowLocked,
    milestonesDefined,
    milestoneConfigOpen: !!milestoneConfigProposalId,
  });

  const nextAction = getNextAction({
    workflow,
    isCreator,
    myProposalStatus,
    hasPending: proposals.some(p => p.status === 'pending'),
    hasScheduled,
    escrowLocked,
  });

  const filteredTabs = tabs.filter(tab => {
    if (tab.key === 'dispute') return hasActiveContract;
    if (tab.key === 'milestones') return milestonesDefined;
    if (tab.key === 'submissions') return isCreator ? milestonesDefined : isHired;
    if (tab.key === 'team') return hasHired;
    if (tab.key === 'negotiate') return !isCreator && !myProposalStatus;
    if (tab.key === 'messages') return isCreator ? proposals.length > 0 : !!myProposalStatus;
    if (tab.key === 'proposals') return isCreator;
    if (tab.key === 'reviews') {
      if (isCreator) return missionStatus === 'Completed';
      return isHired;
    }
    if (tab.key === 'settings') return isCreator && missionStatus === 'Open';
    return true;
  });

  // Reset tabs/forms when mission ID updates
  useEffect(() => {
    setActiveTab('details');
    setShowApplyForm(false);
    setProposalFormSubmitted(false);
    setDeliverableSubmitted(false);
    setDisputeFormSubmitted(false);
    setShowDisputeSuccess(false);
    setDisputeForm({
      disputeType: 'payment',
      amount: mission.reward || '',
      priority: 'medium',
      description: '',
    });
    setProposalForm({
      bid: mission.reward || '',
      roleTitle: '',
      coverNote: '',
    });
    setDeliverableForm({
      title: '',
      link: '',
      notes: '',
    });
    setSelectedMilestoneIndex(0);
    setSchedulerProposalId(null);
    setMilestoneConfigProposalId(null);
  }, [mission.id, mission.milestoneAmounts, milestones.length]);

  const sendMessage = () => {
    if (!messageText.trim()) return;
    const newMsg = {
      from: 'you',
      name: isCreator ? 'You (Client)' : 'You (Freelancer)',
      text: messageText.trim(),
      time: 'Just now'
    };
    onUpdateMission({
      ...mission,
      messages: [...messages, newMsg]
    });
    setMessageText('');
  };

  const submitProposal = (e) => {
    e.preventDefault();
    if (!proposalForm.bid || isNaN(Number(proposalForm.bid))) return;
    setProposalFormSubmitted(true);

    setTimeout(() => {
      const newProposal = {
        id: `prop-${Date.now()}`,
        name: 'You',
        role: proposalForm.roleTitle || 'Blockchain Engineer',
        bid: Number(proposalForm.bid),
        rating: 5.0,
        coverLetter: proposalForm.coverNote || 'No description provided.',
        status: 'pending',
      };
      
      // Spawn a new Proposals message thread in storage
      addProposalConvo({
        clientName: mission.client,
        clientAvatar: mission.clientAvatar,
        missionName: mission.title,
        bid: `${proposalForm.bid} BTS`,
        timeline: `${mission.deadline} days`,
        message: proposalForm.coverNote || `Hi ${mission.client}, I am submitting a proposal for the "${mission.title}" mission.`
      });

      onApply(mission.id); // Triggers parent's bookmarking/application logic
      onUpdateMission({
        ...mission,
        proposals: [...proposals, newProposal],
      });
      setShowApplyForm(false);
      setProposalFormSubmitted(false);
    }, 800);
  };

  const submitDeliverableForMilestone = (milestoneIndex, form) => {
    if (!form.title?.trim()) return;

    const newSubmission = {
      id: `sub-${Date.now()}`,
      title: form.title.trim(),
      link: form.link?.trim() || '#',
      notes: form.notes?.trim() || 'No notes left.',
      submittedBy: 'You',
      date: 'Just now',
      status: 'pending',
      milestoneIndex,
    };

    const newMilestoneStatus = [...milestoneStatus];
    newMilestoneStatus[milestoneIndex] = 'in_review';

    let finalUploadedAt = mission.finalMilestoneUploadedAt;
    let newStatus = mission.status;
    if (milestoneIndex === milestones.length - 1) {
      finalUploadedAt = new Date().toISOString();
      newStatus = 'In Review';
    }

    onUpdateMission({
      ...mission,
      submissions: [...submissions, newSubmission],
      milestoneStatus: newMilestoneStatus,
      finalMilestoneUploadedAt: finalUploadedAt,
      status: newStatus,
    });
  };

  const submitDeliverable = (e) => {
    e.preventDefault();
    if (!deliverableForm.title.trim()) return;
    setDeliverableSubmitted(true);

    setTimeout(() => {
      const newSubmission = {
        id: `sub-${Date.now()}`,
        title: deliverableForm.title.trim(),
        link: deliverableForm.link.trim() || '#',
        notes: deliverableForm.notes.trim() || 'No notes left.',
        submittedBy: 'You',
        date: 'Just now',
        status: 'pending',
        milestoneIndex: selectedMilestoneIndex,
      };

      const newMilestoneStatus = [...milestoneStatus];
      newMilestoneStatus[selectedMilestoneIndex] = 'in_review';

      let finalUploadedAt = mission.finalMilestoneUploadedAt;
      let newStatus = mission.status;
      if (selectedMilestoneIndex === milestones.length - 1) {
        finalUploadedAt = new Date().toISOString();
        newStatus = 'In Review';
      }

      onUpdateMission({
        ...mission,
        submissions: [...submissions, newSubmission],
        milestoneStatus: newMilestoneStatus,
        finalMilestoneUploadedAt: finalUploadedAt,
        status: newStatus,
      });
      setDeliverableSubmitted(false);
      setDeliverableForm({ title: '', link: '', notes: '' });
      setActiveTab('submissions');
    }, 800);
  };

  const submitDispute = (e) => {
    e.preventDefault();
    if (!disputeForm.description.trim()) return;
    setDisputeFormSubmitted(true);

    setTimeout(() => {
      addDisputeConvo({
        opponentName: isCreator ? (proposals.find(p => p.status === 'accepted')?.name || 'Freelancer') : mission.client,
        missionName: mission.title,
        disputeType: disputeForm.disputeType,
        amount: `${disputeForm.amount} BTS`,
        priority: disputeForm.priority,
        description: disputeForm.description.trim(),
      });

      onUpdateMission({
        ...mission,
        disputeActive: true,
        disputeReason: disputeForm.description.trim(),
        status: 'Frozen in Dispute',
      });

      setDisputeFormSubmitted(false);
      setShowDisputeSuccess(true);
    }, 1200);
  };

  const handleProposalAction = (id, action) => {
    const updatedProposals = proposals.map(p => p.id === id ? { ...p, status: action } : p);
    onUpdateMission({
      ...mission,
      proposals: updatedProposals,
    });
  };

  const handleScheduleAlignment = (proposalId, sessionData) => {
    const updatedProposals = proposals.map(p =>
      p.id === proposalId
        ? { ...p, status: 'scheduled', alignmentSession: sessionData }
        : p
    );
    onUpdateMission({ ...mission, proposals: updatedProposals });
  };

  const handleLockMilestones = (proposalId, lockData) => {
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal) return;

    const updatedProposals = proposals.map(p =>
      p.id === proposalId ? { ...p, status: 'accepted' } : p
    );

    onUpdateMission({
      ...mission,
      proposals: updatedProposals,
      milestones: lockData.milestones,
      milestoneAmounts: lockData.milestoneAmounts,
      milestoneStatus: lockData.milestoneStatus,
      milestoneReleased: lockData.milestoneReleased,
      milestoneDays: lockData.milestoneDays || [],
      deadline: lockData.deadline,
      reward: proposal.bid,
      escrowLocked: true,
      escrowReleasedAmount: 0,
      status: 'In Progress',
      appliedCount: Math.min(mission.teamSize, (mission.appliedCount || 0) + 1),
      myProgress: 0,
      myMilestone: lockData.milestones[0] || 'Starting',
      activeContract: {
        freelancerName: proposal.name,
        freelancerRole: proposal.role,
        bid: proposal.bid,
        startedAt: new Date().toISOString().split('T')[0],
      },
    });
    setMilestoneConfigProposalId(null);
  };

  const schedulerProposal = proposals.find(p => p.id === schedulerProposalId);

  const handleSubmissionAction = (id, action) => {
    const sub = submissions.find(s => s.id === id);
    if (!sub) return;

    const updatedSubmissions = submissions.map(s => s.id === id ? { ...s, status: action } : s);
    const mIdx = sub.milestoneIndex !== undefined ? sub.milestoneIndex : milestoneStatus.findIndex(s => s === 'in_review');
    const isFinal = mIdx === milestones.length - 1;

    const newMilestoneStatus = [...milestoneStatus];
    const newReleased = [...milestoneReleased];
    let newReleasedAmount = escrowReleasedAmount;
    let finalUploadedAt = finalMilestoneUploadedAt;
    let newStatus = mission.status;

    if (action === 'approved') {
      newMilestoneStatus[mIdx] = 'completed';
      if (!isFinal) {
        newReleased[mIdx] = true;
        newReleasedAmount += milestoneAmounts[mIdx];
        newStatus = 'In Progress';
      } else {
        // Approved final milestone -> Start 24h dispute window
        finalUploadedAt = new Date().toISOString();
        newStatus = 'In Review';
      }
    } else if (action === 'revision') {
      newMilestoneStatus[mIdx] = 'pending';
      newStatus = 'In Progress';
    }

    const completedCount = newMilestoneStatus.filter(s => s === 'completed').length;
    const progressPct = milestones.length > 0
      ? Math.round((completedCount / milestones.length) * 100)
      : 0;

    onUpdateMission({
      ...mission,
      submissions: updatedSubmissions,
      milestoneStatus: newMilestoneStatus,
      milestoneReleased: newReleased,
      escrowReleasedAmount: newReleasedAmount,
      finalMilestoneUploadedAt: finalUploadedAt,
      myProgress: progressPct,
      myMilestone: milestones[mIdx + 1] || 'Completed Node Finalized',
      status: newStatus,
    });
  };

  const handleMilestoneToggle = (idx) => {
    if (!isCreator) return; // Only creators can modify milestones progress
    const newStatuses = [...milestoneStatus];
    const isDone = newStatuses[idx] === 'completed';
    newStatuses[idx] = isDone ? 'pending' : 'completed';
    
    const newReleased = [...milestoneReleased];
    let newReleasedAmount = escrowReleasedAmount;
    let finalUploadedAt = finalMilestoneUploadedAt;
    let newStatus = mission.status;

    const isFinal = idx === milestones.length - 1;

    if (newStatuses[idx] === 'completed') {
      if (!isFinal) {
        newReleased[idx] = true;
        newReleasedAmount += milestoneAmounts[idx];
      } else {
        finalUploadedAt = new Date().toISOString();
        newStatus = 'In Review';
      }
    } else {
      // Reverted to pending
      if (newReleased[idx]) {
        newReleased[idx] = false;
        newReleasedAmount -= milestoneAmounts[idx];
      }
      if (isFinal) {
        finalUploadedAt = null;
        newReleased[idx] = false;
        newStatus = 'In Progress';
      }
    }

    const completedCount = newStatuses.filter(s => s === 'completed').length;
    const progressPct = milestones.length > 0
      ? Math.round((completedCount / milestones.length) * 100)
      : 0;
    
    onUpdateMission({
      ...mission,
      milestoneStatus: newStatuses,
      milestoneReleased: newReleased,
      escrowReleasedAmount: newReleasedAmount,
      finalMilestoneUploadedAt: finalUploadedAt,
      myProgress: progressPct,
      myMilestone: milestones[idx + 1] || 'Completed Node Finalized',
      status: newStatus
    });
  };

  const simulate24hPassage = () => {
    const finalIdx = milestones.length - 1;
    const newReleased = [...milestoneReleased];
    newReleased[finalIdx] = true;
    
    const newReleasedAmount = escrowReleasedAmount + milestoneAmounts[finalIdx];
    const newMilestoneStatus = [...milestoneStatus];
    newMilestoneStatus[finalIdx] = 'completed';

    onUpdateMission({
      ...mission,
      milestoneStatus: newMilestoneStatus,
      milestoneReleased: newReleased,
      escrowReleasedAmount: newReleasedAmount,
      status: 'Completed',
    });
  };

  const resolveDispute = (resolution) => {
    const finalIdx = milestones.length - 1;
    const newReleased = [...milestoneReleased];
    let newReleasedAmount = escrowReleasedAmount;
    const newMilestoneStatus = [...milestoneStatus];

    if (resolution === 'release') {
      newReleased[finalIdx] = true;
      newReleasedAmount += milestoneAmounts[finalIdx];
      newMilestoneStatus[finalIdx] = 'completed';
    } else {
      newReleased[finalIdx] = false;
      newMilestoneStatus[finalIdx] = 'pending';
    }

    onUpdateMission({
      ...mission,
      milestoneStatus: newMilestoneStatus,
      milestoneReleased: newReleased,
      escrowReleasedAmount: newReleasedAmount,
      disputeActive: false,
      status: 'Completed',
    });
  };

  const handleStatusChange = (newStatus) => {
    onUpdateMission({
      ...mission,
      status: newStatus,
    });
  };

  const sendOffer = () => {
    if (!negotiateAmount || isNaN(Number(negotiateAmount))) return;
    setOfferSent(true);
    setTimeout(() => {
      setOfferSent(false);
      
      // Update bid dynamically inside the proposal if it exists
      let updatedProposals = [...proposals];
      if (myProposal) {
        updatedProposals = proposals.map(p => p.name === 'You' ? { ...p, bid: Number(negotiateAmount) } : p);
      }
      
      // Append a chat bot notification about negotiation offer
      const newMsg = {
        from: 'you',
        name: 'Negotiator Bot',
        text: `💸 Counter-offer proposal submitted for ◈ ${Number(negotiateAmount).toLocaleString()} BTS. Notes: ${negotiateNote || 'No notes.'}`,
        time: 'Just now'
      };

      onUpdateMission({
        ...mission,
        proposals: updatedProposals,
        messages: [...messages, newMsg],
      });
      setNegotiateAmount('');
      setNegotiateNote('');
    }, 1200);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6 animate-fadeIn">
      
      {/* ── Header Row (Back navigation & Context indicator) ── */}
      <div className="flex items-center justify-between border-b border-gray-50 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-extrabold text-gray-500 hover:text-bts-gold bg-gray-50 hover:bg-yellow-50/50 px-4 py-2 rounded-xl transition-all border border-gray-100"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </svg>
          Back to Missions Board
        </button>

        <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-extrabold border ${
          isCreator ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-blue-50 text-blue-700 border-blue-100'
        }`}>
          {isCreator ? (
            <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg> Client Workspace</>
          ) : (
            <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg> Freelancer Workspace</>
          )}
        </div>
      </div>

      {/* ── Step-by-step Workflow Progress ── */}
      <MissionWorkflowProgress
        steps={workflow.steps}
        stepIndex={workflow.stepIndex}
        progressPercent={workflow.progressPercent}
        currentStep={workflow.currentStep}
        role={isCreator ? 'creator' : 'freelancer'}
      />

      {/* ── Active contract partner (in progress) ── */}
      {activeFreelancer && hasActiveContract && (
        <div className="flex items-center gap-3 bg-blue-50/60 border border-blue-100 rounded-2xl px-4 py-3">
          <div className="w-10 h-10 rounded-xl bg-brand-dark flex items-center justify-center text-bts-gold text-sm font-extrabold shrink-0">
            {(activeFreelancer.freelancerName || activeFreelancer.name || '?').charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">Active Developer</p>
            <p className="text-sm font-extrabold text-brand-dark truncate">
              {activeFreelancer.freelancerName || activeFreelancer.name}
              <span className="text-gray-400 font-bold text-xs ml-1">· {activeFreelancer.freelancerRole || activeFreelancer.role}</span>
            </p>
          </div>
          <p className="text-sm font-extrabold text-brand-dark shrink-0">
            <span className="text-bts-gold">◈</span> {(activeFreelancer.bid || mission.reward)?.toLocaleString()} BTS
          </p>
        </div>
      )}

      {/* ── Mission Visual Overview Panel ── */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-2">
        <div className="flex items-start gap-4">
          <img src={mission.clientAvatar} alt={mission.client} className="w-14 h-14 rounded-2xl object-cover border border-gray-100 shadow-sm shrink-0" />
          <div className="space-y-1.5">
            <h2 className="text-xl font-extrabold text-brand-dark leading-tight">{mission.title}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-gray-400 font-bold">{mission.client}</span>
              <span className="text-gray-200">•</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${STATUS_COLOR[missionStatus] || 'bg-gray-100 text-gray-500 border-gray-200'}`}>{missionStatus}</span>
              <span className="text-gray-200">•</span>
              {(mission.tags || []).map(tag => (
                <span key={tag} className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${tagClass(tag)}`}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap bg-gray-50/70 border border-gray-100/50 p-4 rounded-2xl shrink-0">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Budget</p>
            <div className="flex items-center gap-1">
              <span className="text-bts-gold font-extrabold">◈</span>
              <span className="text-lg font-extrabold text-brand-dark">{mission.reward?.toLocaleString()}</span>
              <span className="text-xs text-gray-400 font-bold">BTS</span>
            </div>
          </div>
          <div className="h-6 w-px bg-gray-200" />
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Deadline</p>
            <p className="text-sm font-extrabold text-brand-dark">{mission.deadline} days</p>
          </div>
          <div className="h-6 w-px bg-gray-200" />
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Hired Nodes</p>
            <p className="text-sm font-extrabold text-brand-dark">{mission.appliedCount}/{mission.teamSize} developers</p>
          </div>
        </div>
      </div>

      {/* ── Escrow Wallet Tracker ── */}
      <EscrowStatusCard
        reward={mission.reward}
        escrowReleasedAmount={escrowReleasedAmount}
        disputeActive={disputeActive}
        hasActiveContract={hasActiveContract}
      />

      {/* ── 24h Escrow Dispute Countdown Simulation Banner ── */}
      {finalMilestoneUploadedAt && escrowReleasedAmount < mission.reward && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-5 shadow-sm space-y-3 animate-fadeIn">
          <div className="flex items-start justify-between gap-4 flex-wrap text-left">
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-bounce">⏳</span>
              <div>
                <h4 className="text-xs font-extrabold text-amber-950 uppercase tracking-wider">Escrow Dispute Period Pending (24 Hours)</h4>
                <p className="text-xs text-amber-800 font-semibold mt-0.5">
                  {disputeActive 
                    ? "❌ Dispute active: Escrow release suspended. Resolution panel arbitration required."
                    : "Final milestone deliverable uploaded. Payout will auto-release in 23 hours, 59 minutes if no dispute is filed."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!disputeActive && (
                <>
                  <button
                    onClick={simulate24hPassage}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-sm"
                  >
                    ⏩ Simulate 24h Passage
                  </button>
                  {isCreator && (
                    <button
                      onClick={() => setActiveTab('dispute')}
                      className="px-4 py-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-extrabold transition-all"
                    >
                      ⚠️ File Dispute
                    </button>
                  )}
                </>
              )}
              {disputeActive && isCreator && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => resolveDispute('release')}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-sm"
                  >
                    Resolve & Release to Dev
                  </button>
                  <button 
                    onClick={() => resolveDispute('refund')}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-sm"
                  >
                    Resolve & Refund Client
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Primary Action Panel (Hiring / Application States) ── */}
      {!isCreator && (
        <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            {myProposalStatus === 'accepted' ? (
              <p className="text-sm font-extrabold text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Contract: You have been accepted to this mission!
              </p>
            ) : myProposalStatus === 'scheduled' ? (
              <p className="text-sm font-bold text-purple-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                Alignment Session Scheduled: Awaiting milestone & escrow lock from client.
              </p>
            ) : myProposalStatus === 'pending' ? (
              <p className="text-sm font-bold text-purple-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                Proposal Pending: Waiting for Defi client review...
              </p>
            ) : myProposalStatus === 'rejected' ? (
              <p className="text-sm font-bold text-rose-600">Proposal Declined: The client declined your counter-offer/bid.</p>
            ) : (
              <p className="text-xs font-semibold text-gray-500">Apply for this contract and submit your requested bid to start collaborating.</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => onBookmark(mission.id)}
              className={`p-2.5 rounded-xl transition-all border ${isBookmarked ? 'text-bts-gold bg-yellow-50 border-bts-gold/20' : 'text-gray-400 border-gray-200 hover:text-bts-gold hover:bg-yellow-50'}`}>
              <svg className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>

            {!myProposalStatus && !isFull && (
              <button
                onClick={() => setShowApplyForm(p => !p)}
                className="px-5 py-2.5 bg-brand-dark hover:bg-bts-gold text-white hover:text-brand-dark transition-all rounded-xl text-xs font-extrabold shadow-sm"
              >
                {showApplyForm ? 'Cancel Proposal' : 'Apply & Submit Bid'}
              </button>
            )}
            {isFull && !myProposalStatus && (
              <span className="px-5 py-2.5 bg-gray-100 text-gray-400 rounded-xl text-xs font-extrabold border border-gray-200">Team Allocation Full</span>
            )}
          </div>
        </div>
      )}

      {/* ── Proposal Submission Form (Freelancer Apply) ── */}
      {showApplyForm && !isCreator && (
        <form onSubmit={submitProposal} className="bg-white border border-bts-gold/25 rounded-2xl p-5 shadow-lg space-y-4 animate-fadeIn">
          <h3 className="text-sm font-extrabold text-brand-dark uppercase tracking-wider border-b border-gray-50 pb-2">Submit Proposal Application</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Your Proposed Bid (BTS) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-bts-gold font-extrabold text-xs">◈</span>
                <input
                  type="number"
                  required
                  value={proposalForm.bid}
                  onChange={e => setProposalForm({ ...proposalForm, bid: e.target.value })}
                  className="w-full pl-7 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold text-brand-dark outline-none focus:border-bts-gold focus:ring-2 focus:ring-bts-gold/15 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Your Developer Title/Role *</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Auditor, Rust Dev"
                value={proposalForm.roleTitle}
                onChange={e => setProposalForm({ ...proposalForm, roleTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold text-brand-dark outline-none focus:border-bts-gold focus:ring-2 focus:ring-bts-gold/15 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Brief Cover Letter / Experience Note *</label>
            <textarea
              required
              rows={3}
              placeholder="Why are you qualified for this project? Link to portfolio."
              value={proposalForm.coverNote}
              onChange={e => setProposalForm({ ...proposalForm, coverNote: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold text-brand-dark outline-none focus:border-bts-gold focus:ring-2 focus:ring-bts-gold/15 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={proposalFormSubmitted}
            className="w-full py-3 bg-brand-dark hover:bg-bts-gold hover:text-brand-dark text-white rounded-xl text-xs font-extrabold transition-all shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {proposalFormSubmitted ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                Uploading Proposal...
              </>
            ) : 'Submit Application Proposal'}
          </button>
        </form>
      )}

      {/* ── Main Tab Panel Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar (3 columns) */}
        <div className="lg:col-span-3 space-y-1 bg-gray-50/50 border border-gray-100/50 p-2 rounded-2xl">
          {filteredTabs.map(tab => {
            const badgeCount = tab.badge === 'proposals' ? pendingProposals
              : tab.badge === 'submissions' ? pendingSubmissions : 0;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.key
                    ? 'bg-brand-dark text-white shadow'
                    : 'text-gray-500 hover:text-brand-dark hover:bg-gray-100/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d={tab.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                  {tab.label}
                </div>
                {badgeCount > 0 && (
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.key ? 'bg-white text-brand-dark' : 'bg-rose-500 text-white'
                  }`}>
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Displays (9 columns) */}
        <div className="lg:col-span-9 bg-gray-50/30 border border-gray-100/60 rounded-2xl p-5 min-h-[350px]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-[11px] font-extrabold text-brand-dark uppercase tracking-wider mb-2">Project Scope</h4>
                <p className="text-xs text-gray-500 leading-relaxed bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                  {mission.description}
                </p>
              </div>

              {/* Next step call-to-action */}
              <div className="bg-brand-dark text-white rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-[10px] font-extrabold text-white/50 uppercase tracking-widest">Your Next Step</p>
                  <p className="text-sm font-extrabold mt-0.5">{workflow.currentStep.hint}</p>
                </div>
                <button
                  onClick={() => !nextAction.disabled && setActiveTab(nextAction.tab)}
                  disabled={nextAction.disabled}
                  className="px-5 py-2.5 bg-bts-gold hover:bg-yellow-400 text-brand-dark rounded-xl text-xs font-extrabold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  {nextAction.label} →
                </button>
              </div>

              {/* Milestones timeline */}
              {milestonesDefined ? (
                <div>
                  <h4 className="text-[11px] font-extrabold text-brand-dark uppercase tracking-wider mb-3">Project Milestones Timeline</h4>
                  <div className="space-y-2.5">
                    {milestones.map((ms, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 ${
                          milestoneStatus[idx] === 'completed' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {milestoneStatus[idx] === 'completed' ? '✓' : idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold ${milestoneStatus[idx] === 'completed' ? 'text-gray-400 line-through' : 'text-brand-dark'}`}>{ms}</p>
                        </div>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                          milestoneStatus[idx] === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-200'
                        }`}>
                          {milestoneStatus[idx] === 'completed' ? 'Completed' : idx === milestoneStatus.findIndex(s => s === 'pending') ? 'Active' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4">
                  <p className="text-[11px] font-extrabold text-amber-800 uppercase tracking-wider mb-1">Milestones Not Yet Defined</p>
                  <p className="text-xs text-amber-900/80 font-semibold leading-relaxed">
                    {isCreator
                      ? 'Milestones and escrow splits are agreed during a private alignment session after you review proposals. Schedule an alignment call, then configure and lock milestones from the Proposals Feed.'
                      : 'The client will define project milestones and budget allocation after scheduling a private alignment session with a selected candidate.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MILESTONES (Freelaner overview vs Creator checkbox toggles) */}
          {activeTab === 'milestones' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h4 className="text-[11px] font-extrabold text-brand-dark uppercase tracking-wider">Milestone Deliverable Track</h4>
                <div className="text-right">
                  <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                    {mission.myProgress || 0}% Progress
                  </span>
                </div>
              </div>

              {!milestonesDefined ? (
                <EmptyState
                  text={isCreator
                    ? 'No milestones yet. Review proposals, schedule an alignment session, then configure milestones and lock escrow to activate the project.'
                    : 'Milestones have not been defined yet. They will be set by the client after the alignment session.'}
                />
              ) : (
                <MilestoneStepPanel
                  milestones={milestones}
                  milestoneAmounts={milestoneAmounts}
                  milestoneStatus={milestoneStatus}
                  milestoneReleased={milestoneReleased}
                  milestoneDays={milestoneDays}
                  submissions={submissions}
                  isCreator={isCreator}
                  isHired={isHired}
                  onSubmitDeliverable={submitDeliverableForMilestone}
                  onApproveMilestone={(_, subId) => handleSubmissionAction(subId, 'approved')}
                  onRequestRevision={(_, subId) => handleSubmissionAction(subId, 'revision')}
                />
              )}
            </div>
          )}

          {/* TAB 3: PROPOSALS (Creator reviews applicants) */}
          {activeTab === 'proposals' && isCreator && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h4 className="text-[11px] font-extrabold text-brand-dark uppercase tracking-wider">{proposals.length} Application Proposal{proposals.length !== 1 ? 's' : ''}</h4>
                <span className="text-[10px] text-purple-600 bg-purple-50 px-2 py-0.5 border border-purple-100 rounded-full font-bold">{pendingProposals} pending review</span>
              </div>
              
              {proposals.length === 0 ? <EmptyState text="No developers have applied to this mission node yet." /> : (
                <div className="space-y-3.5">
                  {proposals.map(p => (
                    <div key={p.id} className={`flex flex-col gap-3 rounded-2xl p-4 border transition-all ${
                      p.status === 'accepted' ? 'bg-emerald-50/50 border-emerald-200' :
                      p.status === 'rejected' ? 'bg-gray-50 border-gray-200 opacity-60' :
                      'bg-white border-gray-100 shadow-sm'
                    }`}>
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-dark flex items-center justify-center text-bts-gold text-xs font-extrabold shrink-0">{p.name.charAt(0)}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-extrabold text-brand-dark">{p.name}</p>
                              <span className="text-[10px] text-gray-400">({p.role})</span>
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              {Array.from({ length: 5 }).map((_, j) => (
                                <svg key={j} className={`w-3 h-3 ${j < Math.floor(p.rating) ? 'text-bts-gold' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="text-[10px] text-gray-400 font-bold ml-1">{p.rating}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-extrabold text-brand-dark"><span className="text-bts-gold">◈</span> {p.bid.toLocaleString()} BTS</p>
                          <p className="text-[10px] text-gray-400 font-semibold">Requested Bid</p>
                        </div>
                      </div>

                      <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-3 text-xs text-gray-500 leading-relaxed font-semibold">
                        <span className="font-extrabold text-brand-dark block text-[9px] uppercase tracking-wider mb-1">Cover Note / Bid Justification</span>
                        "{p.coverLetter}"
                      </div>

                      {p.status === 'pending' && (
                        <div className="flex gap-2 justify-end pt-1">
                          <button onClick={() => setSchedulerProposalId(p.id)} className="px-4 py-1.5 bg-brand-dark hover:bg-bts-gold hover:text-brand-dark text-white rounded-xl text-xs font-bold transition-all shadow-sm">Schedule Alignment Session</button>
                          <button onClick={() => handleProposalAction(p.id, 'rejected')} className="px-4 py-1.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold transition-all">Decline</button>
                        </div>
                      )}
                      {p.status === 'scheduled' && (
                        <div className="space-y-3 pt-1">
                          <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-xl px-3 py-2">
                            <span className="text-sm">📅</span>
                            <div>
                              <p className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider">Alignment Session Booked</p>
                              <p className="text-xs font-bold text-brand-dark">{p.alignmentSession?.date} at {p.alignmentSession?.time}</p>
                            </div>
                          </div>
                          {milestoneConfigProposalId === p.id ? (
                            <MilestoneAllocationEditor
                              reward={p.bid}
                              initialMilestones={['Scope definition', 'Core deliverable', 'Final handoff']}
                              onLock={(lockData) => handleLockMilestones(p.id, lockData)}
                            />
                          ) : (
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => setMilestoneConfigProposalId(p.id)}
                                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                              >
                                Configure Milestones & Lock Escrow
                              </button>
                              <button onClick={() => handleProposalAction(p.id, 'rejected')} className="px-4 py-1.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold transition-all">Decline</button>
                            </div>
                          )}
                        </div>
                      )}
                      {p.status === 'accepted' && (
                        <div className="flex justify-end">
                          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100/40 px-3 py-1 border border-emerald-200 rounded-xl flex items-center gap-1.5 shadow-sm">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                            Accepted node added to team
                          </span>
                        </div>
                      )}
                      {p.status === 'rejected' && (
                        <div className="flex justify-end">
                          <span className="text-xs font-extrabold text-gray-400 bg-gray-100 px-3 py-1 rounded-xl border border-gray-200">Proposal declined</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SUBMIT WORK (Freelancer Upload deliverable) */}
          {activeTab === 'submissions' && !isCreator && (
            <div className="space-y-5">
              <h4 className="text-[11px] font-extrabold text-brand-dark uppercase tracking-wider border-b border-gray-100 pb-2">Handoff Code & Deliverables</h4>
              
              {!isHired ? (
                <EmptyState text="You must be accepted and hired for this contract to upload work deliverables." />
              ) : (
                <>
                  {/* Submission Form */}
                  <form onSubmit={submitDeliverable} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-4">
                    <h3 className="text-xs font-extrabold text-brand-dark uppercase tracking-wider mb-2">New Deliverable Upload</h3>
                    
                    <div className="text-left space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Select Target Milestone *</label>
                        <select
                          value={selectedMilestoneIndex}
                          onChange={e => setSelectedMilestoneIndex(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold text-brand-dark outline-none focus:border-bts-gold focus:ring-2 focus:ring-bts-gold/15 transition-all"
                        >
                          {milestones.map((ms, idx) => (
                            <option key={idx} value={idx}>{idx + 1}. {ms} (◈ {milestoneAmounts[idx]?.toLocaleString()} BTS)</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Deliverable Node Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Audit Draft, smart-contract-v1.zip"
                            value={deliverableForm.title}
                            onChange={e => setDeliverableForm({ ...deliverableForm, title: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold text-brand-dark outline-none focus:border-bts-gold focus:ring-2 focus:ring-bts-gold/15 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Source Code Repository Link / URL</label>
                          <input
                            type="url"
                            placeholder="e.g. https://github.com/repository"
                            value={deliverableForm.link}
                            onChange={e => setDeliverableForm({ ...deliverableForm, link: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold text-brand-dark outline-none focus:border-bts-gold focus:ring-2 focus:ring-bts-gold/15 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Handoff Node Notes & Instructions</label>
                      <textarea
                        rows={3}
                        placeholder="Add notes about testing scripts, APIs, or design screens..."
                        value={deliverableForm.notes}
                        onChange={e => setDeliverableForm({ ...deliverableForm, notes: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold text-brand-dark outline-none focus:border-bts-gold focus:ring-2 focus:ring-bts-gold/15 transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={deliverableSubmitted}
                      className="w-full py-2.5 bg-brand-dark hover:bg-bts-gold hover:text-brand-dark text-white rounded-xl text-xs font-extrabold transition-all shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {deliverableSubmitted ? (
                        <>
                          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                          Uploading deliverable...
                        </>
                      ) : 'Submit Deliverable Artifact'}
                    </button>
                  </form>

                  {/* Submission History */}
                  <div className="space-y-3.5">
                    <h3 className="text-xs font-extrabold text-brand-dark uppercase tracking-wider">Your Deliverable History ({submissions.filter(s => s.submittedBy === 'You').length})</h3>
                    {submissions.filter(s => s.submittedBy === 'You').length === 0 ? (
                      <p className="text-[11px] text-gray-400 italic">No submissions made yet.</p>
                    ) : (
                      submissions.filter(s => s.submittedBy === 'You').map(sub => (
                        <div key={sub.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                            </div>
                            <div>
                              <p className="text-xs font-extrabold text-brand-dark">{sub.title}</p>
                              <p className="text-[10px] text-gray-400">Submitted: {sub.date} · Status: <span className="font-bold">{sub.status}</span></p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                            sub.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>{sub.status}</span>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 5: SUBMISSIONS (Creator reviews handoffs) */}
          {activeTab === 'submissions' && isCreator && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h4 className="text-[11px] font-extrabold text-brand-dark uppercase tracking-wider">{submissions.length} Artifact Handoff Submission{submissions.length !== 1 ? 's' : ''}</h4>
                {pendingSubmissions > 0 && (
                  <span className="text-[10px] text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full font-bold">{pendingSubmissions} awaiting checkoff</span>
                )}
              </div>

              {submissions.length === 0 ? <EmptyState text="No team members have uploaded code deliverables yet." /> : (
                <div className="space-y-3.5">
                  {submissions.map(s => (
                    <div key={s.id} className={`flex flex-col gap-3 rounded-2xl p-4 border transition-all ${
                      s.status === 'approved' ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-gray-100 shadow-sm'
                    }`}>
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-extrabold text-brand-dark">{s.title}</p>
                            <p className="text-[11px] text-gray-400 font-semibold">Submitted by {s.submittedBy} · {s.date}</p>
                            {s.milestoneIndex !== undefined && (
                              <span className="inline-block mt-1 bg-yellow-50 border border-yellow-200 text-yellow-700 text-[10px] px-2 py-0.5 rounded-lg font-extrabold">
                                🎯 Targets: Milestone {s.milestoneIndex + 1} ({milestones[s.milestoneIndex]}) · ◈ {milestoneAmounts[s.milestoneIndex]?.toLocaleString()} BTS
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {s.link && s.link !== '#' && (
                            <a href={s.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 hover:text-brand-dark rounded-lg text-xs font-bold transition-all">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                              Open Source Repo
                            </a>
                          )}
                          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                            s.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                            s.status === 'revision' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                            'bg-blue-50 text-blue-700 border-blue-100'
                          }`}>{s.status}</span>
                        </div>
                      </div>

                      <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-3 text-xs text-gray-500 leading-relaxed font-semibold">
                        <span className="font-extrabold text-brand-dark block text-[9px] uppercase tracking-wider mb-1">Developer deliverable notes</span>
                        "{s.notes}"
                      </div>

                      {s.status === 'pending' && (
                        <div className="flex gap-2 justify-end pt-1">
                          <button onClick={() => handleSubmissionAction(s.id, 'approved')} className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">Approve Node & Release Escrow</button>
                          <button onClick={() => handleSubmissionAction(s.id, 'revision')} className="px-4 py-1.5 bg-white border border-amber-200 hover:bg-amber-50 text-amber-700 rounded-xl text-xs font-bold transition-all">Request Revision</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: NEGOTIATE (Freelancer Counter-offer) */}
          {activeTab === 'negotiate' && !isCreator && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h4 className="text-[11px] font-extrabold text-brand-dark uppercase tracking-wider mb-1">Contract Budget</h4>
                <p className="text-2xl font-extrabold text-brand-dark"><span className="text-bts-gold">◈</span> {mission.reward?.toLocaleString()} <span className="text-xs text-gray-400 font-bold">BTS</span></p>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-sm">
                <h4 className="text-xs font-extrabold text-brand-dark uppercase tracking-wider">Submit Counter-Offer Bid</h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Proposed Reward Bid (BTS)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-bts-gold font-extrabold">◈</span>
                      <input type="number" value={negotiateAmount} onChange={e => setNegotiateAmount(e.target.value)}
                        placeholder={mission.reward?.toString()}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-brand-dark outline-none focus:border-bts-gold focus:ring-2 focus:ring-bts-gold/20 transition-all bg-gray-50/20" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Justification Note</label>
                    <textarea rows={3} value={negotiateNote} onChange={e => setNegotiateNote(e.target.value)}
                      placeholder="Explain your changes to the milestones or reward budget..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-brand-dark outline-none focus:border-bts-gold focus:ring-2 focus:ring-bts-gold/20 transition-all resize-none bg-gray-50/20" />
                  </div>

                  <button onClick={sendOffer}
                    className="w-full py-3 bg-brand-dark hover:bg-bts-gold hover:text-brand-dark text-white rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2">
                    {offerSent ? (
                      <>
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                        Sending Counter-offer...
                      </>
                    ) : 'Submit Counter-Offer'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: TEAM DIRECTORY */}
          {activeTab === 'team' && isCreator && (
            <div className="space-y-4">
              <h4 className="text-[11px] font-extrabold text-brand-dark uppercase tracking-wider">Active Team Management</h4>
              {proposals.filter(p => p.status === 'accepted').length === 0 ? (
                <EmptyState text="No team members hired yet. Accept applicant proposals to build your team." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {proposals.filter(p => p.status === 'accepted').map(p => (
                    <div key={p.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-sm font-extrabold shrink-0">{p.name.charAt(0)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-extrabold text-brand-dark truncate">{p.name}</p>
                        <p className="text-[10px] text-gray-400 truncate">{p.role}</p>
                        <p className="text-[10px] text-bts-gold font-extrabold mt-0.5">◈ {p.bid.toLocaleString()} BTS</p>
                      </div>
                      <button onClick={() => setActiveTab('messages')} className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 hover:text-brand-dark rounded-lg text-xs font-bold transition-all">Chat</button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500">Hiring Capacity</span>
                  <span className="text-xs font-bold text-brand-dark">{proposals.filter(p => p.status === 'accepted').length} / {mission.teamSize} developers</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-bts-gold to-brand-dark rounded-full transition-all"
                    style={{ width: `${Math.min(100, (proposals.filter(p => p.status === 'accepted').length / mission.teamSize) * 100)}%` }} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SETTINGS (Creator settings) */}
          {activeTab === 'settings' && isCreator && (
            <div className="space-y-5">
              <h4 className="text-[11px] font-extrabold text-brand-dark uppercase tracking-wider">Mission Workflow Settings</h4>
              
              <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-sm">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Change Mission Stage</label>
                  <select value={missionStatus} onChange={e => handleStatusChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-brand-dark outline-none focus:border-bts-gold focus:ring-2 focus:ring-bts-gold/20 transition-all bg-gray-50/20">
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>In Review</option>
                    <option>Completed</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button className="flex-1 py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-100 rounded-xl text-xs font-extrabold transition-all">Pause Applications</button>
                  <button className="flex-1 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-xl text-xs font-extrabold transition-all">Cancel Contract Node</button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: COLLABORATIVE CHAT (Shared) */}
          {activeTab === 'messages' && (
            <div className="flex flex-col justify-between" style={{ minHeight: '340px' }}>
              <div className="flex-1 space-y-3.5 mb-4 overflow-y-auto max-h-64 pr-2">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === 'you' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${
                      msg.from === 'you' ? 'bg-brand-dark text-white rounded-br-sm' : 'bg-white border border-gray-100 text-brand-dark rounded-bl-sm'
                    }`}>
                      {msg.from !== 'you' && msg.name && <p className="text-[10px] font-extrabold text-bts-gold mb-1">{msg.name}</p>}
                      <p>{msg.text}</p>
                      <p className={`text-[9px] mt-1 text-right ${msg.from === 'you' ? 'text-white/40' : 'text-gray-400'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-100 bg-white p-3 rounded-2xl shadow-sm">
                <input type="text" value={messageText} onChange={e => setMessageText(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder={isCreator ? 'Broadcast update to team developers…' : `Message client team creator…`}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-xs font-semibold text-brand-dark placeholder:text-gray-300 outline-none focus:border-bts-gold focus:ring-2 focus:ring-bts-gold/20 transition-all bg-gray-50/20" />
                <button onClick={sendMessage} className="px-5 py-3 bg-brand-dark hover:bg-bts-gold hover:text-brand-dark text-white rounded-xl text-xs font-extrabold transition-all shrink-0">Send</button>
              </div>
            </div>
          )}

          {/* TAB 10: MISSION REVIEWS */}
          {activeTab === 'reviews' && (
            <ReviewSection
              entityType={REVIEW_ENTITY_TYPES.MISSION}
              entityId={mission.id}
              entityLabel={mission.title}
              title={isCreator ? 'Rate Your Freelancer' : 'Client Feedback'}
              seedReviews={(mission.reviews || []).map((r) => ({
                author: r.author,
                rating: r.rating,
                text: r.text,
              }))}
              eligibilityContext={{
                isCreator,
                missionStatus,
              }}
              showSubmit={isCreator}
              variant="plain"
              emptyText="No reviews submitted for this project contract yet."
            />
          )}

          {/* TAB 11: DISPUTE */}
          {activeTab === 'dispute' && (
            <div className="space-y-6 animate-fadeIn text-left">
              <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-extrabold text-brand-dark uppercase tracking-wider">File Arbitration Dispute</h4>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">Initiate a formal review panel for contract resolution</p>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-extrabold bg-rose-50 border border-rose-100 text-rose-600 rounded-full">
                  Resolution Center
                </span>
              </div>

              {disputeActive ? (
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto text-rose-600 text-xl font-bold">
                    ⚠️
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-brand-dark">Active Arbitration Dispute</h3>
                    <p className="text-xs text-gray-500 max-w-md mx-auto font-semibold leading-relaxed">
                      Escrow funds have been frozen. The resolution panel is reviewing this case.
                    </p>
                    <p className="text-[11px] text-gray-700 italic bg-white border border-rose-100 p-3 rounded-xl max-w-md mx-auto mt-2 font-bold">
                      Reason: "{mission.disputeReason || 'No details specified.'}"
                    </p>
                  </div>

                  {isCreator && (
                    <div className="bg-white border border-rose-100/60 rounded-xl p-5 max-w-md mx-auto space-y-3">
                      <h4 className="text-xs font-extrabold text-brand-dark uppercase tracking-wider">Arbiter Resolution Actions</h4>
                      <p className="text-[10px] text-gray-400 font-semibold">Select a resolution path below to execute the smart contract payout disbursement.</p>
                      
                      <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <button
                          onClick={() => resolveDispute('release')}
                          className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-sm"
                        >
                          Resolve & Release to Dev
                        </button>
                        <button
                          onClick={() => resolveDispute('refund')}
                          className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-sm"
                        >
                          Resolve & Refund Client
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : showDisputeSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600 text-xl font-bold">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-brand-dark">Dispute Case Registered</h3>
                    <p className="text-xs text-gray-500 max-w-md mx-auto font-semibold leading-relaxed">
                      Your arbitration case has been successfully filed with the Bitstacks Resolution Panel. A dedicated moderator has been assigned to investigate this case.
                    </p>
                  </div>
                  <div className="bg-white border border-emerald-100/60 rounded-xl p-3 text-[11px] font-semibold text-gray-500 max-w-sm mx-auto">
                    💬 Track negotiation logs, view system events, and upload evidence in the <strong className="text-brand-dark">Messages &rarr; Disputes</strong> hub.
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setShowDisputeSuccess(false)}
                      className="px-6 py-2 bg-brand-dark hover:bg-bts-gold hover:text-brand-dark text-white rounded-xl text-xs font-extrabold transition-all shadow-sm"
                    >
                      File Another Dispute
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={submitDispute} className="space-y-5 bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
                  {/* Warning / Caution Banner */}
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-amber-800 leading-relaxed font-semibold">
                    <span className="text-sm shrink-0">⚠️</span>
                    <div>
                      <strong className="font-extrabold text-amber-950 block mb-0.5">Formal Dispute Process</strong>
                      Filing a dispute locks the contract escrow and refers the case to the Arbitration Panel. Please ensure your explanation is detailed and accurate.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Opposing Party</label>
                      <input
                        type="text"
                        disabled
                        value={isCreator ? (proposals.find(p => p.status === 'accepted')?.name || 'Freelancer') : mission.client}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-extrabold text-gray-500 cursor-not-allowed outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Dispute Type *</label>
                      <select
                        value={disputeForm.disputeType}
                        onChange={e => setDisputeForm({ ...disputeForm, disputeType: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold text-brand-dark outline-none focus:border-bts-gold focus:ring-2 focus:ring-bts-gold/15 transition-all"
                      >
                        <option value="payment">Payment Issue (Escrow Release)</option>
                        <option value="milestone">Milestone Deliverable Conflict</option>
                        <option value="conduct">Professional Conduct / Terms Violation</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Disputed Amount (BTS) *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-bts-gold font-extrabold text-xs">◈</span>
                        <input
                          type="number"
                          required
                          value={disputeForm.amount}
                          onChange={e => setDisputeForm({ ...disputeForm, amount: e.target.value })}
                          className="w-full pl-7 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold text-brand-dark outline-none focus:border-bts-gold focus:ring-2 focus:ring-bts-gold/15 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Case Priority *</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['low', 'medium', 'high'].map(p => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setDisputeForm({ ...disputeForm, priority: p })}
                            className={`py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border transition-all ${
                              disputeForm.priority === p
                                ? p === 'high'
                                  ? 'bg-rose-500 border-rose-500 text-white shadow-sm'
                                  : p === 'medium'
                                  ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                                  : 'bg-blue-500 border-blue-500 text-white shadow-sm'
                                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Detailed Explanation & Reason *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Explain the reason for opening this dispute. What terms were not met? Be as detailed as possible."
                      value={disputeForm.description}
                      onChange={e => setDisputeForm({ ...disputeForm, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold text-brand-dark outline-none focus:border-bts-gold focus:ring-2 focus:ring-bts-gold/15 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={disputeFormSubmitted}
                    className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {disputeFormSubmitted ? (
                      <>
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                        Filing Dispute...
                      </>
                    ) : 'Open Dispute for Arbitration'}
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <PrivateSessionSchedulerModal
        isOpen={!!schedulerProposalId}
        onClose={() => setSchedulerProposalId(null)}
        candidateName={schedulerProposal?.name || 'Candidate'}
        onSchedule={(sessionData) => {
          if (schedulerProposalId) {
            handleScheduleAlignment(schedulerProposalId, sessionData);
          }
        }}
      />
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="text-center py-12 bg-white border border-gray-100 rounded-2xl shadow-sm">
      <svg className="w-10 h-10 text-gray-200 mx-auto mb-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
      <p className="text-xs font-bold text-gray-400">{text}</p>
    </div>
  );
}
