export default function ClientCard({ clientName, clientAvatar, postedDays }) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
      <h3 className="text-xs font-extrabold text-brand-dark uppercase tracking-widest">Client Profile</h3>
      
      <div className="flex items-center gap-3">
        <img
          src={clientAvatar}
          alt={clientName}
          className="w-10 h-10 rounded-full border border-gray-100 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-extrabold text-brand-dark truncate">{clientName}</h4>
          <p className="text-[10px] text-gray-400 font-semibold">Posted {postedDays}d ago</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50">
        <div>
          <p className="text-[10px] text-gray-400 font-semibold">Payment Status</p>
          <span className="text-[11px] font-extrabold text-emerald-600">Verified ✓</span>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-semibold">Reputation Score</p>
          <span className="text-[11px] font-extrabold text-brand-dark">99% Rep</span>
        </div>
      </div>
    </div>
  );
}
