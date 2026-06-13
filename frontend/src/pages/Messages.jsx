import { useState, useRef, useEffect, useMemo } from 'react';
import Topbar from '../components/Topbar';
import { getConversations, saveConversations } from '../utils/messagesStorage';

// ─── Current user ────────────────────────────────────────────────────────────
const ME = {
  id: 'me',
  name: 'John Doe',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGwwnDm6m5r0C-N0LHiqCBdL2-Nqx8_NqM4iWbojCLkbc_lfkXRoD8ifHqFu_B4YIjC5ptg1deTb7eMqgkoUlSehDIy654yLdySvgNwbY744bsS7-QPDkq8VkubMIslVtgfCIN5VL-RCiGgf7ePrgYIfCFwJGsiNocFZZ5Z_twCj6Fpa0p_1lO7g3d7TBFB_N83r1viTB_zGTY-y9EGraWh8F1Y-_qTQrA1O1izM2LvzBfBgXZ36Y67pgHQLmfW-TzCjpN9MLE9OU',
};

// ─── Backend API Integration Guide & Mock Layer ─────────────────────────────
export const mockApi = {
  fetchConversations: async () => {
    return INITIAL_CONVOS;
  },
  sendMessage: async (convoId, messageText) => {
    return { id: `m-${Date.now()}`, from: 'me', text: messageText, ts: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }), date: 'Today' };
  },
  updateStatus: async (convoId, field, status, optionalPayload = {}) => {
    return { success: true };
  },
  counterProposal: async (convoId, { bid, timeline, date, duration, message }) => {
    return { success: true };
  },
  askInformation: async (convoId, { message }) => {
    return { success: true };
  },
  submitEvidence: async (convoId, { fileName, description }) => {
    return {
      success: true,
      file: { name: fileName, size: '2.4 MB', icon: '📄' }
    };
  }
};

// ─── Category config ─────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: 'direct', label: 'Direct',
    icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
    desc: 'Member-to-member messages',
  },
  {
    id: 'requests', label: 'Requests',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    desc: 'Session bookings, mentorship & custom expert requests',
  },
  {
    id: 'proposals', label: 'Proposals',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    desc: 'D-Lancer freelance project proposals & bids',
  },
  {
    id: 'disputes', label: 'Disputes',
    icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
    desc: 'Escrow disputes & arbitration mediated by platform admins',
  },
];

