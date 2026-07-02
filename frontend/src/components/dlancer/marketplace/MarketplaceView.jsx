import { useState } from 'react';
import MarketplaceFilters from './MarketplaceFilters';
import MarketplaceCategoryPills from './MarketplaceCategoryPills';
import MissionCard from './MissionCard';
import TrendingSection from './TrendingSection';
import Pagination from '../shared/Pagination';
import EmptyPlaceholder from '../shared/EmptyPlaceholder';

const PAGE_SIZE = 6;

export default function MarketplaceView({
  openMissions,
  categories,
  skills,
  isInterested,
  isBookmarked,
  onBookmark,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
    setPage(1);
  };

  const handleClearAll = () => {
    setSelectedDifficulty('all');
    setSelectedDuration('all');
    setSelectedSkills([]);
    setSelectedCategory('all');
    setPage(1);
  };

  const activeFilterCount = [
    selectedCategory !== 'all',
    selectedDifficulty !== 'all',
    selectedDuration !== 'all',
    selectedSkills.length > 0,
  ].filter(Boolean).length;

  // Filter & Sort logic
  const filteredMissions = openMissions
    .filter(m => {
      const matchesSearch = !searchQuery ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        m.client.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || m.tags.includes(selectedCategory);
      const matchesDifficulty = selectedDifficulty === 'all' || m.difficulty === selectedDifficulty;
      const matchesDuration = selectedDuration === 'all' ||
        (selectedDuration === 'short' && m.deadline <= 7) ||
        (selectedDuration === 'medium' && m.deadline > 7 && m.deadline <= 28) ||
        (selectedDuration === 'long' && m.deadline > 28);
      
      const matchesSkills = selectedSkills.length === 0 || selectedSkills.some(s => m.tags.includes(s));

      return matchesSearch && matchesCategory && matchesDifficulty && matchesDuration && matchesSkills;
    })
    .sort((a, b) => {
      if (sortBy === 'reward-high') return b.reward - a.reward;
      if (sortBy === 'ending-soon') return a.deadline - b.deadline;
      return a.postedDays - b.postedDays; // newest first (lower posted days)
    });

  // Calculate category counts
  const catCounts = categories.reduce((acc, cat) => {
    acc[cat.key] = cat.key === 'all'
      ? openMissions.length
      : openMissions.filter(m => m.tags.includes(cat.key)).length;
    return acc;
  }, {});

  const totalPages = Math.ceil(filteredMissions.length / PAGE_SIZE);
  const paginatedMissions = filteredMissions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Trending section data (top 3 by proposals/interested)
  const trendingMissions = [...openMissions]
    .sort((a, b) => (b.proposals || []).length - (a.proposals || []).length)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Search & Header actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder="Search missions, skills, clients..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-brand-dark focus:outline-none focus:border-bts-gold focus:ring-2 focus:ring-bts-gold/20 shadow-sm transition-all"
          />
        </div>
        
        {/* Sort option */}
        <div className="relative shrink-0">
          <select
            value={sortBy}
            onChange={e => { setSortBy(e.target.value); setPage(1); }}
            className="appearance-none pl-4 pr-9 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-brand-dark focus:outline-none focus:border-bts-gold shadow-sm cursor-pointer transition-all"
          >
            <option value="newest">Newest First</option>
            <option value="reward-high">Highest Budget</option>
            <option value="ending-soon">Ending Soon</option>
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>

        {/* Filters toggle */}
        <button
          onClick={() => setShowFilters(f => !f)}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold border transition-all shadow-sm shrink-0 ${
            activeFilterCount > 0 ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-dark hover:text-brand-dark'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V19l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-bts-gold text-brand-dark text-[10px] px-1.5 py-0.5 rounded-full font-extrabold">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <MarketplaceFilters
          skills={skills}
          selectedSkills={selectedSkills}
          selectedDifficulty={selectedDifficulty}
          selectedDuration={selectedDuration}
          onSkillToggle={handleSkillToggle}
          onDifficultyChange={(d) => { setSelectedDifficulty(d); setPage(1); }}
          onDurationChange={(dur) => { setSelectedDuration(dur); setPage(1); }}
          onClearAll={handleClearAll}
          activeCount={activeFilterCount}
        />
      )}

      {/* Category Pills */}
      <MarketplaceCategoryPills
        categories={categories}
        selected={selectedCategory}
        counts={catCounts}
        onSelect={(cat) => { setSelectedCategory(cat); setPage(1); }}
      />

      {/* Trending (Only show on default list) */}
      {!searchQuery && activeFilterCount === 0 && (
        <TrendingSection
          missions={trendingMissions}
          isInterested={isInterested}
          isBookmarked={isBookmarked}
          onBookmark={onBookmark}
        />
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-gray-500">
          Showing <span className="text-brand-dark font-extrabold">{filteredMissions.length}</span> missions
        </p>
      </div>

      {/* Main Grid */}
      {paginatedMissions.length === 0 ? (
        <EmptyPlaceholder
          title="No missions found"
          text="Try adjusting your filters or search query to find matching work."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedMissions.map(mission => (
            <MissionCard
              key={mission.id}
              mission={mission}
              isInterested={isInterested(mission.id)}
              isBookmarked={isBookmarked(mission.id)}
              onBookmark={onBookmark}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination page={page} total={totalPages} onChange={setPage} />
    </div>
  );
}
