import { useState } from 'react';

const SKILL_OPTIONS = [
  'Web3', 'Security', 'Solidity', 'Rust', 'AI/ML', 'UI/UX', 'React',
  'Python', 'DeFi', 'Strategy', 'Networking', 'Economics', 'GameFi', 'Automation'
];

const DIFFICULTY_OPTIONS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const defaultForm = {
  title: '',
  description: '',
  reward: '',
  deadline: '',
  difficulty: 'Intermediate',
  teamSize: 1,
  tags: [],
  deliverables: [''],
};

export default function CreateMissionModal({ onClose, onCreate }) {
  const [form, setForm] = useState(defaultForm);
  const [step, setStep] = useState(1); // 1 = basics, 2 = details
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const toggleTag = (tag) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag]
    }));
  };

  const addCustomTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const updateDeliverable = (idx, val) => {
    const updated = [...form.deliverables];
    updated[idx] = val;
    setForm(f => ({ ...f, deliverables: updated }));
  };

  const addDeliverable = () => {
    setForm(f => ({ ...f, deliverables: [...f.deliverables, ''] }));
  };

  const removeDeliverable = (idx) => {
    setForm(f => ({ ...f, deliverables: f.deliverables.filter((_, i) => i !== idx) }));
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim() || form.description.length < 30) e.description = 'Description must be at least 30 characters';
    if (!form.reward || Number(form.reward) <= 0) e.reward = 'Enter a valid budget';
    if (!form.deadline || Number(form.deadline) <= 0) e.deadline = 'Enter a valid deadline';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (form.tags.length === 0) e.tags = 'Select at least one skill/tag';
    const filled = form.deliverables.filter(d => d.trim());
    if (filled.length === 0) e.deliverables = 'Add at least one deliverable';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    onCreate({
      title: form.title.trim(),
      description: form.description.trim(),
      reward: Number(form.reward),
      deadline: Number(form.deadline),
      difficulty: form.difficulty,
      teamSize: Number(form.teamSize),
      tags: form.tags,
      deliverables: form.deliverables.filter(d => d.trim()),
      thumbnail: `https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop`,
      faqs: [],
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-100 rounded-3xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-3xl flex items-center justify-between z-10">
          <div>
            <h2 className="text-sm font-extrabold text-brand-dark">Post a Mission</h2>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Step {step} of 2 — {step === 1 ? 'Project Basics' : 'Skills & Deliverables'}
            </p>
          </div>
          {/* Progress dots */}
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-brand-dark' : 'bg-gray-200'}`} />
            <span className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-brand-dark' : 'bg-gray-200'}`} />
            <button onClick={onClose} className="ml-3 text-gray-400 hover:text-brand-dark text-xl font-bold leading-none">×</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {step === 1 && (
            <>
              {/* Title */}
              <div>
                <label className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">
                  Mission Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  placeholder="e.g. Smart Contract Security Audit"
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl text-xs text-brand-dark focus:outline-none focus:border-bts-gold focus:bg-white transition-all ${errors.title ? 'border-rose-400' : 'border-gray-150'}`}
                />
                {errors.title && <p className="text-[10px] text-rose-500 mt-1">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">
                  Project Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows="4"
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  placeholder="Describe the project scope, goals, and any technical requirements..."
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl text-xs text-brand-dark focus:outline-none focus:border-bts-gold focus:bg-white transition-all resize-none ${errors.description ? 'border-rose-400' : 'border-gray-150'}`}
                />
                {errors.description && <p className="text-[10px] text-rose-500 mt-1">{errors.description}</p>}
                <p className="text-[9px] text-gray-300 mt-1 text-right">{form.description.length} chars</p>
              </div>

              {/* Budget + Deadline */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">
                    Budget (BTS) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-bts-gold font-extrabold text-xs">◈</span>
                    <input
                      type="number"
                      min="1"
                      value={form.reward}
                      onChange={e => set('reward', e.target.value)}
                      placeholder="1000"
                      className={`w-full pl-8 pr-3 py-3 bg-gray-50 border rounded-2xl text-xs text-brand-dark focus:outline-none focus:border-bts-gold focus:bg-white transition-all ${errors.reward ? 'border-rose-400' : 'border-gray-150'}`}
                    />
                  </div>
                  {errors.reward && <p className="text-[10px] text-rose-500 mt-1">{errors.reward}</p>}
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">
                    Deadline (days) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.deadline}
                    onChange={e => set('deadline', e.target.value)}
                    placeholder="14"
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl text-xs text-brand-dark focus:outline-none focus:border-bts-gold focus:bg-white transition-all ${errors.deadline ? 'border-rose-400' : 'border-gray-150'}`}
                  />
                  {errors.deadline && <p className="text-[10px] text-rose-500 mt-1">{errors.deadline}</p>}
                </div>
              </div>

              {/* Difficulty + Team Size */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">Difficulty</label>
                  <select
                    value={form.difficulty}
                    onChange={e => set('difficulty', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl text-xs text-brand-dark focus:outline-none focus:border-bts-gold focus:bg-white transition-all cursor-pointer appearance-none"
                  >
                    {DIFFICULTY_OPTIONS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">Team Size</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={form.teamSize}
                    onChange={e => set('teamSize', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl text-xs text-brand-dark focus:outline-none focus:border-bts-gold focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-brand-dark text-white rounded-2xl text-xs font-extrabold hover:bg-bts-gold hover:text-brand-dark transition-all shadow-md"
                >
                  Next: Skills & Deliverables →
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Skills / Tags */}
              <div>
                <label className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">
                  Required Skills / Tags <span className="text-rose-400">*</span>
                </label>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {SKILL_OPTIONS.map(tag => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all ${
                        form.tags.includes(tag)
                          ? 'bg-brand-dark text-white border-brand-dark'
                          : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-brand-dark'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                    placeholder="Add custom tag..."
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-150 rounded-xl text-xs text-brand-dark focus:outline-none focus:border-bts-gold focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={addCustomTag}
                    className="px-3 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-brand-dark hover:text-white transition-all"
                  >
                    + Add
                  </button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {form.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-bts-gold/10 text-brand-dark border border-bts-gold/20 rounded text-[10px] font-bold">
                        {tag}
                        <button type="button" onClick={() => toggleTag(tag)} className="text-gray-400 hover:text-rose-500 leading-none">×</button>
                      </span>
                    ))}
                  </div>
                )}
                {errors.tags && <p className="text-[10px] text-rose-500 mt-1">{errors.tags}</p>}
              </div>

              {/* Deliverables */}
              <div>
                <label className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">
                  Deliverables <span className="text-rose-400">*</span>
                </label>
                <div className="space-y-2">
                  {form.deliverables.map((d, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="text-bts-gold font-extrabold text-sm shrink-0 w-4">{idx + 1}</span>
                      <input
                        type="text"
                        value={d}
                        onChange={e => updateDeliverable(idx, e.target.value)}
                        placeholder={`e.g. ${idx === 0 ? 'Security audit report' : idx === 1 ? 'Remediation plan' : 'Deployment guide'}`}
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-150 rounded-xl text-xs text-brand-dark focus:outline-none focus:border-bts-gold focus:bg-white transition-all"
                      />
                      {form.deliverables.length > 1 && (
                        <button type="button" onClick={() => removeDeliverable(idx)} className="text-gray-300 hover:text-rose-500 transition-all text-sm">×</button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addDeliverable}
                  className="mt-2 text-xs font-bold text-bts-gold hover:text-brand-dark transition-colors"
                >
                  + Add Deliverable
                </button>
                {errors.deliverables && <p className="text-[10px] text-rose-500 mt-1">{errors.deliverables}</p>}
              </div>

              {/* Preview summary */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-2">
                <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest">Mission Summary</p>
                <h4 className="text-sm font-extrabold text-brand-dark">{form.title || '—'}</h4>
                <div className="flex items-center gap-3 text-[10px] text-gray-400 font-semibold">
                  <span>◈ {form.reward || '—'} BTS</span>
                  <span>·</span>
                  <span>{form.deadline || '—'} days</span>
                  <span>·</span>
                  <span>{form.difficulty}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-2xl text-xs font-bold hover:border-brand-dark transition-all"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-brand-dark text-white rounded-2xl text-xs font-extrabold hover:bg-bts-gold hover:text-brand-dark transition-all shadow-md"
                >
                  🚀 Publish Mission
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
