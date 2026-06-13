export default function StatsGrid() {
  return (
    <section className="grid grid-cols-4 gap-6 mb-8" data-purpose="summary-stats">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex items-start justify-between relative overflow-hidden">
        <div className="z-10">
          <p className="text-xs font-bold text-gray-400 mb-2">Total BTS Credits</p>
          <div className="mb-4">
            <span className="text-2xl font-extrabold">2,450.75</span>
            <span className="text-xs font-bold text-gray-400 ml-1 uppercase">BTS</span>
            <p className="text-[10px] text-gray-400 font-medium">≈ $12,450.75 USD</p>
          </div>
          <div className="flex items-center text-green-500 font-bold text-xs">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path clipRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" fillRule="evenodd"></path></svg>
            12.5% <span className="text-gray-300 font-normal ml-1">this month</span>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-full">
          <svg fill="none" height="24" stroke="#d4a017" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex items-start justify-between relative overflow-hidden">
        <div className="z-10">
          <p className="text-xs font-bold text-gray-400 mb-2">Active Courses</p>
          <div className="mb-4">
            <span className="text-2xl font-extrabold">8</span>
            <p className="text-[10px] text-gray-400 font-medium">In Progress</p>
          </div>
          <div className="flex items-center text-green-500 font-bold text-xs">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path clipRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" fillRule="evenodd"></path></svg>
            2 new <span className="text-gray-300 font-normal ml-1 text-[10px]">this week</span>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-full">
          <svg fill="none" height="24" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M12 14l9-5-9-5-9 5 9 5z"></path><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex items-start justify-between relative overflow-hidden">
        <div className="z-10">
          <p className="text-xs font-bold text-gray-400 mb-2">Freelance Earnings</p>
          <div className="mb-4">
            <span className="text-2xl font-extrabold">1,250.50</span>
            <span className="text-xs font-bold text-gray-400 ml-1 uppercase">BTS</span>
            <p className="text-[10px] text-gray-400 font-medium">≈ $6,250.50 USD</p>
          </div>
          <div className="flex items-center text-green-500 font-bold text-xs">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path clipRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" fillRule="evenodd"></path></svg>
            18.6% <span className="text-gray-300 font-normal ml-1">this month</span>
          </div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-full">
          <svg fill="none" height="24" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex items-start justify-between relative overflow-hidden">
        <div className="z-10">
          <p className="text-xs font-bold text-gray-400 mb-2">Active Projects</p>
          <div className="mb-4">
            <span className="text-2xl font-extrabold">5</span>
            <p className="text-[10px] text-gray-400 font-medium">Ongoing</p>
          </div>
          <div className="flex items-center text-green-500 font-bold text-xs">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path clipRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" fillRule="evenodd"></path></svg>
            1 new <span className="text-gray-300 font-normal ml-1 text-[10px]">this week</span>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-full">
          <svg fill="none" height="24" stroke="#a855f7" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9l-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
        </div>
      </div>
    </section>
  );
}
