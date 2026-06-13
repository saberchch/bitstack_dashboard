export const FREELANCER_STEPS = [
  { key: 'overview', label: 'Review Project', hint: 'Read the scope and requirements before submitting your offer.' },
  { key: 'proposal', label: 'Submit Offer', hint: 'Send your bid, role, and cover letter to the client.' },
  { key: 'alignment', label: 'Alignment Meeting', hint: 'Join the private session and discuss scope in Messages.' },
  { key: 'milestones', label: 'Milestone Agreement', hint: 'Wait while the client defines milestones, dates, and locks escrow.' },
  { key: 'execution', label: 'Deliver Work', hint: 'Submit milestone deliverables and track escrow payouts.' },
  { key: 'payout', label: 'Final Payout', hint: 'Final deliverable is in review — funds release after the dispute window.' },
  { key: 'completed', label: 'Completed', hint: 'Project closed and all funds disbursed.' },
];

export const CREATOR_STEPS = [
  { key: 'overview', label: 'Project Overview', hint: 'Your mission is live — review scope and wait for offers.' },
  { key: 'proposals', label: 'Review Offers', hint: 'Evaluate freelancer bids and shortlist the best fit.' },
  { key: 'alignment', label: 'Alignment Meeting', hint: 'Schedule a private session with your chosen candidate.' },
  { key: 'milestones', label: 'Define Milestones', hint: 'Agree on deliverables, dates, fund splits, and lock escrow.' },
  { key: 'execution', label: 'Active Work', hint: 'Review submissions and release milestone payouts.' },
  { key: 'payout', label: 'Final Release', hint: 'Approve the final deliverable and complete the payout window.' },
  { key: 'completed', label: 'Completed', hint: 'Contract fulfilled and archived.' },
];

export function getWorkflowState({
  mission,
  isCreator,
  myProposal,
  isHired,
  escrowLocked,
  milestonesDefined,
  milestoneConfigOpen,
}) {
  const steps = isCreator ? CREATOR_STEPS : FREELANCER_STEPS;
  const status = mission.status || 'Open';
  const proposals = mission.proposals || [];
  const proposalStatus = myProposal?.status;
  const hasPending = proposals.some(p => p.status === 'pending');
  const hasScheduled = proposals.some(p => p.status === 'scheduled');
  const hasAccepted = proposals.some(p => p.status === 'accepted');

  let stepIndex = 0;

  if (status === 'Completed') {
    stepIndex = 6;
  } else if (status === 'In Review' && (isCreator ? hasAccepted : isHired)) {
    stepIndex = 5;
  } else if (escrowLocked && milestonesDefined) {
    stepIndex = 4;
  } else if (hasScheduled && milestoneConfigOpen) {
    stepIndex = 3;
  } else if (hasScheduled) {
    stepIndex = 2;
  } else if (isCreator ? hasPending : proposalStatus === 'pending') {
    stepIndex = 1;
  } else if (!isCreator && myProposal) {
    stepIndex = 1;
  } else {
    stepIndex = 0;
  }

  const currentStep = steps[stepIndex];
  const nextStep = steps[Math.min(stepIndex + 1, steps.length - 1)];
  const progressPercent = Math.round((stepIndex / (steps.length - 1)) * 100);

  return { stepIndex, steps, currentStep, nextStep, progressPercent };
}

export function getNextAction({ workflow, isCreator, myProposalStatus, hasPending, hasScheduled, escrowLocked, setActiveTab }) {
  const { stepIndex } = workflow;

  if (isCreator) {
    if (stepIndex === 0 && !hasPending) return { label: 'Wait for Offers', tab: 'details', disabled: true };
    if (stepIndex <= 1 && hasPending) return { label: 'Review Proposals', tab: 'proposals' };
    if (stepIndex === 2) return { label: 'Join Alignment Chat', tab: 'messages' };
    if (stepIndex === 3) return { label: 'Configure Milestones', tab: 'proposals' };
    if (stepIndex === 4) return { label: 'Review Milestones', tab: 'milestones' };
    if (stepIndex === 5) return { label: 'Complete Payout', tab: 'milestones' };
    return { label: 'View Overview', tab: 'details' };
  }

  if (!myProposalStatus) return { label: 'Submit Your Offer', tab: 'details' };
  if (myProposalStatus === 'pending') return { label: 'Check Messages', tab: 'messages' };
  if (myProposalStatus === 'scheduled' && !escrowLocked) return { label: 'Join Discussion', tab: 'messages' };
  if (stepIndex === 4) return { label: 'Submit Milestone', tab: 'milestones' };
  if (stepIndex === 5) return { label: 'Track Final Payout', tab: 'milestones' };
  return { label: 'View Overview', tab: 'details' };
}
