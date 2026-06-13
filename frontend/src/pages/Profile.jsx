import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import { getProfile, updateProfile } from '../utils/profileStorage';
import { getPrivateBookings, getPublicEnrollments, cancelPrivateBooking } from '../utils/enrollmentStorage';
import { sessions as seedSessions } from '../data/sessions';
import { institutes as seedInstitutes } from '../data/institutes';

const MOCK_AVATARS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBGwwnDm6m5r0C-N0LHiqCBdL2-Nqx8_NqM4iWbojCLkbc_lfkXRoD8ifHqFu_B4YIjC5ptg1deTb7eMqgkoUlSehDIy654yLdySvgNwbY744bsS7-QPDkq8VkubMIslVtgfCIN5VL-RCiGgf7ePrgYIfCFwJGsiNocFZZ5Z_twCj6Fpa0p_1lO7g3d7TBFB_N83r1viTB_zGTY-y9EGraWh8F1Y-_qTQrA1O1izM2LvzBfBgXZ36Y67pgHQLmfW-TzCjpN9MLE9OU",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop"
];

const INITIAL_AVAILABLE_TOPICS = [
  "Smart Contracts",
  "DeFi (Fintech)",
  "UI/UX Design",
  "AI Ethics",
  "Big Data / Cybersecurity"
];

