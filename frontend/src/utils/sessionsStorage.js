import { sessions as seedSessions } from '../data/sessions';
import { institutes } from '../data/institutes';

export const SESSION_TYPES = {
  STANDARD: 'standard',
  PREMIUM_PUBLIC: 'premium_public',
  PREMIUM_PRIVATE: 'premium_private',
};

const PREMIUM_PUBLIC_KEY = 'bts_premium_public_sessions';

const SESSION_INSTITUTE_MAP = {
  'cross-chain-deep-dive': 'bitstacks',
  'smart-contract-auditing': 'rocwell',
  'mastering-solidity': 'rocwell',
  'defi-yield-strategies': 'bitstacks',
  'cross-chain-deep': 'bitstacks',
  'intro-zkp': 'bitstacks',
};

const PFE_PREMIUM_PRIVATE_SEED = [
  {
    id: 'pfe-premium-thesis-review',
    title: 'PFE Thesis Defense Coaching',
    level: 'Advanced',
    duration: '60 Mins',
    date: 'Flexible',
    time: 'Book your slot',
    timeInfo: '1-on-1 Premium',
    scheduleDate: '2026-06-20',
    scheduleTime: 'Flexible',
    attendees: 12,
    maxCapacity: 40,
    price: 650,
    sessionType: SESSION_TYPES.PREMIUM_PRIVATE,
    instituteId: 'pfe-guidance',
    topic: 'PFE Mentoring',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpUUs_6oLFXfi4ZbJ5_49XK1ceOl1E0-db0zHBJceTkla2eB7HfZpndnNxAf0YbFy0EltC2xih8LnmfRbCJwbXhWNSsCJKHvT0vOdwrFuAPcBySIYAaR6m82JcFA6TuSLz3dq68IADkIGQx0z8x0olG_LDeK31kKSxc-c_NTWo7AZT8OVXXZNtI4A5JQY8RGpikARyl7_DW69fDY9MGnYLFGFVzA0APikEQ9_5fNtkZKEJSO8A3tuxlmYAhjwhvro96_dJYhKGuHs',
    overview: 'Personalized coaching for your final-year project (PFE) thesis defense. Includes slide review, Q&A simulation, and technical narrative structuring with a senior PFE mentor.',
    instructor: {
      name: 'Marcus Chen',
      role: 'PFE Technical Mentor',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDevsGT_5ugbgDdGi8moFrSPlX_mizOucblgDsL1EvVKfnLfQvq5zh5k-SfK3bqAWSxrFr14mkKoap5fP8NlqWY41on7sO9vTC8yNUt0WClcBTq6jFsdAKWMWJ2vvOJhKkkXFEoyhw78DN5EoKZgT8B6pbgCdncuKMrLUfM9X0bNyO3ozptzxZR48mF-1OJOH1RaKaRMmLJk9mj96OVhPnH1nrRwLDebwiCWuv-Np750NqURl2hEvRFlTMgHQxXEoE5h5tfHzy9UPo',
      mentorId: 'marcus-chen',
    },
    curriculum: [
      { title: '1. Defense Narrative', desc: 'Structure your presentation arc for faculty committees.' },
      { title: '2. Live Q&A Simulation', desc: 'Practice handling technical and methodology questions.' },
      { title: '3. Prototype Walkthrough', desc: 'Polish your demo flow and architecture explanations.' },
    ],
    prerequisites: ['Active PFE or thesis project', 'Draft slides or prototype ready'],
    benefits: [
      'Recorded mock defense session',
      'Written feedback report from mentor',
      'PFE Guidance Institute completion badge',
    ],
  },
  {
    id: 'pfe-premium-code-review',
    title: 'PFE Prototype Code Review',
    level: 'Intermediate',
    duration: '45 Mins',
    date: 'Flexible',
    time: 'Book your slot',
    timeInfo: '1-on-1 Premium',
    scheduleDate: '2026-06-18',
    scheduleTime: 'Flexible',
    attendees: 8,
    maxCapacity: 25,
    price: 450,
    sessionType: SESSION_TYPES.PREMIUM_PRIVATE,
    instituteId: 'pfe-guidance',
    topic: 'PFE Mentoring',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
    overview: 'Deep-dive private code review for your PFE prototype. Covers architecture, testing gaps, deployment readiness, and documentation quality before submission.',
    instructor: {
      name: 'Marcus Chen',
      role: 'PFE Technical Mentor',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDevsGT_5ugbgDdGi8moFrSPlX_mizOucblgDsL1EvVKfnLfQvq5zh5k-SfK3bqAWSxrFr14mkKoap5fP8NlqWY41on7sO9vTC8yNUt0WClcBTq6jFsdAKWMWJ2vvOJhKkkXFEoyhw78DN5EoKZgT8B6pbgCdncuKMrLUfM9X0bNyO3ozptzxZR48mF-1OJOH1RaKaRMmLJk9mj96OVhPnH1nrRwLDebwiCWuv-Np750NqURl2hEvRFlTMgHQxXEoE5h5tfHzy9UPo',
      mentorId: 'marcus-chen',
    },
    curriculum: [
      { title: '1. Code Quality Audit', desc: 'Review structure, patterns, and maintainability.' },
      { title: '2. Testing & CI Gaps', desc: 'Identify missing coverage and pipeline improvements.' },
      { title: '3. Submission Checklist', desc: 'Finalize repo, docs, and deployment artifacts.' },
    ],
    prerequisites: ['Git repository with prototype code', 'README or technical doc draft'],
    benefits: [
      'Annotated code review notes',
      'Priority booking with PFE faculty',
      'Follow-up async support channel access',
    ],
  },
];

