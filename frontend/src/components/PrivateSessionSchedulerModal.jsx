import { useState } from 'react';

export default function PrivateSessionSchedulerModal({ isOpen, onClose, onSchedule, candidateName }) {
  const [form, setForm] = useState({
    date: '2026-06-15',
    time: '10:00',
    duration: '1h',
    notes: 'Align on project milestones, timeline, and escrow payout splits.',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date || !form.time) {
      setErrors({ date: !form.date ? 'Required' : null, time: !form.time ? 'Required' : null });
      return;
    }
    setSubmitting(true);

    setTimeout(() => {
      const newSession = {
        id: `align-${Date.now()}`,
        title: `Project Alignment: ${candidateName}`,
        type: 'private',
        date: form.date,
        time: form.time,
        duration: form.duration,
        host: 'You',
        hostRole: 'Project Creator',
        location: 'Private Video Link',
        seats: '1/1',
        desc: form.notes,
        tags: ['D-Lancer', 'Alignment'],
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(candidateName)}&background=0b1121&color=d4a017&size=40`
      };

      try {
        const saved = localStorage.getItem('bts_calendar_sessions');
        const list = saved ? JSON.parse(saved) : [];
        list.push(newSession);
        localStorage.setItem('bts_calendar_sessions', JSON.stringify(list));
        // Dispatch sync event
        window.dispatchEvent(new Event('bts_calendar_sync'));
      } catch (err) {
        console.error('Failed to sync session with calendar', err);
      }

      onSchedule({
        date: form.date,
        time: form.time,
        notes: form.notes,
      });
      setSubmitting(false);
      onClose();
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/65 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn text-left">
        {/* Header */}
        <div className="bg-brand-dark text-white p-6 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-white/10" />
          <div className="relative z-10">
            <h3 className="text-base font-extrabold">Schedule Alignment Session</h3>
            <p className="text-xs text-white/60 mt-1">Arrange a private slot with {candidateName} to construct milestones.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Session Date *</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={e => {
                  setForm({ ...form, date: e.target.value });
                  setErrors({ ...errors, date: null });
                }}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-brand-dark focus:outline-none focus:border-bts-gold transition-all"
              />
              {errors.date && <p className="text-[10px] text-rose-500 font-bold mt-0.5">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Start Time *</label>
              <input
                type="time"
                required
                value={form.time}
                onChange={e => {
                  setForm({ ...form, time: e.target.value });
                  setErrors({ ...errors, time: null });
                }}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-brand-dark focus:outline-none focus:border-bts-gold transition-all"
              />
              {errors.time && <p className="text-[10px] text-rose-500 font-bold mt-0.5">{errors.time}</p>}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Duration</label>
            <select
              value={form.duration}
              onChange={e => setForm({ ...form, duration: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-brand-dark focus:outline-none focus:border-bts-gold transition-all"
            >
              <option value="30m">30 Minutes</option>
              <option value="1h">1 Hour</option>
              <option value="1.5h">1.5 Hours</option>
              <option value="2h">2 Hours</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Alignment Call Agenda</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="Provide context or links for the freelancer..."
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-brand-dark focus:outline-none focus:border-bts-gold transition-all resize-none"
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2 bg-brand-dark hover:bg-bts-gold text-white hover:text-brand-dark rounded-xl text-xs font-extrabold transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              {submitting ? 'Scheduling…' : 'Schedule Call'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
