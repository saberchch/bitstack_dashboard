import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDLancerState from '../hooks/useDLancerState';
import MarketplaceView from '../components/dlancer/marketplace/MarketplaceView';
import MissionCard from '../components/dlancer/marketplace/MissionCard';
import InProgressCard from './InProgressCard';
import SectionHeader from '../components/dlancer/shared/SectionHeader';
import EmptyPlaceholder from '../components/dlancer/shared/EmptyPlaceholder';
import Topbar from '../components/Topbar';
import CreateMissionModal from '../components/dlancer/mission/CreateMissionModal';

const TABS = [
  { id: 'marketplace', label: 'Explore Missions', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { id: 'active', label: 'Active Contracts', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { id: 'saved', label: 'Saved Missions', icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' }
];

export default function DLancer() {
  const navigate = useNavigate();
  const state = useDLancerState();
  const [activeTab, setActiveTab] = useState('marketplace');
  const [globalSearch, setGlobalSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateMission = (data) => {
    state.handleCreatePost(data);
    setShowCreateModal(false);
    setActiveTab('active');
  };

  const handleGlobalSearch = (val) => {
    setGlobalSearch(val);
    if (activeTab !== 'marketplace') {
      setActiveTab('marketplace');
    }
  };

  // Filter bookmarked missions
  const bookmarkedMissions = state.allMissions.filter(m => state.bookmarks.includes(m.id));

  return (
    <div className="space-y-6">
      <Topbar searchPlaceholder="Search missions, skills, or clients..." onSearchChange={handleGlobalSearch} />

      {/* Header and Title */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-brand-dark tracking-tight">D-Lancer Workspace</h2>
          <p className="text-gray-400 text-xs mt-0.5">Secure freelance project collaboration powered by BTS escrow</p>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto">
          <button
            onClick={() => navigate('/d-lancer/archive')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-50 text-gray-600 border border-gray-200 rounded-xl font-extrabold text-xs hover:bg-gray-100 hover:border-brand-dark transition-all"
          >
            📂 Archive
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex-2 sm:flex-none flex items-center justify-center gap-1.5 px-4.5 py-2 bg-brand-dark text-white rounded-xl font-extrabold text-xs hover:bg-bts-gold hover:text-brand-dark transition-all shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Post a Mission
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex bg-white border border-gray-100 rounded-2xl p-1 shadow-sm gap-1 w-full overflow-x-auto scrollbar-hide whitespace-nowrap">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === tab.id
                ? 'bg-brand-dark text-white shadow'
                : 'text-gray-400 hover:text-brand-dark hover:bg-gray-50'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
            </svg>
            {tab.label}
            {tab.id === 'active' && state.allActiveMissions.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                activeTab === 'active' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {state.allActiveMissions.length}
              </span>
            )}
            {tab.id === 'saved' && bookmarkedMissions.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                activeTab === 'saved' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {bookmarkedMissions.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'marketplace' && (
        <MarketplaceView
          openMissions={state.openMissions}
          categories={state.categories}
          skills={state.skills}
          isInterested={state.isInterested}
          isBookmarked={state.isBookmarked}
          onBookmark={state.handleBookmark}
        />
      )}

      {activeTab === 'active' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <SectionHeader
              title="Projects In Progress"
              subtitle="Your active contracts — as a client or as a freelancer"
            />
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-dark text-white rounded-xl text-xs font-bold hover:bg-bts-gold hover:text-brand-dark transition-all"
            >
              + Post New Mission
            </button>
          </div>

          {state.allActiveMissions.length === 0 ? (
            <EmptyPlaceholder
              title="No active projects yet"
              text="Post a mission to hire a freelancer, or explore the Marketplace and express interest to get started."
            />
          ) : (
            <>
              {/* Client missions */}
              {state.allActiveMissions.filter(m => m._role === 'creator').length > 0 && (
                <div className="space-y-4">
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-bts-gold" />
                    As Client
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {state.allActiveMissions.filter(m => m._role === 'creator').map(mission => (
                      <InProgressCard
                        key={mission.id}
                        mission={mission}
                        onOpen={() => navigate(`/d-lancer/workspace/${mission.id}`)}
                      />
                    ))}
                  </div>
                </div>
              )}
              {/* Freelancer missions */}
              {state.allActiveMissions.filter(m => m._role === 'freelancer').length > 0 && (
                <div className="space-y-4">
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-dark" />
                    As Freelancer
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {state.allActiveMissions.filter(m => m._role === 'freelancer').map(mission => (
                      <InProgressCard
                        key={mission.id}
                        mission={mission}
                        onOpen={() => navigate(`/d-lancer/workspace/${mission.id}`)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="space-y-6">
          <SectionHeader
            title="Saved Missions"
            subtitle="Explore and review missions you bookmarked for later"
          />

          {bookmarkedMissions.length === 0 ? (
            <EmptyPlaceholder
              title="No saved missions yet"
              text="Explore available missions in the Marketplace and click the bookmark icon to save them here."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedMissions.map(mission => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  isInterested={state.isInterested(mission.id)}
                  isBookmarked={true}
                  onBookmark={state.handleBookmark}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Mission Modal */}
      {showCreateModal && (
        <CreateMissionModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateMission}
        />
      )}
    </div>
  );
}
