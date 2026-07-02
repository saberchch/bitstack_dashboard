import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPatch } from '../utils/api';

const STATUS_STYLES = {
  Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending:   'bg-amber-50 text-amber-700 border-amber-200',
  Declined:  'bg-red-50 text-red-600 border-red-200',
  Completed: 'bg-blue-50 text-blue-700 border-blue-200',
};

export default function BookingRequestsPanel() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'Pending' | 'Confirmed' | 'Declined'

  const fetchBookings = useCallback(async () => {
    try {
      const data = await apiGet('/api/bookings');
      setBookings(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const updateStatus = async (bookingId, newStatus) => {
    setActionLoading(prev => ({ ...prev, [bookingId]: newStatus }));
    try {
      const updated = await apiPatch(`/api/bookings/${bookingId}`, { status: newStatus });
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: updated.status || newStatus } : b));
    } catch (err) {
      alert('Could not update booking: ' + err.message);
    } finally {
      setActionLoading(prev => { const n = { ...prev }; delete n[bookingId]; return n; });
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);
  const counts = {
    all: bookings.length,
    Pending: bookings.filter(b => b.status === 'Pending' || !b.status).length,
    Confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    Declined: bookings.filter(b => b.status === 'Declined').length,
  };

  const TABS = [
    { key: 'all', label: 'All' },
    { key: 'Pending', label: 'Pending' },
    { key: 'Confirmed', label: 'Confirmed' },
    { key: 'Declined', label: 'Declined' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-50 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-[10px] font-extrabold text-bts-gold uppercase tracking-widest block mb-0.5">Requests</span>
          <h3 className="font-extrabold text-lg text-brand-dark">Private Booking Requests</h3>
        </div>
        <button onClick={fetchBookings} className="p-2 text-gray-400 hover:text-brand-dark rounded-lg hover:bg-gray-100 transition-colors" title="Refresh">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100 mb-5 flex-wrap">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`flex-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
              filter === t.key
                ? 'bg-white text-brand-dark shadow-sm border border-gray-100'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {t.label}
            {counts[t.key] > 0 && (
              <span className={`ml-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                t.key === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
              }`}>{counts[t.key]}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 gap-2 text-gray-400">
          <div className="w-5 h-5 border-2 border-bts-gold/20 border-t-bts-gold rounded-full animate-spin" />
          <span className="text-xs font-semibold">Loading requests...</span>
        </div>
      ) : error ? (
        <p className="text-sm text-red-500 text-center py-8">{error}</p>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          <p className="text-sm font-bold text-gray-500">No {filter !== 'all' ? filter.toLowerCase() : ''} requests</p>
          <p className="text-xs text-gray-400">Booking requests from students will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(b => {
            const status = b.status || 'Confirmed';
            const isPending = status === 'Pending';
            const isLoading = actionLoading[b.id];
            return (
              <div key={b.id} className="flex items-start gap-3 p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-all">
                <img
                  src={b.studentAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(b.studentName || 'S')}&background=e0e7ff&color=4338ca`}
                  alt={b.studentName}
                  className="w-10 h-10 rounded-full border border-gray-200 object-cover shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="text-sm font-extrabold text-brand-dark">{b.studentName || 'Student'}</p>
                      <p className="text-[10px] font-bold text-bts-gold truncate">{b.topic}</p>
                    </div>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${STATUS_STYLES[status] || STATUS_STYLES.Confirmed}`}>
                      {status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-400 flex-wrap">
                    <span>Day {b.date} · {b.slot}</span>
                    <span>·</span>
                    <span>{b.duration}h session</span>
                    <span>·</span>
                    <span className="font-bold text-emerald-600">+{b.cost} BTS</span>
                  </div>

                  {/* Action buttons */}
                  {isPending && (
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => updateStatus(b.id, 'Confirmed')}
                        disabled={!!isLoading}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isLoading === 'Confirmed' ? '...' : '✓ Accept'}
                      </button>
                      <button
                        onClick={() => updateStatus(b.id, 'Declined')}
                        disabled={!!isLoading}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-extrabold py-1.5 rounded-lg border border-red-200 transition-colors disabled:opacity-50"
                      >
                        {isLoading === 'Declined' ? '...' : '✕ Decline'}
                      </button>
                    </div>
                  )}
                  {status === 'Confirmed' && (
                    <button
                      onClick={() => updateStatus(b.id, 'Completed')}
                      disabled={!!isLoading}
                      className="mt-2 text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading === 'Completed' ? 'Updating...' : 'Mark as Completed →'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
