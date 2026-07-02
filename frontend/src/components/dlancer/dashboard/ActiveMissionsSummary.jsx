export default function ActiveMissionsSummary({ totalActive, totalEarned, totalPending, layout = 'grid' }) {
  const stats = [
    {
      label: 'Active Contracts',
      value: totalActive,
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      color: 'text-blue-600',
      bg: 'bg-blue-50/50 border-blue-100',
    },
    {
      label: 'Total Earned',
      value: `◈ ${totalEarned.toLocaleString()}`,
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50/50 border-emerald-100',
    },
    {
      label: 'Locked in Escrow',
      value: `◈ ${totalPending.toLocaleString()}`,
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'text-bts-gold',
      bg: 'bg-yellow-50/50 border-yellow-100',
    },
    {
      label: 'Platform Reputation',
      value: '4.9 ★',
      icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
      color: 'text-amber-500',
      bg: 'bg-amber-50/50 border-amber-100',
    },
  ];

  if (layout === 'vertical') {
    return (
      <div className="space-y-4">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="flex items-center gap-4 bg-gray-50/40 border border-gray-150 rounded-2xl p-4 hover:border-brand-dark/20 transition-all"
          >
            <div className={`w-10 h-10 ${stat.bg} border rounded-xl flex items-center justify-center shrink-0`}>
              <svg className={`w-5 h-5 ${stat.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d={stat.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">{stat.label}</p>
              <p className="text-lg font-extrabold text-brand-dark mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map(stat => (
        <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className={`w-10 h-10 ${stat.bg} border rounded-xl flex items-center justify-center mb-3`}>
            <svg className={`w-5 h-5 ${stat.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d={stat.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          <p className="text-xl font-extrabold text-brand-dark">{stat.value}</p>
          <p className="text-[11px] text-gray-400 font-semibold mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
