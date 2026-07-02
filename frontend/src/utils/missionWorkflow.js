// 6-step D-Lancer Workflow System
// Browse → Connection → Alignment → Active Work → Final Handoff → Completed

export const WORKFLOW_STEPS = [
  {
    key: 'browse',
    label: 'Browse',
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0',
    hint: 'Explore available missions and express your interest.',
  },
  {
    key: 'connection',
    label: 'Connection',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    hint: 'Client reviews interested freelancers and schedules a meeting.',
  },
  {
    key: 'alignment',
    label: 'Alignment',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    hint: 'Define milestones, deadlines, and lock project escrow.',
  },
  {
    key: 'active_work',
    label: 'Active Work',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    hint: 'Freelancer works through milestones with regular review meetings.',
  },
  {
    key: 'final_handoff',
    label: 'Final Handoff',
    icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
    hint: 'Submit final deliverables and schedule demonstration meeting.',
  },
  {
    key: 'completed',
    label: 'Completed',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0',
    hint: 'Mission archived. All history preserved as read-only.',
  },
];

/**
 * Determine the current workflow step index (0–5) from mission data.
 * @param {object} mission
 * @param {boolean} isCreator - whether the current user is the mission poster
 * @param {boolean} isInterested - whether the current user expressed interest
 * @returns {number} stepIndex 0–5
 */
export function getWorkflowStepIndex(mission, isCreator = false, isInterested = false) {
  const status = mission?.status || 'Open';
  const escrowLocked = mission?.escrowLocked || false;
  const hasActiveContract = !!mission?.activeContract;

  if (status === 'Completed') return 5;
  if (status === 'In Review') return 4;
  if (status === 'In Progress' && escrowLocked) return 3;
  if (hasActiveContract || (status === 'In Progress' && !escrowLocked)) return 2;
  if (isInterested || isCreator) return 1;
  return 0;
}

/**
 * Returns workflow step metadata for a given index.
 */
export function getWorkflowStep(index) {
  return WORKFLOW_STEPS[Math.min(index, WORKFLOW_STEPS.length - 1)];
}

/**
 * Whether a given step index is locked (cannot be opened).
 * Future steps relative to current are locked.
 */
export function isStepLocked(stepIndex, currentIndex) {
  return stepIndex > currentIndex;
}

/**
 * Whether a given step is read-only (past steps).
 */
export function isStepReadOnly(stepIndex, currentIndex) {
  return stepIndex < currentIndex;
}
