import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mentors } from '../data/mentors';
import Topbar from '../components/Topbar';
import BookingModal from '../components/BookingModal';
import ReviewSection, { useEntityRating } from '../components/ReviewSection';
import { REVIEW_ENTITY_TYPES } from '../utils/reviewsStorage';

export default function MentorProfile() {
  const { id } = useParams();
  const mentor = mentors.find(m => m.id === id);

  const [selectedDay, setSelectedDay] = useState(3);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotsFade, setSlotsFade] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const ratingAggregate = useEntityRating(
    REVIEW_ENTITY_TYPES.MENTOR,
    mentor?.id || id,
    mentor?.feedback || [],
    mentor?.rating || 0,
    mentor?.feedback?.length || 0
  );

  if (!mentor) {
    return (
      <>
        <Topbar searchPlaceholder="Search mentorship, courses, or missions..." />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">person_off</span>
          <h2 className="text-2xl font-bold text-brand-dark mb-2">Mentor Not Found</h2>
          <p className="text-gray-500 mb-6 max-w-md">The mentor profile you are trying to view does not exist or may have been removed.</p>
          <Link to="/expert-mentors" className="bg-bts-gold text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all shadow-sm">
            Back to Expert Mentors
          </Link>
        </div>
      </>
    );
  }

  const handleDayClick = (dayNum) => {
    setSlotsFade(true);
    setSelectedDay(dayNum);
    setSelectedSlot(null);
    setTimeout(() => {
      setSlotsFade(false);
    }, 150);
  };

  const preselectedSlotString = selectedSlot !== null ? mentor.slots[selectedSlot]?.time : "";

  return (
    <>
      <Topbar searchPlaceholder="Search mentorship, courses, or missions..." />

      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in" data-purpose="mentor-profile">
        {/* Navigation Breadcrumb */}
        <div>
          <Link 
            to="/expert-mentors" 
            className="inline-flex items-center gap-2 text-xs font-extrabold text-gray-400 hover:text-bts-gold transition-colors uppercase tracking-widest"
          >
            <span className="material-symbols-outlined !text-sm">arrow_back</span>
            Back to Expert Mentors
          </Link>
        </div>

        {/* Hero Header Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-sm">
            <div className="relative">
              <img 
                alt={mentor.name} 
                className="w-36 h-36 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-yellow-50 shadow-md" 
                src={mentor.avatar}
              />
              <div className="absolute -bottom-2 -right-2 bg-bts-gold p-1.5 rounded-full border-4 border-white shadow-md">
                <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3 justify-center md:justify-start">
                <h2 className="text-2xl md:text-3xl font-extrabold text-brand-dark leading-tight">{mentor.name}</h2>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-50 text-bts-gold rounded-lg text-xs font-bold self-center md:self-auto shadow-sm">
                  <span className="material-symbols-outlined !text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span>{ratingAggregate.rating.toFixed(1)} Rating</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-500 mb-6 leading-relaxed">
                {mentor.role}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {mentor.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-3.5 py-1.5 bg-gray-50 border border-gray-100 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing/Stats Card */}
          <div className="bg-brand-dark text-white rounded-2xl p-8 shadow-md flex flex-col justify-between relative overflow-hidden">
            {/* Glowing Accent Blob */}
            <div className="absolute -right-16 -top-16 w-36 h-36 bg-bts-gold/15 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="space-y-5 relative z-10">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hourly Rate</span>
                <span className="text-xl font-extrabold text-bts-gold">{mentor.rate} BTS/hr</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Sessions</span>
                <span className="text-xl font-extrabold">{mentor.sessions}+</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Experience</span>
                <span className="text-xl font-extrabold">{mentor.experience}</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsBookingOpen(true)}
              className="w-full bg-gradient-to-br from-[#FFB77D] to-[#FE932C] text-white py-3.5 px-4 rounded-xl font-bold text-xs shadow-md hover:brightness-105 active:scale-[0.98] transition-all mt-6 cursor-pointer relative z-10 text-center"
            >
              Request Private Session
            </button>
          </div>
        </section>

        {/* Bio, Timeline & Calendar */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Bio & Timeline */}
          <div className="lg:col-span-3 space-y-8">
            {/* About bio card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-extrabold text-brand-dark mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-bts-gold">description</span>
                About
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-normal">
                {mentor.about}
              </p>
            </div>

            {/* Experience Timeline */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-extrabold text-brand-dark mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-bts-gold">timeline</span>
                Experience Timeline
              </h3>
              <div className="relative border-l-2 border-gray-100 ml-3 pl-8 space-y-8">
                {mentor.timeline.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[39px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-bts-gold shadow-sm"></div>
                    <h4 className="font-bold text-sm text-brand-dark leading-snug">{item.title}</h4>
                    <p className="text-[10px] font-bold text-bts-gold uppercase mb-2 tracking-wider">{item.year}</p>
                    <p className="text-xs text-gray-500 leading-relaxed font-normal">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Availability Calendar */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-extrabold text-brand-dark flex items-center gap-2">
                  <span className="material-symbols-outlined text-bts-gold">calendar_month</span>
                  Availability
                </h3>
                <div className="flex gap-1.5">
                  <button className="p-1 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-brand-dark transition-colors cursor-pointer">
                    <span className="material-symbols-outlined !text-lg">chevron_left</span>
                  </button>
                  <button className="p-1 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-brand-dark transition-colors cursor-pointer">
                    <span className="material-symbols-outlined !text-lg">chevron_right</span>
                  </button>
                </div>
              </div>

              {/* Weekday labels */}
              <div className="grid grid-cols-7 mb-2 text-center">
                <span className="text-[10px] font-extrabold text-gray-400">M</span>
                <span className="text-[10px] font-extrabold text-gray-400">T</span>
                <span className="text-[10px] font-extrabold text-gray-400">W</span>
                <span className="text-[10px] font-extrabold text-gray-400">T</span>
                <span className="text-[10px] font-extrabold text-gray-400">F</span>
                <span className="text-[10px] font-extrabold text-gray-400">S</span>
                <span className="text-[10px] font-extrabold text-gray-400">S</span>
              </div>

              {/* Grid Days */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {/* Mock Calendar Days */}
                <div className="aspect-square flex items-center justify-center rounded-lg text-[11px] font-bold text-gray-300 select-none">28</div>
                <div className="aspect-square flex items-center justify-center rounded-lg text-[11px] font-bold text-gray-300 select-none">29</div>
                
                {[1, 2].map(day => (
                  <button 
                    key={day} 
                    onClick={() => handleDayClick(day)}
                    className={`aspect-square flex items-center justify-center rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                      selectedDay === day 
                        ? 'bg-bts-gold text-white border-bts-gold shadow-sm' 
                        : 'border-gray-100 text-brand-dark hover:border-bts-gold'
                    }`}
                  >
                    {day}
                  </button>
                ))}

                <button className={`aspect-square flex items-center justify-center rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                  selectedDay === 3 
                    ? 'bg-bts-gold text-white border-bts-gold shadow-sm' 
                    : 'border-gray-100 text-brand-dark hover:border-bts-gold'
                }`}
                onClick={() => handleDayClick(3)}
                >
                  3
                </button>

                {[4, 5, 6, 7].map(day => (
                  <button 
                    key={day} 
                    onClick={() => handleDayClick(day)}
                    className={`aspect-square flex items-center justify-center rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                      selectedDay === day 
                        ? 'bg-bts-gold text-white border-bts-gold shadow-sm' 
                        : 'border-gray-100 text-brand-dark hover:border-bts-gold'
                    }`}
                  >
                    {day}
                  </button>
                ))}

                <div className="aspect-square flex items-center justify-center rounded-lg text-[11px] font-bold border border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed select-none">8</div>

                {[9, 10, 11, 12].map(day => (
                  <button 
                    key={day} 
                    onClick={() => handleDayClick(day)}
                    className={`aspect-square flex items-center justify-center rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                      selectedDay === day 
                        ? 'bg-bts-gold text-white border-bts-gold shadow-sm' 
                        : 'border-gray-100 text-brand-dark hover:border-bts-gold'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Available Slots for Selected Day */}
              <div className="space-y-3">
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                  Available Slots (May {selectedDay})
                </p>
                <div 
                  className="grid grid-cols-2 gap-2 transition-opacity duration-150"
                  style={{ opacity: slotsFade ? 0 : 1 }}
                >
                  {mentor.slots.map((slot, idx) => (
                    slot.available ? (
                      <button 
                        key={idx}
                        onClick={() => { setSelectedSlot(idx); setIsBookingOpen(true); }}
                        className={`py-2.5 px-3 border rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                          selectedSlot === idx 
                            ? 'bg-bts-gold border-bts-gold text-white shadow-sm'
                            : 'border-yellow-100 text-bts-gold bg-yellow-50/50 hover:bg-yellow-50'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ) : (
                      <button 
                        key={idx}
                        disabled
                        className="py-2.5 px-3 border border-gray-100 text-gray-300 rounded-xl text-xs font-semibold line-through text-center cursor-not-allowed bg-gray-50/20"
                      >
                        {slot.time}
                      </button>
                    )
                  ))}
                </div>
              </div>
            </div>

            {/* Timezone Information Box */}
            <div className="mt-8 p-4 bg-gray-50 border border-gray-100 rounded-xl">
              <div className="flex items-center gap-2 mb-1.5 text-bts-gold">
                <span className="material-symbols-outlined !text-[18px]">info</span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-dark">Timezone Awareness</span>
              </div>
              <p className="text-xs text-gray-500 leading-normal">
                Slots automatically converted to your local time zone. (Current: {mentor.timezone}).
              </p>
            </div>
          </div>
        </section>

        {/* Public Sessions / Workshops */}
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="text-lg font-extrabold text-brand-dark flex items-center gap-2">
              <span className="material-symbols-outlined text-bts-gold">groups</span>
              Public Workshops
            </h3>
            <Link 
              to="/public-sessions" 
              className="text-bts-gold text-xs font-bold flex items-center gap-1 hover:underline"
            >
              View All 
              <span className="material-symbols-outlined !text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentor.workshops.map((workshop, idx) => {
              const CardWrapper = workshop.sessionId ? Link : 'div';
              const wrapperProps = workshop.sessionId
                ? { to: `/public-session/${workshop.sessionId}` }
                : {};
              return (
                <CardWrapper
                  key={idx}
                  {...wrapperProps}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden group shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="h-28 bg-brand-dark relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-[#FFB77D] to-[#FE932C]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50"></div>
                    <span className="text-sm font-extrabold text-white tracking-widest uppercase opacity-75">
                      {workshop.level}
                    </span>
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] font-extrabold text-bts-gold border border-yellow-100 uppercase tracking-widest">
                      {workshop.level}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-brand-dark mb-2 group-hover:text-bts-gold transition-colors leading-snug">
                        {workshop.title}
                      </h4>
                      <div className="flex items-center gap-4 text-gray-400 text-xs mb-6">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined !text-[14px]">calendar_today</span> 
                          {workshop.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined !text-[14px]">schedule</span> 
                          {workshop.duration}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-auto border-t border-gray-50 pt-4">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {workshop.attendees.map((attendee, attIdx) => (
                          <div 
                            key={attIdx} 
                            className="w-7 h-7 rounded-full border border-white bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-500 shadow-sm shrink-0"
                          >
                            {attendee}
                          </div>
                        ))}
                      </div>
                      <span className="px-4 py-2 bg-brand-dark text-white rounded-xl text-xs font-bold group-hover:bg-bts-gold transition-colors shadow-sm">
                        {workshop.buttonText}
                      </span>
                    </div>
                  </div>
                </CardWrapper>
              );
            })}
          </div>
        </section>

        {/* History / Testimonials & Feedback */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-extrabold text-brand-dark mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-bts-gold">history</span>
              Recent Activity
            </h3>
            <div className="space-y-6">
              {mentor.activity.map((act, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="mt-1 w-9 h-9 rounded-xl bg-yellow-50 text-bts-gold flex items-center justify-center shrink-0 border border-yellow-100">
                    <span className="material-symbols-outlined !text-[18px]">{act.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-dark">{act.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5 leading-normal">{act.desc}</p>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-1 block">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Feedback */}
          <ReviewSection
            entityType={REVIEW_ENTITY_TYPES.MENTOR}
            entityId={mentor.id}
            entityLabel={mentor.name}
            title="Student Feedback"
            seedReviews={mentor.feedback}
            fallbackRating={mentor.rating}
            fallbackCount={mentor.feedback.length}
            eligibilityContext={{ mentorId: mentor.id }}
          />
        </section>
      </div>

      {/* Booking Form Modal */}
      <BookingModal 
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        mentor={mentor}
        preselectedDate={selectedDay}
        preselectedSlot={preselectedSlotString}
      />
    </>
  );
}
