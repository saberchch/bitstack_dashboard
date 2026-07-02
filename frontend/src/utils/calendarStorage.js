/**
 * calendarStorage.js
 * ------------------
 * Manages calendar events via direct REST API calls.
 *
 * GET    /api/calendar          → list user's events
 * POST   /api/calendar          → create an event
 * PATCH  /api/calendar/:id      → update an event
 * DELETE /api/calendar/:id      → delete an event
 *
 * Seed events are shown on first load; server events are merged on top.
 */
import { apiGet, apiPost, apiPatch, apiDelete } from './api';

export const CALENDAR_STORAGE_KEY = 'bts_calendar_events';
export const CALENDAR_SYNC_EVENT  = 'bts_calendar_sync';

export const SESSION_TYPES = {
  workshop:   { label: 'Public Workshop',  dot: 'bg-blue-500',    pill: 'bg-blue-50 text-blue-700 border-l-2 border-blue-500',      badge: 'bg-blue-100 text-blue-700',    accent: '#3b82f6' },
  private:    { label: 'Private Session',  dot: 'bg-purple-500',  pill: 'bg-purple-50 text-purple-700 border-l-2 border-purple-500', badge: 'bg-purple-100 text-purple-700', accent: '#a855f7' },
  deadline:   { label: 'Mission Deadline', dot: 'bg-red-500',     pill: 'bg-red-50 text-red-700 border-l-2 border-red-500',         badge: 'bg-red-100 text-red-700',      accent: '#ef4444' },
  exam:       { label: 'Institute Exam',   dot: 'bg-amber-500',   pill: 'bg-amber-50 text-amber-700 border-l-2 border-amber-500',   badge: 'bg-amber-100 text-amber-700',  accent: '#f59e0b' },
  mentorship: { label: 'Mentorship Call',  dot: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700 border-l-2 border-emerald-500', badge: 'bg-emerald-100 text-emerald-700', accent: '#10b981' },
};

export const INITIAL_SESSIONS = [
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
    desc: 'Final submission window for the Deep Web Protocol mission.',
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
    desc: 'Intensive private review of your ZK-Rollup implementation with circuit optimization suggestions.',
    tags: ['ZK-Rollups', 'Private', 'Code Review'],
    avatar: 'https://ui-avatars.com/api/?name=Robert+Lang&background=1d4ed8&color=ffffff&size=40',
  },
  {
    id: 's7', title: 'Code Freeze: NFT Platform v2', type: 'deadline',
    date: '2026-06-18', time: '23:59', duration: 'Hard Deadline',
    host: 'Project: NFT Platform', hostRole: 'Sprint 3 Milestone',
    location: 'GitHub Repository', seats: '—',
    desc: 'All feature branches must be merged and the codebase frozen for QA testing.',
    tags: ['Deadline', 'Code Freeze', 'NFT'],
    avatar: 'https://ui-avatars.com/api/?name=CF&background=ef4444&color=ffffff&size=40',
  },
  {
    id: 's8', title: 'DeFi Architecture Masterclass', type: 'workshop',
    date: '2026-06-12', time: '15:00', duration: '4h',
    host: 'Alice Merton', hostRole: 'Lead Architect · Nexus Protocol',
    location: 'Online · Zoom', seats: '58/80',
    desc: 'Deep dive into AMM architecture, lending pool design, and cross-chain bridge security patterns.',
    tags: ['DeFi', 'Architecture', 'AMM'],
    avatar: 'https://ui-avatars.com/api/?name=Alice+Merton&background=db2777&color=ffffff&size=40',
  },
  {
    id: 's9', title: 'Web3 UI/UX Design Workshop', type: 'workshop',
    date: '2026-06-20', time: '11:00', duration: '3h',
    host: 'Marcus Kane', hostRole: 'Lead Designer · Bitstacks',
    location: 'Online · Figma Live', seats: '35/50',
    desc: 'Hands-on design session covering wallet UX patterns, transaction state design, and dark-mode component systems.',
    tags: ['UI/UX', 'Figma', 'Design'],
    avatar: 'https://ui-avatars.com/api/?name=Marcus+Kane&background=7c3aed&color=ffffff&size=40',
  },
  {
    id: 's10', title: 'BTS Tokenomics Governance Session', type: 'private',
    date: '2026-06-22', time: '17:00', duration: '2h',
    host: 'DAO Council', hostRole: 'Governance · Token Holders',
    location: 'Snapshot + Video', seats: '12/20',
    desc: 'Quarterly governance session to vote on BTS emission schedule and staking parameters.',
    tags: ['DAO', 'Governance', 'Tokenomics'],
    avatar: 'https://ui-avatars.com/api/?name=DAO&background=0b1121&color=d4a017&size=40',
  },
  {
    id: 's11', title: 'AI Ethics Final Assessment', type: 'exam',
    date: '2026-06-25', time: '10:00', duration: '2h',
    host: 'Bitstacks Institute', hostRole: 'AI Ethics Program',
    location: 'Proctored Online', seats: '22/30',
    desc: 'Final written assessment for the AI Ethics program.',
    tags: ['AI Ethics', 'Exam', 'Certification'],
    avatar: 'https://ui-avatars.com/api/?name=BI&background=0b1121&color=d4a017&size=40',
  },
  {
    id: 's12', title: 'Solidity Hackathon Kickoff', type: 'workshop',
    date: '2026-06-28', time: '09:00', duration: '48h',
    host: 'Bitstacks Core Team', hostRole: '72h Hackathon · Open Registration',
    location: 'Online + Discord', seats: '89/150',
    desc: '48-hour Solidity hackathon with prizes of 5,000 BTS for 1st place.',
    tags: ['Hackathon', 'Solidity', 'BTS Prize'],
    avatar: 'https://ui-avatars.com/api/?name=BTS&background=d4a017&color=0b1121&size=40',
  },
];

