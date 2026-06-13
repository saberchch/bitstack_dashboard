export default function RecentActivity() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-brand-dark">Recent Activity</h3>
        <button className="text-[10px] font-bold text-gray-400 hover:text-gray-600 border border-gray-100 px-3 py-1 rounded-lg">View All</button>
      </div>
      <div className="space-y-5 flex-1">
        <div className="flex items-start gap-4">
          <div className="bg-yellow-50 p-2 rounded-lg shrink-0"><svg fill="none" height="16" stroke="#d4a017" strokeWidth="2.5" viewBox="0 0 24 24" width="16"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg></div>
          <div className="flex-1"><div className="flex justify-between items-start"><h5 className="text-xs font-bold text-brand-dark leading-none">BTS Credit received</h5><span className="text-[10px] text-gray-400">2m ago</span></div><p className="text-[11px] text-gray-500 mt-0.5">+250 BTS</p></div>
        </div>
        <div className="flex items-start gap-4">
          <div className="bg-emerald-50 p-2 rounded-lg shrink-0"><svg fill="none" height="16" stroke="#10b981" strokeWidth="2.5" viewBox="0 0 24 24" width="16"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></div>
          <div className="flex-1"><div className="flex justify-between items-start"><h5 className="text-xs font-bold text-brand-dark leading-none">New project created</h5><span className="text-[10px] text-gray-400">15m ago</span></div><p className="text-[11px] text-gray-500 mt-0.5">Smart Contract Audit</p></div>
        </div>
        <div className="flex items-start gap-4">
          <div className="bg-indigo-50 p-2 rounded-lg shrink-0"><svg fill="none" height="16" stroke="#6366f1" strokeWidth="2.5" viewBox="0 0 24 24" width="16"><path d="M12 14l9-5-9-5-9 5 9 5z"></path><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg></div>
          <div className="flex-1"><div className="flex justify-between items-start"><h5 className="text-xs font-bold text-brand-dark leading-none">Course completed</h5><span className="text-[10px] text-gray-400">1h ago</span></div><p className="text-[11px] text-gray-500 mt-0.5">Blockchain Fundamentals</p></div>
        </div>
      </div>
      <a className="mt-8 flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-brand-dark" href="#">View all activities<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg></a>
    </div>
  );
}