export default function Profile() {
  const [profile, setProfile] = useState(getProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('sessions'); // 'sessions' | 'library' | 'missions' | 'courses' | 'history'
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form states
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editType, setEditType] = useState(profile.profileType);
  const [editVerification, setEditVerification] = useState(profile.verificationStatus);
  const [editSkillLevel, setEditSkillLevel] = useState(profile.skillLevel);
  const [editAvatar, setEditAvatar] = useState(profile.avatar);
  const [editInterests, setEditInterests] = useState(profile.topicInterests);
  const [editLinkedin, setEditLinkedin] = useState(profile.linkedin);
  const [editGithub, setEditGithub] = useState(profile.github);
  const [editWebsite, setEditWebsite] = useState(profile.website);

  // Interest search & custom creation state
  const [availableTopics, setAvailableTopics] = useState(() => {
    const combined = [...INITIAL_AVAILABLE_TOPICS];
    profile.topicInterests.forEach(topic => {
      if (!combined.includes(topic)) {
        combined.push(topic);
      }
    });
    return combined;
  });
  const [topicSearch, setTopicSearch] = useState('');

  // Tab Data states
  const [privateBookings, setPrivateBookings] = useState([]);
  const [publicEnrollments, setPublicEnrollments] = useState([]);
  const [librarySaved, setLibrarySaved] = useState([]);
  const [libraryPurchased, setLibraryPurchased] = useState([]);
  const [libraryUploads, setLibraryUploads] = useState([]);
  const [lancerApplications, setLancerApplications] = useState([]);
  const [lancerCreatedMissions, setLancerCreatedMissions] = useState([]);
  const [instituteRegistrations, setInstituteRegistrations] = useState([]);

  useEffect(() => {
    loadTabData();
    const handleProfileSync = () => {
      const p = getProfile();
      setProfile(p);
    };
    window.addEventListener('bts_profile_change', handleProfileSync);
    return () => window.removeEventListener('bts_profile_change', handleProfileSync);
  }, []);

  const loadTabData = () => {
    setPrivateBookings(getPrivateBookings());
    setPublicEnrollments(getPublicEnrollments());

    try {
      const saved = JSON.parse(localStorage.getItem('bts_library_saved') || '[]');
      const purchased = JSON.parse(localStorage.getItem('bts_library_purchased') || '[]');
      const uploads = JSON.parse(localStorage.getItem('bts_library_uploads') || '[]');
      setLibrarySaved(saved);
      setLibraryPurchased(purchased);
      setLibraryUploads(uploads);
    } catch (e) {
      console.error(e);
    }

    try {
      const apps = JSON.parse(localStorage.getItem('bts_lancer_applications') || '[]');
      const created = JSON.parse(localStorage.getItem('bts_lancer_created_missions') || '[]');
      setLancerApplications(apps);
      setLancerCreatedMissions(created);
    } catch (e) {
      console.error(e);
    }

    try {
      const inst = JSON.parse(localStorage.getItem('bts_institute_registrations') || '[]');
      setInstituteRegistrations(inst);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = updateProfile({
      name: editName,
      email: editEmail,
      phone: editPhone,
      role: profile.role, // Disallow modification from form edits; use original
      bio: editBio,
      profileType: editType,
      verificationStatus: editVerification,
      skillLevel: editSkillLevel,
      avatar: editAvatar,
      topicInterests: editInterests,
      linkedin: editLinkedin,
      github: editGithub,
      website: editWebsite
    });
    setProfile(updated);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(profile.name);
    setEditEmail(profile.email);
    setEditPhone(profile.phone);
    setEditBio(profile.bio);
    setEditType(profile.profileType);
    setEditVerification(profile.verificationStatus);
    setEditSkillLevel(profile.skillLevel);
    setEditAvatar(profile.avatar);
    setEditInterests(profile.topicInterests);
    setEditLinkedin(profile.linkedin);
    setEditGithub(profile.github);
    setEditWebsite(profile.website);
    setIsEditing(false);
  };

  const handleInterestToggle = (topic) => {
    setEditInterests(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const handleCreateCustomTopic = () => {
    const cleanTopic = topicSearch.trim();
    if (cleanTopic && !availableTopics.some(t => t.toLowerCase() === cleanTopic.toLowerCase())) {
      setAvailableTopics(prev => [...prev, cleanTopic]);
      setEditInterests(prev => [...prev, cleanTopic]);
      setTopicSearch('');
    }
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this private session booking?")) {
      const updated = cancelPrivateBooking(bookingId);
      setPrivateBookings(updated);
      window.dispatchEvent(new Event('bts_notifications_change'));
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://bitstacks.io/credentials/${profile.userId}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrintCard = () => {
    window.print();
  };

  // Filter topics based on search input
  const filteredAvailableTopics = availableTopics.filter(t =>
    t.toLowerCase().includes(topicSearch.toLowerCase())
  );

  // Aggregate stats
  const totalCourses = instituteRegistrations.filter(r => !r.endsWith("-waitlist")).length;
  const totalMissions = lancerApplications.length + lancerCreatedMissions.length;
  const totalUploads = libraryUploads.length;
  const totalBookings = privateBookings.length + publicEnrollments.length;

  return (
    <div className="flex-1 flex flex-col min-h-screen pb-12">
      <Topbar searchPlaceholder="Search profile metrics, credentials..." />

      {/* Scoped CSS block for clean ID Card Printing */}
      <style>{`
        @media print {
          html, body {
            background-color: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
          }
          aside, header, footer, .no-print, button, nav, main > *:not(.print-card-modal-wrapper) {
            display: none !important;
          }
          main {
            margin: 0 !important;
            padding: 0 !important;
            margin-left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            min-height: 100% !important;
          }
          .print-card-modal-wrapper {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            background: white !important;
            z-index: 9999999 !important;
          }
          .print-card {
            width: 3.5in !important;
            height: 5.5in !important;
            border: 2px solid #d4a017 !important;
            border-radius: 20px !important;
            box-shadow: none !important;
            background-color: #0b1121 !important;
            color: white !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            padding: 24px !important;
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fadeIn">
        
        {/* Left Column: ID Card Pass & Links */}
        <div className="lg:col-span-1 space-y-6 no-print">
          
          {/* Card Preview Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-5 flex flex-col items-center">
            <h3 className="text-xs font-black text-brand-dark uppercase tracking-wider self-start">Digital ID Credentials</h3>
            
            {/* Visual Mini Pass representation */}
            <div className="bg-brand-dark text-white rounded-2xl p-5 shadow-md border border-bts-gold/20 relative overflow-hidden flex flex-col justify-between aspect-[3.5/5] w-full max-w-[280px] group transition-transform hover:scale-[1.02]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,160,23,0.1),transparent_60%)] pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-1">
                  <svg fill="none" height="16" viewBox="0 0 32 32" width="16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 2L4 8L16 14L28 8L16 2Z" stroke="#d4a017" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    <path d="M4 16L16 22L28 16" stroke="#d4a017" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    <path d="M4 24L16 30L28 24" stroke="#d4a017" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                  <span className="text-[10px] font-black tracking-widest text-white/90">BITSTACKS</span>
                </div>
                <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full ${
                  profile.verificationStatus === 'Verified Scholar' ? 'bg-yellow-500/25 text-bts-gold border border-bts-gold/30' : 'bg-white/10 text-white/40 border border-white/10'
                }`}>
                  {profile.verificationStatus === 'Verified Scholar' ? 'VERIFIED' : 'NEW'}
                </span>
              </div>

              <div className="relative z-10 py-4 flex flex-col items-center text-center space-y-2">
                <img 
                  alt={profile.name} 
                  className="w-16 h-16 rounded-full border-2 border-bts-gold object-cover"
                  src={profile.avatar}
                />
                <div>
                  <h4 className="text-sm font-black tracking-tight leading-tight">{profile.name}</h4>
                  <p className="text-[9px] text-bts-gold font-extrabold uppercase tracking-widest mt-0.5">{profile.profileType}</p>
                </div>
              </div>

              <div className="relative z-10 border-t border-white/10 pt-3 flex items-center justify-between">
                <div className="text-left space-y-0.5">
                  <span className="text-[7px] text-white/40 font-bold uppercase tracking-wider block font-sans">ID Pass</span>
                  <span className="text-[10px] font-mono font-bold text-white/80 tracking-wider">{profile.userId}</span>
                </div>
                <div className="bg-white p-1 rounded-md shrink-0 border border-white/20">
                  <svg className="w-8 h-8 text-brand-dark" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="0" y="0" width="20" height="20" />
                    <rect x="0" y="30" width="10" height="10" />
                    <rect x="0" y="80" width="20" height="20" />
                    <rect x="10" y="50" width="10" height="10" />
                    <rect x="30" y="0" width="10" height="10" />
                    <rect x="30" y="20" width="20" height="10" />
                    <circle cx="50" cy="50" r="5" fill="#d4a017" />
                  </svg>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowPrintModal(true)}
              className="w-full py-2.5 bg-brand-dark text-white hover:bg-bts-gold hover:text-brand-dark transition-all rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M8.684 10.742a3 3 0 000 2.516m7.632 0a3 3 0 000-2.516m-7.632-3.09a3 3 0 000 2.22m7.632 0a3 3 0 000-2.22M4 7a3 3 0 003 3h10a3 3 0 003-3M4 17a3 3 0 003 3h10a3 3 0 003-3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
              </svg>
              View & Print ID Card
            </button>
          </div>

          {/* Redesigned Premium Social Contacts Widget */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="space-y-1">
              <h4 className="text-xs font-black text-brand-dark uppercase tracking-wider">Contact Directory</h4>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Professional handles & networks</p>
            </div>
            
            <div className="grid grid-cols-1 gap-2.5">
              {/* LinkedIn */}
              <a 
                href={profile.linkedin} 
                target="_blank" 
                rel="noreferrer"
                className="group flex items-center gap-3.5 p-3 rounded-2xl bg-blue-50/40 hover:bg-blue-50 border border-blue-100/50 hover:border-blue-200 transition-all duration-300 shadow-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  in
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[8px] text-blue-700 font-bold uppercase tracking-wider block">LinkedIn Handle</span>
                  <span className="text-xs font-extrabold text-brand-dark truncate block mt-0.5">{profile.linkedin ? profile.linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, '') : 'Not Connected'}</span>
                </div>
                <svg className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
              </a>

              {/* GitHub */}
              <a 
                href={profile.github} 
                target="_blank" 
                rel="noreferrer" 
                className="group flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50/50 hover:bg-slate-50 border border-slate-200/40 hover:border-slate-300 transition-all duration-300 shadow-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-brand-dark text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  git
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider block">GitHub Repository</span>
                  <span className="text-xs font-extrabold text-brand-dark truncate block mt-0.5">{profile.github ? profile.github.replace(/https?:\/\/(www\.)?github\.com\//, '') : 'Not Connected'}</span>
                </div>
                <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-dark transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
              </a>

              {/* Web / Website */}
              <a 
                href={profile.website} 
                target="_blank" 
                rel="noreferrer" 
                className="group flex items-center gap-3.5 p-3 rounded-2xl bg-yellow-50/30 hover:bg-yellow-50/70 border border-yellow-100/50 hover:border-yellow-300/60 transition-all duration-300 shadow-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-[#d4a017] text-brand-dark flex items-center justify-center font-bold text-sm shrink-0 shadow-sm shadow-yellow-500/20 group-hover:scale-105 transition-transform">
                  web
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[8px] text-yellow-700 font-bold uppercase tracking-wider block">Domain / Website</span>
                  <span className="text-xs font-extrabold text-brand-dark truncate block mt-0.5">{profile.website ? profile.website.replace(/https?:\/\//, '') : 'Not Connected'}</span>
                </div>
                <svg className="w-3.5 h-3.5 text-yellow-500 group-hover:text-yellow-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
              </a>

              {/* Phone */}
              <div 
                className="group flex items-center gap-3.5 p-3 rounded-2xl bg-emerald-50/30 border border-emerald-100/50 shadow-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm shadow-emerald-500/20">
                  ph
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[8px] text-emerald-700 font-bold uppercase tracking-wider block">Mobile Number</span>
                  <span className="text-xs font-extrabold text-brand-dark truncate block mt-0.5">{profile.phone || 'Not Connected'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bio Details, Form & History Tabs */}
        <div className="lg:col-span-2 space-y-6 no-print">
          
          {/* Main Info Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-brand-dark leading-tight flex items-center gap-2">
                  Academic Profile
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    profile.verificationStatus === 'Verified Scholar' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {profile.verificationStatus}
                  </span>
                </h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                  Manage your institutional information, biography, and professional interests
                </p>
              </div>

              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 border border-gray-200 hover:border-bts-gold text-gray-600 hover:text-[#d4a017] rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-5">
                
                {/* Avatar Row */}
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Select Avatar</label>
                  <div className="flex items-center gap-3">
                    {MOCK_AVATARS.map((av, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setEditAvatar(av)}
                        className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all shrink-0 ${
                          editAvatar === av ? 'border-bts-gold ring-2 ring-yellow-200 scale-105' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img alt={`Avatar ${index}`} className="w-full h-full object-cover" src={av} />
                      </button>
                    ))}
                  </div>
                  <input
                    type="url"
                    placeholder="Or paste custom image URL..."
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Email Address</label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Phone Number</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none"
                    />
                  </div>

                  {/* Locked Role Title Field (System Defined) */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase block">Role Title (System Managed)</label>
                    <div className="w-full text-xs p-2.5 bg-gray-100 border border-gray-200 text-gray-400 rounded-xl font-extrabold cursor-not-allowed select-none flex items-center justify-between">
                      <span>{profile.role}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-gray-200 text-gray-500 uppercase tracking-widest font-black">Locked</span>
                    </div>
                  </div>

                  {/* Profile Type */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Profile Type</label>
                    <select
                      value={editType}
                      onChange={(e) => setEditType(e.target.value)}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-100 rounded-xl"
                    >
                      <option value="Student">Student</option>
                      <option value="Mentor">Mentor</option>
                      <option value="Freelancer">Freelancer</option>
                    </select>
                  </div>

                  {/* Verification Status */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Verification Status</label>
                    <select
                      value={editVerification}
                      onChange={(e) => setEditVerification(e.target.value)}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-100 rounded-xl"
                    >
                      <option value="New User">New User</option>
                      <option value="Verified Scholar">Verified Scholar</option>
                    </select>
                  </div>

                  {/* Skill Level */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Skill Level</label>
                    <select
                      value={editSkillLevel}
                      onChange={(e) => setEditSkillLevel(e.target.value)}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-100 rounded-xl"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>

                  {/* LinkedIn */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">LinkedIn URL</label>
                    <input
                      type="url"
                      value={editLinkedin}
                      onChange={(e) => setEditLinkedin(e.target.value)}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-100 rounded-xl"
                    />
                  </div>

                  {/* GitHub */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">GitHub Profile URL</label>
                    <input
                      type="url"
                      value={editGithub}
                      onChange={(e) => setEditGithub(e.target.value)}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-100 rounded-xl"
                    />
                  </div>

                  {/* Website */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Website / ENS Limo</label>
                    <input
                      type="url"
                      value={editWebsite}
                      onChange={(e) => setEditWebsite(e.target.value)}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-100 rounded-xl"
                    />
                  </div>
                </div>

                {/* Biography */}
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Biography</label>
                  <textarea
                    rows="3"
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none"
                  />
                </div>

                {/* Autocomplete Topic Interests search and creation tool */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Topic Interests (For Smart Matching)</label>
                    <span className="text-[10px] bg-yellow-50 text-yellow-800 px-2 py-0.5 rounded font-extrabold">Match Enabled</span>
                  </div>

                  {/* Topic Search Input */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/>
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Search topics or type custom topic name..."
                      value={topicSearch}
                      onChange={(e) => setTopicSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    />
                  </div>

                  {/* Toggle pills and Custom topic creator button */}
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {filteredAvailableTopics.map(topic => {
                      const isSelected = editInterests.includes(topic);
                      return (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => handleInterestToggle(topic)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1 ${
                            isSelected 
                              ? 'bg-brand-dark text-white border-brand-dark shadow-sm' 
                              : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-400 hover:bg-gray-100'
                          }`}
                        >
                          {topic}
                          {isSelected && <span className="text-[9px] opacity-60 ml-0.5">✕</span>}
                        </button>
                      );
                    })}

                    {topicSearch.trim() && !availableTopics.some(t => t.toLowerCase() === topicSearch.trim().toLowerCase()) && (
                      <button
                        type="button"
                        onClick={handleCreateCustomTopic}
                        className="px-3.5 py-1.5 bg-yellow-50 text-[#d4a017] border border-dashed border-yellow-300 hover:bg-yellow-100/50 hover:border-yellow-400 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span className="font-extrabold">+ Add</span> "{topicSearch.trim()}"
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-brand-dark text-white rounded-xl text-xs font-extrabold hover:bg-bts-gold hover:text-brand-dark transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-1">
                  <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">Bio</span>
                  <p className="text-xs text-gray-600 font-semibold leading-relaxed">
                    {profile.bio || 'No biography details provided.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">Skill Level</span>
                    <p className="text-xs font-bold text-brand-dark">{profile.skillLevel}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">Profile Category</span>
                    <p className="text-xs font-bold text-bts-gold">{profile.profileType}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">Interests & Topics (Smart Matching Active)</span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.topicInterests.map(interest => (
                      <span key={interest} className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-gray-50 text-gray-500 border border-gray-100">
                        {interest}
                      </span>
                    ))}
                    {profile.topicInterests.length === 0 && <span className="text-xs text-gray-400 font-medium">None selected.</span>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Active Bookings', value: totalBookings, icon: '🎓', colorClass: 'text-blue-600 bg-blue-50 border-blue-100' },
              { label: 'Library Uploads', value: totalUploads, icon: '📚', colorClass: 'text-purple-600 bg-purple-50 border-purple-100' },
              { label: 'Missions Posted/Applied', value: totalMissions, icon: '💼', colorClass: 'text-amber-600 bg-amber-50 border-amber-100' },
              { label: 'Course Enrollments', value: totalCourses, icon: '🏛️', colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
            ].map(achievement => (
              <div key={achievement.label} className={`border rounded-2xl p-4 shadow-sm text-center flex flex-col items-center justify-center space-y-1.5 ${achievement.colorClass}`}>
                <span className="text-xl shrink-0">{achievement.icon}</span>
                <p className="text-xl font-extrabold text-brand-dark leading-none">{achievement.value}</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{achievement.label}</p>
              </div>
            ))}
          </div>

          {/* Tab lists */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex border-b border-gray-100 overflow-x-auto gap-4 scrollbar-none">
              {[
                { key: 'sessions', label: 'Bookings & Workshops', count: totalBookings },
                { key: 'library', label: 'Library Contributions', count: libraryUploads.length + libraryPurchased.length },
                { key: 'missions', label: 'D-Lancer Missions', count: lancerApplications.length + lancerCreatedMissions.length },
                { key: 'courses', label: 'D-Institute Paths', count: totalCourses },
                { key: 'history', label: 'Activity Timeline', count: null }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    activeTab === tab.key ? 'border-bts-gold text-brand-dark' : 'border-transparent text-gray-400 hover:text-brand-dark'
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.key ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-500'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Sessions tab */}
            {activeTab === 'sessions' && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-sm font-extrabold text-brand-dark uppercase tracking-wider">Booked Private Sessions</h3>
                {privateBookings.length === 0 ? (
                  <p className="text-xs text-gray-400 font-medium py-4">No private mentorship sessions booked.</p>
                ) : (
                  <div className="space-y-3">
                    {privateBookings.map(booking => (
                      <div key={booking.id} className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-100 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <img alt={booking.mentorName} className="w-10 h-10 rounded-xl object-cover shrink-0" src={booking.mentorAvatar} />
                          <div>
                            <p className="text-xs font-extrabold text-brand-dark">{booking.topic}</p>
                            <p className="text-[10px] text-gray-400 font-medium">
                              Mentor: <span className="text-[#d4a017] font-bold">{booking.mentorName}</span> · Duration: {booking.duration}h
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xs font-extrabold text-brand-dark">{booking.slot}</p>
                            <p className="text-[10px] text-gray-400 font-semibold">June {booking.date}</p>
                          </div>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="p-1.5 bg-rose-50 border border-rose-100 hover:bg-rose-100 hover:border-rose-200 text-rose-600 rounded-xl transition-all cursor-pointer"
                            title="Cancel Booking"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <h3 className="text-sm font-extrabold text-brand-dark uppercase tracking-wider pt-2">Registered Public Workshops</h3>
                {publicEnrollments.length === 0 ? (
                  <p className="text-xs text-gray-400 font-medium py-4">Not enrolled in any public workshops.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {publicEnrollments.map(id => {
                      const session = seedSessions.find(s => s.id === id);
                      if (!session) return null;
                      return (
                        <div key={id} className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-sm">
                          <div>
                            <span className="text-[9px] bg-yellow-50 text-yellow-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              {session.level}
                            </span>
                            <h4 className="text-xs font-black text-brand-dark mt-1 leading-tight">{session.title}</h4>
                            <p className="text-[10px] text-gray-400 mt-1">Instructor: {session.instructor.name}</p>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 pt-2 border-t border-gray-50">
                            <span>{session.date} · {session.time}</span>
                            <span className="text-bts-gold">{session.duration}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Library tab */}
            {activeTab === 'library' && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-sm font-extrabold text-brand-dark uppercase tracking-wider">My Submissions</h3>
                {libraryUploads.length === 0 ? (
                  <p className="text-xs text-gray-400 font-medium py-4">No academic resources submitted to the D-Library.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {libraryUploads.map(res => (
                      <div key={res.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-start gap-3">
                        <img src={res.thumbnail} alt={res.title} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                        <div className="min-w-0">
                          <h4 className="text-xs font-black text-brand-dark truncate">{res.title}</h4>
                          <p className="text-[10px] text-gray-400 truncate">{res.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[9px] font-extrabold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">Live</span>
                            <span className="text-[10px] text-gray-500 font-bold">{res.price > 0 ? `${res.price} BTS` : 'Open Access'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <h3 className="text-sm font-extrabold text-brand-dark uppercase tracking-wider pt-2">Purchased Library Resources</h3>
                {libraryPurchased.length === 0 ? (
                  <p className="text-xs text-gray-400 font-medium py-4">No premium resources purchased yet.</p>
                ) : (
                  <div className="space-y-2">
                    {libraryPurchased.map(id => (
                      <div key={id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl">
                        <span className="text-xs font-bold text-brand-dark">Resource reference ID: #{id}</span>
                        <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">Owned</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Missions tab */}
            {activeTab === 'missions' && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-sm font-extrabold text-brand-dark uppercase tracking-wider">Applied Freelance Missions</h3>
                {lancerApplications.length === 0 ? (
                  <p className="text-xs text-gray-400 font-medium py-4">No applications submitted to D-Lancer missions.</p>
                ) : (
                  <div className="space-y-3.5">
                    {lancerApplications.map(id => (
                      <div key={id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-black text-brand-dark uppercase tracking-wide">Mission Application: {id.replace(/-/g, ' ')}</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">Application status: pending audit verification review</p>
                        </div>
                        <span className="text-[10px] font-extrabold bg-yellow-50 text-yellow-800 px-2.5 py-0.5 rounded-full border border-yellow-200">
                          Pending Review
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <h3 className="text-sm font-extrabold text-brand-dark uppercase tracking-wider pt-2">Missions Posted by Me</h3>
                {lancerCreatedMissions.length === 0 ? (
                  <p className="text-xs text-gray-400 font-medium py-4">No job/mission opportunities posted.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lancerCreatedMissions.map(m => (
                      <div key={m.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-black text-brand-dark leading-tight">{m.title}</h4>
                          <p className="text-[10px] text-gray-400 line-clamp-2 mt-1">{m.description}</p>
                        </div>
                        <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-50 text-[10px] font-bold text-gray-500">
                          <span>Budget: ◈{m.reward} BTS</span>
                          <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Open</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Courses tab */}
            {activeTab === 'courses' && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-sm font-extrabold text-brand-dark uppercase tracking-wider">Enrolled Institute Tracks</h3>
                {instituteRegistrations.length === 0 ? (
                  <p className="text-xs text-gray-400 font-medium py-4">No active enrollments in Bitstacks, Rocwell, or PFE Guidance Institutes.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {instituteRegistrations.map(regId => {
                      const isWaitlisted = regId.endsWith("-waitlist");
                      const actualId = isWaitlisted ? regId.replace("-waitlist", "") : regId;
                      const inst = seedInstitutes.find(i => i.id === actualId);
                      if (!inst) return null;
                      return (
                        <div key={regId} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col justify-between">
                          <div>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                              isWaitlisted ? 'bg-yellow-50 text-yellow-800 border-yellow-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            }`}>
                              {isWaitlisted ? 'Waitlisted' : 'Enrolled'}
                            </span>
                            <h4 className="text-xs font-black text-brand-dark mt-2 leading-tight">{inst.title}</h4>
                            <p className="text-[10px] text-gray-400 line-clamp-2 mt-1">{inst.description}</p>
                          </div>
                          <div className="text-[10px] font-extrabold text-bts-gold mt-3 pt-2 border-t border-gray-200/50">
                            {inst.oneSentence}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* History tab */}
            {activeTab === 'history' && (
              <div className="space-y-5 animate-fadeIn">
                <h3 className="text-sm font-extrabold text-brand-dark uppercase tracking-wider">Activity Timeline</h3>
                <div className="relative border-l border-gray-100 pl-4 ml-2 space-y-6">
                  <div className="relative">
                    <span className="absolute -left-[22px] top-0.5 w-3.5 h-3.5 rounded-full bg-yellow-400 border-2 border-white ring-4 ring-yellow-50" />
                    <div>
                      <p className="text-xs font-extrabold text-brand-dark">Registered for academic dashboard credentials</p>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">June 12, 2026</p>
                    </div>
                  </div>

                  {privateBookings.map((booking, index) => (
                    <div key={`timeline-booking-${index}`} className="relative">
                      <span className="absolute -left-[22px] top-0.5 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white ring-4 ring-blue-50" />
                      <div>
                        <p className="text-xs font-extrabold text-brand-dark">
                          Booked private session with mentor <span className="text-blue-600 font-bold">{booking.mentorName}</span>
                        </p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">Topic: {booking.topic}</p>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Recently</p>
                      </div>
                    </div>
                  ))}

                  {libraryUploads.map((res, index) => (
                    <div key={`timeline-upload-${index}`} className="relative">
                      <span className="absolute -left-[22px] top-0.5 w-3.5 h-3.5 rounded-full bg-purple-500 border-2 border-white ring-4 ring-purple-50" />
                      <div>
                        <p className="text-xs font-extrabold text-brand-dark">
                          Contributed resource to digital library: <span className="text-purple-600 font-bold">{res.title}</span>
                        </p>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Recently</p>
                      </div>
                    </div>
                  ))}

                  {lancerApplications.map((appId, index) => (
                    <div key={`timeline-app-${index}`} className="relative">
                      <span className="absolute -left-[22px] top-0.5 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white ring-4 ring-amber-50" />
                      <div>
                        <p className="text-xs font-extrabold text-brand-dark">
                          Submitted application for D-Lancer mission: <span className="text-amber-600 font-bold">{appId.replace(/-/g, ' ')}</span>
                        </p>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Recently</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share / Print Credential Pass Fullscreen Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-brand-dark/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn print-card-modal-wrapper no-print">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xl max-w-sm w-full space-y-6 relative flex flex-col items-center">
            
            {/* Modal Close */}
            <button 
              onClick={() => setShowPrintModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 bg-gray-50 border border-gray-100 rounded-full transition-all cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/>
              </svg>
            </button>

            <div className="text-center space-y-1">
              <h3 className="text-base font-extrabold text-brand-dark">Share Scholar Pass</h3>
              <p className="text-xs text-gray-400 font-medium">Verify your profile credentials peer-to-peer</p>
            </div>

            {/* Print Pass Card */}
            <div className="print-card bg-brand-dark text-white rounded-2xl p-6 shadow-xl border border-bts-gold/30 relative overflow-hidden flex flex-col justify-between aspect-[3.5/5.5] w-full max-w-[280px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,160,23,0.15),transparent_60%)] pointer-events-none" />
              
              <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3.5">
                <div className="flex items-center gap-1.5">
                  <svg fill="none" height="16" viewBox="0 0 32 32" width="16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 2L4 8L16 14L28 8L16 2Z" stroke="#d4a017" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    <path d="M4 16L16 22L28 16" stroke="#d4a017" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    <path d="M4 24L16 30L28 24" stroke="#d4a017" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                  <span className="text-[10px] font-black tracking-widest text-white/90">BITSTACKS</span>
                </div>
                <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full ${
                  profile.verificationStatus === 'Verified Scholar' ? 'bg-yellow-500/25 text-bts-gold border border-bts-gold/30' : 'bg-white/10 text-white/50 border border-white/10'
                }`}>
                  {profile.verificationStatus === 'Verified Scholar' ? 'VERIFIED' : 'PENDING'}
                </span>
              </div>

              <div className="relative z-10 py-5 flex flex-col items-center text-center space-y-2.5">
                <img 
                  alt={profile.name} 
                  className="w-20 h-20 rounded-full border-2 border-bts-gold object-cover"
                  src={profile.avatar}
                />
                <div>
                  <h4 className="text-sm font-black tracking-tight leading-tight">{profile.name}</h4>
                  <p className="text-[8px] text-bts-gold font-extrabold uppercase tracking-widest mt-0.5">{profile.profileType}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">{profile.email}</p>
                </div>
              </div>

              <div className="relative z-10 border-t border-white/10 pt-3 flex items-center justify-between">
                <div className="text-left space-y-0.5">
                  <span className="text-[7px] text-white/40 font-bold uppercase tracking-wider block font-sans">Scholar Pass ID</span>
                  <span className="text-[10px] font-mono font-bold text-white/80 tracking-widest">{profile.userId}</span>
                  <span className="text-[7px] font-extrabold bg-white/5 text-white/40 px-2 py-0.5 rounded border border-white/5 block w-fit mt-1">
                    {profile.role}
                  </span>
                </div>

                <div className="bg-white p-1 rounded-md shrink-0 border border-white/20">
                  <svg className="w-10 h-10 text-brand-dark" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="0" y="0" width="20" height="20" />
                    <rect x="0" y="30" width="10" height="10" />
                    <rect x="0" y="80" width="20" height="20" />
                    <rect x="10" y="50" width="10" height="10" />
                    <rect x="30" y="0" width="10" height="10" />
                    <rect x="30" y="20" width="20" height="10" />
                    <rect x="30" y="40" width="10" height="20" />
                    <rect x="50" y="0" width="10" height="20" />
                    <rect x="80" y="0" width="20" height="20" />
                    <rect x="80" y="80" width="20" height="20" />
                    <circle cx="50" cy="50" r="5" fill="#d4a017" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="w-full grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleCopyLink}
                className="py-2.5 border border-gray-200 hover:border-bts-gold text-gray-600 hover:text-[#d4a017] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                </svg>
                {copiedLink ? 'Copied ✓' : 'Copy Link'}
              </button>
              <button
                onClick={handlePrintCard}
                className="py-2.5 bg-brand-dark text-white hover:bg-bts-gold hover:text-brand-dark transition-all rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                </svg>
                Print Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
