export default function EscrowStatusCard({ reward, escrowReleasedAmount, disputeActive, hasActiveContract }) {
  if (!hasActiveContract) return null;

  return (
    <div className="bg-gradient-to-r from-brand-dark/95 to-slate-900 border border-gray-800 text-white rounded-2xl p-5 shadow-lg space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🛡️</span>
          <div className="text-left">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Decentralized Escrow Contract</h4>
            <p className="text-[10px] text-gray-500 font-bold">Immutable Agreement Node · Active Payouts</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-xl text-[10px] font-extrabold border ${
          disputeActive ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse' :
          escrowReleasedAmount >= reward ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
          escrowReleasedAmount > 0 ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
          'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
        }`}>
          {disputeActive ? '⚠️ Frozen in Dispute' :
           escrowReleasedAmount >= reward ? '✓ Escrow Disbursed' :
           escrowReleasedAmount > 0 ? '💸 Partially Released' :
           '🔒 Locked in Escrow'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="bg-white/5 border border-white/5 rounded-xl p-3.5">
          <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-1">Total Project Budget</p>
          <p className="text-lg font-extrabold">◈ {reward?.toLocaleString()} <span className="text-xs text-white/40">BTS</span></p>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-xl p-3.5">
          <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-1">Released Payouts</p>
          <p className="text-lg font-extrabold text-emerald-400">◈ {escrowReleasedAmount?.toLocaleString()} <span className="text-xs text-white/40">BTS</span></p>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-xl p-3.5">
          <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-1">Remaining Locked</p>
          <p className={`text-lg font-extrabold ${disputeActive ? 'text-rose-400' : 'text-bts-gold'}`}>
            ◈ {(reward - escrowReleasedAmount)?.toLocaleString()} <span className="text-xs text-white/40">BTS</span>
          </p>
        </div>
      </div>
    </div>
  );
}
