import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mentors } from '../data/mentors';
import BookingModal from './BookingModal';
import GuidedResearchWizard from './GuidedResearchWizard';
import AdvancedFilters from './AdvancedFilters';
import {
  DEFAULT_ADVANCED_FILTERS,
  getMentorSchools,
  getMentorModules,
  filterMentors,
  sortMentors,
  countActiveFilters,
} from '../utils/mentorFilters';

export default function MentorsGrid() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState(DEFAULT_ADVANCED_FILTERS);

  const availableSchools = getMentorSchools(mentors);
  const availableModules = getMentorModules(mentors);
  const activeFilterCount = countActiveFilters(advancedFilters);

  const handleOpenBooking = (mentor) => {
    setSelectedMentor(mentor);
    setIsBookingOpen(true);
  };

  const handleResetFilters = () => {
    setAdvancedFilters(DEFAULT_ADVANCED_FILTERS);
    setSearch('');
  };

  const filteredMentors = sortMentors(
    filterMentors(mentors, { search, advancedFilters }),
    sortBy
  );

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-brand-dark">Find Your Mentor</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
              Matchmaker & advanced filters for your case
            </p>
          </div>
          <button
            onClick={() => setIsWizardOpen(true)}
            className="bg-yellow-50 text-bts-gold border border-yellow-100 hover:bg-yellow-100/50 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined !text-[18px]">auto_awesome</span>
            Guided Matchmaker
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined">search</span>
            <input
              className="w-full bg-gray-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-bts-gold outline-none"
              placeholder="Search by name, skills, or expertise..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className={`border px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                isAdvancedOpen
                  ? 'bg-bts-gold border-bts-gold text-white shadow-xs'
                  : 'bg-white border-gray-200 text-brand-dark hover:bg-gray-50'
              }`}
            >
              <span className="material-symbols-outlined !text-[18px]">filter_list</span>
              Advanced Filters
              {activeFilterCount > 0 && (
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                  isAdvancedOpen ? 'bg-white/20 text-white' : 'bg-bts-gold/10 text-bts-gold'
                }`}>
                  {activeFilterCount}
                </span>
              )}
            </button>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-bold text-brand-dark focus:ring-2 focus:ring-bts-gold outline-none cursor-pointer appearance-none pr-9 h-full min-w-[130px]"
              >
                <option value="rating">Rating</option>
                <option value="price-asc">BTS (Low–High)</option>
                <option value="price-desc">BTS (High–Low)</option>
                <option value="sessions">Popularity</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined !text-[14px] text-gray-400 pointer-events-none">
                keyboard_arrow_down
              </span>
            </div>
          </div>
        </div>

        <AdvancedFilters
          isOpen={isAdvancedOpen}
          filters={advancedFilters}
          onChange={setAdvancedFilters}
          onReset={handleResetFilters}
          availableSchools={availableSchools}
          availableModules={availableModules}
        />

        <p className="text-[11px] text-gray-400 font-semibold">
          {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''} match your criteria
        </p>
      </div>

      {filteredMentors.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
          <span className="material-symbols-outlined text-4xl text-gray-300 mb-3">person_search</span>
          <p className="text-gray-500 font-medium mb-2">No mentors found matching your filters.</p>
          <button
            onClick={() => setIsWizardOpen(true)}
            className="text-xs font-bold text-bts-gold hover:text-brand-dark transition-colors"
          >
            Try the Guided Matchmaker
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMentors.map((mentor) => (
            <div key={mentor.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative group flex flex-col justify-between">
              <div>
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] font-bold bg-yellow-50 text-bts-gold px-2 py-1 rounded border border-yellow-100">
                    {mentor.rate} BTS/hr
                  </span>
                </div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <img
                      alt={mentor.name}
                      className="w-16 h-16 rounded-xl object-cover border-2 border-transparent group-hover:border-yellow-100"
                      src={mentor.avatar}
                    />
                    {mentor.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-bts-gold p-1 rounded-full border-2 border-white">
                        <span className="material-symbols-outlined !text-[12px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      </div>
                    )}
                  </div>
                  <div className="pr-20">
                    <h3 className="font-bold text-brand-dark text-lg leading-tight">{mentor.name}</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{mentor.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-bts-gold">
                        <span className="material-symbols-outlined !text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="text-xs font-bold ml-1">{mentor.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-gray-400 text-[11px] font-medium">({mentor.sessions} sessions)</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {mentor.skills.map((skill, index) => (
                    <span
                      key={index}
                      onClick={() => setSearch(skill)}
                      className="text-[9px] font-extrabold px-2 py-1 bg-gray-50 text-gray-500 rounded border border-gray-100 uppercase tracking-tight cursor-pointer hover:bg-bts-gold hover:text-white transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-gray-500 text-xs line-clamp-2 mb-6 leading-relaxed">
                  {mentor.bio}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <button
                  onClick={() => handleOpenBooking(mentor)}
                  className="bg-bts-gold text-white py-2.5 rounded-xl font-bold text-[11px] hover:bg-opacity-90 transition-all shadow-sm cursor-pointer"
                >
                  Book Session
                </button>
                <Link
                  to={`/mentor/${mentor.id}`}
                  className="border border-gray-200 text-brand-dark py-2.5 rounded-xl font-bold text-[11px] hover:bg-gray-50 transition-colors text-center flex items-center justify-center"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 flex justify-center">
        <nav className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="w-10 h-10 bg-bts-gold text-white rounded-xl font-bold text-sm shadow-md">1</button>
          <button className="w-10 h-10 border border-gray-200 rounded-xl font-bold text-gray-400 hover:bg-gray-50 hover:text-brand-dark transition-all text-sm">2</button>
          <button className="w-10 h-10 border border-gray-200 rounded-xl font-bold text-gray-400 hover:bg-gray-50 hover:text-brand-dark transition-all text-sm">3</button>
          <span className="px-2 text-gray-300 text-sm">...</span>
          <button className="w-10 h-10 border border-gray-200 rounded-xl font-bold text-gray-400 hover:bg-gray-50 hover:text-brand-dark transition-all text-sm">12</button>
          <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </nav>
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        mentor={selectedMentor}
      />

      <GuidedResearchWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSelectMentor={handleOpenBooking}
      />
    </div>
  );
}
