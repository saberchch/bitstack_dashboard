import Topbar from '../components/Topbar';
import StatsGrid from '../components/StatsGrid';
import ActivityOverview from '../components/ActivityOverview';
import ContinueLearning from '../components/ContinueLearning';
import UpcomingEvents from '../components/UpcomingEvents';
import RecentActivity from '../components/RecentActivity';
import RecommendedMentors from '../components/RecommendedMentors';
import ResourceLibrary from '../components/ResourceLibrary';

export default function Dashboard() {
  return (
    <>
      <Topbar searchPlaceholder="Search anything..." />
      <StatsGrid />
      <div className="grid grid-cols-3 gap-8">
        {/* Left Main Column */}
        <div className="col-span-2 space-y-8">
          <ActivityOverview />
          <ContinueLearning />
          <UpcomingEvents />
        </div>
        {/* Right Sidebar Column */}
        <div className="col-span-1 space-y-8">
          <RecentActivity />
          <RecommendedMentors />
          <ResourceLibrary />
        </div>
      </div>
    </>
  );
}
