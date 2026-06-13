import Topbar from '../components/Topbar';
import PlatformHero from '../components/PlatformHero';
import PublicSessions from '../components/PublicSessions';
import PrivateSessions from '../components/PrivateSessions';

export default function DPlatform() {
  return (
    <>
      <Topbar searchPlaceholder="Search ecosystem..." />
      <PlatformHero />
      <div className="space-y-8">
        <PublicSessions />
        <PrivateSessions />
      </div>
    </>
  );
}
