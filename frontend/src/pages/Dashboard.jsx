import Topbar from '../components/Topbar';
import StatsGrid from '../components/StatsGrid';
import ActivityOverview from '../components/ActivityOverview';
import ContinueLearning from '../components/ContinueLearning';
import UpcomingEvents from '../components/UpcomingEvents';
import RecommendedMentorsStrip from '../components/RecommendedMentorsStrip';
import RecentActivity from '../components/RecentActivity';
import ResourceLibrary from '../components/ResourceLibrary';

export default function Dashboard() {
  return (
    <>
      <Topbar searchPlaceholder="Search anything..." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 items-stretch">
        <UpcomingEvents />
        <RecommendedMentorsStrip />
      </div>

      <div className="grid grid-cols-3 gap-8 mb-8">
        <div className="col-span-2 space-y-8">
          <ActivityOverview />
          <ContinueLearning />
        </div>
        <div className="col-span-1 space-y-8">
          <RecentActivity />
          <ResourceLibrary />
        </div>
      </div>

      <StatsGrid />
    </>
  );
}
