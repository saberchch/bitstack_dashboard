import { useState } from 'react';

const ALL_TAGS = ['Web3', 'Security', 'Rust', 'AI/ML', 'UI/UX', 'Python', 'Solidity', 'React', 'DeFi', 'Strategy', 'Blockchain'];

const DIFFICULTY_OPTIONS = ['Intermediate', 'Advanced', 'Expert'];

export default function CreateMissionModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    tags: [],
    reward: '',
    deadline: '',
    teamSize: 1,
    difficulty: 'Intermediate',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const toggleTag = (tag) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag],
    }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (!form.description.trim()) errs.description = 'Description is required.';
    if (form.tags.length === 0) errs.tags = 'Select at least one skill tag.';
    if (!form.reward || isNaN(Number(form.reward)) || Number(form.reward) <= 0) errs.reward = 'Enter a valid reward amount.';
    if (!form.deadline || isNaN(Number(form.deadline)) || Number(form.deadline) <= 0) errs.deadline = 'Enter a valid deadline in days.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitted(true);
    setTimeout(() => {
      onCreate({
        title: form.title.trim(),
        description: form.description.trim(),
        tags: form.tags,
        reward: Number(form.reward),
        deadline: Number(form.deadline),
        teamSize: Number(form.teamSize),
        difficulty: form.difficulty,
      });
    }, 900);
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(11, 17, 33, 0.65)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden"
        style={{ animation: 'modalIn .2s ease' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-extrabold text-brand-dark">Post a New Mission</h2>
            <p className="text-xs text-gray-400 mt-0.5">Find the right talent — milestones are set during alignment</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-brand-dark hover:bg-gray-50 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-7 py-6 space-y-5">

          {/* Title */}
          <div>
            <label className="block text-xs font-extrabold text-brand-dark mb-1.5 uppercase tracking-wider">
              Mission Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="e.g. Smart Contract Security Audit"
              className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold text-brand-dark placeholder:text-gray-300 outline-none transition-all ${
                errors.title ? 'border-rose-400 bg-rose-50' : 'border-gray-200 focus:border-bts-gold focus:ring-2 focus:ring-bts-gold/20'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-500 font-bold mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-extrabold text-brand-dark mb-1.5 uppercase tracking-wider">
              Description *
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Describe the scope, deliverables, and any specific requirements..."
              className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold text-brand-dark placeholder:text-gray-300 outline-none transition-all resize-none ${
                errors.description ? 'border-rose-400 bg-rose-50' : 'border-gray-200 focus:border-bts-gold focus:ring-2 focus:ring-bts-gold/20'
              }`}
            />
            {errors.description && <p className="text-xs text-rose-500 font-bold mt-1">{errors.description}</p>}
          </div>

          {/* Skill Tags */}
          <div>
            <label className="block text-xs font-extrabold text-brand-dark mb-2 uppercase tracking-wider">
              Skill Tags *
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    form.tags.includes(tag)
                      ? 'bg-brand-dark text-white border-brand-dark'
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-brand-dark hover:text-brand-dark'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {errors.tags && <p className="text-xs text-rose-500 font-bold mt-1">{errors.tags}</p>}
          </div>

          {/* Reward + Deadline */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-brand-dark mb-1.5 uppercase tracking-wider">
                Reward (BTS) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-bts-gold font-extrabold text-sm">◈</span>
                <input
                  type="number"
                  min="1"
                  value={form.reward}
                  onChange={e => handleChange('reward', e.target.value)}
                  placeholder="e.g. 1200"
                  className={`w-full pl-8 pr-4 py-3 rounded-xl border text-sm font-semibold text-brand-dark placeholder:text-gray-300 outline-none transition-all ${
                    errors.reward ? 'border-rose-400 bg-rose-50' : 'border-gray-200 focus:border-bts-gold focus:ring-2 focus:ring-bts-gold/20'
                  }`}
                />
              </div>
              {errors.reward && <p className="text-xs text-rose-500 font-bold mt-1">{errors.reward}</p>}
            </div>
            <div>
              <label className="block text-xs font-extrabold text-brand-dark mb-1.5 uppercase tracking-wider">
                Deadline (days) *
              </label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <input
                  type="number"
                  min="1"
                  value={form.deadline}
                  onChange={e => handleChange('deadline', e.target.value)}
                  placeholder="e.g. 14"
                  className={`w-full pl-9 pr-4 py-3 rounded-xl border text-sm font-semibold text-brand-dark placeholder:text-gray-300 outline-none transition-all ${
                    errors.deadline ? 'border-rose-400 bg-rose-50' : 'border-gray-200 focus:border-bts-gold focus:ring-2 focus:ring-bts-gold/20'
                  }`}
                />
              </div>
              {errors.deadline && <p className="text-xs text-rose-500 font-bold mt-1">{errors.deadline}</p>}
            </div>
          </div>

          {/* Team Size + Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-brand-dark mb-1.5 uppercase tracking-wider">
                Team Size
              </label>
              <select
                value={form.teamSize}
                onChange={e => handleChange('teamSize', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-brand-dark outline-none focus:border-bts-gold focus:ring-2 focus:ring-bts-gold/20 transition-all bg-white"
              >
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-extrabold text-brand-dark mb-1.5 uppercase tracking-wider">
                Difficulty
              </label>
              <select
                value={form.difficulty}
                onChange={e => handleChange('difficulty', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-brand-dark outline-none focus:border-bts-gold focus:ring-2 focus:ring-bts-gold/20 transition-all bg-white"
              >
                {DIFFICULTY_OPTIONS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-100 rounded-xl px-4 py-3">
            <p className="text-[11px] font-extrabold text-amber-800 mb-0.5">Milestones come later</p>
            <p className="text-xs text-amber-900/75 font-semibold leading-relaxed">
              You do not need to define milestones now. After freelancers apply, schedule a private alignment session and agree on milestones and escrow splits before activating the contract.
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-gray-100 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:border-gray-300 hover:text-brand-dark transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitted}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-dark text-white rounded-xl text-sm font-extrabold hover:bg-bts-gold hover:text-brand-dark transition-all shadow-lg shadow-brand-dark/10 disabled:opacity-60"
          >
            {submitted ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Posting…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                Post Mission
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
