import { WORKFLOW_STEPS, isStepLocked, isStepReadOnly } from '../../../utils/missionWorkflow';

export default function WorkflowTimeline({ currentStepIndex, activeStepIndex, onChangeStep }) {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-2xl p-5 space-y-4 mb-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
            Project Workflow
          </p>
          <h3 className="text-sm font-extrabold text-brand-dark mt-0.5">
            Step {activeStepIndex + 1} of {WORKFLOW_STEPS.length}: {WORKFLOW_STEPS[activeStepIndex].label}
          </h3>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            {WORKFLOW_STEPS[activeStepIndex].hint}
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-extrabold text-bts-gold">
            {Math.round((currentStepIndex / (WORKFLOW_STEPS.length - 1)) * 100)}%
          </p>
          <p className="text-[10px] text-gray-400 font-bold uppercase">Escrow Progress</p>
        </div>
      </div>

      {/* Progress timeline bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-bts-gold to-brand-dark rounded-full transition-all duration-700"
          style={{ width: `${Math.round((currentStepIndex / (WORKFLOW_STEPS.length - 1)) * 100)}%` }}
        />
      </div>

      {/* Step buttons */}
      <div className="flex items-start justify-between gap-1 overflow-x-auto pb-1">
        {WORKFLOW_STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isActive = idx === activeStepIndex;
          const isLocked = isStepLocked(idx, currentStepIndex);
          const isCurrent = idx === currentStepIndex;

          let stepClass = 'bg-white border-gray-200 text-gray-300';
          let labelClass = 'text-gray-300';

          if (isLocked) {
            stepClass = 'bg-gray-50 border-gray-150 text-gray-300 cursor-not-allowed';
            labelClass = 'text-gray-300';
          } else if (isActive) {
            stepClass = 'bg-brand-dark border-brand-dark text-white shadow-md scale-110';
            labelClass = 'text-brand-dark font-extrabold';
          } else if (isDone) {
            stepClass = 'bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600';
            labelClass = 'text-emerald-600';
          } else if (isCurrent) {
            stepClass = 'bg-white border-brand-dark text-brand-dark hover:bg-gray-50';
            labelClass = 'text-brand-dark';
          }

          return (
            <button
              key={step.key}
              disabled={isLocked}
              onClick={() => onChangeStep(idx)}
              className="flex flex-col items-center min-w-[72px] flex-1 focus:outline-none transition-all group"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-extrabold border-2 transition-all ${stepClass}`}
              >
                {isDone ? '✓' : idx + 1}
              </div>
              <p className={`text-[9px] font-bold text-center mt-1.5 leading-tight ${labelClass}`}>
                {step.label}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
