import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useDLancerState from '../hooks/useDLancerState';
import { getWorkflowStepIndex } from '../utils/missionWorkflow';
import WorkflowTimeline from '../components/dlancer/workflow/WorkflowTimeline';
import StepBrowse from '../components/dlancer/workflow/StepBrowse';
import StepConnection from '../components/dlancer/workflow/StepConnection';
import StepAlignment from '../components/dlancer/workflow/StepAlignment';
import StepActiveWork from '../components/dlancer/workflow/StepActiveWork';
import StepFinalHandoff from '../components/dlancer/workflow/StepFinalHandoff';
import StepCompleted from '../components/dlancer/workflow/StepCompleted';

export default function MissionWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const state = useDLancerState();
  const mission = state.getMissionById(id);

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const isCreator = mission?.isMyPost || false;
  const isInterested = state.isInterested(id);
  const currentStepIndex = getWorkflowStepIndex(mission, isCreator, isInterested);

  // Sync active step view index to the highest unlocked/current index when mission loads
  useEffect(() => {
    if (mission) {
      setActiveStepIndex(currentStepIndex);
    }
  }, [mission, currentStepIndex]);

  if (!mission) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-bold text-gray-500">Mission not found</h2>
        <button onClick={() => navigate('/d-lancer')} className="mt-4 text-bts-gold font-bold">
          ➔ Back to D-Lancer
        </button>
      </div>
    );
  }

  const handleUpdateWorkflow = () => {
    // Simulate updating backend/localStorage workflow status by incrementing active contract details
    let nextStatus = mission.status;
    let nextEscrow = mission.escrowLocked;

    if (currentStepIndex === 1) {
      // Transition from Connection to Alignment
      nextStatus = 'In Progress';
    } else if (currentStepIndex === 2) {
      // Transition from Alignment to Active Work
      nextEscrow = true;
    } else if (currentStepIndex === 3) {
      // Transition to final handoff review
      nextStatus = 'In Review';
    } else if (currentStepIndex === 4) {
      // Complete
      nextStatus = 'Completed';
    }

    const updated = {
      ...mission,
      status: nextStatus,
      escrowLocked: nextEscrow,
      activeContract: mission.activeContract || {
        freelancerName: 'Diego F.',
        freelancerRole: 'Lead Engineer',
        bid: mission.reward,
        startedAt: new Date().toLocaleDateString(),
      },
    };

    state.handleUpdateMission(updated);
    alert('Workflow status synchronized!');
  };

  const isReadOnlyView = activeStepIndex !== currentStepIndex;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/d-lancer')}
          className="text-xs font-bold text-gray-400 hover:text-brand-dark transition-colors flex items-center gap-1.5"
        >
          ➔ Back to D-Lancer
        </button>
      </div>

      {/* Persistent Workflow timeline at the top */}
      <WorkflowTimeline
        currentStepIndex={currentStepIndex}
        activeStepIndex={activeStepIndex}
        onChangeStep={setActiveStepIndex}
      />

      {/* Render the selected workflow step */}
      <div className="mt-6">
        {activeStepIndex === 0 && (
          <StepBrowse
            mission={mission}
            isInterested={isInterested}
            onExpressInterest={() => state.handleExpressInterest(id)}
            isReadOnly={isReadOnlyView}
          />
        )}
        {activeStepIndex === 1 && (
          <StepConnection
            mission={mission}
            isCreator={isCreator}
            isReadOnly={isReadOnlyView}
            onUpdateWorkflow={handleUpdateWorkflow}
          />
        )}
        {activeStepIndex === 2 && (
          <StepAlignment
            mission={mission}
            isCreator={isCreator}
            isReadOnly={isReadOnlyView}
            onUpdateWorkflow={handleUpdateWorkflow}
            onUpdateMission={state.handleUpdateMission}
          />
        )}
        {activeStepIndex === 3 && (
          <StepActiveWork
            mission={mission}
            isCreator={isCreator}
            isReadOnly={isReadOnlyView}
            onUpdateWorkflow={handleUpdateWorkflow}
            onUpdateMission={state.handleUpdateMission}
          />
        )}
        {activeStepIndex === 4 && (
          <StepFinalHandoff
            mission={mission}
            isCreator={isCreator}
            isReadOnly={isReadOnlyView}
            onUpdateWorkflow={handleUpdateWorkflow}
            onUpdateMission={state.handleUpdateMission}
          />
        )}
        {activeStepIndex === 5 && (
          <StepCompleted
            mission={mission}
          />
        )}
      </div>
    </div>
  );
}
