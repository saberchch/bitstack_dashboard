import { useState } from 'react';
import { institutes } from '../data/institutes';
import { createPremiumPublicSession } from '../utils/sessionsStorage';
import { getProfile } from '../utils/profileStorage';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function CreatePremiumSessionModal({ onClose, onCreated }) {
  const profile = getProfile();
  const isAdmin = profile.platformRole === 'admin';

  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    instituteId: 'none',
    level: 'Intermediate',
    duration: '90 Mins',
    date: '',
    time: '2:00 PM EST',
    maxCapacity: 100,
    price: 150,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
    instructorName: profile.name || '',
    instructorRole: profile.role || 'Mentor',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Session title is required.');
      return;
    }
    if (!form.date.trim()) {
      setError('Scheduled date is required.');
      return;
    }
    if (!form.shortDescription.trim()) {
      setError('Short description is required.');
      return;
    }

    const finalInstituteId = isAdmin ? form.instituteId : 'none';
    const institute = finalInstituteId === 'none' ? null : institutes.find((i) => i.id === finalInstituteId);

    setSaving(true);
    setError('');
    try {
      const savedSession = await createPremiumPublicSession({
        title: form.title.trim(),
        shortDescription: form.shortDescription.trim(),
        overview: form.shortDescription.trim(),
        instituteId: finalInstituteId === 'none' ? null : finalInstituteId,
        instituteName: finalInstituteId === 'none' ? 'Independent Session' : institute?.title,
        level: form.level,
        duration: form.duration,
        date: form.date,
        time: form.time,
        scheduleDate: form.date,
        scheduleTime: form.time,
        timeInfo: `${form.date} · ${form.time}`,
        maxCapacity: Number(form.maxCapacity) || 100,
        price: Number(form.price) || 0,
        image: form.image,
        topic: 'Premium Workshop',
        instructor: {
          name: isAdmin ? (form.instructorName.trim() || profile.name) : profile.name,
          role: isAdmin ? form.instructorRole : (profile.role || 'Expert Mentor'),
          avatar: profile.avatar || '/alice_avatar.png',
          mentorId: profile.userId,
        },
      });
      onCreated?.(savedSession);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to publish session. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold text-brand-dark">Create Public Workshop</h3>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                {isAdmin
                  ? 'Admin Mode. Publish instantly platform-wide from the selected institute.'
                  : 'Mentor Mode. Publish a public workshop linked directly to your profile.'}
              </p>
            </div>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-brand-dark cursor-pointer">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">Workshop Title</label>
            <input
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-bts-gold/30"
              placeholder="e.g. Advanced ZK Rollup Engineering"
            />
          </div>

          {isAdmin && (
            <div>
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">Institute Association</label>
              <select
                value={form.instituteId}
                onChange={(e) => handleChange('instituteId', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-bts-gold/30 cursor-pointer"
              >
                <option value="none">None (Independent Session)</option>
                {institutes.map((inst) => (
                  <option key={inst.id} value={inst.id}>{inst.title}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">Description</label>
            <textarea
              value={form.shortDescription}
              onChange={(e) => handleChange('shortDescription', e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-bts-gold/30"
              placeholder="What will students learn in this workshop?"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">Scheduled Date</label>
              <input
                value={form.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-bts-gold/30"
                placeholder="June 25"
              />
            </div>
            <div>
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">Scheduled Time</label>
              <input
                value={form.time}
                onChange={(e) => handleChange('time', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-bts-gold/30"
                placeholder="2:00 PM EST"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">Target Level</label>
              <select
                value={form.level}
                onChange={(e) => handleChange('level', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-bts-gold/30"
              >
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">Duration</label>
              <input
                value={form.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-bts-gold/30"
                placeholder="e.g. 90 Mins"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">Price (BTS)</label>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-bts-gold/30"
              />
            </div>
            <div>
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">Max Capacity</label>
              <input
                type="number"
                min={10}
                value={form.maxCapacity}
                onChange={(e) => handleChange('maxCapacity', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-bts-gold/30"
              />
            </div>
          </div>

          {isAdmin && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">Instructor Name Override</label>
                <input
                  value={form.instructorName}
                  onChange={(e) => handleChange('instructorName', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-bts-gold/30"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">Instructor Role Override</label>
                <input
                  value={form.instructorRole}
                  onChange={(e) => handleChange('instructorRole', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-bts-gold/30"
                  placeholder="Optional"
                />
              </div>
            </div>
          )}

          {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={saving} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 cursor-pointer disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-bts-gold text-white text-sm font-extrabold hover:opacity-90 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
              {saving ? (
                <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Publishing...</>
              ) : 'Publish Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
