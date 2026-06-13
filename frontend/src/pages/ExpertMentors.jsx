import Topbar from '../components/Topbar';
import ExpertMentorsHero from '../components/ExpertMentorsHero';
import MentorsGrid from '../components/MentorsGrid';
import MentorsSidebar from '../components/MentorsSidebar';

export default function ExpertMentors() {
  return (
    <>
      <Topbar searchPlaceholder="Search courses, mentors, or papers..." />
      <ExpertMentorsHero />
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 xl:col-span-9 space-y-8">
          <MentorsGrid />
        </div>
        <aside className="hidden xl:flex xl:col-span-3 flex-col gap-8">
          <MentorsSidebar />
        </aside>
      </div>
    </>
  );
}
