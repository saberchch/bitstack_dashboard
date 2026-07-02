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
import MissionOverview from './pages/MissionOverview';
import MissionWorkspace from './pages/MissionWorkspace';
import MissionArchive from './pages/MissionArchive';
import BTSCredit from './pages/BTSCredit';
import DLibrary from './pages/DLibrary';
import Calendar from './pages/Calendar';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import useServerHydrate from './hooks/useServerHydrate';
import { useState } from 'react';
import AuthPage from './pages/AuthPage';

import MentorAvailabilityPage from './pages/MentorAvailabilityPage';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('bts_auth_token'));
  
  // Hydrate localStorage from the backend on first mount.
  const { hydrating } = useServerHydrate();

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
    // useServerHydrate will automatically fetch all data on re-render
  };

  if (hydrating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full filter blur-[100px] animate-pulse delay-700"></div>

        <div className="z-10 flex flex-col items-center space-y-6 max-w-sm px-6 py-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl text-center">
          {/* Logo Icon */}
          <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-yellow-500/20 to-amber-500/20 rounded-2xl border border-yellow-500/30 shadow-lg shadow-yellow-500/5 animate-bounce">
            <svg fill="none" className="w-10 h-10 text-yellow-400" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2L4 8L16 14L28 8L16 2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              <path d="M4 16L16 22L28 16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              <path d="M4 24L16 30L28 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-white">BITSTACKS</h1>
            <p className="text-[10px] uppercase tracking-widest text-yellow-500 font-extrabold">Ecosystem Sync</p>
          </div>

          {/* Spinner and loading description */}
          <div className="flex flex-col items-center space-y-3 pt-4 w-full">
            <div className="w-8 h-8 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
            <p className="text-xs text-gray-400 font-semibold tracking-wide animate-pulse">Initializing secure node...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

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
            <Route path="/d-lancer/mission/:id" element={<MissionOverview />} />
            <Route path="/d-lancer/workspace/:id" element={<MissionWorkspace />} />
            <Route path="/d-lancer/archive" element={<MissionArchive />} />
            <Route path="/bts-credit" element={<BTSCredit />} />
            <Route path="/d-library" element={<DLibrary />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/mentor/availability" element={<MentorAvailabilityPage />} />
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
