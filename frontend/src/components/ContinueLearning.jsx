export default function ContinueLearning() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-brand-dark">Continue Learning</h3>
        <button className="text-xs font-bold text-indigo-600">View All</button>
      </div>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-50 p-3 rounded-xl shrink-0">
            <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <h5 className="text-sm font-bold text-brand-dark">Full Stack Web Development</h5>
              <span className="text-xs font-bold text-gray-400">65%</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-xl shrink-0">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <h5 className="text-sm font-bold text-brand-dark">Database Systems</h5>
              <span className="text-xs font-bold text-gray-400">40%</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: '40%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
