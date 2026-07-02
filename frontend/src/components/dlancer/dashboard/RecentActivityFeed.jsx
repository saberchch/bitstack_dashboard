import { useNavigate } from 'react-router-dom';

const ACTIVITY_ICONS = {
  milestone_approved: { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0', color: 'text-emerald-600 bg-emerald-50' },
  message: { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'text-blue-600 bg-blue-50' },
  interest: { icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'text-violet-600 bg-violet-50' },
  payment: { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-bts-gold bg-yellow-50' },
  review: { icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', color: 'text-amber-500 bg-amber-50' },
};

export default function RecentActivityFeed({ activities }) {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-extrabold text-brand-dark">Recent Activity</h3>
          <p className="text-[11px] text-gray-400">Latest updates across your missions</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl divide-y divide-gray-50 shadow-sm">
        {activities.map((activity, i) => {
          const config = ACTIVITY_ICONS[activity.type] || ACTIVITY_ICONS.message;
          return (
            <div
              key={activity.id || i}
              onClick={() => activity.missionId && navigate(`/d-lancer/workspace/${activity.missionId}`)}
              className={`flex items-center gap-3 p-4 transition-colors ${activity.missionId ? 'cursor-pointer hover:bg-gray-50' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${config.color}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d={config.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-brand-dark leading-snug">{activity.text}</p>
              </div>
              <span className="text-[10px] text-gray-400 font-semibold shrink-0 whitespace-nowrap">{activity.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
