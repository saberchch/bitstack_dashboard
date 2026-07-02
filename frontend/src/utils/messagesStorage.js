/**
 * messagesStorage.js
 * ------------------
 * Manages conversations & messages via direct REST API calls.
 *
 * GET  /api/conversations                          → list all conversations
 * POST /api/conversations                          → create conversation
 * GET  /api/conversations/:id/messages             → list messages
 * POST /api/conversations/:id/messages             → send message
 * PATCH /api/conversations/:id/messages/:mid/read  → mark message read
 *
 * Local cache keeps conversations in memory so synchronous reads stay instant.
 */
import { apiGet, apiPost, apiPatch } from './api';
import { addNotification } from './notificationsStorage';

// ── Seed data (shown when server returns empty / user has no conversations yet) ─
const INITIAL_CONVOS = [
  // ════ DIRECT ════
  {
    id: 'd1', category: 'direct', pinned: true,
    contact: { name: 'Sarah Jenkins', role: 'Senior Mentor · Bitstacks', avatar: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=db2777&color=ffffff&size=40', online: true },
    unread: 2,
    sharedFiles: [
      { name: 'audit_report_v2.pdf', size: '1.8 MB', icon: '📄' },
    ],
    messages: [
      { id: '1', from: 'other', text: 'Hey! Have you reviewed the ZK-Rollup code I sent over?', ts: '10:12', date: 'Today' },
      { id: '2', from: 'me', text: 'Yes! Pushed comments to the PR — a couple of circuit optimizations to address but overall solid.', ts: '10:15', date: 'Today' },
      { id: '3', from: 'other', text: 'Perfect. Can we hop on a call to walk through it?', ts: '10:18', date: 'Today' },
      { id: '4', from: 'me', text: '4pm works for me.', ts: '10:19', date: 'Today' },
      { id: '5', from: 'other', text: 'Great, calendar invite incoming 📅', ts: '10:20', date: 'Today' },
      { id: '6', from: 'other', text: 'Also — have you seen the staking mechanic update in the changelog?', ts: '10:21', date: 'Today' },
    ],
  },
  {
    id: 'd2', category: 'direct',
    contact: { name: 'Dr. Robert Lang', role: 'Oxford Crypto Lab', avatar: 'https://ui-avatars.com/api/?name=Robert+Lang&background=1d4ed8&color=ffffff&size=40', online: false },
    unread: 0,
    sharedFiles: [],
    messages: [
      { id: '1', from: 'other', text: 'The benchmark results for the prover are impressive. Great work on the circuit depth reduction.', ts: 'Yesterday', date: 'Yesterday' },
      { id: '2', from: 'me', text: 'Thanks! Switched to Plonk-based inner circuit — cut constraints by ~40%.', ts: 'Yesterday', date: 'Yesterday' },
      { id: '3', from: 'other', text: 'Would you consider writing this up as a research note for the lab?', ts: 'Yesterday', date: 'Yesterday' },
    ],
  },

  // ════ REQUESTS ════
  {
    id: 'r1', category: 'requests',
    contact: { name: 'Dr. Robert Lang', role: 'Expert Mentor · Oxford Crypto Lab', avatar: 'https://ui-avatars.com/api/?name=Robert+Lang&background=1d4ed8&color=ffffff&size=40', online: false },
    unread: 1,
    sharedFiles: [],
    requestMeta: {
      type: 'private_session',
      typeLabel: 'Private Session Request',
      ref: 'ZK-Rollup Deep Dive — 1-on-1',
      platform: 'D-Platform',
      detail: '1.5h Session · Jun 20, 2026 · 16:00',
      price: '250 BTS',
      direction: 'incoming',
      status: 'pending',
      history: [
        { date: 'Jun 11', action: 'Created Request', actor: 'Dr. Robert Lang', details: '1.5h Session @ 250 BTS' }
      ]
    },
    messages: [
      { id: '1', from: 'other', text: 'Hello John! I would like to book a private mentorship session with you on June 20th. I want to deep dive into recursive proof verification circuits.', ts: '08:45', date: 'Today' },
    ],
  },
  {
    id: 'r2', category: 'requests',
    contact: { name: 'Sarah Jenkins', role: 'Senior Mentor · Bitstacks', avatar: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=db2777&color=ffffff&size=40', online: true },
    unread: 0,
    sharedFiles: [],
    requestMeta: {
      type: 'mentorship',
      typeLabel: 'Mentorship Application',
      ref: '12-Week Web3 Roadmap Program',
      platform: 'Expert Mentors',
      detail: '12-week intensive track · Applied Jun 3',
      price: '500 BTS',
      direction: 'outgoing',
      status: 'info_requested',
      history: [
        { date: 'Jun 3', action: 'Applied', actor: 'me', details: 'Mentorship application submitted' },
        { date: 'Jun 5', action: 'Requested Info', actor: 'Sarah Jenkins', details: 'Requested GitHub portfolio & ZK experience writeup' }
      ]
    },
    messages: [
      { id: '1', from: 'me', text: "Hi Sarah, I've submitted my application to your 12-Week Web3 Roadmap mentorship program. I'm interested in ZK Layer-2 designs.", ts: 'Jun 3', date: 'Jun 3' },
      { id: '2', from: 'other', text: 'Hi John! I reviewed your background and it looks very interesting. Before accepting, could you share a link to your ZK implementation repos or explain your constraints reduction approach?', ts: 'Jun 5', date: 'Jun 5' },
    ],
  },

  // ════ PROPOSALS ════
  {
    id: 'p1', category: 'proposals',
    contact: { name: 'Rami T.', role: 'Full-Stack Dev · Freelancer', avatar: 'https://ui-avatars.com/api/?name=Rami+T&background=7c3aed&color=ffffff&size=40', online: true },
    unread: 2,
    sharedFiles: [
      { name: 'proposal_brief.docx', size: '280 KB', icon: '📝' },
    ],
    proposalMeta: {
      direction: 'incoming',
      typeLabel: 'Freelance Proposal Received',
      mission: 'DAO Governance Dashboard',
      missionId: 'my-post-dao-governance',
      platform: 'D-Lancer',
      bid: '1,500 BTS',
      timeline: '16 days',
      freelancerRating: '4.6',
      status: 'pending',
      history: [
        { date: 'Jun 11', action: 'Submitted Proposal', actor: 'Rami T.', details: 'Bid: 1,500 BTS, Timeline: 16 days' }
      ]
    },
    messages: [
      { id: '1', from: 'other', text: "Hi! I've reviewed the DAO Governance Dashboard mission brief. I have 3 years of experience building real-time dashboards with React and WebSocket integrations for blockchain data.", ts: '09:30', date: 'Today' },
      { id: '2', from: 'other', text: "My bid is 1,500 BTS with a 16-day delivery timeline. I'd structure the work in 3 milestones. Please see the attached brief.", ts: '09:31', date: 'Today' },
    ],
  },
  {
    id: 'p2', category: 'proposals',
    contact: { name: 'DeFi Nexus', role: 'Client · D-Lancer Mission', avatar: 'https://ui-avatars.com/api/?name=DeFi+Nexus&background=0b1121&color=d4a017&size=40', online: false },
    unread: 0,
    sharedFiles: [],
    proposalMeta: {
      direction: 'outgoing',
      typeLabel: 'Proposal Sent',
      mission: 'Smart Contract Security Audit',
      missionId: 'smart-contract-audit',
      platform: 'D-Lancer',
      bid: '1,200 BTS',
      timeline: '14 days',
      freelancerRating: '—',
      status: 'counter_proposed',
      history: [
        { date: 'Jun 8', action: 'Submitted Bid', actor: 'me', details: 'Bid: 1,200 BTS, Timeline: 14 days' },
        { date: 'Jun 10', action: 'Counter-Offer Received', actor: 'DeFi Nexus', details: 'Counter-bid: 1,000 BTS, Timeline: 10 days' }
      ]
    },
    messages: [
      { id: '1', from: 'me', text: "Hi DeFi Nexus! I've completed 12 Solidity audits and would love to review your code. My bid is 1,200 BTS across 14 days.", ts: 'Jun 8', date: 'Jun 8' },
      { id: '2', from: 'other', text: 'Thanks John. We like your profile, but our budget is tight. Could you do it for 1,000 BTS and complete it in 10 days?', ts: 'Jun 10', date: 'Jun 10' },
    ],
  },

  // ════ DISPUTES ════
  {
    id: 'dis1', category: 'disputes',
    contact: { name: 'Arbitration Panel', role: 'Dispute #DIS-2041 · Bitstacks Resolution', avatar: 'https://ui-avatars.com/api/?name=ARB&background=0b1121&color=d4a017&size=40', online: true },
    unread: 1,
    sharedFiles: [
      { name: 'original_agreement.pdf', size: '540 KB', icon: '📄' }
    ],
    disputeMeta: {
      id: '#DIS-2041',
      type: 'payment',
      typeLabel: 'Payment Dispute',
      platform: 'D-Lancer',
      mission: 'Smart Contract Security Audit',
      parties: 'You (Auditor) vs DeFi Nexus (Client)',
      amount: '1,200 BTS',
      status: 'evidence_required',
      priority: 'high',
      opened: 'Jun 10, 2026',
      arbitrator: 'Panel #7 — 3 elected members',
      myRole: 'Claimant',
    },
    messages: [
      { id: '1', from: 'me', text: 'I filed this dispute because DeFi Nexus has not released the milestone 2 payment (600 BTS) despite the deliverable being submitted and approved 5 days ago.', ts: 'Jun 10', date: 'Jun 10' },
      { id: '2', from: 'other', text: 'Dispute #DIS-2041 has been opened. Arbitration Panel #7 has been assigned. Please submit your GitHub proof-of-completion, communication logs, or approved pull requests to transition the case to Review state.', ts: 'Jun 11', date: 'Jun 11' },
    ],
  },
];

// ── Module-level cache ─────────────────────────────────────────────────────────
let _cache = (() => {
  try {
    const raw = localStorage.getItem('bts_conversations');
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CONVOS;
  } catch (_) {
    return INITIAL_CONVOS;
  }
})();

function _setCache(convos) {
  _cache = Array.isArray(convos) ? convos : [];
  try {
    localStorage.setItem('bts_conversations', JSON.stringify(_cache));
  } catch (_) {}
  window.dispatchEvent(new CustomEvent('bts_conversations_change', { detail: _cache }));
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Synchronous read from in-memory cache. */
export function getConversations() {
  return _cache;
}

/** Fetch conversations from the server and refresh cache. */
export async function fetchConversationsFromServer() {
  try {
    const data = await apiGet('/api/conversations');
    if (Array.isArray(data) && data.length > 0) {
      _setCache(data);
    }
  } catch (err) {
    console.warn('[messagesStorage] fetchConversations failed:', err.message);
  }
  return _cache;
}

/** Persist conversations array to server. */
export function saveConversations(convos) {
  _setCache(convos);
  // Fire-and-forget: sync each new convo to server
  // (full-array replace is handled via /api/sync for large payloads)
}

/** Create a new request conversation (outgoing private session request). */
export async function addRequestConvo({ mentorName, mentorAvatar, topic, price, date, duration, message }) {
  const nowTs = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const newConvo = {
    id: `req-${Date.now()}`,
    category: 'requests',
    contact: {
      name: mentorName,
      role: 'Expert Mentor',
      avatar: mentorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentorName)}&background=1d4ed8&color=ffffff&size=40`,
      online: false,
    },
    unread: 0,
    sharedFiles: [],
    requestMeta: {
      type: 'private_session',
      typeLabel: 'Private Session Request',
      ref: topic || 'Custom Session Request',
      platform: 'D-Platform',
      detail: `${duration} · ${date}`,
      price: price || '—',
      direction: 'outgoing',
      status: 'pending',
      history: [
        { date: 'Today', action: 'Created Request', actor: 'me', details: `${duration} @ ${price}` }
      ]
    },
    messages: [
      { id: `m-${Date.now()}`, from: 'me', text: message, ts: nowTs, date: 'Today' }
    ]
  };

  // Optimistic update
  _setCache([..._cache, newConvo]);

  // Persist to server
  try {
    await apiPost('/api/conversations', { peerId: mentorName, ...newConvo });
  } catch (err) {
    console.warn('[messagesStorage] addRequestConvo server call failed:', err.message);
  }

  addNotification({
    category: 'mentorship',
    title: 'Private Session Request Sent',
    description: `You requested a session with ${mentorName} on "${topic || 'Custom Topic'}".`,
    route: '/messages',
  });

  return newConvo;
}

/** Create a new proposal conversation (outgoing freelance bid). */
export async function addProposalConvo({ clientName, clientAvatar, missionName, bid, timeline, message }) {
  const nowTs = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const newConvo = {
    id: `prop-${Date.now()}`,
    category: 'proposals',
    contact: {
      name: clientName,
      role: 'Client · D-Lancer',
      avatar: clientAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(clientName)}&background=0b1121&color=d4a017&size=40`,
      online: false,
    },
    unread: 0,
    sharedFiles: [],
    proposalMeta: {
      direction: 'outgoing',
      typeLabel: 'Proposal Sent',
      mission: missionName,
      missionId: `mission-${Date.now()}`,
      platform: 'D-Lancer',
      bid: bid || '—',
      timeline: timeline || '—',
      freelancerRating: '—',
      status: 'pending',
      history: [
        { date: 'Today', action: 'Submitted Bid', actor: 'me', details: `Bid: ${bid}, Timeline: ${timeline}` }
      ]
    },
    messages: [
      { id: `m-${Date.now()}`, from: 'me', text: message, ts: nowTs, date: 'Today' }
    ]
  };

  _setCache([..._cache, newConvo]);

  try {
    await apiPost('/api/conversations', { peerId: clientName, ...newConvo });
  } catch (err) {
    console.warn('[messagesStorage] addProposalConvo server call failed:', err.message);
  }

  addNotification({
    category: 'dlancer',
    title: 'Proposal Bid Submitted',
    description: `You submitted a bid of ${bid} to ${clientName} for "${missionName}".`,
    route: '/messages',
  });

  return newConvo;
}

/** Create a new dispute conversation. */
export async function addDisputeConvo({ opponentName, missionName, disputeType, amount, priority, description }) {
  const nowTs = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const newId = `disp-${Date.now()}`;
  const newConvo = {
    id: newId,
    category: 'disputes',
    contact: {
      name: 'Arbitration Panel',
      role: `Dispute #DIS-${newId.slice(-4).toUpperCase()} · Bitstacks Resolution`,
      avatar: `https://ui-avatars.com/api/?name=ARB&background=0b1121&color=d4a017&size=40`,
      online: true,
    },
    unread: 0,
    sharedFiles: [],
    disputeMeta: {
      id: `#DIS-${newId.slice(-4).toUpperCase()}`,
      type: disputeType || 'payment',
      typeLabel: `${(disputeType || 'payment').charAt(0).toUpperCase() + (disputeType || 'payment').slice(1)} Dispute`,
      platform: 'D-Lancer',
      mission: missionName || 'Audit Contract',
      parties: `You vs ${opponentName}`,
      amount: amount || '—',
      status: 'evidence_required',
      priority: priority || 'medium',
      opened: 'Today',
      arbitrator: 'Admin / Arbitration Panel #7',
      myRole: 'Claimant',
    },
    messages: [
      { id: `m-${Date.now()}`, from: 'me', text: description, ts: nowTs, date: 'Today' },
      { id: `sys-${Date.now()}`, from: 'system', text: `⚖️ Dispute has been opened. Please submit evidence documents inside the case panel.`, ts: nowTs, date: 'Today' }
    ]
  };

  _setCache([..._cache, newConvo]);

  try {
    await apiPost('/api/conversations', newConvo);
  } catch (err) {
    console.warn('[messagesStorage] addDisputeConvo server call failed:', err.message);
  }

  addNotification({
    category: 'disputes',
    title: 'Dispute Arbitration Opened',
    description: `Arbitration case opened against ${opponentName} for "${missionName}".`,
    route: '/messages',
  });

  return newConvo;
}

/** Send a message in a conversation (POST /api/conversations/:id/messages). */
export async function sendMessage(convoId, content) {
  const nowTs = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const optimistic = { id: `m-${Date.now()}`, from: 'me', text: content, ts: nowTs, date: 'Today' };

  // Optimistic update
  _setCache(_cache.map(c =>
    c.id === convoId
      ? { ...c, messages: [...(c.messages || []), optimistic] }
      : c
  ));

  try {
    await apiPost(`/api/conversations/${convoId}/messages`, { content, type: 'text' });
  } catch (err) {
    console.warn('[messagesStorage] sendMessage failed:', err.message);
  }

  return optimistic;
}

/** Mark a message as read. */
export async function markMessageRead(convoId, msgId) {
  try {
    await apiPatch(`/api/conversations/${convoId}/messages/${msgId}/read`);
  } catch (_) {}
}
