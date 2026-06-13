import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { institutes } from '../data/institutes';
import { getAllSessions } from '../utils/sessionsStorage';
import { mentors } from '../data/mentors';
import { getPublicEnrollments, enrollInPublicSession } from '../utils/enrollmentStorage';
import ReviewSection from '../components/ReviewSection';
import { REVIEW_ENTITY_TYPES } from '../utils/reviewsStorage';

export default function InstituteDetail() {
  const { id } = useParams();
  const institute = institutes.find(inst => inst.id === id);

  const [enrollments, setEnrollments] = useState([]);

  // Fetch enrollments on mount
  useEffect(() => {
    setEnrollments(getPublicEnrollments());
  }, []);

  if (!institute) {
    return (
      <>
        <Topbar searchPlaceholder="Search courses or institutes..." />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">school</span>
          <h2 className="text-2xl font-bold text-brand-dark mb-2">Institute Not Found</h2>
          <p className="text-gray-500 mb-6 max-w-md">The institute profile you are trying to view does not exist or may have been removed.</p>
          <Link to="/d-institute" className="bg-bts-gold text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all shadow-sm">
            Back to D-Institute
          </Link>
        </div>
      </>
    );
  }

  // Filter workshops/sessions offered by this institute's faculty
  const activeWorkshops = getAllSessions().filter((session) =>
    institute.faculties.includes(session.instructor?.mentorId)
  );

  // Load mentors associated with this institute
  const associatedMentors = mentors.filter(mentor => 
    institute.faculties.includes(mentor.id)
  );

  const handleEnroll = (sessionId) => {
    const updated = enrollInPublicSession(sessionId);
    setEnrollments(updated);
  };

  // Styles map for the training / expertise areas
  const expStyles = {
    "Blockchain & Web3": { bg: "bg-amber-50 text-bts-gold border-amber-100", icon: "hub" },
    "Data Science & Analytics": { bg: "bg-blue-50 text-blue-600 border-blue-100", icon: "database" },
    "Artificial Intelligence": { bg: "bg-purple-50 text-purple-600 border-purple-100", icon: "psychology" },
    "Software Development": { bg: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: "code" },
    "Cybersecurity": { bg: "bg-rose-50 text-rose-600 border-rose-100", icon: "shield" },
    "Engineering Technologies": { bg: "bg-indigo-50 text-indigo-600 border-indigo-100", icon: "construction" },
    "Board Strategy & Governance": { bg: "bg-amber-50 text-bts-gold border-amber-100", icon: "dashboard" },
    "Capital Raising & Tokenomics": { bg: "bg-blue-50 text-blue-600 border-blue-100", icon: "payments" },
    "Presentation Coaching": { bg: "bg-purple-50 text-purple-600 border-purple-100", icon: "coaching" },
    "Prototype Development": { bg: "bg-indigo-50 text-indigo-600 border-indigo-100", icon: "build" }
  };

  // Contact details mock for D-Institute profiles
  const contactDetails = {
    bitstacks: {
      email: "admissions@mybitstack.com",
      phone: "+1 (555) 248-7822",
      address: "Tech Innovation Hub, Block A, Suite 400",
      socials: {
        twitter: "https://twitter.com/mybitstack",
        github: "https://github.com/mybitstack",
        linkedin: "https://linkedin.com/company/mybitstack",
        website: "https://mybitstack.com/?utm_source=chatgpt.com"
      }
    },
    rocwell: {
      email: "info@rocwell.edu",
      phone: "+1 (555) 998-1044",
      address: "Executive Square, Corporate Tower, Floor 18",
      socials: {
        twitter: "https://twitter.com/rocwelledu",
        github: "https://github.com/rocwelledu",
        linkedin: "https://linkedin.com/company/rocwelledu",
        website: "https://rocwell.edu"
      }
    },
    "pfe-guidance": {
      email: "academic-support@pfe-guidance.org",
      phone: "+1 (555) 774-8833",
      address: "University Extension, Support Wing C",
      socials: {
        twitter: "https://twitter.com/pfeguidance",
        github: "https://github.com/pfeguidance",
        linkedin: "https://linkedin.com/company/pfeguidance",
        website: "https://pfe-guidance.org"
      }
    }
  }[id] || {};

  return (
    <>
      <Topbar searchPlaceholder={`Search in ${institute.title}...`} />

      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in mt-6" data-purpose="institute-profile">
        {/* Navigation Breadcrumb */}
        <div>
          <Link 
            to="/d-institute" 
            className="inline-flex items-center gap-2 text-xs font-extrabold text-gray-400 hover:text-bts-gold transition-colors uppercase tracking-widest"
          >
            <span className="material-symbols-outlined !text-sm">arrow_back</span>
            Back to D-Institute
          </Link>
        </div>

        {/* Hero Section */}
        <section className="relative bg-white border border-gray-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-sm overflow-hidden">
          {/* Glowing Accent Circle */}
          <div className="absolute -right-24 -top-24 w-48 h-48 bg-bts-gold/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative shrink-0">
            <img 
              alt={institute.title} 
              className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover border-4 border-yellow-50 shadow-md animate-fade-in" 
              src={institute.image}
            />
            <div className="absolute -bottom-2 -right-2 bg-brand-dark p-1.5 rounded-full border-4 border-white shadow-md">
              <span className="material-symbols-outlined text-white text-[16px]">verified</span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3 justify-center md:justify-start">
              <h2 className="text-2xl md:text-3xl font-extrabold text-brand-dark leading-tight">{institute.title}</h2>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-50 text-bts-gold rounded-lg text-xs font-bold self-center md:self-auto shadow-sm border border-yellow-100/50">
                <span className="material-symbols-outlined !text-[14px]">school</span>
                <span>{institute.tag}</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-4 leading-relaxed max-w-3xl">
              {institute.description}
            </p>
            {contactDetails.socials?.website && (
              <a 
                href={contactDetails.socials.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-bts-gold font-bold hover:underline"
              >
                <span className="material-symbols-outlined !text-sm">language</span>
                Visit Official Website
              </a>
            )}
          </div>
        </section>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Main Content */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Active Sessions & Workshops (High Prominence) */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-extrabold text-brand-dark flex items-center gap-2">
                    <span className="material-symbols-outlined text-bts-gold">event_seat</span>
                    Active Workshops Available Now
                  </h3>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Live sessions & certified programs</p>
                </div>
                <span className="bg-yellow-50 text-bts-gold text-[10px] font-extrabold px-2.5 py-1 rounded-lg border border-yellow-100/50 flex items-center gap-1 shadow-sm shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-bts-gold animate-ping"></span>
                  {activeWorkshops.length} Available
                </span>
              </div>

              {activeWorkshops.length === 0 ? (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-8 text-center">
                  <span className="material-symbols-outlined text-gray-300 text-4xl mb-2">event_busy</span>
                  <p className="text-xs text-gray-400 font-semibold">No active sessions or workshops available at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeWorkshops.map((session) => {
                    const isEnrolled = enrollments.includes(session.id);
                    return (
                      <div 
                        key={session.id}
                        className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-bts-gold/30 hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        {/* Banner Area */}
                        <div className="relative h-36 bg-brand-dark p-5 flex flex-col justify-between overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/40 to-brand-dark/95 z-10 pointer-events-none"></div>
                          
                          <div className="flex justify-between items-center z-10">
                            <span className="text-[9px] bg-white/10 text-white backdrop-blur-md px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              {session.level}
                            </span>
                            <span className="text-[9px] text-bts-gold font-extrabold uppercase tracking-wider">
                              {session.date}
                            </span>
                          </div>

                          <h4 className="text-white font-extrabold text-sm leading-snug z-10 group-hover:text-bts-gold transition-colors mt-2 line-clamp-2">
                            {session.title}
                          </h4>
                        </div>

                        {/* Description & Metadata */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <p className="text-[11px] text-gray-400 font-medium leading-relaxed line-clamp-2">
                            {session.overview}
                          </p>

                          <div className="flex justify-between items-center text-[10px] text-gray-400 font-extrabold uppercase tracking-wide pt-1">
                            <span className="flex items-center gap-1 text-gray-500">
                              <span className="material-symbols-outlined !text-[14px]">groups</span>
                              {session.attendees} Enrolled
                            </span>
                            <span className="flex items-center gap-1 text-gray-500">
                              <span className="material-symbols-outlined !text-[14px]">timer</span>
                              {session.duration}
                            </span>
                          </div>

                          {/* Footer Action Area */}
                          <div className="flex items-center gap-3 pt-3 border-t border-gray-50 justify-between">
                            <Link 
                              to={`/mentor/${session.instructor.mentorId}`} 
                              className="flex items-center gap-2 min-w-0 hover:text-bts-gold transition-colors"
                            >
                              <img 
                                src={session.instructor.avatar} 
                                alt={session.instructor.name}
                                className="w-7 h-7 rounded-full object-cover border border-gray-200"
                              />
                              <span className="text-[10px] font-bold text-brand-dark truncate">
                                {session.instructor.name}
                              </span>
                            </Link>

                            <div className="flex items-center gap-2 shrink-0">
                              <Link 
                                to={`/public-session/${session.id}`}
                                className="px-3 py-1.5 text-[10px] font-bold text-gray-500 hover:text-brand-dark hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                Details
                              </Link>
                              <button
                                onClick={() => handleEnroll(session.id)}
                                className={`px-3.5 py-1.5 text-[10px] font-bold rounded-lg transition-colors cursor-pointer border ${
                                  isEnrolled
                                    ? "bg-green-50 text-green-600 border-green-200"
                                    : "bg-bts-gold text-white hover:bg-brand-dark border-transparent shadow-sm"
                                }`}
                              >
                                {isEnrolled ? "Enrolled ✓" : "Enroll Now"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* List of Training (Areas of Expertise) */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-extrabold text-brand-dark flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-bts-gold">menu_book</span>
                Trainings Offered & Expertise
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {institute.expertise.map((exp, idx) => {
                  const style = expStyles[exp.title] || { bg: "bg-yellow-50 text-bts-gold border-yellow-100", icon: "star" };
                  return (
                    <div 
                      key={idx} 
                      className="p-5 rounded-2xl border border-gray-100/50 hover:border-bts-gold/30 hover:bg-gray-50/20 transition-all flex flex-col justify-between bg-white shadow-sm hover:shadow-md"
                    >
                      <div className="flex gap-4">
                        <div className={`w-11 h-11 ${style.bg} border rounded-xl flex items-center justify-center shrink-0 shadow-sm`}>
                          <span className="material-symbols-outlined !text-[22px]">
                            {style.icon}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-extrabold text-brand-dark mb-1 leading-snug">{exp.title}</h4>
                          <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                            {exp.desc}
                          </p>
                        </div>
                      </div>
                      
                      {/* Module tags */}
                      {exp.modules && (
                        <div className="mt-4 pt-3.5 border-t border-gray-50 flex flex-wrap gap-1.5">
                          {exp.modules.map((mod, modIdx) => (
                            <span 
                              key={modIdx}
                              className="text-[8px] bg-gray-50 text-gray-500 font-bold px-2 py-0.5 rounded border border-gray-100/50"
                            >
                              {mod}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Vision & Mission */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-extrabold text-brand-dark flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-bts-gold">visibility</span>
                  Our Vision
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {institute.vision}
                </p>
              </div>
              <hr className="border-gray-100/80" />
              <div>
                <h3 className="text-lg font-extrabold text-brand-dark flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-bts-gold">task_alt</span>
                  Our Mission
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {institute.mission.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-bold text-gray-600">
                      <span className="material-symbols-outlined text-bts-gold shrink-0 !text-[18px]">check_circle</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Long Term Ambition */}
            <div className="bg-gradient-to-r from-brand-dark to-brand-dark/90 text-white rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                <span className="material-symbols-outlined !text-[120px]">insights</span>
              </div>
              <h3 className="text-lg font-extrabold text-bts-gold flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined">rocket_launch</span>
                Long-Term Ambition
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-medium">
                {institute.longTermAmbition}
              </p>
              {institute.oneSentence && (
                <div className="mt-4 pt-4 border-t border-white/10 text-[11px] font-bold text-white italic">
                  "{institute.oneSentence}"
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar Columns */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Institute Faculty / Instructors (Linked) */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-brand-dark flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-bts-gold">badge</span>
                Expert Faculty
              </h3>
              <div className="space-y-3">
                {associatedMentors.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4 font-semibold">No faculty members registered.</p>
                ) : (
                  associatedMentors.map((mentor) => (
                    <Link 
                      key={mentor.id}
                      to={`/mentor/${mentor.id}`}
                      className="flex items-center gap-3 p-2.5 bg-gray-50 hover:bg-yellow-50/40 border border-gray-100 rounded-xl transition-all group cursor-pointer"
                    >
                      <img 
                        alt={mentor.name} 
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0" 
                        src={mentor.avatar}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-extrabold text-brand-dark group-hover:text-bts-gold transition-colors truncate">
                          {mentor.name}
                        </p>
                        <p className="text-[9px] text-gray-400 truncate leading-snug">{mentor.role}</p>
                      </div>
                      <span className="material-symbols-outlined text-gray-300 group-hover:text-bts-gold transition-colors !text-[16px]">
                        chevron_right
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-brand-dark mb-4">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-bts-gold !text-[18px] mt-0.5">mail</span>
                  <div className="min-w-0">
                    <p className="text-[9px] text-gray-400 font-bold uppercase leading-none mb-1">Email Support</p>
                    <a href={`mailto:${contactDetails.email}`} className="text-xs font-bold text-brand-dark hover:underline truncate block">
                      {contactDetails.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-bts-gold !text-[18px] mt-0.5">phone</span>
                  <div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase leading-none mb-1">Telephone</p>
                    <p className="text-xs font-bold text-brand-dark">
                      {contactDetails.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-bts-gold !text-[18px] mt-0.5">location_on</span>
                  <div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase leading-none mb-1">Location Campus</p>
                    <p className="text-xs font-medium text-gray-500 leading-snug">
                      {contactDetails.address}
                    </p>
                  </div>
                </div>

                {/* Social links */}
                <div className="flex gap-3.5 pt-3 border-t border-gray-100">
                  {contactDetails.socials?.twitter && (
                    <a href={contactDetails.socials.twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-bts-gold transition-colors">
                      <span className="material-symbols-outlined !text-[18px]">public</span>
                    </a>
                  )}
                  {contactDetails.socials?.github && (
                    <a href={contactDetails.socials.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-bts-gold transition-colors">
                      <span className="material-symbols-outlined !text-[18px]">terminal</span>
                    </a>
                  )}
                  {contactDetails.socials?.linkedin && (
                    <a href={contactDetails.socials.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-bts-gold transition-colors">
                      <span className="material-symbols-outlined !text-[18px]">account_circle</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Learning Approach */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-brand-dark mb-4">Learning Approach</h3>
              <div className="space-y-4">
                {institute.learningApproach.slice(0, 4).map((approach, idx) => (
                  <div key={idx} className="flex gap-3 relative">
                    {/* Line for timeline indicator */}
                    {idx < 3 && (
                      <div className="absolute left-2.5 top-5 bottom-[-20px] w-0.5 bg-gray-100"></div>
                    )}
                    <div className="w-5.5 h-5.5 rounded-full bg-yellow-50 border border-yellow-200 text-bts-gold flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm z-10">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-brand-dark leading-tight">{approach.title}</h4>
                      <p className="text-[10px] text-gray-400 leading-snug mt-0.5 font-medium">{approach.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Audience served */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-brand-dark mb-4">Who We Serve</h3>
              <div className="flex flex-wrap gap-1.5">
                {institute.whoWeServe.map((item, idx) => (
                  <span 
                    key={idx}
                    className="text-[9px] bg-gray-50 text-gray-500 font-bold px-2.5 py-1 rounded-lg border border-gray-100 shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <ReviewSection
          entityType={REVIEW_ENTITY_TYPES.INSTITUTE}
          entityId={institute.id}
          entityLabel={institute.name}
          title="Institute Reviews"
          eligibilityContext={{
            instituteSessionIds: activeWorkshops.map((s) => s.id),
          }}
          emptyText="No reviews yet for this institute."
        />
      </div>
    </>
  );
}
