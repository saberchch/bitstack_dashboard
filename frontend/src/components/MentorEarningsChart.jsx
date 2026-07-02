import { useState, useEffect, useMemo } from 'react';
import { getProfile } from '../utils/profileStorage';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getWeekEarnings(transactions) {
  const now = new Date();
  const weekStart = new Date(now);
  const day = weekStart.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  weekStart.setDate(weekStart.getDate() + diff);
  weekStart.setHours(0, 0, 0, 0);

  return DAY_LABELS.map((label, i) => {
    const dayDate = new Date(weekStart);
    dayDate.setDate(weekStart.getDate() + i);
    const dateKey = dayDate.toISOString().slice(0, 10);

    const earned = transactions
      .filter(t => {
        if (!t.date) return false;
        const tDate = new Date(t.date).toISOString().slice(0, 10);
        return tDate === dateKey && (t.type === 'Session Payout' || t.type === 'Mission Payout' || String(t.amount || '').startsWith('+'));
      })
      .reduce((sum, t) => {
        const clean = String(t.amount || '0').replace('+', '').replace(/,/g, '');
        return sum + (parseFloat(clean) || 0);
      }, 0);

    return { day: label, earned };
  });
}

export default function MentorEarningsChart() {
  const [profile, setProfile] = useState(() => getProfile());
  const [transactions, setTransactions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bts_transactions') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    const refresh = () => {
      setProfile(getProfile());
      try { setTransactions(JSON.parse(localStorage.getItem('bts_transactions') || '[]')); } catch {}
    };
    window.addEventListener('bts_profile_change', refresh);
    window.addEventListener('bts_transactions_change', refresh);
    return () => {
      window.removeEventListener('bts_profile_change', refresh);
      window.removeEventListener('bts_transactions_change', refresh);
    };
  }, []);

  const weekData = useMemo(() => getWeekEarnings(transactions), [transactions]);
  const maxEarned = Math.max(...weekData.map(d => d.earned), 1);
  const totalWeekly = weekData.reduce((s, d) => s + d.earned, 0);
  const totalEarned = transactions
    .filter(t => String(t.amount || '').startsWith('+'))
    .reduce((sum, t) => {
      const clean = String(t.amount || '0').replace('+', '').replace(/,/g, '');
      return sum + (parseFloat(clean) || 0);
    }, 0);

  const balance = profile.balance || 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 h-full flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <div>
          <span className="text-[10px] font-extrabold text-bts-gold uppercase tracking-widest block mb-0.5">
            Earnings
          </span>
          <h3 className="font-extrabold text-lg text-brand-dark">Weekly Revenue</h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 font-bold uppercase">This Week</p>
          <p className="text-lg font-extrabold text-emerald-600">
            +{totalWeekly.toLocaleString()} <span className="text-xs text-gray-400">BTS</span>
          </p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-2 mt-5 mb-3 h-28 px-1">
        {weekData.map((d) => {
          const heightPct = (d.earned / maxEarned) * 100;
          const isToday = d.day === DAY_LABELS[(new Date().getDay() + 6) % 7];
          return (
            <div key={d.day} className="flex flex-col items-center flex-1 gap-1">
              <div className="w-full flex flex-col justify-end h-24">
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${isToday ? 'bg-bts-gold' : 'bg-emerald-100 hover:bg-emerald-300'}`}
                  style={{ height: `${Math.max(heightPct, d.earned > 0 ? 8 : 3)}%` }}
                  title={`${d.earned} BTS`}
                />
              </div>
              <span className={`text-[9px] font-bold ${isToday ? 'text-bts-gold' : 'text-gray-400'}`}>{d.day}</span>
            </div>
          );
        })}
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-50 mt-auto">
        <div>
          <p className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">Balance</p>
          <p className="text-sm font-extrabold text-brand-dark">{balance.toLocaleString()}</p>
          <p className="text-[9px] text-gray-400">BTS available</p>
        </div>
        <div>
          <p className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">Total Earned</p>
          <p className="text-sm font-extrabold text-emerald-600">+{totalEarned.toLocaleString()}</p>
          <p className="text-[9px] text-gray-400">All time BTS</p>
        </div>
        <div>
          <p className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">This Week</p>
          <p className="text-sm font-extrabold text-brand-dark">{totalWeekly.toLocaleString()}</p>
          <p className="text-[9px] text-gray-400">BTS sessions</p>
        </div>
      </div>
    </div>
  );
}
