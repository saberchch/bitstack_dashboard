import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mentors } from '../data/mentors';
import BookingModal from './BookingModal';

export default function MentorsGrid() {
  const [search, setSearch] = useState("");
  const [expertise, setExpertise] = useState("All");
  const [rating, setRating] = useState("All");

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);

  const handleOpenBooking = (mentor) => {
    setSelectedMentor(mentor);
    setIsBookingOpen(true);
  };

  const filteredMentors = mentors.filter(mentor => {
    // Search filter
    const matchesSearch = mentor.name.toLowerCase().includes(search.toLowerCase()) ||
      mentor.bio.toLowerCase().includes(search.toLowerCase()) ||
      mentor.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase()));

    // Expertise filter
    const matchesExpertise = expertise === "All" || mentor.skills.some(skill => {
      if (expertise === "Solidity") return skill.toLowerCase().includes("solidity");
      if (expertise === "DeFi Architecture") return skill.toLowerCase().includes("defi") || skill.toLowerCase().includes("tokenomics") || skill.toLowerCase().includes("amm");
      if (expertise === "ZKP Cryptography") return skill.toLowerCase().includes("cryptography") || skill.toLowerCase().includes("zk-proofs");
      return false;
    });

    // Rating filter
    const matchesRating = rating === "All" || (
      rating === "4.5+" ? mentor.rating >= 4.5 : mentor.rating >= 4.0
    );

    return matchesSearch && matchesExpertise && matchesRating;
  });

  return (
    <div className="space-y-8">
      {/* Filters Bar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined">search</span>
            <input 
              className="w-full bg-gray-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-bts-gold outline-none" 
              placeholder="Search by name, tags, or expertise..." 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <select 
              className="bg-gray-50 border-none rounded-xl px-4 py-3 text-sm text-gray-600 focus:ring-2 focus:ring-bts-gold min-w-[140px] outline-none"
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
            >
              <option value="All">All Expertise</option>
              <option value="Solidity">Solidity</option>
              <option value="DeFi Architecture">DeFi Architecture</option>
              <option value="ZKP Cryptography">ZKP Cryptography</option>
            </select>
            <select 
              className="bg-gray-50 border-none rounded-xl px-4 py-3 text-sm text-gray-600 focus:ring-2 focus:ring-bts-gold min-w-[120px] outline-none"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="All">All Ratings</option>
              <option value="4.5+">Rating 4.5+</option>
              <option value="4.0+">Rating 4.0+</option>
            </select>
            <button 
              onClick={() => { setSearch(""); setExpertise("All"); setRating("All"); }}
              className="bg-bts-gold text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
            >
              <span className="material-symbols-outlined !text-[20px]">filter_list</span>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Mentor Cards Grid */}
      {filteredMentors.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
          <span className="material-symbols-outlined text-4xl text-gray-300 mb-3">person_search</span>
          <p className="text-gray-500 font-medium">No mentors found matching your filters.</p>
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
                    <div className="absolute -bottom-1 -right-1 bg-bts-gold p-1 rounded-full border-2 border-white">
                      <span className="material-symbols-outlined !text-[12px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    </div>
                  </div>
                  <div className="pr-20">
                    <h3 className="font-bold text-brand-dark text-lg leading-tight">{mentor.name}</h3>
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
                    <span key={index} className="text-[9px] font-extrabold px-2 py-1 bg-gray-50 text-gray-500 rounded border border-gray-100 uppercase tracking-tight">
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

      {/* Pagination */}
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

      {/* Booking Form Modal */}
      <BookingModal 
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        mentor={selectedMentor}
      />
    </div>
  );
}
