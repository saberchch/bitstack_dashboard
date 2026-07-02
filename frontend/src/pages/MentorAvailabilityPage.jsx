import { useState, useEffect, useCallback } from 'react';
import Topbar from '../components/Topbar';
import { apiGet, apiPost, apiPatch, apiDelete } from '../utils/api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIMES = [
  '8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM',
  '1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM'
];

function AddSlotForm({ dayIndex, onAdded }) {
  const [start, setStart] = useState('9:00 AM');
  const [end, setEnd] = useState('10:00 AM');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleAdd = async () => {
    setErr('');
    if (start === end) { setErr('Start and end must differ.'); return; }
    setLoading(true);
    try {
      const slot = await apiPost('/api/availability', { dayOfWeek: dayIndex, startTime: start, endTime: end });
      onAdded(slot);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap mt-3 pt-3 border-t border-gray-100">
      <select value={start} onChange={e => setStart(e.target.value)}
        className="text-xs font-semibold border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-bts-gold/20">
        {TIMES.map(t => <option key={t}>{t}</option>)}
      </select>
      <span className="text-xs text-gray-400 font-bold">→</span>
      <select value={end} onChange={e => setEnd(e.target.value)}
        className="text-xs font-semibold border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-bts-gold/20">
        {TIMES.map(t => <option key={t}>{t}</option>)}
      </select>
      <button
        onClick={handleAdd}
        disabled={loading}
        className="flex items-center gap-1 bg-bts-gold hover:bg-yellow-500 text-gray-950 text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? '...' : '+ Add'}
      </button>
      {err && <p className="text-[10px] text-red-500 font-semibold w-full">{err}</p>}
    </div>
  );
}

export default function MentorAvailabilityPage() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDays, setOpenDays] = useState({});
  const [toggling, setToggling] = useState({});
  const [deleting, setDeleting] = useState({});

  const fetchSlots = useCallback(async () => {
    try {
      const data = await apiGet('/api/availability');
      setSlots(data || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  const slotsByDay = DAYS.map((day, idx) => ({
    day,
    idx,
    slots: slots.filter(s => s.dayOfWeek === idx),
  }));

  const toggleActive = async (slot) => {
    setToggling(prev => ({ ...prev, [slot.id]: true }));
    try {
      const updated = await apiPatch(`/api/availability/${slot.id}/toggle`);
      setSlots(prev => prev.map(s => s.id === slot.id ? { ...s, isActive: updated.isActive } : s));
    } catch { /* silent */ } finally {
      setToggling(prev => { const n = { ...prev }; delete n[slot.id]; return n; });
    }
  };

  const deleteSlot = async (slot) => {
    setDeleting(prev => ({ ...prev, [slot.id]: true }));
    try {
      await apiDelete(`/api/availability/${slot.id}`);
      setSlots(prev => prev.filter(s => s.id !== slot.id));
    } catch { /* silent */ } finally {
      setDeleting(prev => { const n = { ...prev }; delete n[slot.id]; return n; });
    }
  };

  const addSlot = (slot) => {
    setSlots(prev => [...prev, slot]);
  };

  const totalActive = slots.filter(s => s.isActive).length;

  return (
    <>
      <Topbar searchPlaceholder="Availability settings..." />

      {/* Header */}
      <div className="mb-6">
        <p className="text-[10px] font-extrabold text-bts-gold uppercase tracking-widest mb-0.5">Settings</p>
        <h2 className="text-2xl font-extrabold text-brand-dark">Availability Schedule</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          Define when students can book private sessions with you.
          {totalActive > 0 && <span className="ml-2 text-emerald-600 font-bold">{totalActive} active slots</span>}
        </p>
      </div>

      {/* Summary banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-5 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-bts-gold/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Current availability</p>
            <p className="text-2xl font-extrabold text-white">{totalActive} <span className="text-sm text-gray-400">active slots</span></p>
            <p className="text-xs text-gray-400 mt-0.5">
              Across {new Set(slots.filter(s => s.isActive).map(s => s.dayOfWeek)).size} days per week
            </p>
          </div>
          <div className="flex items-center gap-6">
            {DAYS.slice(0, 5).map((d, i) => {
              const hasActive = slots.some(s => s.dayOfWeek === i && s.isActive);
              return (
                <div key={d} className="flex flex-col items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${hasActive ? 'bg-bts-gold' : 'bg-gray-600'}`} />
                  <span className="text-[9px] text-gray-400 font-bold">{d.slice(0, 1)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Day grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-gray-400">
          <div className="w-5 h-5 border-2 border-bts-gold/20 border-t-bts-gold rounded-full animate-spin" />
          <span className="text-xs font-semibold">Loading availability...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {slotsByDay.map(({ day, idx, slots: daySlots }) => {
            const isOpen = openDays[idx];
            const activeCount = daySlots.filter(s => s.isActive).length;
            return (
              <div
                key={day}
                className={`bg-white rounded-2xl border transition-all shadow-sm ${
                  activeCount > 0 ? 'border-bts-gold/20' : 'border-gray-100'
                }`}
              >
                {/* Day header */}
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${activeCount > 0 ? 'bg-bts-gold' : 'bg-gray-200'}`} />
                    <div>
                      <p className="text-sm font-extrabold text-brand-dark">{day}</p>
                      <p className="text-[10px] text-gray-400">
                        {daySlots.length === 0 ? 'No slots' : `${activeCount}/${daySlots.length} active`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setOpenDays(prev => ({ ...prev, [idx]: !isOpen }))}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-brand-dark hover:bg-gray-100 transition-colors"
                  >
                    <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>
                </div>

                {/* Slot list */}
                {(isOpen || daySlots.length > 0) && (
                  <div className="px-5 pb-4">
                    {daySlots.length > 0 && (
                      <div className="space-y-2 mb-2">
                        {daySlots.map(slot => (
                          <div
                            key={slot.id}
                            className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                              slot.isActive
                                ? 'border-bts-gold/20 bg-yellow-50/50'
                                : 'border-gray-100 bg-gray-50/50 opacity-60'
                            }`}
                          >
                            <span className="text-xs font-bold text-brand-dark">
                              {slot.startTime} – {slot.endTime}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {/* Toggle */}
                              <button
                                onClick={() => toggleActive(slot)}
                                disabled={toggling[slot.id]}
                                className={`w-8 h-4 rounded-full transition-all relative shrink-0 ${
                                  slot.isActive ? 'bg-bts-gold' : 'bg-gray-200'
                                } disabled:opacity-50`}
                              >
                                <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${
                                  slot.isActive ? 'right-0.5' : 'left-0.5'
                                }`} />
                              </button>
                              {/* Delete */}
                              <button
                                onClick={() => deleteSlot(slot)}
                                disabled={deleting[slot.id]}
                                className="p-1 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors disabled:opacity-50"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add slot form */}
                    {(isOpen || daySlots.length === 0) && (
                      <AddSlotForm dayIndex={idx} onAdded={addSlot} />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
