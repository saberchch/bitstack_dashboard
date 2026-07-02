const DURATION_OPTIONS = [
  { key: 'all', label: 'Any Duration' },
  { key: 'short', label: '< 1 week' },
  { key: 'medium', label: '1–4 weeks' },
  { key: 'long', label: '1–3 months' },
];

export default function MarketplaceFilters({
  skills,
  selectedSkills,
  selectedDifficulty,
  selectedDuration,
  onSkillToggle,
  onDifficultyChange,
  onDurationChange,
  onClearAll,
  activeCount,
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-md space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Difficulty */}
        <div>
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Difficulty</p>
          <div className="flex flex-wrap gap-1.5">
            {['all', 'Intermediate', 'Advanced', 'Expert'].map(d => (
              <button
                key={d}
                onClick={() => onDifficultyChange(d)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                  selectedDifficulty === d
                    ? 'bg-brand-dark text-white border-brand-dark'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-brand-dark'
                }`}
              >
                {d === 'all' ? 'Any' : d}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Duration</p>
          <div className="flex flex-wrap gap-1.5">
            {DURATION_OPTIONS.map(d => (
              <button
                key={d.key}
                onClick={() => onDurationChange(d.key)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                  selectedDuration === d.key
                    ? 'bg-brand-dark text-white border-brand-dark'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-brand-dark'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {skills.map(skill => (
              <button
                key={skill}
                onClick={() => onSkillToggle(skill)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                  selectedSkills.includes(skill)
                    ? 'bg-brand-dark text-white border-brand-dark'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-brand-dark'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeCount > 0 && (
        <div className="flex justify-end pt-3 border-t border-gray-100">
          <button
            onClick={onClearAll}
            className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
