import GreetingHero from './GreetingHero';
import ActiveMissionsSummary from './ActiveMissionsSummary';
import ContinueWorking from './ContinueWorking';
import RecommendedMissions from './RecommendedMissions';
import RecentActivityFeed from './RecentActivityFeed';

export default function DLancerDashboard({
  allActiveMissions,
  openMissions,
  recentActivity,
  totalEarned,
  totalPending,
  onSearch,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Main Content Column (2/3 width) */}
      <div className="lg:col-span-2 space-y-6">
        <GreetingHero onSearch={onSearch} />

        {allActiveMissions.length > 0 && (
          <ContinueWorking missions={allActiveMissions} />
        )}

        <RecommendedMissions missions={openMissions} />
      </div>

      {/* Sidebar Stats & Activity Feed (1/3 width) */}
      <div className="space-y-6">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-extrabold text-brand-dark mb-4">Your Work Space</h3>
          <ActiveMissionsSummary
            totalActive={allActiveMissions.length}
            totalEarned={totalEarned}
            totalPending={totalPending}
            layout="vertical"
          />
        </div>

        <RecentActivityFeed activities={recentActivity} />
      </div>
    </div>
  );
}
