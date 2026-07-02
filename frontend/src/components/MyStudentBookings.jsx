import { useState, useEffect } from 'react';
import { apiGet } from '../utils/api';

export default function MyStudentBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await apiGet('/api/bookings');
        setBookings(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <section className="flex flex-col h-full bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm" data-purpose="my-student-bookings">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-extrabold text-bts-gold uppercase tracking-wider">
          Student Bookings
        </span>
        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
          {bookings.length} request{bookings.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-gray-400">
          <div className="w-5 h-5 border-2 border-bts-gold/20 border-t-bts-gold rounded-full animate-spin mb-2"></div>
          <p className="text-[10px] font-semibold">Loading student bookings...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center gap-3 text-red-500 py-6">
          <span className="material-symbols-outlined !text-lg text-red-400">error</span>
          <p className="text-xs font-semibold">{error}</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-gray-400 space-y-2">
          <span className="material-symbols-outlined !text-2xl text-gray-300">calendar_today</span>
          <p className="text-xs font-semibold text-gray-400">No student bookings yet</p>
          <p className="text-[9px] text-gray-500 max-w-[200px] leading-normal">
            When students book a private mentorship session with you, they will appear here.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto max-h-[300px] space-y-3 pr-1">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl hover:border-bts-gold/20 transition-all group"
            >
              {/* Student Avatar */}
              <img
                src={booking.studentAvatar}
                alt={booking.studentName}
                className="w-10 h-10 rounded-full border border-gray-200 shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-1">
                  <p className="text-xs font-extrabold text-brand-dark truncate">{booking.studentName}</p>
                  <span className="text-[9px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full shrink-0">
                    {booking.status}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-bts-gold truncate mt-0.5">
                  {booking.topic}
                </p>
                <p className="text-[9px] text-gray-400 mt-1">
                  May {booking.date}, 2026 at {booking.slot} ({booking.duration} hr)
                </p>
              </div>

              {/* Earnings info */}
              <div className="text-right shrink-0">
                <span className="text-[10px] font-extrabold text-brand-dark block">
                  +{booking.cost} BTS
                </span>
                <span className="text-[8px] text-gray-400 font-bold block">
                  Pending Payout
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
