export default function EscrowSummaryPanel({
  budget,
  escrowLocked,
  escrowReleasedAmount,
  isCreator,
  onLock,
  isReadOnly,
}) {
  const initiationAmount = Math.round(budget * 0.1);
  const remainingEscrow = budget - escrowReleasedAmount;

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400 font-semibold">Total Escrow Funds</span>
          <span className="font-extrabold text-brand-dark">◈ {budget.toLocaleString()} BTS</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400 font-semibold">Down Payment (After M1)</span>
          <span className="font-extrabold text-brand-dark">◈ {initiationAmount.toLocaleString()} BTS</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400 font-semibold">Released to Date</span>
          <span className="font-extrabold text-emerald-600">◈ {escrowReleasedAmount.toLocaleString()} BTS</span>
        </div>
        <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-100">
          <span className="text-gray-400 font-semibold">Remaining Locked</span>
          <span className="font-extrabold text-brand-dark">◈ {remainingEscrow.toLocaleString()} BTS</span>
        </div>
      </div>

      {!escrowLocked && !isReadOnly && (
        <div className="space-y-3">
          {isCreator ? (
            <button
              type="button"
              onClick={onLock}
              className="w-full py-3 bg-brand-dark text-white rounded-xl text-xs font-extrabold hover:bg-bts-gold hover:text-brand-dark transition-all shadow-md"
            >
              Lock Funds & Deposit Escrow
            </button>
          ) : (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
              <p className="text-[11px] text-amber-700 font-extrabold">
                Awaiting Escrow Deposit
              </p>
              <p className="text-[10px] text-amber-600/80 mt-0.5">
                The client must lock funds to initiate the contract.
              </p>
            </div>
          )}
        </div>
      )}

      {escrowLocked && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center flex flex-col items-center justify-center gap-1">
          <span className="text-emerald-600 text-xs font-extrabold">✓ Escrow Locked & Active (100% Locked)</span>
          <p className="text-[9px] text-gray-400">Down payment releases automatically upon first milestone completion.</p>
        </div>
      )}
    </div>
  );
}