function normalizeSession(session) {
  const instituteId =
    session.instituteId ||
    SESSION_INSTITUTE_MAP[session.id] ||
    'bitstacks';
  const institute = institutes.find((i) => i.id === instituteId);

  return {
    ...session,
    sessionType: session.sessionType || SESSION_TYPES.STANDARD,
    instituteId,
    instituteName: institute?.title || 'BitStack Institute',
    scheduleDate: session.scheduleDate || session.date,
    scheduleTime: session.scheduleTime || session.time,
    topic: session.topic || 'Workshop',
    shortDescription:
      session.shortDescription ||
      (session.overview ? session.overview.slice(0, 120) + '…' : ''),
  };
}

function readPremiumPublicSessions() {
  try {
    const raw = localStorage.getItem(PREMIUM_PUBLIC_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writePremiumPublicSessions(sessions) {
  localStorage.setItem(PREMIUM_PUBLIC_KEY, JSON.stringify(sessions));
  window.dispatchEvent(new CustomEvent('bts_sessions_change'));
}

export function getAllSessions() {
  const normalizedSeed = seedSessions.map((s) =>
    normalizeSession({
      ...s,
      sessionType:
        s.id === 'intro-zkp' ? SESSION_TYPES.PREMIUM_PUBLIC : SESSION_TYPES.STANDARD,
    })
  );
  const premiumPublic = readPremiumPublicSessions().map(normalizeSession);
  const premiumPrivate = PFE_PREMIUM_PRIVATE_SEED.map(normalizeSession);

  return [...normalizedSeed, ...premiumPublic, ...premiumPrivate];
}

export function getSessionById(id) {
  return getAllSessions().find((s) => s.id === id) || null;
}

export function getPublicSessions() {
  return getAllSessions().filter(
    (s) =>
      s.sessionType === SESSION_TYPES.STANDARD ||
      s.sessionType === SESSION_TYPES.PREMIUM_PUBLIC
  );
}

export function getPremiumPublicSessions() {
  return getAllSessions().filter((s) => s.sessionType === SESSION_TYPES.PREMIUM_PUBLIC);
}

export function getPremiumPrivateSessions() {
  return getAllSessions().filter((s) => s.sessionType === SESSION_TYPES.PREMIUM_PRIVATE);
}

export function getInstituteName(instituteId) {
  return institutes.find((i) => i.id === instituteId)?.title || instituteId;
}

export function createPremiumPublicSession(sessionData) {
  const session = normalizeSession({
    ...sessionData,
    id: `premium-${Date.now()}`,
    sessionType: SESSION_TYPES.PREMIUM_PUBLIC,
    attendees: 0,
    maxCapacity: sessionData.maxCapacity || 100,
    createdAt: new Date().toISOString(),
    createdBy: 'admin',
    timeInfo: sessionData.timeInfo || `Starts ${sessionData.date}`,
    overview: sessionData.overview || sessionData.shortDescription || '',
    curriculum: sessionData.curriculum || [
      { title: '1. Session Overview', desc: sessionData.shortDescription || 'Premium workshop content.' },
    ],
    prerequisites: sessionData.prerequisites || ['Bitstacks ecosystem pass'],
    benefits: sessionData.benefits || [
      'Premium institute badge',
      'Platform-wide visibility upon publish',
      'Recorded session archive access',
    ],
    instructor: sessionData.instructor || {
      name: 'Institute Faculty',
      role: 'Premium Instructor',
      avatar: 'https://ui-avatars.com/api/?name=Faculty&background=d4a017&color=0b1121',
      mentorId: null,
    },
  });

  const next = [session, ...readPremiumPublicSessions()];
  writePremiumPublicSessions(next);
  return session;
}