export const INITIAL_INVITES = [
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

export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const DAY_NAMES   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ── Module-level cache ─────────────────────────────────────────────────────────
// Start with seed data; server events are merged after first fetch.
let _cache = (() => {
  try {
    const raw = localStorage.getItem(CALENDAR_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...INITIAL_SESSIONS];
  } catch (_) {
    return [...INITIAL_SESSIONS];
  }
})();

function _setCache(sessions, { notify = true } = {}) {
  _cache = Array.isArray(sessions) ? sessions : [];
  try {
    localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(_cache));
  } catch (_) {}
  if (notify) window.dispatchEvent(new Event(CALENDAR_SYNC_EVENT));
}

// ── Date helpers ───────────────────────────────────────────────────────────────
function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function sessionToDate(session) {
  const [y, m, d] = session.date.split('-').map(Number);
  const [h, min]  = (session.time || '00:00').split(':').map(Number);
  return new Date(y, m - 1, d, h, min);
}

export function daysUntil(session, from = startOfToday()) {
  const [y, m, d] = session.date.split('-').map(Number);
  const sessionDay = new Date(y, m - 1, d);
  return Math.round((sessionDay - from) / (1000 * 60 * 60 * 24));
}

export function formatSessionDate(session) {
  const date = sessionToDate(session);
  return {
    month: MONTH_NAMES[date.getMonth()].slice(0, 3),
    day:   date.getDate(),
    weekday: DAY_NAMES[date.getDay()],
  };
}

export function formatSessionTime(time) {
  if (!time) return '';
  const [h, m]   = time.split(':').map(Number);
  const suffix   = h >= 12 ? 'PM' : 'AM';
  const hour12   = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function getRelativeLabel(session) {
  const diff = daysUntil(session);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff > 1 && diff <= 7) return `In ${diff} days`;
  return null;
}

export function isUrgentSession(session, withinDays = 3) {
  const diff = daysUntil(session);
  if (diff < 0) return false;
  if (session.type === 'deadline' && diff <= withinDays) return true;
  if (session.type === 'exam'     && diff <= 2)          return true;
  return diff === 0;
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Synchronous read. */
export function getCalendarSessions() {
  return _cache;
}

/** Fetch events from server, merge with seed data, refresh cache. */
export async function fetchCalendarFromServer() {
  try {
    const data = await apiGet('/api/calendar');
    if (Array.isArray(data) && data.length > 0) {
      // Merge: server events override seed events with the same id
      const serverIds = new Set(data.map(e => e.id));
      const merged    = [
        ...INITIAL_SESSIONS.filter(s => !serverIds.has(s.id)),
        ...data,
      ];
      _setCache(merged);
    }
  } catch (err) {
    console.warn('[calendarStorage] fetchCalendarFromServer failed:', err.message);
  }
  return _cache;
}

/** No-op kept for backward compatibility. */
export function initCalendarStorage() {}

/** Add a new event and persist to server. */
export async function addCalendarSession(session) {
  _setCache([..._cache, session]);
  try {
    const saved = await apiPost('/api/calendar', session);
    if (saved && saved.id && saved.id !== session.id) {
      // Sync server-assigned id
      _setCache(_cache.map(s => s.id === session.id ? { ...session, id: saved.id } : s));
    }
  } catch (err) {
    console.warn('[calendarStorage] addCalendarSession failed:', err.message);
  }
  return session;
}

/** Save (replace) the full sessions list locally; use addCalendarSession for server persistence. */
export function saveCalendarSessions(sessions, { notify = true } = {}) {
  _setCache(sessions, { notify });
}

// ── Filter / sort helpers ─────────────────────────────────────────────────────
function sortUpcoming(a, b) {
  const aUrgent = isUrgentSession(a);
  const bUrgent = isUrgentSession(b);
  if (aUrgent && !bUrgent) return -1;
  if (!aUrgent && bUrgent) return 1;
  if (a.type === 'deadline' && b.type !== 'deadline') return -1;
  if (a.type !== 'deadline' && b.type === 'deadline') return 1;
  return sessionToDate(a) - sessionToDate(b);
}

export function getUpcomingSessions(sessions = getCalendarSessions(), { limit = 5 } = {}) {
  const today = startOfToday();
  return sessions
    .filter(s => sessionToDate(s) >= today)
    .sort(sortUpcoming)
    .slice(0, limit);
}

export function getUrgentDeadlines(sessions = getCalendarSessions(), withinDays = 3) {
  return sessions
    .filter(s => s.type === 'deadline' && daysUntil(s) >= 0 && daysUntil(s) <= withinDays)
    .sort((a, b) => sessionToDate(a) - sessionToDate(b));
}

export function getTodaySessions(sessions = getCalendarSessions()) {
  const today = startOfToday();
  const key   = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return sessions
    .filter(s => s.date === key)
    .sort((a, b) => sessionToDate(a) - sessionToDate(b));
}
