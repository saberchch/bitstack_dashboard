export default function MissionWorkflowProgress({ steps, stepIndex, progressPercent, currentStep, role }) {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
            {role === 'creator' ? 'Client Workflow' : 'Freelancer Workflow'}
          </p>
          <h3 className="text-sm font-extrabold text-brand-dark mt-0.5">
            Step {stepIndex + 1} of {steps.length}: {currentStep.label}
          </h3>
          <p className="text-xs text-gray-500 font-semibold mt-1">{currentStep.hint}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-bts-gold">{progressPercent}%</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase">Progress</p>
        </div>
      </div>

      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-bts-gold to-brand-dark rounded-full transition-all duration-700"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-start justify-between gap-1 overflow-x-auto pb-1">
        {steps.map((step, idx) => {
          const isDone = idx < stepIndex;
          const isActive = idx === stepIndex;
          return (
            <div key={step.key} className="flex flex-col items-center min-w-[72px] flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-extrabold border-2 transition-all ${
                  isDone
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : isActive
                    ? 'bg-brand-dark border-brand-dark text-white shadow-md scale-110'
                    : 'bg-white border-gray-200 text-gray-300'
                }`}
              >
                {isDone ? '✓' : idx + 1}
              </div>
              <p
                className={`text-[9px] font-bold text-center mt-1.5 leading-tight ${
                  isActive ? 'text-brand-dark' : isDone ? 'text-emerald-600' : 'text-gray-300'
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