// ─── Status maps ─────────────────────────────────────────────────────────────
const REQ_STATUS = {
  pending: { l: 'Pending Review', c: 'bg-amber-100 text-amber-700 border border-amber-200' },
  counter_proposed: { l: 'Countered', c: 'bg-indigo-100 text-indigo-700 border border-indigo-200' },
  info_requested: { l: 'Info Requested', c: 'bg-blue-100 text-blue-700 border border-blue-200' },
  accepted: { l: 'Accepted', c: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
  declined: { l: 'Declined', c: 'bg-red-100 text-red-700 border border-red-200' },
  withdrawn: { l: 'Withdrawn', c: 'bg-gray-100 text-gray-500 border border-gray-200' },
};

const PROP_STATUS = {
  pending: { l: 'Pending Review', c: 'bg-amber-100 text-amber-700 border border-amber-200' },
  counter_proposed: { l: 'Countered', c: 'bg-indigo-100 text-indigo-700 border border-indigo-200' },
  info_requested: { l: 'Info Requested', c: 'bg-blue-100 text-blue-700 border border-blue-200' },
  accepted: { l: 'Accepted / Active', c: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
  rejected: { l: 'Rejected', c: 'bg-red-100 text-red-700 border border-red-200' },
  withdrawn: { l: 'Withdrawn', c: 'bg-gray-100 text-gray-500 border border-gray-200' },
};

const DISP_STATUS = {
  open: { l: 'Dispute Open', c: 'bg-red-100 text-red-700 border border-red-200' },
  evidence_required: { l: 'Evidence Required', c: 'bg-amber-100 text-amber-700 border border-amber-200' },
  in_review: { l: 'Panel Reviewing', c: 'bg-blue-100 text-blue-700 border border-blue-200' },
  resolved: { l: 'Resolved', c: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
  closed: { l: 'Closed', c: 'bg-gray-100 text-gray-500 border border-gray-200' },
};

const PRIORITY = {
  high: 'bg-rose-100 text-rose-700 border border-rose-200',
  medium: 'bg-amber-100 text-amber-700 border border-amber-200',
  low: 'bg-gray-100 text-gray-600 border border-gray-200',
};

// ─── Seed conversations ───────────────────────────────────────────────────────
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
      { id: '1', from: 'me', text: 'Hi Sarah, I\'ve submitted my application to your 12-Week Web3 Roadmap mentorship program. I\'m interested in ZK Layer-2 designs.', ts: 'Jun 3', date: 'Jun 3' },
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
      { id: '1', from: 'other', text: 'Hi! I\'ve reviewed the DAO Governance Dashboard mission brief. I have 3 years of experience building real-time dashboards with React and WebSocket integrations for blockchain data.', ts: '09:30', date: 'Today' },
      { id: '2', from: 'other', text: 'My bid is 1,500 BTS with a 16-day delivery timeline. I\'d structure the work in 3 milestones. Please see the attached brief.', ts: '09:31', date: 'Today' },
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
        { date: 'Jun 10', action: 'Counter-Offer Recieved', actor: 'DeFi Nexus', details: 'Counter-bid: 1,000 BTS, Timeline: 10 days' }
      ]
    },
    messages: [
      { id: '1', from: 'me', text: 'Hi DeFi Nexus! I\'ve completed 12 Solidity audits and would love to review your code. My bid is 1,200 BTS across 14 days.', ts: 'Jun 8', date: 'Jun 8' },
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

const emptyForm = () => ({ to: '', subject: '', message: '', bid: '', timeline: '', missionId: '', disputeType: 'payment', priority: 'medium', mentorName: '', sessionDate: '', sessionDuration: '1h' });

// ══════════════════════════════════════════════════════════════════════════════
export default function Messages() {
  const [convos, setConvos] = useState(() => getConversations());

  useEffect(() => {
    saveConversations(convos);
  }, [convos]);

  const [activeCat, setActiveCat] = useState('direct');
  const [activeId, setActiveId] = useState('d1');
  const [search, setSearch] = useState('');
  const [msgInput, setMsgInput] = useState('');
  
  // Compose modal states
  const [showCompose, setShowCompose] = useState(false);
  const [composeStep, setComposeStep] = useState(1);
  const [composeType, setComposeType] = useState(null);
  const [form, setForm] = useState(emptyForm());

  // Interactive right-panel form states
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [counterBid, setCounterBid] = useState('');
  const [counterTimeline, setCounterTimeline] = useState('');
  const [counterDate, setCounterDate] = useState('');
  const [counterDuration, setCounterDuration] = useState('1h');
  const [counterMsg, setCounterMsg] = useState('');

  const [showInfoForm, setShowInfoForm] = useState(false);
  const [infoMsg, setInfoMsg] = useState('');

  const [showEvidenceForm, setShowEvidenceForm] = useState(false);
  const [evidenceFile, setEvidenceFile] = useState('');
  const [evidenceDesc, setEvidenceDesc] = useState('');

  const [showPanel, setShowPanel] = useState(true);
  const bottomRef = useRef(null);

  const catConvos = useMemo(() =>
    convos.filter(c => c.category === activeCat && (
      !search || c.contact.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.messages.at(-1)?.text || '').toLowerCase().includes(search.toLowerCase())
    )), [convos, activeCat, search]);

  const activeConvo = convos.find(c => c.id === activeId) || catConvos[0];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [activeId, convos]);
  
  useEffect(() => {
    if (!activeConvo) return;
    setConvos(p => p.map(c => c.id === activeConvo.id ? { ...c, unread: 0 } : c));
  }, [activeId]);

  // Reset interactive forms when switching active conversation
  useEffect(() => {
    setShowCounterForm(false);
    setShowInfoForm(false);
    setShowEvidenceForm(false);
    setCounterBid('');
    setCounterTimeline('');
    setCounterDate('');
    setCounterMsg('');
    setInfoMsg('');
    setEvidenceFile('');
    setEvidenceDesc('');
  }, [activeId]);

  const unreadFor = (cat) => convos.filter(c => c.category === cat).reduce((s, c) => s + c.unread, 0);

  // Send normal message
  const sendMessage = async () => {
    const text = msgInput.trim();
    if (!text || !activeConvo) return;
    
    // Simulate backend POST request
    const mockRes = await mockApi.sendMessage(activeConvo.id, text);
    
    setConvos(p => p.map(c => c.id === activeConvo.id
      ? { ...c, messages: [...c.messages, mockRes] }
      : c));
    setMsgInput('');
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  // Accept / Hire Action
  const handleAccept = async (id) => {
    const convo = convos.find(c => c.id === id);
    if (!convo) return;
    
    const field = convo.requestMeta ? 'requestMeta' : 'proposalMeta';
    
    // API Call
    await mockApi.updateStatus(id, field, 'accepted');
    
    const ts = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const systemText = convo.requestMeta ? '🎉 Request accepted.' : '🎉 Proposal accepted & freelancer hired.';
    
    setConvos(p => p.map(c => {
      if (c.id !== id) return c;
      const meta = c[field];
      return {
        ...c,
        [field]: { 
          ...meta, 
          status: 'accepted',
          history: [...(meta.history || []), { date: 'Today', action: 'Accepted', actor: 'me', details: 'Approved & Escrow Funded' }]
        },
        messages: [...c.messages, { id: `sys-${Date.now()}`, from: 'system', text: systemText, ts, date: 'Today' }]
      };
    }));
  };

  // Decline Action
  const handleDecline = async (id) => {
    const convo = convos.find(c => c.id === id);
    if (!convo) return;
    
    const field = convo.requestMeta ? 'requestMeta' : 'proposalMeta';
    const declStatus = convo.requestMeta ? 'declined' : 'rejected';
    
    // API Call
    await mockApi.updateStatus(id, field, declStatus);
    
    const ts = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const systemText = convo.requestMeta ? '❌ Request declined.' : '❌ Proposal declined/rejected.';
    
    setConvos(p => p.map(c => {
      if (c.id !== id) return c;
      const meta = c[field];
      return {
        ...c,
        [field]: { 
          ...meta, 
          status: declStatus,
          history: [...(meta.history || []), { date: 'Today', action: 'Declined', actor: 'me', details: 'Declined' }]
        },
        messages: [...c.messages, { id: `sys-${Date.now()}`, from: 'system', text: systemText, ts, date: 'Today' }]
      };
    }));
  };

  // Counter-Proposal Action
  const handleCounterSubmit = async (id) => {
    const convo = convos.find(c => c.id === id);
    if (!convo) return;
    
    const isRequest = !!convo.requestMeta;
    const field = isRequest ? 'requestMeta' : 'proposalMeta';
    
    const payload = {
      bid: counterBid || '—',
      timeline: counterTimeline || '—',
      date: counterDate || '—',
      duration: counterDuration || '—',
      message: counterMsg.trim()
    };

    // API Call
    await mockApi.counterProposal(id, payload);
    
    const ts = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    let sysText = `🔄 Counter-Proposal sent: `;
    let histDetails = '';
    if (isRequest) {
      sysText += `${payload.duration} Session @ ${payload.bid} on ${payload.date}.`;
      histDetails = `Counter-offer: ${payload.duration} @ ${payload.bid}`;
    } else {
      sysText += `Bid of ${payload.bid} over ${payload.timeline}.`;
      histDetails = `Counter-offer: ${payload.bid} / ${payload.timeline}`;
    }
    
    setConvos(p => p.map(c => {
      if (c.id !== id) return c;
      const meta = c[field];
      const newMsgs = [...c.messages];
      
      if (payload.message) {
        newMsgs.push({ id: `msg-c-${Date.now()}`, from: 'me', text: `Counter Offer: ${payload.message}`, ts, date: 'Today' });
      }
      newMsgs.push({ id: `sys-c-${Date.now()}`, from: 'system', text: sysText, ts, date: 'Today' });

      return {
        ...c,
        [field]: {
          ...meta,
          status: 'counter_proposed',
          direction: 'outgoing',
          price: isRequest ? payload.bid : meta.price,
          detail: isRequest ? `${payload.duration} · ${payload.date}` : meta.detail,
          bid: !isRequest ? payload.bid : meta.bid,
          timeline: !isRequest ? payload.timeline : meta.timeline,
          history: [...(meta.history || []), { date: 'Today', action: 'Countered', actor: 'me', details: histDetails }]
        },
        messages: newMsgs
      };
    }));

    setShowCounterForm(false);
  };

  // Ask for Information Action
  const handleAskInfoSubmit = async (id) => {
    const convo = convos.find(c => c.id === id);
    if (!convo) return;
    
    const field = convo.requestMeta ? 'requestMeta' : 'proposalMeta';
    if (!infoMsg.trim()) return;

    // API Call
    await mockApi.askInformation(id, { message: infoMsg });
    
    const ts = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    setConvos(p => p.map(c => {
      if (c.id !== id) return c;
      const meta = c[field];
      return {
        ...c,
        [field]: {
          ...meta,
          status: 'info_requested',
          history: [...(meta.history || []), { date: 'Today', action: 'Requested Info', actor: 'me', details: 'Asked for details' }]
        },
        messages: [
          ...c.messages,
          { id: `msg-inf-${Date.now()}`, from: 'me', text: `Question: ${infoMsg}`, ts, date: 'Today' },
          { id: `sys-inf-${Date.now()}`, from: 'system', text: 'ℹ️ Information request sent.', ts, date: 'Today' }
        ]
      };
    }));

    setShowInfoForm(false);
  };

  // Withdraw Action
  const handleWithdraw = async (id) => {
    const convo = convos.find(c => c.id === id);
    if (!convo) return;
    
    const field = convo.requestMeta ? 'requestMeta' : 'proposalMeta';
    
    // API Call
    await mockApi.updateStatus(id, field, 'withdrawn');
    
    const ts = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    setConvos(p => p.map(c => {
      if (c.id !== id) return c;
      const meta = c[field];
      return {
        ...c,
        [field]: {
          ...meta,
          status: 'withdrawn',
          history: [...(meta.history || []), { date: 'Today', action: 'Withdrew', actor: 'me', details: 'Withdrawn' }]
        },
        messages: [...c.messages, { id: `sys-wth-${Date.now()}`, from: 'system', text: '🚫 You withdrew this request/proposal.', ts, date: 'Today' }]
      };
    }));
  };

  // Submit Evidence Action (Disputes)
  const handleEvidenceSubmit = async (id) => {
    const convo = convos.find(c => c.id === id);
    if (!convo) return;
    if (!evidenceFile.trim()) return;

    // API Call
    const mockRes = await mockApi.submitEvidence(id, { fileName: evidenceFile, description: evidenceDesc });
    
    const ts = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    setConvos(p => p.map(c => {
      if (c.id !== id) return c;
      const meta = c.disputeMeta;
      return {
        ...c,
        disputeMeta: {
          ...meta,
          status: 'in_review',
        },
        sharedFiles: [...c.sharedFiles, mockRes.file],
        messages: [
          ...c.messages,
          { id: `sys-ev-${Date.now()}`, from: 'system', text: `📁 Claimant submitted evidence: "${evidenceFile}". Description: ${evidenceDesc || 'No details provided'}`, ts, date: 'Today' }
        ]
      };
    }));

    setShowEvidenceForm(false);
  };

  // Compose Modal flow final send
  const handleComposeSend = () => {
    if (!form.message.trim()) return;
    const ct = COMPOSE_TYPES.find(t => t.id === composeType);
    const cat = ct?.category || 'direct';
    const newId = `new-${Date.now()}`;

    let meta = {};
    if (composeType === 'session_request') {
      meta = {
        requestMeta: {
          type: 'private_session',
          typeLabel: 'Private Session Request',
          ref: form.subject || 'Custom Session',
          platform: 'D-Platform',
          detail: `${form.sessionDuration} · ${form.sessionDate || 'TBD'}`,
          price: form.bid || '—',
          direction: 'outgoing',
          status: 'pending',
          history: [{ date: 'Today', action: 'Applied', actor: 'me', details: 'Session request sent' }]
        }
      };
    }
    if (composeType === 'mentorship_apply') {
      meta = {
        requestMeta: {
          type: 'mentorship',
          typeLabel: 'Mentorship Application',
          ref: form.subject || 'Mentorship Program',
          platform: 'Expert Mentors',
          detail: `Applied ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
          price: form.bid || '—',
          direction: 'outgoing',
          status: 'pending',
          history: [{ date: 'Today', action: 'Applied', actor: 'me', details: 'Application submitted' }]
        }
      };
    }
    if (composeType === 'freelance_proposal') {
      meta = {
        proposalMeta: {
          direction: 'outgoing',
          typeLabel: 'Proposal Sent',
          mission: form.subject || 'D-Lancer Mission',
          missionId: form.missionId || '—',
          platform: 'D-Lancer',
          bid: form.bid || '—',
          timeline: form.timeline || '—',
          freelancerRating: '—',
          status: 'pending',
          history: [{ date: 'Today', action: 'Submitted Bid', actor: 'me', details: `Bid: ${form.bid}, Timeline: ${form.timeline}` }]
        }
      };
    }
    if (composeType === 'open_dispute') {
      meta = {
        disputeMeta: {
          id: `#DIS-${Math.floor(2000 + Math.random() * 999)}`,
          type: form.disputeType,
          typeLabel: `${form.disputeType.charAt(0).toUpperCase() + form.disputeType.slice(1)} Dispute`,
          platform: 'D-Lancer',
          mission: form.subject || '—',
          parties: `You vs ${form.to || 'Other Party'}`,
          amount: form.bid || '—',
          status: 'open',
          priority: form.priority,
          opened: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          arbitrator: 'Admin / Arbitration Panel #7',
          myRole: 'Claimant'
        }
      };
    }

    const newConvo = {
      id: newId, category: cat,
      contact: {
        name: composeType === 'open_dispute' ? 'Arbitration Panel'
          : composeType === 'session_request' ? (form.to || 'Mentor')
            : composeType === 'mentorship_apply' ? (form.to || 'Mentor')
              : form.to || 'New Contact',
        role: ct?.desc || '',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent((form.to || '?').slice(0, 2))}&background=0b1121&color=d4a017&size=40`,
        online: false,
      },
      unread: 0,
      sharedFiles: [],
      messages: [{ id: 'm1', from: 'me', text: form.message, ts: 'Just now', date: 'Today' }],
      ...meta,
    };

    setConvos(p => [...p, newConvo]);
    setActiveCat(cat);
    setActiveId(newId);
    setShowCompose(false);
    setComposeStep(1);
    setComposeType(null);
    setForm(emptyForm());
  };

  return (
    <>
      <Topbar searchPlaceholder="Search messages..." />

      {/* Header */}
      <section className="mb-5 mt-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-brand-dark tracking-tight mb-1">Messages</h2>
          <p className="text-gray-400 text-xs font-semibold">Direct chats · Session & mentorship requests · D-Lancer proposals · Dispute resolution</p>
        </div>
        <button
          onClick={() => { setShowCompose(true); setComposeStep(1); setComposeType(null); }}
          className="flex items-center gap-2 px-4.5 py-2.5 bg-brand-dark text-white rounded-xl font-bold text-xs hover:bg-bts-gold hover:text-brand-dark transition-all shadow-lg shadow-brand-dark/10 shrink-0 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          Compose
        </button>
      </section>

      {/* Main 3-col layout */}
      <div className="flex h-[calc(100vh-215px)] min-h-[540px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* ══ Col 1: Category nav + conversation list ══ */}
        <div className="w-72 shrink-0 flex flex-col border-r border-gray-100 bg-gray-50/10">
          {/* Category tabs */}
          <div className="p-3 border-b border-gray-100 bg-gray-50/60">
            <div className="grid grid-cols-4 gap-1">
              {CATEGORIES.map(cat => {
                const u = unreadFor(cat.id);
                const active = activeCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCat(cat.id); const f = convos.find(c => c.category === cat.id); if (f) setActiveId(f.id); }}
                    className={`relative flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-[11px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${active ? 'bg-brand-dark text-white shadow' : 'text-gray-400 hover:text-brand-dark hover:bg-white'}`}
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d={cat.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                    {cat.label}
                    {u > 0 && (
                      <span className={`absolute -top-1 -right-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-extrabold ${active ? 'bg-bts-gold text-brand-dark' : 'bg-red-500 text-white'}`}>{u}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category context banner */}
          <div className="px-3 py-2 bg-gray-50/40 border-b border-gray-100">
            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
              {CATEGORIES.find(c => c.id === activeCat)?.desc}
            </p>
          </div>

          {/* Search */}
          <div className="px-3.5 py-2.5 border-b border-gray-100 bg-white">
            <div className="relative">
              <svg className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-secondary/20" />
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto bg-white">
            {catConvos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center px-4">
                <p className="text-xs font-bold text-gray-300">No conversations yet</p>
              </div>
            ) : catConvos.map(convo => {
              const last = convo.messages.at(-1);
              const isActive = activeId === convo.id;
              return (
                <button
                  key={convo.id}
                  onClick={() => setActiveId(convo.id)}
                  className={`w-full text-left px-3.5 py-3 border-b border-gray-50 flex items-start gap-2.5 transition-all cursor-pointer ${isActive ? 'bg-secondary/5 border-l-2 border-l-secondary' : 'hover:bg-gray-50 border-l-2 border-l-transparent'}`}
                >
                  <div className="relative shrink-0">
                    <img src={convo.contact.avatar} alt={convo.contact.name} className="w-8.5 h-8.5 rounded-full" />
                    {convo.contact.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className={`text-xs font-bold truncate ${isActive ? 'text-secondary' : 'text-brand-dark'}`}>{convo.contact.name}</p>
                      <span className="text-[10px] text-gray-400 font-semibold shrink-0 ml-1">{last?.ts}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 truncate mb-1">{last?.text}</p>
                    <StatusBadge convo={convo} />
                  </div>
                  {convo.unread > 0 && (
                    <span className="w-4 h-4 bg-secondary text-white rounded-full flex items-center justify-center text-[9px] font-extrabold shrink-0 mt-1">{convo.unread}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ══ Col 2: Chat ══ */}
        {activeConvo ? (
          <div className="flex-1 flex flex-col min-w-0 bg-white">
            {/* Chat header */}
            <div className="px-4.5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0 shadow-sm z-10">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img src={activeConvo.contact.avatar} alt={activeConvo.contact.name} className="w-8.5 h-8.5 rounded-full" />
                  {activeConvo.contact.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />}
                </div>
                <div>
                  <p className="text-sm font-extrabold text-brand-dark leading-tight">{activeConvo.contact.name}</p>
                  <p className="text-xs text-gray-400 font-semibold mt-0.5">
                    {activeConvo.contact.online ? '🟢 Online' : 'Offline'} · {activeConvo.contact.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPanel(p => !p)}
                  className={`p-2 rounded-lg border transition-all cursor-pointer ${showPanel ? 'border-brand-dark bg-brand-dark text-white' : 'border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                  title="Toggle Details Hub"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gray-50/20">
              {/* Grouped messages */}
              {(() => {
                const groups = {};
                activeConvo.messages.forEach(m => { if (!groups[m.date]) groups[m.date] = []; groups[m.date].push(m); });
                return Object.entries(groups).map(([date, msgs]) => (
                  <div key={date} className="space-y-3">
                    <div className="flex items-center gap-2.5 my-4">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{date}</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>
                    {msgs.map(msg => {
                      if (msg.from === 'system') {
                        return (
                          <div key={msg.id} className="flex justify-center my-3">
                            <span className="text-[11px] font-semibold text-gray-600 bg-gray-100/90 border border-gray-200 px-3.5 py-1.5 rounded-2xl text-center max-w-[85%] leading-relaxed shadow-sm">
                              {msg.text}
                              <span className="text-[9px] text-gray-400 ml-3 font-normal">{msg.ts}</span>
                            </span>
                          </div>
                        );
                      }

                      const isMe = msg.from === 'me';
                      return (
                        <div key={msg.id} className={`flex gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                          <img
                            src={isMe ? ME.avatar : activeConvo.contact.avatar}
                            alt="" className="w-7.5 h-7.5 rounded-full shrink-0 mt-0.5 object-cover"
                          />
                          <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div className={`px-3.5 py-2 rounded-2xl text-xs font-semibold leading-relaxed ${isMe ? 'bg-brand-dark text-white rounded-tr-sm' : 'bg-gray-100 text-brand-dark rounded-tl-sm'}`}>
                              {msg.text}
                            </div>
                            <span className="text-[9px] text-gray-400 font-semibold mt-1 px-1">{msg.ts}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ));
              })()}
              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="px-4 py-3 border-t border-gray-100 bg-white shrink-0">
              <div className="flex items-end gap-2.5 bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-2.5 focus-within:border-secondary/40 focus-within:ring-1 focus-within:ring-secondary/20 transition-all">
                <button className="text-gray-400 hover:text-brand-dark transition-colors cursor-pointer shrink-0 mb-1">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </button>
                <textarea
                  value={msgInput} onChange={e => setMsgInput(e.target.value)} onKeyDown={handleKey}
                  placeholder="Type a message… (Enter to send)"
                  rows={1}
                  className="flex-1 bg-transparent text-xs font-semibold text-brand-dark placeholder-gray-400 focus:outline-none resize-none leading-relaxed max-h-28 overflow-y-auto"
                  style={{ minHeight: '20px' }}
                />
                <button onClick={sendMessage} disabled={!msgInput.trim()} className="w-8 h-8 bg-brand-dark text-white rounded-xl flex items-center justify-center hover:bg-bts-gold hover:text-brand-dark transition-all cursor-pointer disabled:opacity-40 shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </button>
              </div>
              <p className="text-[9px] text-gray-300 font-semibold mt-1.5 pl-1">Enter to send · Shift+Enter for new line</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8 bg-white">
            <svg className="w-12 h-12 text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <p className="text-sm font-extrabold text-gray-300 mb-1">Select a conversation</p>
            <p className="text-xs text-gray-300">Pick one from the left sidebar to start chatting.</p>
          </div>
        )}

        {/* ══ Col 3: Right details & actions hub ══ */}
        {showPanel && activeConvo && (
          <div className="w-72 shrink-0 border-l border-gray-100 flex flex-col overflow-y-auto bg-gray-50/20">
            {/* Contact profile block */}
            <div className="p-4 border-b border-gray-100 text-center bg-white shadow-sm">
              <div className="relative inline-block mb-2.5">
                <img src={activeConvo.contact.avatar} alt={activeConvo.contact.name} className="w-12 h-12 rounded-2xl border border-gray-150" />
                {activeConvo.contact.online && <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />}
              </div>
              <p className="text-xs font-extrabold text-brand-dark leading-tight">{activeConvo.contact.name}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{activeConvo.contact.role}</p>
            </div>

            {/* Case file & actions panel */}
            <RightPanel
              convo={activeConvo}
              onAccept={() => handleAccept(activeConvo.id)}
              onDecline={() => handleDecline(activeConvo.id)}
              onWithdraw={() => handleWithdraw(activeConvo.id)}
              // Counter offer states
              showCounterForm={showCounterForm}
              setShowCounterForm={setShowCounterForm}
              counterBid={counterBid}
              setCounterBid={setCounterBid}
              counterTimeline={counterTimeline}
              setCounterTimeline={setCounterTimeline}
              counterDate={counterDate}
              setCounterDate={setCounterDate}
              counterDuration={counterDuration}
              setCounterDuration={setCounterDuration}
              counterMsg={counterMsg}
              setCounterMsg={setCounterMsg}
              onCounterSubmit={() => handleCounterSubmit(activeConvo.id)}
              // Ask information states
              showInfoForm={showInfoForm}
              setShowInfoForm={setShowInfoForm}
              infoMsg={infoMsg}
              setInfoMsg={setInfoMsg}
              onInfoSubmit={() => handleAskInfoSubmit(activeConvo.id)}
              // Dispute evidence states
              showEvidenceForm={showEvidenceForm}
              setShowEvidenceForm={setShowEvidenceForm}
              evidenceFile={evidenceFile}
              setEvidenceFile={setEvidenceFile}
              evidenceDesc={evidenceDesc}
              setEvidenceDesc={setEvidenceDesc}
              onEvidenceSubmit={() => handleEvidenceSubmit(activeConvo.id)}
            />

            {/* Shared files section */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Shared Documents</p>
              {activeConvo.sharedFiles?.length === 0 ? (
                <p className="text-xs text-gray-300 font-semibold italic">No documents shared.</p>
              ) : activeConvo.sharedFiles?.map(f => (
                <div key={f.name} className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-sm">{f.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-brand-dark truncate">{f.name}</p>
                    <p className="text-[10px] text-gray-400">{f.size}</p>
                  </div>
                  <button className="text-gray-400 hover:text-brand-dark cursor-pointer p-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ══ Compose Modal ══ */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowCompose(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn" onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div className="bg-brand-dark text-white p-5 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
              <div className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-white/5" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-0.5">
                    {composeStep === 1 ? 'New Conversation' : COMPOSE_TYPES.find(t => t.id === composeType)?.label}
                  </p>
                  <h3 className="text-sm font-extrabold">{composeStep === 1 ? 'What would you like to do?' : 'Fill in the details'}</h3>
                </div>
                <button onClick={() => setShowCompose(false)} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                </button>
              </div>
            </div>

            {/* Step 1: type picker */}
            {composeStep === 1 && (
              <div className="p-5 space-y-2.5">
                {COMPOSE_TYPES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setComposeType(t.id); setComposeStep(2); }}
                    className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all cursor-pointer text-left group hover:shadow-md ${t.color}`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-white/60`}>
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d={t.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-extrabold">{t.label}</p>
                      <p className="text-[10px] font-semibold opacity-70 mt-0.5">{t.desc}</p>
                    </div>
                    <svg className="w-3.5 h-3.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: compose form */}
            {composeStep === 2 && (
              <div className="p-5 space-y-3.5 max-h-[65vh] overflow-y-auto">
                <button onClick={() => setComposeStep(1)} className="flex items-center gap-1 text-[11px] font-extrabold text-gray-400 hover:text-brand-dark transition-colors cursor-pointer">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                  Back
                </button>

                <ComposeForm
                  type={composeType}
                  form={form}
                  onChange={(k, v) => setForm(f => ({ ...f, [k]: v }))}
                />

                <div className="flex gap-2.5 pt-1">
                  <button
                    onClick={handleComposeSend}
                    disabled={!form.message.trim()}
                    className="flex-1 py-2.5 bg-brand-dark text-white rounded-xl font-extrabold text-xs hover:bg-bts-gold hover:text-brand-dark transition-all cursor-pointer disabled:opacity-40"
                  >Send</button>
                  <button onClick={() => setShowCompose(false)} className="px-4.5 py-2.5 bg-gray-100 text-gray-500 rounded-xl font-extrabold text-xs hover:bg-gray-200 transition-all cursor-pointer">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ convo }) {
  const s = convo.requestMeta?.status;
  const ps = convo.proposalMeta?.status;
  const ds = convo.disputeMeta?.status;
  if (s) return <span className={`mt-1 inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full ${REQ_STATUS[s]?.c}`}>{REQ_STATUS[s]?.l}</span>;
  if (ps) return <span className={`mt-1 inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full ${PROP_STATUS[ps]?.c}`}>{PROP_STATUS[ps]?.l}</span>;
  if (ds) return <span className={`mt-1 inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full ${DISP_STATUS[ds]?.c}`}>{DISP_STATUS[ds]?.l}</span>;
  return null;
}

function RightPanel({
  convo,
  onAccept,
  onDecline,
  onWithdraw,
  // Counter state
  showCounterForm,
  setShowCounterForm,
  counterBid,
  setCounterBid,
  counterTimeline,
  setCounterTimeline,
  counterDate,
  setCounterDate,
  counterDuration,
  setCounterDuration,
  counterMsg,
  setCounterMsg,
  onCounterSubmit,
  // Info state
  showInfoForm,
  setShowInfoForm,
  infoMsg,
  setInfoMsg,
  onInfoSubmit,
  // Dispute evidence state
  showEvidenceForm,
  setShowEvidenceForm,
  evidenceFile,
  setEvidenceFile,
  evidenceDesc,
  setEvidenceDesc,
  onEvidenceSubmit
}) {
  if (!convo.requestMeta && !convo.proposalMeta && !convo.disputeMeta) {
    return (
      <div className="p-4 border-b border-gray-100 bg-white space-y-3">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Conversation</p>
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-gray-500">Total Messages</span>
          <span className="text-brand-dark font-extrabold">{convo.messages.length}</span>
        </div>
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-gray-500">User Status</span>
          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${convo.contact.online ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
            {convo.contact.online ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    );
  }

  const DetailRow = ({ label, value }) => (
    <div className="flex justify-between items-start gap-2 text-xs">
      <span className="font-bold text-gray-500 shrink-0">{label}</span>
      <span className="font-extrabold text-brand-dark text-right leading-snug">{value}</span>
    </div>
  );

  // 1. REQUESTS CASE PANEL
  if (convo.requestMeta) {
    const { type, typeLabel, ref, platform, detail, price, status, direction, history } = convo.requestMeta;
    const isIncoming = direction === 'incoming';
    const isNegotiable = status === 'pending' || status === 'counter_proposed' || status === 'info_requested';

    return (
      <div className="flex flex-col bg-white border-b border-gray-100">
        <div className="p-4 space-y-2.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
              {typeLabel}
            </span>
            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${REQ_STATUS[status]?.c}`}>
              {REQ_STATUS[status]?.l}
            </span>
          </div>
          
          <p className="text-xs font-extrabold text-brand-dark leading-snug">{ref}</p>
          <div className="h-px bg-gray-100 my-1.5" />
          
          <DetailRow label="Platform" value={platform} />
          <DetailRow label="Detail" value={detail} />
          <DetailRow label="Budget/Price" value={price} />
          <DetailRow label="Sender" value={isIncoming ? convo.contact.name : 'You (John Doe)'} />
        </div>

        {isNegotiable && !showCounterForm && !showInfoForm && (
          <div className="px-4 pb-4 flex flex-col gap-1.5">
            {isIncoming ? (
              <>
                <button onClick={onAccept} className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-[11px] text-white font-bold rounded-xl transition-all cursor-pointer shadow-sm">
                  Accept Request
                </button>
                <div className="grid grid-cols-2 gap-1.5">
                  <button onClick={() => setShowCounterForm(true)} className="py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] text-white font-bold rounded-xl transition-all cursor-pointer border border-indigo-150">
                    Counter
                  </button>
                  <button onClick={() => setShowInfoForm(true)} className="py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] text-white font-bold rounded-xl transition-all cursor-pointer border border-blue-150">
                    Ask Details
                  </button>
                </div>
                <button onClick={onDecline} className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-650 text-[11px] text-white font-bold rounded-xl transition-all cursor-pointer border border-red-150 text-center">
                  Decline
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setShowCounterForm(true)} className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] text-white font-bold rounded-xl transition-all cursor-pointer border border-indigo-150 text-center">
                  Adjust Offer
                </button>
                <button onClick={onWithdraw} className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] text-white font-bold rounded-xl transition-all cursor-pointer border border-red-150 text-center">
                  Withdraw Application
                </button>
              </>
            )}
          </div>
        )}

        {showCounterForm && (
          <div className="p-4 bg-indigo-50/30 border-t border-b border-indigo-100 space-y-3">
            <h4 className="text-[11px] font-extrabold text-indigo-700 uppercase tracking-wider">Propose Counter Offer</h4>
            <div className="space-y-2">
              <div>
                <label className="text-[9px] font-bold uppercase text-gray-400 tracking-wider block">Target Bid (BTS)</label>
                <input value={counterBid} onChange={e => setCounterBid(e.target.value)} placeholder="e.g. 300 BTS" className="w-full mt-0.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase text-gray-400 tracking-wider block">Session Date</label>
                <input type="date" value={counterDate} onChange={e => setCounterDate(e.target.value)} className="w-full mt-0.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none" />
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase text-gray-400 tracking-wider block">Note Message</label>
                <textarea value={counterMsg} onChange={e => setCounterMsg(e.target.value)} placeholder="Adjust details..." rows={2} className="w-full mt-0.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none resize-none" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={onCounterSubmit} className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-[11px] text-white font-bold rounded-lg transition-all cursor-pointer">
                Submit Counter
              </button>
              <button onClick={() => setShowCounterForm(false)} className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-500 text-[11px] font-bold rounded-lg border border-gray-200 transition-all cursor-pointer">
                Back
              </button>
            </div>
          </div>
        )}

        {showInfoForm && (
          <div className="p-4 bg-blue-50/30 border-t border-b border-blue-100 space-y-3">
            <h4 className="text-[11px] font-extrabold text-blue-700 uppercase tracking-wider">Request Details</h4>
            <div>
              <label className="text-[9px] font-bold uppercase text-gray-400 tracking-wider block">Your Question</label>
              <textarea value={infoMsg} onChange={e => setInfoMsg(e.target.value)} placeholder="What details do you need?" rows={2} className="w-full mt-0.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none resize-none" />
            </div>
            <div className="flex gap-2">
              <button onClick={onInfoSubmit} disabled={!infoMsg.trim()} className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-[11px] text-white font-bold rounded-lg transition-all cursor-pointer disabled:opacity-45">
                Send Request
              </button>
              <button onClick={() => setShowInfoForm(false)} className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-500 text-[11px] font-bold rounded-lg border border-gray-200 transition-all cursor-pointer">
                Back
              </button>
            </div>
          </div>
        )}

        {history && history.length > 0 && (
          <div className="p-4 bg-gray-50/50 border-t border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Case History Log</p>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div key={i} className="flex flex-col text-[11px] leading-normal">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-extrabold text-brand-dark">{h.action}</span>
                    <span className="text-gray-400 text-[9px]">{h.date}</span>
                  </div>
                  <span className="text-gray-500 font-semibold">{h.actor} · <span className="italic text-gray-600">{h.details}</span></span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. PROPOSALS CASE PANEL
  if (convo.proposalMeta) {
    const { direction, typeLabel, mission, platform, bid, timeline, freelancerRating, status, history } = convo.proposalMeta;
    const isIncoming = direction === 'incoming';
    const isNegotiable = status === 'pending' || status === 'counter_proposed' || status === 'info_requested';

    return (
      <div className="flex flex-col bg-white border-b border-gray-100">
        <div className="p-4 space-y-2.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
              {typeLabel}
            </span>
            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${PROP_STATUS[status]?.c}`}>
              {PROP_STATUS[status]?.l}
            </span>
          </div>

          <p className="text-xs font-extrabold text-brand-dark leading-snug">{mission}</p>
          <div className="h-px bg-gray-100 my-1.5" />

          <DetailRow label="Platform" value={platform} />
          <DetailRow label="Proposed Bid" value={bid} />
          <DetailRow label="Delivery Time" value={timeline} />
          {freelancerRating !== '—' && <DetailRow label="Rating" value={`⭐ ${freelancerRating}`} />}
          <DetailRow label="Owner" value={isIncoming ? 'You (Client)' : convo.contact.name} />
        </div>

        {isNegotiable && !showCounterForm && !showInfoForm && (
          <div className="px-4 pb-4 flex flex-col gap-1.5">
            {isIncoming ? (
              <>
                <button onClick={onAccept} className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-[11px] text-white font-bold rounded-xl transition-all cursor-pointer shadow-sm">
                  Hire Freelancer
                </button>
                <div className="grid grid-cols-2 gap-1.5">
                  <button onClick={() => setShowCounterForm(true)} className="py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] text-white font-bold rounded-xl transition-all cursor-pointer border border-indigo-150">
                    Counter Bid
                  </button>
                  <button onClick={() => setShowInfoForm(true)} className="py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] text-white font-bold rounded-xl transition-all cursor-pointer border border-blue-150">
                    Ask Details
                  </button>
                </div>
                <button onClick={onDecline} className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] text-white font-bold rounded-xl transition-all cursor-pointer border border-red-150 text-center">
                  Reject Proposal
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setShowCounterForm(true)} className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] text-white font-bold rounded-xl transition-all cursor-pointer border border-indigo-150 text-center">
                  Modify Proposal Bid
                </button>
                <button onClick={onWithdraw} className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-650 text-[11px] text-white font-bold rounded-xl transition-all cursor-pointer border border-red-150 text-center">
                  Withdraw Proposal
                </button>
              </>
            )}
          </div>
        )}

        {showCounterForm && (
          <div className="p-4 bg-indigo-50/30 border-t border-b border-indigo-100 space-y-3">
            <h4 className="text-[11px] font-extrabold text-indigo-700 uppercase tracking-wider">Propose Counter Bid</h4>
            <div className="space-y-2">
              <div>
                <label className="text-[9px] font-bold uppercase text-gray-400 tracking-wider block">Counter Bid (BTS)</label>
                <input value={counterBid} onChange={e => setCounterBid(e.target.value)} placeholder="e.g. 1,400 BTS" className="w-full mt-0.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none" />
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase text-gray-400 tracking-wider block">Delivery Timeline</label>
                <input value={counterTimeline} onChange={e => setCounterTimeline(e.target.value)} placeholder="e.g. 12 days" className="w-full mt-0.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none" />
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase text-gray-400 tracking-wider block">Message note</label>
                <textarea value={counterMsg} onChange={e => setCounterMsg(e.target.value)} placeholder="Adjust details..." rows={2} className="w-full mt-0.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none resize-none" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={onCounterSubmit} className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-[11px] text-white font-bold rounded-lg transition-all cursor-pointer">
                Submit Counter
              </button>
              <button onClick={() => setShowCounterForm(false)} className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-500 text-[11px] font-bold rounded-lg border border-gray-200 transition-all cursor-pointer">
                Back
              </button>
            </div>
          </div>
        )}

        {showInfoForm && (
          <div className="p-4 bg-blue-50/30 border-t border-b border-blue-100 space-y-3">
            <h4 className="text-[11px] font-extrabold text-blue-700 uppercase tracking-wider">Ask Freelancer Details</h4>
            <div>
              <label className="text-[9px] font-bold uppercase text-gray-400 tracking-wider block">Message</label>
              <textarea value={infoMsg} onChange={e => setInfoMsg(e.target.value)} placeholder="What portfolio details are missing?" rows={2} className="w-full mt-0.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none resize-none" />
            </div>
            <div className="flex gap-2">
              <button onClick={onInfoSubmit} disabled={!infoMsg.trim()} className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-[11px] text-white font-bold rounded-lg transition-all cursor-pointer disabled:opacity-45">
                Send Request
              </button>
              <button onClick={() => setShowInfoForm(false)} className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-500 text-[11px] font-bold rounded-lg border border-gray-200 transition-all cursor-pointer">
                Back
              </button>
            </div>
          </div>
        )}

        {history && history.length > 0 && (
          <div className="p-4 bg-gray-50/50 border-t border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Proposal History Log</p>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div key={i} className="flex flex-col text-[11px] leading-normal">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-extrabold text-brand-dark">{h.action}</span>
                    <span className="text-gray-400 text-[9px]">{h.date}</span>
                  </div>
                  <span className="text-gray-500 font-semibold">{h.actor} · <span className="italic text-gray-600">{h.details}</span></span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. DISPUTES CASE PANEL
  if (convo.disputeMeta) {
    const { id, typeLabel, platform, mission, parties, amount, status, priority, opened, arbitrator, myRole, resolution } = convo.disputeMeta;
    const isPendingEvidence = status === 'open' || status === 'evidence_required';

    return (
      <div className="flex flex-col bg-white border-b border-gray-100">
        <div className="p-4 space-y-2.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
              ⚖️ {typeLabel}
            </span>
            <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full ${DISP_STATUS[status]?.c}`}>
              {DISP_STATUS[status]?.l}
            </span>
          </div>

          <p className="text-xs font-extrabold text-brand-dark leading-snug">{id} — {mission}</p>
          <div className="h-px bg-gray-100 my-1.5" />

          <DetailRow label="Escrow Sum" value={amount} />
          <DetailRow label="Platform" value={platform} />
          <DetailRow label="Opened" value={opened} />
          <DetailRow label="Assigned Panel" value={arbitrator} />
          <DetailRow label="Your Role" value={myRole} />
          <div className="flex justify-between items-center text-xs font-semibold pt-1">
            <span className="text-gray-500 font-bold">Priority</span>
            <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full capitalize ${PRIORITY[priority]}`}>
              {priority}
            </span>
          </div>

          {resolution && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-[11px] text-emerald-800 leading-relaxed font-semibold mt-2">
              <strong>Panel Ruling:</strong> {resolution}
            </div>
          )}
        </div>

        {isPendingEvidence && !showEvidenceForm && (
          <div className="px-4 pb-4">
            <button onClick={() => setShowEvidenceForm(true)} className="w-full py-2 bg-brand-dark hover:bg-bts-gold hover:text-brand-dark text-[11px] text-white font-bold rounded-xl transition-all cursor-pointer shadow-sm">
              Upload Case Evidence
            </button>
          </div>
        )}

        {showEvidenceForm && (
          <div className="p-4 bg-red-50/20 border-t border-b border-red-100 space-y-3">
            <h4 className="text-[11px] font-extrabold text-red-750 uppercase tracking-wider">Provide Evidence</h4>
            <div className="space-y-2">
              <div>
                <label className="text-[9px] font-bold uppercase text-gray-400 tracking-wider block">Evidence File Title</label>
                <input value={evidenceFile} onChange={e => setEvidenceFile(e.target.value)} placeholder="e.g. proof_of_delivery.zip" className="w-full mt-0.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none" />
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase text-gray-400 tracking-wider block">Description / Note</label>
                <textarea value={evidenceDesc} onChange={e => setEvidenceDesc(e.target.value)} placeholder="State the proof details..." rows={3} className="w-full mt-0.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none resize-none" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={onEvidenceSubmit} disabled={!evidenceFile.trim()} className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-[11px] text-white font-bold rounded-lg transition-all cursor-pointer disabled:opacity-45">
                Submit Proof
              </button>
              <button onClick={() => setShowEvidenceForm(false)} className="px-3.5 py-1.5 bg-white hover:bg-gray-100 text-gray-500 text-[11px] font-bold rounded-lg border border-gray-200 transition-all cursor-pointer">
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

function ComposeForm({ type, form, onChange }) {
  const F = ({ label, children, required }) => (
    <div>
      <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
  const input = (k, placeholder, opts = {}) => (
    <input value={form[k]} onChange={e => onChange(k, e.target.value)} placeholder={placeholder}
      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-secondary/20"
      {...opts} />
  );
  const textarea = (
    <textarea value={form.message} onChange={e => onChange('message', e.target.value)}
      rows={3} placeholder="Write your message…"
      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-secondary/20 resize-none"
    />
  );

  if (type === 'direct') return (
    <>
      <F label="To" required>{input('to', 'Member name or @handle')}</F>
      <F label="Message" required>{textarea}</F>
    </>
  );

  if (type === 'session_request') return (
    <>
      <F label="Mentor Name" required>{input('to', 'e.g. Dr. Robert Lang')}</F>
      <F label="Session Topic">{input('subject', 'e.g. ZK-Rollup circuit optimization')}</F>
      <div className="grid grid-cols-2 gap-3">
        <F label="Preferred Date"><input type="date" value={form.sessionDate} onChange={e => onChange('sessionDate', e.target.value)} className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none" /></F>
        <F label="Duration">
          <select value={form.sessionDuration} onChange={e => onChange('sessionDuration', e.target.value)} className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none">
            {['30min', '1h', '1.5h', '2h'].map(d => <option key={d}>{d}</option>)}
          </select>
        </F>
      </div>
      <F label="Session Budget (BTS)">{input('bid', 'e.g. 150 BTS')}</F>
      <F label="Message to Mentor" required>{textarea}</F>
    </>
  );

  if (type === 'mentorship_apply') return (
    <>
      <F label="Mentor Name" required>{input('to', 'e.g. Sarah Jenkins')}</F>
      <F label="Program / Track">{input('subject', 'e.g. 12-Week Web3 Roadmap')}</F>
      <F label="Program Fee (BTS)">{input('bid', 'e.g. 500 BTS')}</F>
      <F label="Application Message" required>{textarea}</F>
    </>
  );

  if (type === 'freelance_proposal') return (
    <>
      <F label="Client / Mission Owner" required>{input('to', 'e.g. DeFi Nexus')}</F>
      <F label="Mission Name">{input('subject', 'e.g. Smart Contract Security Audit')}</F>
      <div className="grid grid-cols-2 gap-3">
        <F label="Your Bid (BTS)">{input('bid', 'e.g. 1,200 BTS')}</F>
        <F label="Timeline">{input('timeline', 'e.g. 14 days')}</F>
      </div>
      <F label="Proposal Message" required>{textarea}</F>
    </>
  );

  if (type === 'open_dispute') return (
    <>
      <F label="Dispute Type">
        <div className="grid grid-cols-3 gap-2">
          {['payment', 'milestone', 'conduct'].map(dt => (
            <button key={dt} type="button" onClick={() => onChange('disputeType', dt)}
              className={`py-1.5 px-2 rounded-xl border text-[11px] font-extrabold capitalize transition-all cursor-pointer ${form.disputeType === dt ? 'border-brand-dark bg-brand-dark/5 text-brand-dark' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
              {dt}
            </button>
          ))}
        </div>
      </F>
      <F label="Opposing Party" required>{input('to', 'e.g. DeFi Nexus (client)')}</F>
      <F label="Related Mission">{input('subject', 'e.g. Smart Contract Security Audit')}</F>
      <F label="Amount in Dispute (BTS)">{input('bid', 'e.g. 600 BTS')}</F>
      <F label="Priority">
        <div className="grid grid-cols-3 gap-2">
          {['low', 'medium', 'high'].map(p => (
            <button key={p} type="button" onClick={() => onChange('priority', p)}
              className={`py-1.5 px-2 rounded-xl border text-[11px] font-extrabold capitalize transition-all cursor-pointer ${form.priority === p ? 'border-brand-dark bg-brand-dark/5 text-brand-dark' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
              {p}
            </button>
          ))}
        </div>
      </F>
      <F label="Case Description" required>{textarea}</F>
    </>
  );

  return null;
}

// ─── Compose types ────────────────────────────────────────────────────────────
const COMPOSE_TYPES = [
  {
    id: 'direct', label: 'Direct Message', desc: 'Chat with any Bitstacks member',
    icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
    color: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  {
    id: 'session_request', label: 'Request a Private Session', desc: 'Book 1-on-1 time with a mentor from D-Platform',
    icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    category: 'requests',
  },
  {
    id: 'mentorship_apply', label: 'Apply for Mentorship', desc: 'Apply to a mentor\'s program from Expert Mentors',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    category: 'requests',
  },
  {
    id: 'freelance_proposal', label: 'Send a Freelance Proposal', desc: 'Bid on a D-Lancer mission you want to take',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    category: 'proposals',
  },
  {
    id: 'open_dispute', label: 'Open a Dispute', desc: 'File a payment, milestone or conduct dispute',
    icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
    color: 'text-red-600 bg-red-50 border-red-200',
    category: 'disputes',
  },
];
