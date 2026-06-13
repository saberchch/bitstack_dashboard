import { useState, useMemo, useEffect } from 'react';
import Topbar from '../components/Topbar';

// ─── Session Type Config ────────────────────────────────────────────────────────
const SESSION_TYPES = {
  workshop:   { label: 'Public Workshop',  dot: 'bg-blue-500',    pill: 'bg-blue-50 text-blue-700 border-l-2 border-blue-500',      badge: 'bg-blue-100 text-blue-700',    accent: '#3b82f6' },
  private:    { label: 'Private Session',  dot: 'bg-purple-500',  pill: 'bg-purple-50 text-purple-700 border-l-2 border-purple-500', badge: 'bg-purple-100 text-purple-700', accent: '#a855f7' },
  deadline:   { label: 'Mission Deadline', dot: 'bg-red-500',     pill: 'bg-red-50 text-red-700 border-l-2 border-red-500',         badge: 'bg-red-100 text-red-700',      accent: '#ef4444' },
  exam:       { label: 'Institute Exam',   dot: 'bg-amber-500',   pill: 'bg-amber-50 text-amber-700 border-l-2 border-amber-500',   badge: 'bg-amber-100 text-amber-700',  accent: '#f59e0b' },
  mentorship: { label: 'Mentorship Call',  dot: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700 border-l-2 border-emerald-500', badge: 'bg-emerald-100 text-emerald-700', accent: '#10b981' },
};

// ─── Seed Sessions ──────────────────────────────────────────────────────────────
const INITIAL_SESSIONS = [
  {
    id: 's1', title: 'Quantum Ethics 101', type: 'workshop',
    date: '2026-06-01', time: '14:00', duration: '2h',
    host: 'Dr. Aris Havel', hostRole: 'Lead Researcher · Global Workshop',
    location: 'Online · Zoom', seats: '24/30',
    desc: 'An in-depth exploration of ethical frameworks applied to quantum computing and AI governance in decentralized networks.',
    tags: ['AI Ethics', 'Quantum', 'Workshop'],
    avatar: 'https://ui-avatars.com/api/?name=Aris+Havel&background=312e81&color=a5b4fc&size=40',
  },
  {
    id: 's2', title: 'Mentorship Call — Web3 Roadmap', type: 'mentorship',
    date: '2026-06-03', time: '10:30', duration: '1h',
    host: 'Sarah Jenkins', hostRole: 'Senior Mentor · Bitstacks',
    location: 'Video Call', seats: '1/1',
    desc: 'Private roadmap review covering your Web3 learning path, project priorities, and upcoming certification targets.',
    tags: ['Web3', 'Mentorship', 'Private'],
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=db2777&color=ffffff&size=40',
  },
  {
    id: 's3', title: 'Bitstacks Live Demo Day', type: 'workshop',
    date: '2026-06-08', time: '14:00', duration: '3h',
    host: 'Bitstacks Core Team', hostRole: 'Platform Demo · All Members',
    location: 'Online · StreamYard', seats: '142/200',
    desc: 'Live demonstration of the Q3 platform updates including the D-Library, new BTS staking mechanism, and DAO governance module.',
    tags: ['Demo', 'Platform', 'BTS'],
    avatar: 'https://ui-avatars.com/api/?name=Bitstacks&background=d4a017&color=0b1121&size=40',
  },
  {
    id: 's4', title: 'Final Submission: Deep Web Protocol', type: 'deadline',
    date: '2026-06-08', time: '17:30', duration: 'Hard Deadline',
    host: 'D-Lancer System', hostRole: 'Mission Level 4',
    location: 'Portal Submission', seats: '—',
    desc: 'Final submission window for the Deep Web Protocol mission. All deliverables must be uploaded and peer-reviewed before this timestamp.',
    tags: ['Deadline', 'Mission', 'Level 4'],
    avatar: 'https://ui-avatars.com/api/?name=DL&background=ef4444&color=ffffff&size=40',
  },
  {
    id: 's5', title: 'Algorithmic Law & Smart Contracts Exam', type: 'exam',
    date: '2026-06-10', time: '09:00', duration: '3h',
    host: 'Bitstacks Institute', hostRole: 'Official Certification Exam',
    location: 'Proctored Online', seats: '18/25',
    desc: 'Certification exam covering Solidity patterns, legal compliance for smart contracts, and blockchain dispute resolution protocols.',
    tags: ['Exam', 'Solidity', 'Legal', 'Certification'],
    avatar: 'https://ui-avatars.com/api/?name=BI&background=0b1121&color=d4a017&size=40',
  },
  {
    id: 's6', title: 'Private Code Review — ZK Rollups', type: 'private',
    date: '2026-06-15', time: '16:00', duration: '1.5h',
    host: 'Dr. Robert Lang', hostRole: 'Oxford Crypto Lab',
    location: 'Private Video Call', seats: '2/3',
    desc: 'Intensive private review of your ZK-Rollup implementation with circuit optimization suggestions and prover performance benchmarking.',
    tags: ['ZK-Rollups', 'Private', 'Code Review'],
    avatar: 'https://ui-avatars.com/api/?name=Robert+Lang&background=1d4ed8&color=ffffff&size=40',
  },
  {
    id: 's7', title: 'Code Freeze: NFT Platform v2', type: 'deadline',
    date: '2026-06-18', time: '23:59', duration: 'Hard Deadline',
    host: 'Project: NFT Platform', hostRole: 'Sprint 3 Milestone',
    location: 'GitHub Repository', seats: '—',
    desc: 'All feature branches must be merged and the codebase frozen for QA testing. No commits after this timestamp will be accepted.',
    tags: ['Deadline', 'Code Freeze', 'NFT'],
    avatar: 'https://ui-avatars.com/api/?name=CF&background=ef4444&color=ffffff&size=40',
  },
  {
    id: 's8', title: 'DeFi Architecture Masterclass', type: 'workshop',
    date: '2026-06-12', time: '15:00', duration: '4h',
    host: 'Alice Merton', hostRole: 'Lead Architect · Nexus Protocol',
    location: 'Online · Zoom', seats: '58/80',
    desc: 'Deep dive into AMM architecture, lending pool design, and cross-chain bridge security patterns in production DeFi systems.',
    tags: ['DeFi', 'Architecture', 'AMM'],
    avatar: 'https://ui-avatars.com/api/?name=Alice+Merton&background=db2777&color=ffffff&size=40',
  },
  {
    id: 's9', title: 'Web3 UI/UX Design Workshop', type: 'workshop',
    date: '2026-06-20', time: '11:00', duration: '3h',
    host: 'Marcus Kane', hostRole: 'Lead Designer · Bitstacks',
    location: 'Online · Figma Live', seats: '35/50',
    desc: 'Hands-on design session covering wallet UX patterns, transaction state design, and dark-mode component systems for dApps.',
    tags: ['UI/UX', 'Figma', 'Design'],
    avatar: 'https://ui-avatars.com/api/?name=Marcus+Kane&background=7c3aed&color=ffffff&size=40',
  },
  {
    id: 's10', title: 'BTS Tokenomics Governance Session', type: 'private',
    date: '2026-06-22', time: '17:00', duration: '2h',
    host: 'DAO Council', hostRole: 'Governance · Token Holders',
    location: 'Snapshot + Video', seats: '12/20',
    desc: 'Quarterly governance session to vote on BTS emission schedule, staking parameter adjustments, and treasury allocation proposals.',
    tags: ['DAO', 'Governance', 'Tokenomics'],
    avatar: 'https://ui-avatars.com/api/?name=DAO&background=0b1121&color=d4a017&size=40',
  },
  {
    id: 's11', title: 'AI Ethics Final Assessment', type: 'exam',
    date: '2026-06-25', time: '10:00', duration: '2h',
    host: 'Bitstacks Institute', hostRole: 'AI Ethics Program',
    location: 'Proctored Online', seats: '22/30',
    desc: 'Final written assessment for the AI Ethics program, covering case studies in decentralized AI governance and algorithmic fairness.',
    tags: ['AI Ethics', 'Exam', 'Certification'],
    avatar: 'https://ui-avatars.com/api/?name=BI&background=0b1121&color=d4a017&size=40',
  },
  {
    id: 's12', title: 'Solidity Hackathon Kickoff', type: 'workshop',
    date: '2026-06-28', time: '09:00', duration: '48h',
    host: 'Bitstacks Core Team', hostRole: '72h Hackathon · Open Registration',
    location: 'Online + Discord', seats: '89/150',
    desc: '48-hour Solidity hackathon with prizes of 5,000 BTS for 1st place. Build a DeFi protocol, NFT marketplace, or DAO tooling project.',
    tags: ['Hackathon', 'Solidity', 'BTS Prize'],
    avatar: 'https://ui-avatars.com/api/?name=BTS&background=d4a017&color=0b1121&size=40',
  },
];

const INITIAL_INVITES = [
  {
    id: 'inv1', from: 'Sarah Jenkins', fromRole: 'Code Review · Jun 15',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=db2777&color=ffffff&size=40',
    sessionTitle: 'Private Code Review — ZK Rollups',
  },
  {
    id: 'inv2', from: 'Dr. Marcus Veil', fromRole: 'Mentorship · Jun 17',
    avatar: 'https://ui-avatars.com/api/?name=Marcus+Veil&background=1d4ed8&color=ffffff&size=40',
    sessionTitle: 'Web3 Career Mentorship',
  },
  {
    id: 'inv3', from: 'DataLabs DAO', fromRole: 'Workshop · Jun 21',
    avatar: 'https://ui-avatars.com/api/?name=DataLabs&background=059669&color=ffffff&size=40',
    sessionTitle: 'Big Data Analytics for DeFi',
  },
];

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 07:00 – 20:00

// ─── Helpers ────────────────────────────────────────────────────────────────────
function pad(n) { return String(n).padStart(2, '0'); }
function dateStr(y, m, d) { return `${y}-${pad(m + 1)}-${pad(d)}`; }
function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

// ─── Empty form state ───────────────────────────────────────────────────────────
const emptyForm = () => ({
  title: '', date: '', time: '', duration: '', type: 'workshop',
  host: '', location: '', seats: '', desc: '',
});

// ══════════════════════════════════════════════════════════════════════════════
export default function Calendar() {
  const today = new Date();
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('bts_calendar_sessions');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SESSIONS;
  });
  
  const [viewYear, setViewYear]           = useState(today.getFullYear());
  const [viewMonth, setViewMonth]         = useState(today.getMonth());
  const [viewMode, setViewMode]           = useState('month');
  const [weekOffset, setWeekOffset]       = useState(0);   // 0 = current week
  const [dayOffset, setDayOffset]         = useState(0);   // 0 = today
  const [selectedSession, setSelectedSession] = useState(null);
  const [activeFilters, setActiveFilters] = useState(Object.keys(SESSION_TYPES));
  const [pendingInvites, setPendingInvites] = useState(INITIAL_INVITES);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [form, setForm]                   = useState(emptyForm());
  const [formErrors, setFormErrors]       = useState({});
  const [formSelectedType, setFormSelectedType] = useState('workshop');

  useEffect(() => {
    if (!localStorage.getItem('bts_calendar_sessions')) {
      localStorage.setItem('bts_calendar_sessions', JSON.stringify(INITIAL_SESSIONS));
    }
  }, []);

  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('bts_calendar_sessions');
        if (saved) setSessions(JSON.parse(saved));
      } catch {}
    };
    window.addEventListener('bts_calendar_sync', handleSync);
    return () => window.removeEventListener('bts_calendar_sync', handleSync);
  }, []);

  useEffect(() => {
    localStorage.setItem('bts_calendar_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // ── Stats ──
  const stats = useMemo(() => {
    const thisMonth = sessions.filter(s => {
      const [y, m] = s.date.split('-').map(Number);
      return y === viewYear && m === viewMonth + 1;
    });
    return {
      total: thisMonth.length,
      workshops: thisMonth.filter(s => s.type === 'workshop').length,
      deadlines: thisMonth.filter(s => s.type === 'deadline').length,
      exams: thisMonth.filter(s => s.type === 'exam' || s.type === 'mentorship' || s.type === 'private').length,
    };
  }, [sessions, viewYear, viewMonth]);

  // ── Calendar grid (month view) ──
  const { days, totalCells } = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();
    const cells = [];
    for (let i = firstDay - 1; i >= 0; i--)
      cells.push({ day: daysInPrevMonth - i, currentMonth: false });
    for (let d = 1; d <= daysInMonth; d++)
      cells.push({ day: d, currentMonth: true });
    const remainder = 7 - (cells.length % 7);
    if (remainder < 7)
      for (let d = 1; d <= remainder; d++)
        cells.push({ day: d, currentMonth: false });
    return { days: cells, totalCells: cells.length };
  }, [viewYear, viewMonth]);

  // ── Week view: 7 days starting from weekOffset weeks from today ──
  const weekDays = useMemo(() => {
    const base = new Date(today);
    base.setDate(base.getDate() - base.getDay() + weekOffset * 7); // start of week
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d;
    });
  }, [weekOffset]);

  // ── Day view ──
  const dayDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + dayOffset);
    return d;
  }, [dayOffset]);

  // ── Session lookup per date string ──
  const sessionsByDateStr = useMemo(() => {
    const map = {};
    sessions.forEach(s => {
      if (!map[s.date]) map[s.date] = [];
      map[s.date].push(s);
    });
    return map;
  }, [sessions]);

  // ── Session lookup per day-of-month (month view) ──
  const sessionsByDay = useMemo(() => {
    const map = {};
    sessions.forEach(s => {
      const [y, m, d] = s.date.split('-').map(Number);
      if (y === viewYear && m === viewMonth + 1) {
        if (!map[d]) map[d] = [];
        map[d].push(s);
      }
    });
    return map;
  }, [sessions, viewYear, viewMonth]);

  // ── Today sessions ──
  const todaySessions = useMemo(() => {
    const key = dateStr(today.getFullYear(), today.getMonth(), today.getDate());
    return (sessionsByDateStr[key] || []);
  }, [sessionsByDateStr]);

  // ── Navigation ──
  const goToPrev = () => {
    if (viewMode === 'month') {
      if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
      else setViewMonth(m => m - 1);
    } else if (viewMode === 'week') {
      setWeekOffset(o => o - 1);
    } else {
      setDayOffset(o => o - 1);
    }
  };
  const goToNext = () => {
    if (viewMode === 'month') {
      if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
      else setViewMonth(m => m + 1);
    } else if (viewMode === 'week') {
      setWeekOffset(o => o + 1);
    } else {
      setDayOffset(o => o + 1);
    }
  };
  const goToToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setWeekOffset(0);
    setDayOffset(0);
  };

  const toggleFilter = (type) => {
    setActiveFilters(prev =>
      prev.includes(type) ? (prev.length > 1 ? prev.filter(t => t !== type) : prev) : [...prev, type]
    );
  };

  const isToday = (day, currentMonth) =>
    currentMonth && day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

  // ── Nav label ──
  const navLabel = useMemo(() => {
    if (viewMode === 'month') return `${MONTH_NAMES[viewMonth]} ${viewYear}`;
    if (viewMode === 'week') {
      const first = weekDays[0], last = weekDays[6];
      return `${MONTH_NAMES[first.getMonth()].slice(0,3)} ${first.getDate()} – ${MONTH_NAMES[last.getMonth()].slice(0,3)} ${last.getDate()}, ${last.getFullYear()}`;
    }
    return `${DAY_NAMES[dayDate.getDay()]}, ${MONTH_NAMES[dayDate.getMonth()]} ${dayDate.getDate()}, ${dayDate.getFullYear()}`;
  }, [viewMode, viewMonth, viewYear, weekDays, dayDate]);

  // ── Schedule form handlers ──
  const handleFormChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setFormErrors(e => ({ ...e, [field]: undefined }));
  };

  const validateForm = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Required';
    if (!form.date) errs.date = 'Required';
    if (!form.time) errs.time = 'Required';
    return errs;
  };

  const handleCreateEvent = () => {
    const errs = validateForm();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    const newSession = {
      id: `user-${Date.now()}`,
      title: form.title.trim(),
      type: formSelectedType,
      date: form.date,
      time: form.time,
      duration: form.duration || '1h',
      host: form.host.trim() || 'You',
      hostRole: 'Custom Event',
      location: form.location.trim() || 'TBD',
      seats: form.seats.trim() || '—',
      desc: form.desc.trim() || 'No description provided.',
      tags: [SESSION_TYPES[formSelectedType].label],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.title.slice(0,2))}&background=0b1121&color=d4a017&size=40`,
    };
    setSessions(prev => [...prev, newSession]);
    setForm(emptyForm());
    setFormSelectedType('workshop');
    setFormErrors({});
    setShowScheduleModal(false);
  };

  const filteredForDate = (dateString) =>
    (sessionsByDateStr[dateString] || []).filter(s => activeFilters.includes(s.type));

  // ══════════════════════════════════════════════════════════════════════════════
  return (
    <>
      <Topbar searchPlaceholder="Search sessions, events, deadlines..." />

      {/* ── Page Header ── */}
      <section className="mb-5 mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-brand-dark tracking-tight mb-1">Calendar</h2>
          <p className="text-gray-400 text-sm">Your academic sessions, deadlines, and events — all in one place.</p>
        </div>
        <button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-brand-dark text-white rounded-xl font-bold text-sm hover:bg-bts-gold hover:text-brand-dark transition-all shadow-lg shadow-brand-dark/10 shrink-0 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          Schedule Event
        </button>
      </section>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'This Month', value: stats.total, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'text-brand-dark', bg: 'bg-white' },
          { label: 'Workshops',  value: stats.workshops, icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Deadlines',  value: stats.deadlines, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Sessions',   value: stats.exams, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center shrink-0`}>
              <svg className={`w-4 h-4 ${stat.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d={stat.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-extrabold text-brand-dark leading-none">{stat.value}</p>
              <p className="text-[10px] font-bold text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-6 items-start">
        {/* ══ Left: Calendar area ══ */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Controls Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-xl font-extrabold text-brand-dark">{navLabel}</h3>
              {/* View mode toggle */}
              <div className="flex bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
                {['month', 'week', 'day'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${viewMode === mode ? 'bg-brand-dark text-white shadow' : 'text-gray-400 hover:text-brand-dark'}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              {/* Nav arrows */}
              <div className="flex items-center gap-1">
                <button onClick={goToPrev} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </button>
                <button onClick={goToNext} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </button>
                <button onClick={goToToday} className="px-3 py-1.5 text-xs font-extrabold text-secondary hover:underline transition-all">Today</button>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(SESSION_TYPES).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => toggleFilter(key)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                  activeFilters.includes(key) ? 'border-gray-200 bg-white shadow-sm' : 'border-gray-100 bg-gray-50 opacity-40'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </button>
            ))}
          </div>

          {/* ── MONTH VIEW ── */}
          {viewMode === 'month' && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
                {DAY_NAMES.map(d => (
                  <div key={d} className="py-3 text-center text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{d}</div>
                ))}
              </div>
              {/* Day cells */}
              <div className="grid grid-cols-7">
                {days.map((cell, idx) => {
                  const cellSessions = (cell.currentMonth ? (sessionsByDay[cell.day] || []) : [])
                    .filter(s => activeFilters.includes(s.type));
                  const todayCell = isToday(cell.day, cell.currentMonth);
                  const isLastCol = (idx + 1) % 7 === 0;
                  const isLastRow = idx >= totalCells - 7;
                  return (
                    <div
                      key={idx}
                      className={`min-h-[106px] p-2 border-b border-r border-gray-100 transition-colors
                        ${isLastCol ? 'border-r-0' : ''}
                        ${isLastRow ? 'border-b-0' : ''}
                        ${!cell.currentMonth ? 'bg-gray-50/60' : 'hover:bg-gray-50/80 cursor-pointer'}
                        ${todayCell ? 'bg-blue-50/50 ring-1 ring-inset ring-secondary/20' : ''}
                      `}
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        {todayCell ? (
                          <span className="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-extrabold shrink-0">
                            {cell.day}
                          </span>
                        ) : (
                          <span className={`text-xs font-bold ${cell.currentMonth ? 'text-brand-dark' : 'text-gray-300'}`}>
                            {cell.day}
                          </span>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        {cellSessions.slice(0, 2).map(s => (
                          <button
                            key={s.id}
                            onClick={() => setSelectedSession(s)}
                            className={`w-full text-left text-[10px] font-bold px-1.5 py-0.5 rounded truncate block transition-all hover:brightness-95 cursor-pointer ${SESSION_TYPES[s.type].pill}`}
                          >
                            {s.title}
                          </button>
                        ))}
                        {cellSessions.length > 2 && (
                          <button
                            onClick={() => setSelectedSession(cellSessions[2])}
                            className="w-full text-left text-[9px] font-extrabold text-gray-400 pl-1.5 hover:text-brand-dark transition-colors cursor-pointer"
                          >
                            +{cellSessions.length - 2} more
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── WEEK VIEW ── */}
          {viewMode === 'week' && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              {/* Day header row */}
              <div className="grid grid-cols-8 border-b border-gray-100 bg-gray-50">
                <div className="py-3 border-r border-gray-100" /> {/* time gutter */}
                {weekDays.map((d, i) => {
                  const isT = isSameDay(d, today);
                  return (
                    <div key={i} className={`py-3 text-center border-r border-gray-100 last:border-r-0 ${isT ? 'bg-secondary/5' : ''}`}>
                      <p className={`text-[10px] font-extrabold uppercase tracking-wider ${isT ? 'text-secondary' : 'text-gray-400'}`}>
                        {DAY_NAMES[d.getDay()]}
                      </p>
                      <p className={`text-sm font-extrabold mt-0.5 ${isT ? 'text-secondary' : 'text-brand-dark'}`}>
                        {d.getDate()}
                      </p>
                    </div>
                  );
                })}
              </div>
              {/* Time slots */}
              <div className="overflow-y-auto max-h-[480px]">
                {HOURS.map(hour => (
                  <div key={hour} className="grid grid-cols-8 border-b border-gray-50 last:border-b-0">
                    {/* Time label */}
                    <div className="py-3 px-3 border-r border-gray-100 shrink-0">
                      <span className="text-[10px] font-bold text-gray-300">{pad(hour)}:00</span>
                    </div>
                    {weekDays.map((d, di) => {
                      const ds = dateStr(d.getFullYear(), d.getMonth(), d.getDate());
                      const slotSessions = filteredForDate(ds).filter(s => {
                        const mins = timeToMinutes(s.time);
                        return mins >= hour * 60 && mins < (hour + 1) * 60;
                      });
                      const isT = isSameDay(d, today);
                      return (
                        <div key={di} className={`min-h-[52px] border-r border-gray-50 last:border-r-0 p-1 ${isT ? 'bg-secondary/5' : ''}`}>
                          {slotSessions.map(s => (
                            <button
                              key={s.id}
                              onClick={() => setSelectedSession(s)}
                              className={`w-full text-left text-[9px] font-bold px-1.5 py-1 rounded mb-0.5 truncate block transition-all hover:brightness-95 cursor-pointer ${SESSION_TYPES[s.type].pill}`}
                            >
                              {s.time} {s.title}
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── DAY VIEW ── */}
          {viewMode === 'day' && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              {/* Day header */}
              <div className={`px-5 py-4 border-b border-gray-100 ${isSameDay(dayDate, today) ? 'bg-secondary/5' : 'bg-gray-50'}`}>
                <p className={`text-xs font-extrabold uppercase tracking-widest ${isSameDay(dayDate, today) ? 'text-secondary' : 'text-gray-400'}`}>
                  {DAY_NAMES[dayDate.getDay()]}
                </p>
                <p className={`text-2xl font-extrabold ${isSameDay(dayDate, today) ? 'text-secondary' : 'text-brand-dark'}`}>
                  {MONTH_NAMES[dayDate.getMonth()]} {dayDate.getDate()}, {dayDate.getFullYear()}
                </p>
              </div>
              {/* Time slots */}
              <div className="overflow-y-auto max-h-[480px]">
                {HOURS.map(hour => {
                  const ds = dateStr(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate());
                  const slotSessions = filteredForDate(ds).filter(s => {
                    const mins = timeToMinutes(s.time);
                    return mins >= hour * 60 && mins < (hour + 1) * 60;
                  });
                  return (
                    <div key={hour} className="flex border-b border-gray-50 last:border-b-0">
                      <div className="w-16 py-3 px-3 shrink-0 border-r border-gray-100">
                        <span className="text-[10px] font-bold text-gray-300">{pad(hour)}:00</span>
                      </div>
                      <div className="flex-1 min-h-[60px] p-2 space-y-1">
                        {slotSessions.map(s => (
                          <button
                            key={s.id}
                            onClick={() => setSelectedSession(s)}
                            className={`w-full text-left text-xs font-bold px-3 py-2 rounded-xl truncate block transition-all hover:brightness-95 cursor-pointer ${SESSION_TYPES[s.type].pill}`}
                          >
                            <span className="font-extrabold">{s.time}</span> · {s.title}
                            <span className="text-[10px] ml-2 font-normal opacity-70">({s.duration})</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-4 px-1">
            {Object.entries(SESSION_TYPES).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                <span className="text-[10px] font-bold text-gray-400">{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══ Right Panel ══ */}
        <aside className="w-72 shrink-0 space-y-5">

          {/* Upcoming Today */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-brand-dark">Upcoming Today</h3>
              <span className="text-[10px] font-extrabold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                {todaySessions.length} Active
              </span>
            </div>
            {todaySessions.length === 0 ? (
              <div className="text-center py-6">
                <svg className="w-8 h-8 text-gray-200 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <p className="text-xs font-semibold text-gray-400">No sessions today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todaySessions.map((s, i) => (
                  <div key={s.id} className={`flex gap-3 ${i < todaySessions.length - 1 ? 'pb-4 border-b border-gray-50' : ''}`}>
                    <div className="flex flex-col items-center shrink-0">
                      <span className="text-[10px] font-extrabold text-brand-dark">{s.time}</span>
                      <div className={`w-0.5 flex-1 mt-1 ${SESSION_TYPES[s.type].dot} opacity-30`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-extrabold text-brand-dark leading-tight">{s.title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{s.hostRole}</p>
                      <button
                        onClick={() => setSelectedSession(s)}
                        className={`mt-2 inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          s.type === 'deadline' ? 'bg-red-50 text-red-700' : 'bg-brand-dark text-white hover:bg-bts-gold hover:text-brand-dark'
                        }`}
                      >
                        {s.type === 'deadline' ? 'View Deadline' : 'Join Session'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Invites */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-brand-dark">Pending Requests</h3>
              {pendingInvites.length > 0 && (
                <span className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-extrabold">
                  {pendingInvites.length}
                </span>
              )}
            </div>
            {pendingInvites.length === 0 ? (
              <p className="text-xs text-gray-400 font-semibold text-center py-4">No pending requests</p>
            ) : (
              <div className="space-y-3">
                {pendingInvites.map(inv => (
                  <div key={inv.id} className="p-3 bg-gray-50 rounded-xl border border-transparent hover:border-secondary/20 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={inv.avatar} alt={inv.from} className="w-8 h-8 rounded-full shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-extrabold text-brand-dark truncate">{inv.from}</p>
                        <p className="text-[10px] text-gray-400">{inv.fromRole}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPendingInvites(prev => prev.filter(i => i.id !== inv.id))}
                        className="flex-1 py-1.5 bg-brand-dark text-white text-[10px] font-extrabold rounded-lg hover:bg-bts-gold hover:text-brand-dark transition-all cursor-pointer"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => setPendingInvites(prev => prev.filter(i => i.id !== inv.id))}
                        className="px-3 py-1.5 border border-gray-200 text-[10px] font-extrabold text-gray-500 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ecosystem Sync */}
          <div className="bg-brand-dark text-white rounded-2xl p-5 relative overflow-hidden shadow-lg">
            <div className="absolute -bottom-5 -right-5 opacity-5">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-extrabold mb-1">Ecosystem Sync</h3>
              <p className="text-[10px] text-gray-400 mb-4 leading-relaxed">Connect external calendars to avoid schedule conflicts.</p>
              <div className="space-y-2">
                <button className="w-full bg-white/10 hover:bg-white/20 text-white py-2 px-3 rounded-xl flex items-center gap-2 text-[10px] font-bold transition-all cursor-pointer">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sync Google Calendar
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 text-white py-2 px-3 rounded-xl flex items-center gap-2 text-[10px] font-bold transition-all cursor-pointer">
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M0 0h11.5v11.5H0V0zm12.5 0H24v11.5H12.5V0zM0 12.5h11.5V24H0V12.5zm12.5 0H24V24H12.5V12.5z"/>
                  </svg>
                  Sync Outlook Calendar
                </button>
              </div>
            </div>
          </div>

        </aside>
      </div>

      {/* ══ Session Detail Modal ══ */}
      {selectedSession && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedSession(null)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`p-6 ${
              selectedSession.type === 'deadline'   ? 'bg-red-500'     :
              selectedSession.type === 'exam'       ? 'bg-amber-500'   :
              selectedSession.type === 'private'    ? 'bg-purple-600'  :
              selectedSession.type === 'mentorship' ? 'bg-emerald-600' :
              'bg-brand-dark'
            } text-white relative overflow-hidden`}>
              <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10" />
              <div className="absolute -left-4 -bottom-4 w-20 h-20 rounded-full bg-white/5" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-white/20">
                    {SESSION_TYPES[selectedSession.type].label}
                  </span>
                  <button
                    onClick={() => setSelectedSession(null)}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>
                </div>
                <h3 className="text-xl font-extrabold leading-tight mb-1">{selectedSession.title}</h3>
                <div className="flex items-center gap-4 text-white/70 text-xs font-semibold mt-2">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                    {selectedSession.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                    {selectedSession.time} · {selectedSession.duration}
                  </span>
                </div>
              </div>
            </div>
            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <img src={selectedSession.avatar} alt={selectedSession.host} className="w-10 h-10 rounded-xl border border-gray-100 object-cover" />
                <div>
                  <p className="text-sm font-extrabold text-brand-dark">{selectedSession.host}</p>
                  <p className="text-xs text-gray-400">{selectedSession.hostRole}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{selectedSession.desc}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Location</p>
                  <p className="text-xs font-bold text-brand-dark">{selectedSession.location}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Participants</p>
                  <p className="text-xs font-bold text-brand-dark">{selectedSession.seats}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedSession.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-extrabold px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full">{tag}</span>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                {selectedSession.type === 'deadline' ? (
                  <button className="flex-1 py-3 bg-red-500 text-white rounded-xl font-extrabold text-sm hover:bg-red-600 transition-all cursor-pointer flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                    Submit Deliverable
                  </button>
                ) : (
                  <button className="flex-1 py-3 bg-brand-dark text-white rounded-xl font-extrabold text-sm hover:bg-bts-gold hover:text-brand-dark transition-all cursor-pointer flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                    Join Session
                  </button>
                )}
                <button className="px-4 py-3 bg-gray-100 text-gray-500 rounded-xl font-extrabold text-sm hover:bg-gray-200 transition-all cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ Schedule Event Modal ══ */}
      {showScheduleModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowScheduleModal(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-7 space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-brand-dark">Schedule New Event</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Event Title <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.title}
                  onChange={e => handleFormChange('title', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 font-semibold transition-colors ${formErrors.title ? 'border-red-300' : 'border-gray-200 focus:border-secondary/40'}`}
                  placeholder="e.g. DeFi Workshop, Code Review..."
                />
                {formErrors.title && <p className="text-[10px] text-red-500 mt-1 font-bold">{formErrors.title}</p>}
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => handleFormChange('date', e.target.value)}
                    className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 font-semibold ${formErrors.date ? 'border-red-300' : 'border-gray-200'}`}
                  />
                  {formErrors.date && <p className="text-[10px] text-red-500 mt-1 font-bold">{formErrors.date}</p>}
                </div>
                <div>
                  <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Time <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={e => handleFormChange('time', e.target.value)}
                    className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 font-semibold ${formErrors.time ? 'border-red-300' : 'border-gray-200'}`}
                  />
                  {formErrors.time && <p className="text-[10px] text-red-500 mt-1 font-bold">{formErrors.time}</p>}
                </div>
              </div>

              {/* Duration & Host */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">Duration</label>
                  <input
                    value={form.duration}
                    onChange={e => handleFormChange('duration', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 font-semibold"
                    placeholder="e.g. 2h, 1.5h"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">Host</label>
                  <input
                    value={form.host}
                    onChange={e => handleFormChange('host', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 font-semibold"
                    placeholder="Your name"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">Location</label>
                <input
                  value={form.location}
                  onChange={e => handleFormChange('location', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 font-semibold"
                  placeholder="Online · Zoom, Discord, etc."
                />
              </div>

              {/* Session Type */}
              <div>
                <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">Session Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(SESSION_TYPES).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => setFormSelectedType(key)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                        formSelectedType === key
                          ? 'border-brand-dark bg-brand-dark/5 text-brand-dark'
                          : 'border-gray-200 hover:border-gray-300 text-gray-500'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`} />
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">Description</label>
                <textarea
                  value={form.desc}
                  onChange={e => handleFormChange('desc', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 font-semibold resize-none"
                  placeholder="Brief description of the event..."
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCreateEvent}
                className="flex-1 py-3 bg-brand-dark text-white rounded-xl font-extrabold text-sm hover:bg-bts-gold hover:text-brand-dark transition-all cursor-pointer"
              >
                Create Event
              </button>
              <button
                onClick={() => { setShowScheduleModal(false); setForm(emptyForm()); setFormErrors({}); }}
                className="px-5 py-3 bg-gray-100 text-gray-500 rounded-xl font-extrabold text-sm hover:bg-gray-200 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
