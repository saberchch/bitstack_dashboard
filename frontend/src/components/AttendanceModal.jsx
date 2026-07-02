import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../utils/api';

export default function AttendanceModal({ session, onClose }) {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGet(`/api/attendance/${session.id}`);
        // If no saved records yet, seed from session.attendees count (placeholder)
        if (!data || data.length === 0) {
          setAttendees([]);
        } else {
          setAttendees(data.map(a => ({ ...a, attended: !!a.attended })));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [session.id]);

  const toggle = (idx) => {
    setAttendees(prev => prev.map((a, i) => i === idx ? { ...a, attended: !a.attended } : a));
    setSaved(false);
  };

  const addManual = () => {
    setAttendees(prev => [...prev, {
      studentId: `manual-${Date.now()}`,
      studentName: 'New Student',
      studentAvatar: 'https://ui-avatars.com/api/?name=Student&background=d4a017&color=0b1121',
      attended: false,
    }]);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await apiPost(`/api/attendance/${session.id}`, { attendances: attendees });
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const presentCount = attendees.filter(a => a.attended).length;
  const total = attendees.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div>
            <p className="text-[10px] font-extrabold text-bts-gold uppercase tracking-widest mb-0.5">Attendance</p>
            <h3 className="text-base font-extrabold text-brand-dark truncate max-w-xs">{session.title}</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10 gap-2 text-gray-400">
              <div className="w-5 h-5 border-2 border-bts-gold/20 border-t-bts-gold rounded-full animate-spin" />
              <span className="text-xs font-semibold">Loading roster...</span>
            </div>
          ) : error ? (
            <p className="text-sm text-red-500 text-center py-6">{error}</p>
          ) : attendees.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <p className="text-sm font-bold text-gray-500">No students enrolled yet</p>
              <p className="text-xs text-gray-400">You can add students manually below</p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Summary bar */}
              <div className="flex items-center justify-between text-xs font-bold mb-3">
                <span className="text-gray-500">{total} students</span>
                <span className="text-emerald-600">{presentCount} present · {total - presentCount} absent</span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full mb-4 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: total > 0 ? `${(presentCount/total)*100}%` : '0%' }} />
              </div>
              {attendees.map((a, idx) => (
                <div
                  key={a.studentId}
                  onClick={() => toggle(idx)}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    a.attended
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-gray-100 bg-white hover:bg-gray-50'
                  }`}
                >
                  <img
                    src={a.studentAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.studentName || 'S')}&background=d4a017&color=0b1121`}
                    alt={a.studentName}
                    className="w-9 h-9 rounded-full border border-gray-200 object-cover shrink-0"
                  />
                  <span className="flex-1 text-sm font-semibold text-brand-dark">{a.studentName}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                    a.attended ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
                  }`}>
                    {a.attended && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
          <button
            onClick={addManual}
            className="text-xs font-bold text-gray-500 hover:text-brand-dark flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            Add Student
          </button>
          <div className="flex items-center gap-3">
            {saved && <span className="text-xs font-bold text-emerald-600">✓ Saved</span>}
            <button onClick={onClose} className="text-xs font-bold text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || attendees.length === 0}
              className="bg-brand-dark hover:bg-gray-700 text-white text-xs font-extrabold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
