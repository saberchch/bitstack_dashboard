export default function ActivityOverview() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-base">BTS Activity Overview</h3>
        <select className="bg-gray-50 border-none rounded-lg text-xs font-bold py-1.5 pl-3 pr-8 focus:ring-0">
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>
      <div className="relative chart-container mb-6 flex flex-col justify-end">
        <div className="absolute left-0 h-full flex flex-col justify-between text-[10px] text-gray-400 py-1">
          <span>3K</span><span>2.5K</span><span>2K</span><span>1.5K</span><span>1K</span><span>500</span><span>0</span>
        </div>
        <div className="ml-8 h-full border-b border-l border-gray-50 relative overflow-hidden">
          <div className="absolute inset-0 flex flex-col justify-between">
            <div className="border-t border-gray-50 h-px w-full"></div>
            <div className="border-t border-gray-50 h-px w-full"></div>
            <div className="border-t border-gray-50 h-px w-full"></div>
            <div className="border-t border-gray-50 h-px w-full"></div>
            <div className="border-t border-gray-50 h-px w-full"></div>
            <div className="border-t border-gray-50 h-px w-full"></div>
          </div>
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3"></stop>
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            <path d="M0 200 L100 180 L200 140 L300 130 L400 100 L500 80 L600 60 L600 250 L0 250 Z" fill="url(#chartGradient)"></path>
            <path d="M0 200 L100 180 L200 140 L300 130 L400 100 L500 80 L600 60" fill="none" stroke="#fbbf24" strokeWidth="2"></path>
            <circle cx="0" cy="200" fill="#fbbf24" r="4"></circle>
            <circle cx="100" cy="180" fill="#fbbf24" r="4"></circle>
            <circle cx="200" cy="140" fill="#fbbf24" r="4"></circle>
            <circle cx="300" cy="130" fill="#fbbf24" r="4"></circle>
            <circle cx="400" cy="100" fill="#fbbf24" r="4"></circle>
            <circle cx="500" cy="80" fill="#fbbf24" r="4"></circle>
            <circle cx="600" cy="60" fill="#fbbf24" r="4"></circle>
          </svg>
        </div>
        <div className="ml-8 flex justify-between text-[10px] text-gray-400 mt-2">
          <span>May 12</span><span>May 13</span><span>May 14</span><span>May 15</span><span>May 16</span><span>May 17</span><span>May 18</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-50">
        <div><p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Total Transactions</p><div className="flex items-center gap-1.5"><span className="text-sm font-extrabold">1,842</span><span className="text-[9px] text-green-500 font-bold">↑ 15.4%</span></div></div>
        <div><p className="text-[10px] text-gray-400 font-bold uppercase mb-1">New Users</p><div className="flex items-center gap-1.5"><span className="text-sm font-extrabold">320</span><span className="text-[9px] text-green-500 font-bold">↑ 9.8%</span></div></div>
        <div><p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Platform Volume</p><div className="flex items-center gap-1.5"><span className="text-sm font-extrabold">5,650 <span className="text-[10px] text-gray-400 font-normal">BTS</span></span><span className="text-[9px] text-green-500 font-bold">↑ 20.1%</span></div></div>
        <div><p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Success Rate</p><div className="flex items-center gap-1.5"><span className="text-sm font-extrabold">98.6%</span><span className="text-[9px] text-green-500 font-bold">↑ 1.2%</span></div></div>
      </div>
    </div>
  );
}
