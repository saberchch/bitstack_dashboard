import { useState, useEffect } from 'react';

export default function AdvancedFilters({ isOpen, filters, onChange, onReset, availableSchools, availableModules }) {
  const [newSchoolInput, setNewSchoolInput] = useState("");
  const [newModuleInput, setNewModuleInput] = useState("");

  const [customSchools, setCustomSchools] = useState([]);
  const [customModules, setCustomModules] = useState([]);

  useEffect(() => {
    if (onReset) {
      // Clear custom typed items when reset is clicked
      setCustomSchools([]);
      setCustomModules([]);
    }
  }, [filters]);

  if (!isOpen) return null;

  const schoolsList = Array.from(new Set([
    ...availableSchools,
    ...customSchools
  ])).filter(s => s && s.trim() !== "");

  const modulesList = Array.from(new Set([
    ...availableModules,
    ...customModules
  ])).filter(m => m && m.trim() !== "");

  const goalsList = [
    "Exam prep",
    "TD & Tutorials",
    "Project coaching",
    "Catch-up"
  ];

  const languages = ["English", "French", "Arabic"];

  const availabilityOptions = [
    "Available Today",
    "Weekday Morning",
    "Weekday Evening",
    "Weekend"
  ];

  const handleSchoolChange = (schoolName) => {
    const active = filters.schools || [];
    const updated = active.includes(schoolName)
      ? active.filter(s => s !== schoolName)
      : [...active, schoolName];
    onChange({ ...filters, schools: updated });
  };

  const handleModuleChange = (moduleName) => {
    const active = filters.modules || [];
    const updated = active.includes(moduleName)
      ? active.filter(m => m !== moduleName)
      : [...active, moduleName];
    onChange({ ...filters, modules: updated });
  };

  const handleGoalChange = (goalName) => {
    const active = filters.goals || [];
    const updated = active.includes(goalName)
      ? active.filter(g => g !== goalName)
      : [...active, goalName];
    onChange({ ...filters, goals: updated });
  };

  const handleAvailabilityChange = (optName) => {
    const active = filters.availabilities || [];
    const updated = active.includes(optName)
      ? active.filter(a => a !== optName)
      : [...active, optName];
    onChange({ ...filters, availabilities: updated });
  };

  const handleAddCustomSchool = () => {
    const name = newSchoolInput.trim();
    if (name && !schoolsList.includes(name)) {
      setCustomSchools([...customSchools, name]);
      handleSchoolChange(name);
      setNewSchoolInput("");
    }
  };

  const handleAddCustomModule = () => {
    const name = newModuleInput.trim();
    if (name && !modulesList.includes(name)) {
      setCustomModules([...customModules, name]);
      handleModuleChange(name);
      setNewModuleInput("");
    }
  };

  return (
    <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 mb-6 animate-fade-in space-y-6">
      <div className="flex justify-between items-center pb-3 border-b border-gray-200/50">
        <h4 className="text-xs font-black text-brand-dark uppercase tracking-wider flex items-center gap-1.5">
          <span className="material-symbols-outlined !text-[16px] text-bts-gold">filter_alt</span>
          Advanced Filters
        </h4>
        <button 
          onClick={() => {
            setCustomSchools([]);
            setCustomModules([]);
            onReset();
          }}
          className="text-[10px] font-extrabold text-bts-gold hover:text-opacity-80 transition-colors uppercase tracking-wider cursor-pointer"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        
        {/* School Filters */}
        <div className="space-y-2">
          <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">School</label>
          <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
            {schoolsList.map(s => {
              const isChecked = (filters.schools || []).includes(s);
              return (
                <label key={s} className="flex items-center gap-2 text-xs text-brand-dark cursor-pointer font-medium hover:text-bts-gold transition-colors">
                  <input 
                    type="checkbox" 
                    checked={isChecked}
                    onChange={() => handleSchoolChange(s)}
                    className="rounded text-bts-gold focus:ring-bts-gold border-gray-300 w-3.5 h-3.5 cursor-pointer accent-[#d4a017]"
                  />
                  <span className="truncate">{s === "National Institute of Applied Sciences and Technology" ? "INSAT" : s}</span>
                </label>
              );
            })}
          </div>
          {/* Add custom school field */}
          <div className="flex gap-1 pt-1.5">
            <input 
              type="text"
              placeholder="Add school..."
              value={newSchoolInput}
              onChange={(e) => setNewSchoolInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSchool()}
              className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:ring-1 focus:ring-bts-gold outline-none flex-1 font-bold text-brand-dark"
            />
            <button
              onClick={handleAddCustomSchool}
              className="bg-brand-dark text-white rounded-lg px-2 py-1 text-[10px] font-black hover:bg-bts-gold transition-colors cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Subjects / Modules Filters */}
        <div className="space-y-2">
          <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Subjects / Modules</label>
          <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
            {modulesList.map(m => {
              const isChecked = (filters.modules || []).includes(m);
              return (
                <label key={m} className="flex items-center gap-2 text-xs text-brand-dark cursor-pointer font-medium hover:text-bts-gold transition-colors">
                  <input 
                    type="checkbox" 
                    checked={isChecked}
                    onChange={() => handleModuleChange(m)}
                    className="rounded text-bts-gold focus:ring-bts-gold border-gray-300 w-3.5 h-3.5 cursor-pointer accent-[#d4a017]"
                  />
                  <span className="truncate">{m}</span>
                </label>
              );
            })}
          </div>
          {/* Add custom module field */}
          <div className="flex gap-1 pt-1.5">
            <input 
              type="text"
              placeholder="Add subject..."
              value={newModuleInput}
              onChange={(e) => setNewModuleInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustomModule()}
              className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:ring-1 focus:ring-bts-gold outline-none flex-1 font-bold text-brand-dark"
            />
            <button
              onClick={handleAddCustomModule}
              className="bg-brand-dark text-white rounded-lg px-2 py-1 text-[10px] font-black hover:bg-bts-gold transition-colors cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Goals Filters */}
        <div className="space-y-2">
          <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Goals</label>
          <div className="space-y-1.5">
            {goalsList.map(g => {
              const isChecked = (filters.goals || []).includes(g);
              return (
                <label key={g} className="flex items-center gap-2 text-xs text-brand-dark cursor-pointer font-medium hover:text-bts-gold transition-colors">
                  <input 
                    type="checkbox" 
                    checked={isChecked}
                    onChange={() => handleGoalChange(g)}
                    className="rounded text-bts-gold focus:ring-bts-gold border-gray-300 w-3.5 h-3.5 cursor-pointer accent-[#d4a017]"
                  />
                  <span>{g}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Pricing, Language & Verification Controls */}
        <div className="space-y-4">
          
          {/* Price Range Slider */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Max Price</label>
              <span className="text-xs font-extrabold text-bts-gold">{filters.maxPrice || 800} BTS</span>
            </div>
            <input 
              type="range" 
              min="100" 
              max="800" 
              step="50"
              value={filters.maxPrice || 800}
              onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-full accent-[#d4a017] cursor-pointer"
            />
          </div>

          {/* Language Selector */}
          <div className="space-y-1">
            <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Language</label>
            <select
              value={filters.language || "All"}
              onChange={(e) => onChange({ ...filters, language: e.target.value })}
              className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-brand-dark focus:ring-1 focus:ring-bts-gold outline-none cursor-pointer"
            >
              <option value="All">All Languages</option>
              {languages.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Verified Only Toggle */}
          <div className="flex items-center justify-between bg-white border border-gray-150 p-2 rounded-xl shadow-xs">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-bts-gold !text-base">verified</span>
              <span className="text-[10px] font-bold text-brand-dark">Verified only</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={filters.verifiedOnly || false}
                onChange={(e) => onChange({ ...filters, verifiedOnly: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-bts-gold"></div>
            </label>
          </div>

        </div>

      </div>

      {/* Availability Selection */}
      <div className="space-y-2 pt-2 border-t border-gray-200/40">
        <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Availability</label>
        <div className="flex flex-wrap gap-2">
          {availabilityOptions.map(opt => {
            const isSelected = (filters.availabilities || []).includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleAvailabilityChange(opt)}
                className={`text-[10px] font-extrabold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-bts-gold border-bts-gold text-white shadow-xs' 
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-brand-dark'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
