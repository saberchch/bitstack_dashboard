export const PUBLIC_SESSION_TABS = {
  ALL: 'all',
  ENROLLMENTS: 'enrollments',
  PREMIUM_PUBLIC: 'premium_public',
  PREMIUM_PRIVATE: 'premium_private',
};

export default function PublicSessionsFilters({
  activeTab,
  onTabChange,
  enrollmentCount = 0,
  search = '',
  onSearchChange,
  levelFilter = 'all',
  onLevelFilterChange,
}) {
  const tabs = [
    { key: PUBLIC_SESSION_TABS.ALL, label: 'All Sessions', icon: 'grid_view' },
    { key: PUBLIC_SESSION_TABS.ENROLLMENTS, label: 'My Enrollments', icon: 'bookmark', badge: enrollmentCount },
    { key: PUBLIC_SESSION_TABS.PREMIUM_PUBLIC, label: 'Premium Public', icon: 'workspace_premium' },
    { key: PUBLIC_SESSION_TABS.PREMIUM_PRIVATE, label: 'PFE Premium Private', icon: 'person_pin' },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mb-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-bts-gold text-white shadow-sm'
                  : 'border border-gray-100 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="material-symbols-outlined !text-[16px]">{tab.icon}</span>
              {tab.label}
              {tab.badge > 0 && (
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold ${
                  activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-yellow-50 text-bts-gold'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab !== PUBLIC_SESSION_TABS.ENROLLMENTS && (
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <span className="material-symbols-outlined !text-[18px]">search</span>
              </span>
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium focus:ring-2 focus:ring-bts-gold outline-none text-brand-dark"
                placeholder="Search sessions, institutes, instructors..."
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            <select
              value={levelFilter}
              onChange={(e) => onLevelFilterChange(e.target.value)}
              className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-600 focus:ring-2 focus:ring-bts-gold min-w-[160px] cursor-pointer"
            >
              <option value="all">Difficulty: All</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
