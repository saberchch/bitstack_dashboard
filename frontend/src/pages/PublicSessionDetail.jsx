import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSessionById, getPublicSessions, SESSION_TYPES } from '../utils/sessionsStorage';
import { getPublicEnrollments, enrollInPublicSession } from '../utils/enrollmentStorage';
import Topbar from '../components/Topbar';
import ReviewSection from '../components/ReviewSection';
import { REVIEW_ENTITY_TYPES } from '../utils/reviewsStorage';
import { getBalance, deductBalance, checkAffordability } from '../utils/balanceStorage';

export default function PublicSessionDetail() {
  const { id } = useParams();
  const session = getSessionById(id);

  const [enrollments, setEnrollments] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollError, setEnrollError] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  // Live balance — updates whenever profile changes
  const [userBalance, setUserBalance] = useState(getBalance);

  // Keep balance in sync with profile change events
  useEffect(() => {
    const onProfileChange = () => setUserBalance(getBalance());
    window.addEventListener('bts_profile_change', onProfileChange);
    return () => window.removeEventListener('bts_profile_change', onProfileChange);
  }, []);

  useEffect(() => {
    const list = getPublicEnrollments();
    setEnrollments(list);
    if (session) {
      setIsEnrolled(list.includes(session.id));
    }
    setEnrollError('');
  }, [id, session]);

  if (!session) {
    return (
      <>
        <Topbar searchPlaceholder="Search sessions, topics, or instructors..." />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">school</span>
          <h2 className="text-2xl font-bold text-brand-dark mb-2">Workshop Not Found</h2>
          <p className="text-gray-500 mb-6 max-w-md">The public session details you are looking for could not be found.</p>
          <Link to="/public-sessions" className="bg-bts-gold text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all shadow-sm">
            Back to Public Sessions
          </Link>
        </div>
      </>
    );
  }

  const sessionPrice = session?.price || 0;
  const isFreeSession = sessionPrice === 0;

  const handleEnroll = () => {
    setEnrollError('');

    // Paid sessions: verify and deduct balance first
    if (!isFreeSession) {
      const check = checkAffordability(sessionPrice);
      if (!check.affordable) {
        setEnrollError(
          `Insufficient BTS balance. You have ${check.balance.toLocaleString()} BTS but this session costs ${sessionPrice.toLocaleString()} BTS.`
        );
        return;
      }
      const deduction = deductBalance(sessionPrice, `Enrolled: ${session.title}`);
      if (!deduction.ok) {
        setEnrollError(deduction.error);
        return;
      }
      // Reflect immediately so the callout card updates
      setUserBalance(deduction.newBalance);
    }

    setEnrolling(true);
    const updatedList = enrollInPublicSession(session.id);
    setEnrollments(updatedList);
    setIsEnrolled(true);
    setEnrolling(false);
  };

  const otherWorkshops = getPublicSessions()
    .filter((s) => s.id !== session.id)
    .slice(0, 2);

  const isPremiumPrivate = session.sessionType === SESSION_TYPES.PREMIUM_PRIVATE;
  const isPremiumPublic = session.sessionType === SESSION_TYPES.PREMIUM_PUBLIC;

  // Math for attendees capacity
  const capacityPercent = Math.round((session.attendees / session.maxCapacity) * 100);

  return (
    <>
      <Topbar searchPlaceholder="Search sessions, topics, or instructors..." />

      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in" data-purpose="public-session-detail">
        {/* Breadcrumbs */}
        <div>
          <Link 
            to="/public-sessions" 
            className="inline-flex items-center gap-2 text-xs font-extrabold text-gray-400 hover:text-bts-gold transition-colors uppercase tracking-widest"
          >
            <span className="material-symbols-outlined !text-sm">arrow_back</span>
            Back to Public Sessions
          </Link>
        </div>

        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Hero Header Card */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 relative shadow-sm">
            <div className="w-full md:w-56 h-48 md:h-auto rounded-xl overflow-hidden bg-gray-100 shrink-0 shadow-inner">
              <img 
                alt={session.title} 
                className="w-full h-full object-cover" 
                src={session.image}
              />
            </div>
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                  <span className="bg-yellow-50 text-bts-gold border border-yellow-100 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    {session.level}
                  </span>
                  {isPremiumPublic && (
                    <span className="bg-yellow-50 text-bts-gold border border-yellow-100 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider">
                      Premium Public
                    </span>
                  )}
                  {isPremiumPrivate && (
                    <span className="bg-purple-50 text-purple-600 border border-purple-100 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider">
                      PFE Premium Private
                    </span>
                  )}
                  {session.instituteName && (
                    <span className="bg-gray-50 border border-gray-100 px-2.5 py-0.5 rounded-lg text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                      {session.instituteName}
                    </span>
                  )}
                  <span className="bg-gray-50 border border-gray-100 px-2.5 py-0.5 rounded-lg text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    {session.duration}
                  </span>
                  {isEnrolled && (
                    <span className="bg-green-50 text-green-600 border border-green-100 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-0.5">
                      <span className="material-symbols-outlined !text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      Enrolled
                    </span>
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-brand-dark leading-tight mb-4">
                  {session.title}
                </h2>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500 font-semibold mb-6">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-bts-gold !text-lg">calendar_today</span>
                    {session.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-bts-gold !text-lg">schedule</span>
                    {session.time}
                  </span>
                </div>
              </div>

              {/* Progress joined */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  <span>Attendees joined</span>
                  <span>{session.attendees} / {session.maxCapacity} Seats</span>
                </div>
                <div className="w-full h-2 bg-gray-50 border border-gray-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-bts-gold transition-all duration-500" 
                    style={{ width: `${capacityPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Callout Card */}
          <div className="bg-brand-dark text-white rounded-2xl p-8 shadow-md flex flex-col justify-between relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -right-16 -top-16 w-36 h-36 bg-bts-gold/15 rounded-full blur-2xl pointer-events-none"></div>

            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Access Fee</span>
                {isFreeSession ? (
                  <span className="text-xl font-extrabold text-bts-gold">Ecosystem Pass</span>
                ) : (
                  <span className="text-xl font-extrabold text-bts-gold">{sessionPrice.toLocaleString()} BTS</span>
                )}
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Balance</span>
                <span className={`text-sm font-bold ${
                  (!isFreeSession && userBalance < sessionPrice) ? 'text-red-400' : 'text-gray-300'
                }`}>
                  {userBalance.toLocaleString()} BTS
                </span>
              </div>
              {isFreeSession ? (
                <p className="text-[10px] text-gray-400 leading-normal">
                  This public workshop is covered by your Bitstacks Ecosystem credentials. Confirming reservation guarantees access and slides.
                </p>
              ) : (
                <div className="space-y-2">
                  {userBalance >= sessionPrice ? (
                    <p className="text-[10px] text-gray-400 leading-normal">
                      {sessionPrice.toLocaleString()} BTS will be deducted from your wallet upon reservation.
                    </p>
                  ) : (
                    <div className="flex items-start gap-1.5 bg-red-900/30 border border-red-500/30 rounded-lg p-2.5">
                      <span className="material-symbols-outlined !text-sm text-red-400 shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
                      <p className="text-[10px] text-red-300 leading-normal">
                        You need <strong className="text-red-200">{(sessionPrice - userBalance).toLocaleString()} more BTS</strong> to reserve this spot. Top up via BTS Credit.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Enrollment error */}
              {enrollError && (
                <div className="flex items-start gap-1.5 bg-red-900/30 border border-red-500/30 rounded-lg p-2.5">
                  <span className="material-symbols-outlined !text-sm text-red-400 shrink-0 mt-0.5">error</span>
                  <p className="text-[10px] text-red-300 leading-normal">{enrollError}</p>
                </div>
              )}
            </div>

            <button 
              onClick={handleEnroll}
              disabled={isEnrolled || enrolling || (!isFreeSession && userBalance < sessionPrice)}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs shadow-md transition-all mt-6 flex items-center justify-center gap-1.5 relative z-10 ${
                isEnrolled 
                  ? 'bg-white/10 text-gray-400 border border-white/5 cursor-default' 
                  : (!isFreeSession && userBalance < sessionPrice)
                  ? 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed'
                  : enrolling
                  ? 'bg-bts-gold/70 text-white cursor-wait'
                  : 'bg-gradient-to-br from-[#FFB77D] to-[#FE932C] text-white hover:brightness-105 active:scale-[0.98] cursor-pointer'
              }`}
            >
              {isEnrolled ? (
                <>
                  <span className="material-symbols-outlined !text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  Reservation Confirmed
                </>
              ) : (!isFreeSession && userBalance < sessionPrice) ? (
                <>
                  <span className="material-symbols-outlined !text-sm">account_balance_wallet</span>
                  Insufficient Balance
                </>
              ) : enrolling ? 'Confirming...' : isFreeSession ? 'Reserve My Spot' : `Reserve — ${sessionPrice.toLocaleString()} BTS`}
            </button>
          </div>
        </section>

        {/* Content Breakdown */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Syllabus & Overview */}
          <div className="lg:col-span-3 space-y-8">
            {/* Overview Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-extrabold text-brand-dark mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-bts-gold">description</span>
                Workshop Overview
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-normal">
                {session.overview}
              </p>
            </div>

            {/* Syllabus timeline */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-extrabold text-brand-dark mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-bts-gold">timeline</span>
                Syllabus &amp; Curriculum
              </h3>
              <div className="relative border-l-2 border-gray-100 ml-3 pl-8 space-y-8">
                {session.curriculum.map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[39px] top-1 w-4 h-4 rounded-full bg-white border-4 border-bts-gold shadow-sm"></div>
                    <h4 className="font-bold text-sm text-brand-dark leading-snug">{step.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-normal mt-1">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-extrabold text-brand-dark mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-bts-gold">handshake</span>
                Prerequisites &amp; Preparation
              </h3>
              <ul className="space-y-3">
                {session.prerequisites.map((pre, idx) => (
                  <li key={idx} className="flex gap-3 items-start text-xs text-gray-500 font-medium">
                    <span className="material-symbols-outlined text-bts-gold !text-sm mt-0.5">check_circle</span>
                    <span>{pre}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instructor & Other Sessions Sidebar */}
          <div className="lg:col-span-2 space-y-8">
            {/* Instructor Spotlight */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Instructor</h4>
              <Link 
                to={`/mentor/${session.instructor.mentorId}`}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-all group cursor-pointer block"
              >
                <img 
                  alt={session.instructor.name} 
                  className="w-14 h-14 rounded-full object-cover border border-gray-100" 
                  src={session.instructor.avatar}
                />
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-extrabold text-sm text-brand-dark group-hover:text-bts-gold transition-colors leading-tight mb-1">
                    {session.instructor.name}
                  </h4>
                  <p className="text-xs text-gray-500 leading-normal">{session.instructor.role}</p>
                  <span className="text-[10px] font-bold text-bts-gold uppercase mt-2 block hover:underline flex items-center gap-0.5">
                    View Mentor Profile 
                    <span className="material-symbols-outlined !text-sm">chevron_right</span>
                  </span>
                </div>
              </Link>
            </div>

            {/* Highlights benefits */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-brand-dark mb-4 uppercase tracking-wider text-gray-400">What you will receive</h3>
              <ul className="space-y-3">
                {session.benefits.map((ben, idx) => (
                  <li key={idx} className="flex gap-2 items-start text-xs text-gray-500">
                    <span className="material-symbols-outlined text-bts-gold !text-[16px] mt-0.5">star</span>
                    <span>{ben}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Other Workshops sidebar */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Other Upcoming Workshops</h4>
              <div className="space-y-4">
                {otherWorkshops.map((other) => (
                  <Link 
                    key={other.id}
                    to={`/public-session/${other.id}`}
                    className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex gap-4 group cursor-pointer block"
                  >
                    <img 
                      alt={other.title} 
                      className="w-14 h-14 rounded-lg object-cover bg-gray-50 shrink-0" 
                      src={other.image}
                    />
                    <div className="flex-1 overflow-hidden">
                      <span className="text-[9px] font-bold text-bts-gold uppercase">{other.level} • {other.duration}</span>
                      <h4 className="font-bold text-xs text-brand-dark group-hover:text-bts-gold transition-colors leading-snug line-clamp-2 mt-0.5">
                        {other.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Workshop Reviews — enrolled students only */}
        <ReviewSection
          entityType={REVIEW_ENTITY_TYPES.SESSION}
          entityId={session.id}
          entityLabel={session.title}
          title="Workshop Reviews"
          eligibilityContext={{ enrollments }}
          emptyText="No student reviews yet for this workshop."
        />
      </div>
    </>
  );
}
