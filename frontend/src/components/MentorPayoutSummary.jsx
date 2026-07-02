import { useState, useEffect } from 'react';
import { getProfile } from '../utils/profileStorage';

export default function MentorPayoutSummary() {
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

  const balance = profile.balance || 0;
  const totalEarned = transactions
    .filter(t => String(t.amount || '').startsWith('+'))
    .reduce((sum, t) => {
      const clean = String(t.amount || '0').replace('+', '').replace(/,/g, '');
      return sum + (parseFloat(clean) || 0);
    }, 0);
  const totalWithdrawn = transactions
    .filter(t => String(t.amount || '').startsWith('-'))
    .reduce((sum, t) => {
      const clean = String(t.amount || '0').replace('-', '').replace(/,/g, '');
      return sum + (parseFloat(clean) || 0);
    }, 0);
  const pending = Math.max(0, totalEarned - totalWithdrawn - balance);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
      <div className="mb-5">
        <span className="text-[10px] font-extrabold text-bts-gold uppercase tracking-widest block mb-0.5">
          Finance
        </span>
        <h3 className="font-extrabold text-lg text-brand-dark">Payout Summary</h3>
      </div>

      {/* Balance highlight */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 mb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-bts-gold/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Available Balance</p>
        <p className="text-2xl font-extrabold text-white">
          {balance.toLocaleString()}
          <span className="text-sm text-gray-400 ml-1.5">BTS</span>
        </p>
        <button className="mt-3 w-full bg-bts-gold hover:bg-yellow-500 text-gray-950 text-xs font-extrabold py-2 rounded-lg transition-colors">
          Request Payout
        </button>
      </div>

      {/* Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <p className="text-xs font-semibold text-gray-600">Total Earned</p>
          </div>
          <p className="text-xs font-extrabold text-emerald-600">+{totalEarned.toLocaleString()} BTS</p>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <p className="text-xs font-semibold text-gray-600">Pending Clearance</p>
          </div>
          <p className="text-xs font-extrabold text-amber-600">{pending.toLocaleString()} BTS</p>
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-300 shrink-0" />
            <p className="text-xs font-semibold text-gray-600">Total Withdrawn</p>
          </div>
          <p className="text-xs font-extrabold text-gray-500">-{totalWithdrawn.toLocaleString()} BTS</p>
        </div>
      </div>
    </div>
  );
}
