import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mentors } from '../data/mentors';
import { getPrivateBookings, cancelPrivateBooking } from '../utils/enrollmentStorage';
import BookingModal from './BookingModal';
import GuidedResearchWizard from './GuidedResearchWizard';
import AdvancedFilters from './AdvancedFilters';

export default function PrivateSessions() {
  const [activeTab, setActiveTab] = useState("mentors"); // "mentors" | "bookings"
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [sortBy, setSortBy] = useState("rating"); // "rating" | "price-asc" | "price-desc" | "sessions"
  const [cancelingBooking, setCancelingBooking] = useState(null);

  // Wizard and advanced filter states
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const defaultFilters = {
    schools: [],
    modules: [],
    goals: [],
    language: "All",
    verifiedOnly: false,
    availabilities: [],
    maxPrice: 800
  };
  const [advancedFilters, setAdvancedFilters] = useState(defaultFilters);

  // Dynamic school and module extraction from database
  const availableSchools = Array.from(new Set(mentors.map(m => m.school || "Professional / Independent")));
  const availableModules = Array.from(new Set(mentors.reduce((acc, m) => [...acc, ...(m.modules || [])], [])));

  // Fetch bookings on mount or when tab toggles/bookings change
  useEffect(() => {
    setBookings(getPrivateBookings());
  }, [activeTab, isBookingOpen]);

  const handleOpenBooking = (mentor) => {
    setSelectedMentor(mentor);
    setIsBookingOpen(true);
  };

  const handleCancel = (bookingId) => {
    const updated = cancelPrivateBooking(bookingId);
    setBookings(updated);
  };

  const handleResetFilters = () => {
    setAdvancedFilters(defaultFilters);
    setSearch("");
  };

  const filteredMentors = mentors.filter(mentor => {
    // 1. Text Search
    const matchesSearch = search === "" || 
      mentor.name.toLowerCase().includes(search.toLowerCase()) ||
      mentor.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase())) ||
      mentor.role.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;

    // 2. School Filter (if any school selected, mentor must match one of them)
    if (advancedFilters.schools.length > 0) {
      const mentorSchool = mentor.school || "Professional / Independent";
      const matchesSchool = advancedFilters.schools.some(s => 
        mentorSchool.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(mentorSchool.toLowerCase())
      );
      if (!matchesSchool) return false;
    }

    // 3. Module/Subject Filter (if any selected, mentor must match one of them in modules or skills)
    if (advancedFilters.modules && advancedFilters.modules.length > 0) {
      const matchesModule = advancedFilters.modules.some(mod => {
        const target = mod.toLowerCase();
        const hasDirectModule = mentor.modules && mentor.modules.some(m => m.toLowerCase().includes(target) || target.includes(m.toLowerCase()));
        const hasSkillMatch = mentor.skills && mentor.skills.some(s => s.toLowerCase().includes(target) || target.includes(s.toLowerCase()));
        return hasDirectModule || hasSkillMatch;
      });
      if (!matchesModule) return false;
    }

    // 4. Goals Filter (if any goal selected, mentor must support at least one of them)
    if (advancedFilters.goals.length > 0) {
      const hasGoal = mentor.goals && mentor.goals.some(g => advancedFilters.goals.includes(g));
      if (!hasGoal) return false;
    }

    // 5. Language Filter
    if (advancedFilters.language !== "All" && mentor.language !== advancedFilters.language) {
      return false;
    }

    // 6. Verified Filter
    if (advancedFilters.verifiedOnly && !mentor.verified) {
      return false;
    }

    // 7. Availability Filter (if any selected, mentor must have at least one matching availability tag)
    if (advancedFilters.availabilities.length > 0) {
      const hasAvail = mentor.availability && mentor.availability.some(a => advancedFilters.availabilities.includes(a));
      if (!hasAvail) return false;
    }

    // 8. Price Filter
    if (mentor.rate > advancedFilters.maxPrice) {
      return false;
    }

    return true;
  });

  const sortedMentors = [...filteredMentors].sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating;
    } else if (sortBy === "price-asc") {
      return a.rate - b.rate;
    } else if (sortBy === "price-desc") {
      return b.rate - a.rate;
    } else if (sortBy === "sessions") {
      return b.sessions - a.sessions;
    }
    return 0;
  });

  const filteredBookings = bookings.filter(booking => 
    booking.mentorName.toLowerCase().includes(search.toLowerCase()) ||
    booking.topic.toLowerCase().includes(search.toLowerCase())
  );

  // Compute stats
  const totalBookings = bookings.length;
  const totalSpent = bookings.reduce((sum, b) => sum + (b.cost || 0), 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex flex-col" data-purpose="private-sessions-widget">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-lg text-brand-dark">Private Sessions</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase">One-on-one learning</p>
        </div>
        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
          <button 
            onClick={() => setActiveTab("mentors")}
            className={`font-bold px-3 py-1.5 rounded-lg text-[10px] transition-all cursor-pointer ${
              activeTab === "mentors" 
                ? "bg-white text-bts-gold shadow-sm" 
                : "text-gray-400 hover:text-brand-dark"
            }`}
          >
            Mentors
          </button>
          <button 
            onClick={() => setActiveTab("bookings")}
            className={`font-bold px-3 py-1.5 rounded-lg text-[10px] transition-all cursor-pointer ${
              activeTab === "bookings" 
                ? "bg-white text-bts-gold shadow-sm" 
                : "text-gray-400 hover:text-brand-dark"
            }`}
          >
            My Bookings
          </button>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-2 gap-3 mb-6 bg-gray-50/60 rounded-xl p-3 border border-gray-100/50">
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">Booked Sessions</span>
          <span className="text-sm font-extrabold text-brand-dark flex items-center gap-1.5 mt-0.5">
            <span className="material-symbols-outlined !text-[14px] text-bts-gold">event_seat</span>
            {totalBookings} {totalBookings === 1 ? 'Session' : 'Sessions'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">Total Value Allocated</span>
          <span className="text-sm font-extrabold text-bts-gold flex items-center gap-1 mt-0.5">
            <span className="material-symbols-outlined !text-[14px]">payments</span>
            {totalSpent} BTS
          </span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <span className="material-symbols-outlined !text-[18px]">search</span>
          </span>
          <input 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-xs focus:ring-1 focus:ring-bts-gold outline-none text-brand-dark font-medium" 
            placeholder={activeTab === "mentors" ? "Search mentors, skills..." : "Search booked topics..."} 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {activeTab === "mentors" && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsWizardOpen(true)}
              className="bg-yellow-50 text-bts-gold border border-yellow-100 hover:bg-yellow-100/50 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Guided Matchmaker"
            >
              <span className="material-symbols-outlined !text-[18px] animate-pulse">auto_awesome</span>
              Guided Matchmaker
            </button>
            <button
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className={`border px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isAdvancedOpen 
                  ? 'bg-bts-gold border-bts-gold text-white shadow-xs' 
                  : 'bg-white border-gray-200 text-brand-dark hover:bg-gray-50'
              }`}
            >
              <span className="material-symbols-outlined !text-[18px]">filter_list</span>
              Filters
            </button>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 border-none rounded-xl px-3 py-2.5 text-xs font-bold text-brand-dark focus:ring-1 focus:ring-bts-gold outline-none cursor-pointer appearance-none pr-8 flex items-center h-full min-w-[110px]"
              >
                <option value="rating">⭐ Rating</option>
                <option value="price-asc">BTS (Low-High)</option>
                <option value="price-desc">BTS (High-Low)</option>
                <option value="sessions">🔥 Popularity</option>
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined !text-[14px] text-gray-400 pointer-events-none">
                keyboard_arrow_down
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Filter Collapsible Panel */}
      {activeTab === "mentors" && (
        <AdvancedFilters 
          isOpen={isAdvancedOpen}
          filters={advancedFilters}
          onChange={setAdvancedFilters}
          onReset={handleResetFilters}
          availableSchools={availableSchools}
          availableModules={availableModules}
        />
      )}

      {/* List Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTab === "mentors" ? (
          /* Mentors List */
          sortedMentors.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4 font-semibold col-span-full">No mentors match your search.</p>
          ) : (
            sortedMentors.map((mentor) => (
              <div 
                key={mentor.id} 
                className="group border border-gray-100 hover:border-bts-gold/30 p-3 rounded-xl hover:bg-gray-50/50 transition-all cursor-pointer flex flex-col gap-2.5 shadow-sm hover:shadow-md bg-white"
              >
                <div className="flex items-start gap-3">
                  <Link to={`/mentor/${mentor.id}`} className="shrink-0" onClick={(e) => e.stopPropagation()}>
                    <img 
                      alt={mentor.name} 
                      className="w-11 h-11 rounded-full object-cover border border-gray-100 group-hover:border-bts-gold/40 transition-colors" 
                      src={mentor.avatar}
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <Link to={`/mentor/${mentor.id}`} className="hover:text-bts-gold transition-colors block truncate" onClick={(e) => e.stopPropagation()}>
                        <p className="text-xs font-bold text-brand-dark leading-tight">{mentor.name}</p>
                      </Link>
                      <div className="flex items-center gap-0.5 text-bts-gold shrink-0 bg-yellow-50 px-1.5 py-0.5 rounded text-[8px] font-extrabold border border-yellow-100">
                        <span className="material-symbols-outlined !text-[9px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        {mentor.rating.toFixed(1)}
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-snug mt-0.5 truncate">{mentor.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-bold text-bts-gold bg-gray-50 border border-gray-100/80 px-1.5 py-0.5 rounded">
                        {mentor.rate} BTS/hr
                      </span>
                      <span className="text-[9px] text-gray-400 font-semibold flex items-center gap-0.5">
                        <span className="material-symbols-outlined !text-[11px]">work_history</span>
                        {mentor.experience} Exp
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Skill Pills & Book Button */}
                <div className="flex items-center justify-between pt-1.5 border-t border-gray-50/80 gap-2">
                  <div className="flex gap-1 overflow-hidden">
                    {mentor.skills.slice(0, 2).map((skill, idx) => (
                      <span 
                        key={idx} 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSearch(skill);
                        }}
                        className="text-[8px] bg-gray-50 text-gray-500 font-bold px-1.5 py-0.5 rounded hover:bg-bts-gold hover:text-white transition-colors cursor-pointer border border-gray-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenBooking(mentor);
                    }}
                    className="bg-brand-dark text-white text-[9px] font-bold px-3 py-1.5 rounded-lg shadow-sm hover:bg-bts-gold transition-colors cursor-pointer shrink-0"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            ))
          )
        ) : (
          /* Bookings List */
          filteredBookings.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-200 col-span-full">
              <span className="material-symbols-outlined text-gray-300 text-3xl mb-1">calendar_today</span>
              <p className="text-xs text-gray-400 font-semibold">No booked sessions found.</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div 
                key={booking.id} 
                className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl hover:shadow-sm transition-all relative group"
              >
                {/* Calendar Block Graphic */}
                <div className="w-10 h-11 bg-white border border-gray-100 rounded-lg overflow-hidden shrink-0 shadow-sm flex flex-col text-center">
                  <div className="bg-red-500 text-white text-[7px] font-bold uppercase py-0.5 tracking-wider">
                    May
                  </div>
                  <div className="flex-1 flex items-center justify-center text-xs font-black text-brand-dark">
                    {booking.date.toString().padStart(2, '0')}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <Link to={`/mentor/${booking.mentorId}`} className="flex items-center gap-1.5 min-w-0 hover:text-bts-gold transition-colors">
                      <img 
                        alt={booking.mentorName} 
                        className="w-4.5 h-4.5 rounded-full object-cover border border-gray-200 shrink-0" 
                        src={booking.mentorAvatar}
                      />
                      <p className="text-[10px] font-bold text-brand-dark truncate">{booking.mentorName}</p>
                    </Link>
                    
                    <div className="flex items-center gap-1.5">
                      <span className="bg-green-50 text-green-600 text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-green-100 uppercase tracking-wide flex items-center gap-0.5 shrink-0">
                        <span className="material-symbols-outlined !text-[9px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        {booking.status}
                      </span>
                      <button
                        onClick={() => setCancelingBooking(booking)}
                        className="text-gray-400 hover:text-red-500 p-0.5 hover:bg-white rounded transition-colors cursor-pointer"
                        title="Cancel Booking"
                      >
                        <span className="material-symbols-outlined !text-[12px]">delete</span>
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-[10px] font-bold text-brand-dark line-clamp-1 mb-1">{booking.topic}</p>
                  
                  <div className="flex items-center justify-between text-[8px] text-gray-400 font-bold uppercase tracking-wide">
                    <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined !text-[11px]">schedule</span> 
                      {booking.slot} ({booking.duration}h)
                    </span>
                    <span className="text-bts-gold font-extrabold">
                      {booking.cost} BTS
                    </span>
                  </div>
                </div>
              </div>
            ))
          )
        )}
      </div>

      {/* Info Widget bottom */}
      <div className="mt-8 p-4 bg-yellow-50 rounded-xl border border-yellow-100 flex items-center gap-3">
        <div className="bg-white p-2 rounded-lg shadow-sm">
          <span className="material-symbols-outlined !text-[16px] text-bts-gold">auto_awesome</span>
        </div>
        <div>
          <p className="text-[10px] font-extrabold text-brand-dark">Premium Matching</p>
          <p className="text-[9px] text-gray-500 leading-tight">Get matched automatically based on your history.</p>
        </div>
      </div>

      {/* Booking Modal context */}
      <BookingModal 
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        mentor={selectedMentor}
      />

      {/* Guided Research Wizard Modal */}
      <GuidedResearchWizard 
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSelectMentor={handleOpenBooking}
      />

      {/* Cancellation Confirmation Modal */}
      {cancelingBooking && (
        <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-sm w-full p-6 text-center space-y-4 transform scale-100 transition-all">
            <div className="w-12 h-12 bg-red-50 rounded-full border border-red-200 flex items-center justify-center text-red-500 mx-auto shadow-sm">
              <span className="material-symbols-outlined !text-2xl">warning</span>
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-brand-dark">Cancel Private Session?</h4>
              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                Are you sure you want to cancel your session with <strong className="text-brand-dark font-bold">{cancelingBooking.mentorName}</strong> on <strong className="text-brand-dark font-bold">May {cancelingBooking.date}</strong> at <strong className="text-brand-dark font-bold">{cancelingBooking.slot}</strong>?
              </p>
              <p className="text-[10px] text-bts-gold font-bold mt-2 bg-yellow-50/60 border border-yellow-100/50 py-1.5 rounded-lg">
                Refund amount: {cancelingBooking.cost} BTS
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={() => setCancelingBooking(null)}
                className="flex-1 border border-gray-200 text-brand-dark py-2.5 rounded-xl font-bold text-xs hover:bg-gray-50 transition-colors cursor-pointer text-center"
              >
                Keep Session
              </button>
              <button 
                onClick={() => {
                  handleCancel(cancelingBooking.id);
                  setCancelingBooking(null);
                }}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-bold text-xs hover:bg-red-600 transition-all cursor-pointer text-center shadow-sm"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

