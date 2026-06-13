import { useState } from 'react';
import { institutes } from '../data/institutes';
import { createPremiumPublicSession } from '../utils/sessionsStorage';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function CreatePremiumSessionModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    instituteId: 'bitstacks',
    level: 'Intermediate',
    duration: '90 Mins',
    date: '',
    time: '2:00 PM EST',
    maxCapacity: 100,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
    instructorName: '',
    instructorRole: 'Institute Faculty',
  });
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
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

    const institute = institutes.find((i) => i.id === form.instituteId);
    const session = createPremiumPublicSession({
      title: form.title.trim(),
      shortDescription: form.shortDescription.trim(),
      overview: form.shortDescription.trim(),
      instituteId: form.instituteId,
      instituteName: institute?.title,
      level: form.level,
      duration: form.duration,
      date: form.date,
      time: form.time,
      scheduleDate: form.date,
      scheduleTime: form.time,
      timeInfo: `${form.date} · ${form.time}`,
      maxCapacity: Number(form.maxCapacity) || 100,
      image: form.image,
      topic: 'Premium Workshop',
      instructor: {
        name: form.instructorName.trim() || `${institute?.title || 'Institute'} Faculty`,
        role: form.instructorRole,
        avatar: 'https://ui-avatars.com/api/?name=Faculty&background=d4a017&color=0b1121&size=80',
        mentorId: null,
      },
    });

    onCreated?.(session);
    onClose();
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
              <h3 className="text-lg font-extrabold text-brand-dark">Create Premium Public Session</h3>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                Admin-only. Published instantly platform-wide from the selected institute.
              </p>
            </div>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-brand-dark cursor-pointer">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">Title</label>
            <input
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-bts-gold/30"
              placeholder="e.g. Advanced ZK Rollup Engineering"
            />
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">Institute</label>
            <select
              value={form.instituteId}
              onChange={(e) => handleChange('instituteId', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-bts-gold/30 cursor-pointer"
            >
              {institutes.map((inst) => (
                <option key={inst.id} value={inst.id}>{inst.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">Description</label>
            <textarea
              value={form.shortDescription}
              onChange={(e) => handleChange('shortDescription', e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-bts-gold/30"
              placeholder="What will students learn in this premium workshop?"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">Date</label>
              <input
                value={form.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-bts-gold/30"
                placeholder="June 25"
              />
            </div>
            <div>
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">Time</label>
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
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">Level</label>
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
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
            <div>
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">Instructor Name</label>
              <input
                value={form.instructorName}
                onChange={(e) => handleChange('instructorName', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-bts-gold/30"
                placeholder="Optional"
              />
            </div>
          </div>

          {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2.5 rounded-xl bg-bts-gold text-white text-sm font-extrabold hover:opacity-90 cursor-pointer">
              Publish Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
