import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import FooterBanner from './components/FooterBanner';
import Dashboard from './pages/Dashboard';
import DPlatform from './pages/DPlatform';
import ExpertMentors from './pages/ExpertMentors';
import PublicSessionsPage from './pages/PublicSessionsPage';
import MentorProfile from './pages/MentorProfile';
import PublicSessionDetail from './pages/PublicSessionDetail';
import DInstitute from './pages/DInstitute';
import InstituteDetail from './pages/InstituteDetail';
import DLancer from './pages/DLancer';
import BTSCredit from './pages/BTSCredit';
import DLibrary from './pages/DLibrary';
import Calendar from './pages/Calendar';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <main className="flex-1 ml-56 min-h-screen p-8 flex flex-col overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/d-platform" element={<DPlatform />} />
            <Route path="/expert-mentors" element={<ExpertMentors />} />
            <Route path="/public-sessions" element={<PublicSessionsPage />} />
            <Route path="/mentor/:id" element={<MentorProfile />} />
            <Route path="/public-session/:id" element={<PublicSessionDetail />} />
            <Route path="/d-institute" element={<DInstitute />} />
            <Route path="/institute/:id" element={<InstituteDetail />} />
            <Route path="/d-lancer" element={<DLancer />} />
            <Route path="/bts-credit" element={<BTSCredit />} />
            <Route path="/d-library" element={<DLibrary />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          <div className="mt-auto pt-8">
            <FooterBanner />
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
