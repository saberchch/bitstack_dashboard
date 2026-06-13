import { useState, useEffect, useCallback, useRef } from 'react';
import Topbar from '../components/Topbar';
import CreateMissionModal from '../components/CreateMissionModal';
import MissionWorkspace from '../components/MissionWorkspace';

// Strip stale milestone data from missions that haven't locked escrow yet
function normalizeMission(m) {
  if (m.escrowLocked) return m;
  return {
    ...m,
    milestones: [],
    milestoneAmounts: [],
    milestoneStatus: [],
    milestoneReleased: [],
    escrowReleasedAmount: 0,
    escrowLocked: false,
  };
}

/** Always include demo freelancer mission (refreshed from seed). */
function mergeSeedMissions(saved) {
  const list = Array.isArray(saved) ? saved.map(normalizeMission) : [];
  SEED_MISSIONS.forEach(seed => {
    const idx = list.findIndex(m => m.id === seed.id);
    if (idx === -1) {
      list.push(normalizeMission(seed));
    } else if (seed.id === 'cross-chain-bridge-api') {
      list[idx] = normalizeMission(seed);
    }
  });
  return list;
}

// ─── Seed data ───────────────────────────────────────────────────────────────
const SEED_MISSIONS = [
  {
    id: 'smart-contract-audit',
    title: 'Smart Contract Security Audit',
    description: 'Full security audit of a DeFi lending protocol built on Solidity. Identify reentrancy vulnerabilities, front-running risks, and gas optimization issues.',
    tags: ['Web3', 'Security', 'Solidity'],
    reward: 1200, deadline: 14, teamSize: 2, appliedCount: 1,
    difficulty: 'Expert', client: 'DeFi Nexus', postedDays: 2,
    clientAvatar: 'https://ui-avatars.com/api/?name=DeFi+Nexus&background=0b1121&color=d4a017&size=40&font-size=0.4',
    status: 'Open',
    milestones: [],
    proposals: [
      { id: 'p1', name: 'Alex R.', role: 'Solidity Auditor', bid: 1100, rating: 4.8, status: 'pending' },
      { id: 'p2', name: 'Maria K.', role: 'Security Researcher', bid: 1200, rating: 4.9, status: 'pending' },
    ],
    submissions: [],
    reviews: [],
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop',
  },
  {
    id: 'ai-oracle-integration',
    title: 'AI Oracle Integration for NFT Pricing',
    description: 'Build a Chainlink-compatible AI oracle that dynamically prices NFT assets using ML models trained on historical sales data.',
    tags: ['AI/ML', 'Web3', 'Python'],
    reward: 2500, deadline: 21, teamSize: 3, appliedCount: 2,
    difficulty: 'Advanced', client: 'MetaArts DAO', postedDays: 5,
    clientAvatar: 'https://ui-avatars.com/api/?name=MetaArts+DAO&background=7c3aed&color=ffffff&size=40&font-size=0.4',
    status: 'In Progress',
    milestones: ['Model training', 'Chainlink adapter', 'On-chain deployment', 'Testing & QA'],
    milestoneAmounts: [625, 625, 625, 625],
    milestoneDays: [7, 7, 5, 5],
    milestoneStatus: ['in_review', 'pending', 'pending', 'pending'],
    milestoneReleased: [false, false, false, false],
    escrowLocked: true,
    escrowReleasedAmount: 0,
    proposals: [
      { id: 'p3', name: 'Jin L.', role: 'ML Engineer', bid: 2400, rating: 4.7, status: 'accepted' },
      { id: 'p4', name: 'Samuel A.', role: 'Web3 Dev', bid: 2500, rating: 5.0, status: 'pending' },
    ],
    activeContract: { freelancerName: 'Jin L.', freelancerRole: 'ML Engineer', bid: 2400, startedAt: '2026-06-01' },
    submissions: [{ id: 's1', title: 'ML Model v1', submittedBy: 'Jin L.', date: 'Jun 1', status: 'pending' }],
    reviews: [{ author: 'MetaArts DAO', text: 'Strong start, looking forward to the next milestone.', rating: 4 }],
    thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=250&fit=crop',
  },
  {
    id: 'rust-blockchain-node',
    title: 'Custom Rust Blockchain Node',
    description: 'Develop a lightweight, high-performance layer-1 blockchain node in Rust with PBFT consensus, P2P networking, and a JSON-RPC API.',
    tags: ['Rust', 'Blockchain', 'Networking'],
    reward: 4000, deadline: 45, teamSize: 4, appliedCount: 3,
    difficulty: 'Expert', client: 'ChainForge Labs', postedDays: 1,
    clientAvatar: 'https://ui-avatars.com/api/?name=ChainForge&background=1d4ed8&color=ffffff&size=40&font-size=0.4',
    status: 'Open',
    milestones: [],
    proposals: [{ id: 'p5', name: 'Tobias W.', role: 'Rust Systems Eng.', bid: 3800, rating: 4.9, status: 'pending' }],
    submissions: [], reviews: [],
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop',
  },
  {
    id: 'defi-dashboard-ui',
    title: 'DeFi Portfolio Dashboard UI',
    description: 'Design and build a Web3 portfolio tracker with real-time price feeds, wallet connection (RainbowKit), and interactive chart visualizations.',
    tags: ['UI/UX', 'Web3', 'React'],
    reward: 900, deadline: 10, teamSize: 2, appliedCount: 1,
    difficulty: 'Intermediate', client: 'BlockWave Inc.', postedDays: 3,
    clientAvatar: 'https://ui-avatars.com/api/?name=BlockWave&background=d4a017&color=0b1121&size=40&font-size=0.4',
    status: 'In Review',
    milestones: ['Design mockups', 'Component build', 'Wallet integration'],
    milestoneAmounts: [293, 293, 294],
    milestoneStatus: ['completed', 'completed', 'in_review'],
    milestoneReleased: [true, true, false],
    escrowLocked: true,
    escrowReleasedAmount: 586,
    proposals: [{ id: 'p6', name: 'Chloe M.', role: 'UI/UX Designer', bid: 880, rating: 4.8, status: 'accepted' }],
    activeContract: { freelancerName: 'Chloe M.', freelancerRole: 'UI/UX Designer', bid: 880, startedAt: '2026-05-20' },
    submissions: [{ id: 's2', title: 'Dashboard v1.0', submittedBy: 'Chloe M.', date: 'Jun 5', status: 'pending' }],
    reviews: [{ author: 'BlockWave Inc.', text: 'Clean design, minor revisions needed on mobile layout.', rating: 4 }],
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
  },
  {
    id: 'python-trading-bot',
    title: 'Automated DeFi Arbitrage Bot',
    description: 'Python-based arbitrage trading bot that monitors multiple DEXes (Uniswap, Curve, Balancer) and executes flash-loan strategies.',
    tags: ['Python', 'DeFi', 'Automation'],
    reward: 1800, deadline: 28, teamSize: 2, appliedCount: 0,
    difficulty: 'Advanced', client: 'AlphaYield', postedDays: 7,
    clientAvatar: 'https://ui-avatars.com/api/?name=AlphaYield&background=059669&color=ffffff&size=40&font-size=0.4',
    status: 'Open',
    milestones: [],
    proposals: [], submissions: [], reviews: [],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
  },
  {
    id: 'tokenomics-design',
    title: 'Tokenomics & Whitepaper Design',
    description: 'Comprehensive tokenomics for a new GameFi project including emission schedules, staking mechanics, governance model, and whitepaper.',
    tags: ['Strategy', 'GameFi', 'Economics'],
    reward: 750, deadline: 12, teamSize: 1, appliedCount: 0,
    difficulty: 'Intermediate', client: 'PixelRealm', postedDays: 4,
    clientAvatar: 'https://ui-avatars.com/api/?name=PixelRealm&background=db2777&color=ffffff&size=40&font-size=0.4',
    status: 'Open',
    milestones: [],
    proposals: [], submissions: [], reviews: [],
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=250&fit=crop',
  },
  {
    id: 'zk-proof-verifier',
    title: 'ZK-Proof Verifier Smart Contract',
    description: 'Implement an on-chain zero-knowledge proof verifier using the Groth16 scheme for a privacy-preserving voting protocol.',
    tags: ['Web3', 'Security', 'Solidity'],
    reward: 3200, deadline: 30, teamSize: 2, appliedCount: 1,
    difficulty: 'Expert', client: 'ZeroVault', postedDays: 0,
    clientAvatar: 'https://ui-avatars.com/api/?name=ZeroVault&background=312e81&color=a5b4fc&size=40&font-size=0.4',
    status: 'Open',
    milestones: [],
    proposals: [{ id: 'p7', name: 'Hamid R.', role: 'ZK Engineer', bid: 3000, rating: 5.0, status: 'pending' }],
    submissions: [], reviews: [],
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop',
  },
  {
    id: 'nft-marketplace-backend',
    title: 'NFT Marketplace REST API',
    description: 'High-performance Node.js + PostgreSQL backend for an NFT marketplace with lazy minting, auction support, and royalty enforcement.',
    tags: ['Web3', 'Python', 'Networking'],
    reward: 1500, deadline: 20, teamSize: 3, appliedCount: 3,
    difficulty: 'Advanced', client: 'ArtChain', postedDays: 14,
    clientAvatar: 'https://ui-avatars.com/api/?name=ArtChain&background=0d9488&color=ffffff&size=40&font-size=0.4',
    status: 'Completed',
    milestones: ['API design', 'Auth & minting', 'Auction engine', 'Royalty logic'],
    milestoneAmounts: [375, 375, 375, 375],
    milestoneStatus: ['completed', 'completed', 'completed', 'completed'],
    milestoneReleased: [true, true, true, true],
    escrowLocked: true,
    escrowReleasedAmount: 1500,
    proposals: [{ id: 'p8', name: 'Lena V.', role: 'Backend Engineer', bid: 1400, rating: 4.7, status: 'accepted' }],
    submissions: [{ id: 's3', title: 'API v2.0 Final', submittedBy: 'Lena V.', date: 'May 30', status: 'approved' }],
    reviews: [{ author: 'ArtChain', text: 'Excellent work, delivered ahead of schedule!', rating: 5 }],
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop',
  },
  {
    id: 'cross-chain-bridge-api',
    title: 'Cross-Chain Bridge API',
    description: 'Build a production REST + WebSocket API for a cross-chain asset bridge supporting EVM, Solana, and Cosmos. Milestone 3 focuses on the routing layer that selects optimal paths and quotes fees across chains.',
    tags: ['Web3', 'Rust', 'Networking'],
    reward: 2700, deadline: 35, teamSize: 1, appliedCount: 1,
    difficulty: 'Expert', client: 'BridgeLink Protocol', postedDays: 12,
    clientAvatar: 'https://ui-avatars.com/api/?name=BridgeLink&background=0b1121&color=d4a017&size=40&font-size=0.4',
    status: 'In Progress',
    milestones: [
      'Architecture & API specification',
      'Core bridge modules',
      'Cross-chain routing layer',
      'Audit prep & deployment docs',
    ],
    milestoneAmounts: [675, 675, 675, 675],
    milestoneDays: [7, 10, 14, 7],
    milestoneStatus: ['completed', 'completed', 'pending', 'pending'],
    milestoneReleased: [true, true, false, false],
    escrowLocked: true,
    escrowReleasedAmount: 1350,
    disputeActive: false,
    myProgress: 50,
    myMilestone: 'Cross-chain routing layer',
    proposals: [
      {
        id: 'p-you-bridge',
        name: 'You',
        role: 'Full-Stack Web3 Developer',
        bid: 2700,
        rating: 5.0,
        status: 'accepted',
        coverLetter: 'I have shipped two cross-chain routers on mainnet. Ready to deliver the routing layer next.',
        alignmentSession: { date: '2026-06-05', time: '14:00', notes: 'Scope and milestone splits agreed.' },
      },
    ],
    activeContract: {
      freelancerName: 'You',
      freelancerRole: 'Full-Stack Web3 Developer',
      bid: 2700,
      startedAt: '2026-05-28',
    },
    submissions: [
      {
        id: 'sub-bridge-m1',
        title: 'Bridge Architecture & OpenAPI Spec',
        link: 'https://github.com/example/bridge-spec',
        notes: 'Full OpenAPI 3.1 spec with sequence diagrams for deposit/withdraw flows.',
        submittedBy: 'You',
        date: 'Jun 2',
        status: 'approved',
        milestoneIndex: 0,
      },
      {
        id: 'sub-bridge-m2',
        title: 'Core Bridge Modules v1.2',
        link: 'https://github.com/example/bridge-core',
        notes: 'EVM + Solana lock/release modules with integration tests.',
        submittedBy: 'You',
        date: 'Jun 9',
        status: 'approved',
        milestoneIndex: 1,
      },
    ],
    messages: [
      { from: 'client', name: 'BridgeLink Protocol', text: 'Great work on modules 1 and 2. For milestone 3, prioritize fee quoting accuracy across Cosmos IBC routes.', time: '1d ago' },
      { from: 'you', name: 'You (Freelancer)', text: 'Understood — I will include IBC path simulation and expose /quote endpoints in the routing layer deliverable.', time: '1d ago' },
    ],
    reviews: [],
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop',
  },
];

// Seed my created missions (I'm the client)
const SEED_MY_POSTS = [
  {
    id: 'my-post-dao-governance',
    title: 'DAO Governance Dashboard',
    description: 'Build a real-time governance dashboard for our DAO, showing active proposals, voting power distribution, and historical vote outcomes.',
    tags: ['Web3', 'React', 'UI/UX'],
    reward: 1600, deadline: 18, teamSize: 3, appliedCount: 2,
    difficulty: 'Advanced', client: 'You', postedDays: 3,
    clientAvatar: 'https://ui-avatars.com/api/?name=You&background=d4a017&color=0b1121&size=40',
    status: 'Open',
    milestones: [],
    milestoneAmounts: [],
    milestoneStatus: [],
    milestoneReleased: [],
    escrowLocked: false,
    escrowReleasedAmount: 0,
    disputeActive: false,
    proposals: [
      { id: 'mp1', name: 'Rami T.', role: 'Full-Stack Dev', bid: 1500, rating: 4.6, status: 'pending' },
      { id: 'mp2', name: 'Selin K.', role: 'React Engineer', bid: 1600, rating: 4.8, status: 'pending' },
    ],
    submissions: [], reviews: [],
    isMyPost: true,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
  },
  {
    id: 'my-post-wallet-sdk',
    title: 'Multi-Chain Wallet SDK',
    description: 'Develop a TypeScript SDK that abstracts multi-chain wallet interactions, supporting EVM, Solana, and Cosmos chains with a unified API.',
    tags: ['Web3', 'Rust', 'Solidity'],
    reward: 3500, deadline: 40, teamSize: 2, appliedCount: 1,
    difficulty: 'Expert', client: 'You', postedDays: 8,
    clientAvatar: 'https://ui-avatars.com/api/?name=You&background=d4a017&color=0b1121&size=40',
    status: 'In Progress',
    milestones: ['EVM support', 'Solana adapter', 'Cosmos adapter', 'Documentation'],
    milestoneAmounts: [875, 875, 875, 875],
    milestoneDays: [10, 14, 14, 7],
    milestoneStatus: ['completed', 'pending', 'pending', 'pending'],
    milestoneReleased: [true, false, false, false],
    escrowLocked: true,
    escrowReleasedAmount: 875,
    disputeActive: false,
    proposals: [
      { id: 'mp3', name: 'Diego F.', role: 'SDK Engineer', bid: 3400, rating: 5.0, status: 'accepted' },
    ],
    activeContract: { freelancerName: 'Diego F.', freelancerRole: 'SDK Engineer', bid: 3400, startedAt: '2026-05-25' },
    submissions: [{ id: 'ms1', title: 'EVM Module v1', submittedBy: 'Diego F.', date: 'Jun 3', status: 'approved' }],
    reviews: [],
    isMyPost: true,
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop',
  },
];

// Seed my active work (I'm the freelancer, applied & working)
const SEED_MY_WORK = [
  {
    id: 'cross-chain-bridge-api',
    myProgress: 50,
    myMilestone: 'Cross-chain routing layer',
    myRole: 'Full-Stack Web3 Developer',
    myBid: 2700,
  },
];

// Seed archived missions (past work)
const SEED_ARCHIVE = [
  {
    id: 'nft-marketplace-backend',
    role: 'freelancer',
    earnedBts: 1400,
    completedDate: 'May 30, 2024',
    myRating: 5,
  },
  {
    id: 'my-closed-token-audit',
    role: 'creator',
    title: 'Token Contract Audit (Closed)',
    description: 'Audit of our ERC-20 token before mainnet launch. Completed successfully.',
    tags: ['Web3', 'Security'],
    reward: 800, teamSize: 1,
    status: 'Completed',
    clientAvatar: 'https://ui-avatars.com/api/?name=You&background=d4a017&color=0b1121&size=40',
    completedDate: 'Apr 15, 2024',
    spentBts: 800,
    freelancer: 'Omar S.',
    freelancerRating: 5,
    difficulty: 'Advanced',
  },
];

const PAGE_SIZE = 6;
const ALL_SKILLS = ['Web3', 'Security', 'Rust', 'AI/ML', 'UI/UX', 'Python', 'Solidity', 'React', 'DeFi', 'Strategy'];
const MY_POST_IDS = new Set(SEED_MY_POSTS.map(p => p.id));

// Unified minimal color palette — matching DLibrary design system
const DIFFICULTY_LABEL = {
  Intermediate: { label: 'Intermediate', cls: 'bg-brand-dark/80 text-white' },
  Advanced: { label: 'Advanced', cls: 'bg-brand-dark/80 text-white' },
  Expert: { label: 'Expert', cls: 'bg-brand-dark text-bts-gold' },
};
const STATUS_COLOR = {
  Open: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  'In Progress': 'text-brand-dark bg-yellow-50 border-yellow-200',
  'In Review': 'text-amber-700 bg-amber-50 border-amber-200',
  Completed: 'text-gray-500 bg-gray-100 border-gray-200',
};
// Simple neutral tag style — no per-tag color chaos
const tagClass = () => 'bg-gray-100 text-gray-600';

const MAIN_TABS = [
  { key: 'explore', label: 'Explore', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0' },
  { key: 'in-progress', label: 'In Progress', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { key: 'my-work', label: 'My Applications', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { key: 'my-posts', label: 'My Posts', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586' },
  { key: 'archive', label: 'Archive', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
];

const CATEGORIES = [
  { key: 'all', label: 'All Missions', emoji: '◈' },
  { key: 'AI/ML', label: 'AI & ML', emoji: '🤖' },
  { key: 'Security', label: 'Cybersecurity', emoji: '🛡️' },
  { key: 'UI/UX', label: 'Design & UX', emoji: '🎨' },
  { key: 'React', label: 'Frontend Dev', emoji: '⚛️' },
  { key: 'Python', label: 'Python / Data', emoji: '🐍' },
  { key: 'Rust', label: 'Systems / Rust', emoji: '⚙️' },
  { key: 'Strategy', label: 'Strategy & PM', emoji: '📊' },
  { key: 'Web3', label: 'Web3', emoji: '⛓️' },
];

const SORT_OPTIONS = [
  { key: 'newest', label: 'Newest First' },
  { key: 'reward-high', label: 'Highest Reward' },
  { key: 'most-applied', label: 'Most Applied' },
  { key: 'ending-soon', label: 'Ending Soon' },
];

const DURATION_OPTIONS = [
  { key: 'all', label: 'Any Duration' },
  { key: 'short', label: '< 1 week' },
  { key: 'medium', label: '1–4 weeks' },
  { key: 'long', label: '1–3 months' },
];

// ─── Main Component ──────────────────────────────────────────────────────────
export default function DLancer() {
  const [mainTab, setMainTab] = useState('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [inlineSearch, setInlineSearch] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showSkillFilter, setShowSkillFilter] = useState(false);
  const [showFullFilter, setShowFullFilter] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeMissionId, setActiveMissionId] = useState(null);
  const [activeMissionRole, setActiveMissionRole] = useState('freelancer');
  const [applyingId, setApplyingId] = useState(null);
  const [page, setPage] = useState(1);
  const filterRef = useRef(null);
  const filterDrawerRef = useRef(null);

  const [applications, setApplications] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('bts_lancer_applications') || '[]');
      if (!saved.includes('cross-chain-bridge-api')) {
        return [...saved, 'cross-chain-bridge-api'];
      }
      return saved;
    } catch { return ['cross-chain-bridge-api']; }
  });
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bts_lancer_bookmarks') || '[]'); } catch { return []; }
  });
  const [myPostMissions, setMyPostMissions] = useState(() => {
    try {
      const saved = localStorage.getItem('bts_lancer_my_posts');
      if (saved) return JSON.parse(saved).map(normalizeMission);
    } catch {}
    try {
      const savedCreated = localStorage.getItem('bts_lancer_created_missions');
      if (savedCreated) {
        const parsedCreated = JSON.parse(savedCreated);
        const combined = [...SEED_MY_POSTS];
        parsedCreated.forEach(m => {
          if (!combined.some(c => c.id === m.id)) {
            combined.push(normalizeMission({ ...m, isMyPost: true }));
          }
        });
        return combined.map(normalizeMission);
      }
    } catch {}
    return SEED_MY_POSTS;
  });
  const [seedMissions, setSeedMissions] = useState(() => {
    try {
      const saved = localStorage.getItem('bts_lancer_seed_missions');
      if (saved) return mergeSeedMissions(JSON.parse(saved));
    } catch {}
    return SEED_MISSIONS;
  });

  useEffect(() => { localStorage.setItem('bts_lancer_applications', JSON.stringify(applications)); }, [applications]);
  useEffect(() => { localStorage.setItem('bts_lancer_bookmarks', JSON.stringify(bookmarks)); }, [bookmarks]);
  useEffect(() => { localStorage.setItem('bts_lancer_my_posts', JSON.stringify(myPostMissions)); }, [myPostMissions]);
  useEffect(() => { localStorage.setItem('bts_lancer_seed_missions', JSON.stringify(seedMissions)); }, [seedMissions]);

  useEffect(() => {
    const h = (e) => { if (filterRef.current && !filterRef.current.contains(e.target)) setShowSkillFilter(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => { setPage(1); }, [searchQuery, inlineSearch, mainTab, selectedSkills, selectedCategory, selectedDifficulty, selectedStatus, selectedDuration, sortBy]);

  // All missions pool (seed + user created)
  const allExplore = [...seedMissions, ...myPostMissions];
  const myWorkIds = new Set([...SEED_MY_WORK.map(w => w.id), ...applications]);
  const archiveMissions = SEED_ARCHIVE;

  // Explore filter + sort
  const effectiveSearch = (inlineSearch || searchQuery).toLowerCase();
  const activeFilterCount = [
    selectedCategory !== 'all', selectedDifficulty !== 'all',
    selectedDuration !== 'all', selectedSkills.length > 0,
  ].filter(Boolean).length;

  const exploreFiltered = allExplore
    .filter(m => !m.isMyPost)
    .filter(m => m.status === 'Open')
    .filter(m => {
      const ms = !effectiveSearch
        || m.title.toLowerCase().includes(effectiveSearch)
        || m.description.toLowerCase().includes(effectiveSearch)
        || m.tags.some(t => t.toLowerCase().includes(effectiveSearch))
        || m.client.toLowerCase().includes(effectiveSearch);
      const sk = selectedSkills.length === 0 || selectedSkills.some(s => m.tags.includes(s));
      const cat = selectedCategory === 'all' || m.tags.includes(selectedCategory);
      const diff = selectedDifficulty === 'all' || m.difficulty === selectedDifficulty;
      const dur = selectedDuration === 'all'
        || (selectedDuration === 'short' && m.deadline <= 7)
        || (selectedDuration === 'medium' && m.deadline > 7 && m.deadline <= 28)
        || (selectedDuration === 'long' && m.deadline > 28);
      return ms && sk && cat && diff && dur;
    })
    .sort((a, b) => {
      if (sortBy === 'reward-high') return b.reward - a.reward;
      if (sortBy === 'most-applied') return b.appliedCount - a.appliedCount;
      if (sortBy === 'ending-soon') return a.deadline - b.deadline;
      return a.postedDays - b.postedDays; // newest = lowest postedDays
    });

  // Trending: top 3 by appliedCount among open missions
  const trendingMissions = [...allExplore]
    .filter(m => !m.isMyPost && m.status === 'Open')
    .sort((a, b) => b.appliedCount - a.appliedCount)
    .slice(0, 4);

  // Category counts
  const catCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat.key] = cat.key === 'all'
      ? allExplore.filter(m => !m.isMyPost && m.status === 'Open').length
      : allExplore.filter(m => !m.isMyPost && m.status === 'Open' && m.tags.includes(cat.key)).length;
    return acc;
  }, {});

  // Active in-progress contracts (not shown in Explore browse)
  const inProgressMissions = (() => {
    const map = new Map();
    myPostMissions
      .filter(m => ['In Progress', 'In Review'].includes(m.status))
      .forEach(m => map.set(m.id, { ...m, _role: 'creator' }));
    allExplore
      .filter(m => ['In Progress', 'In Review'].includes(m.status))
      .filter(m => {
        const hired = m.proposals?.some(p => p.name === 'You' && p.status === 'accepted');
        const seedWork = SEED_MY_WORK.some(w => w.id === m.id);
        return hired || seedWork;
      })
      .forEach(m => {
        const seedExtra = SEED_MY_WORK.find(w => w.id === m.id) || {};
        map.set(m.id, { ...m, ...seedExtra, _role: 'freelancer' });
      });
    return Array.from(map.values());
  })();

  // My Applications: applied but not yet in active contract
  const myWorkMissions = [
    ...SEED_MY_WORK.map(w => {
      const base = allExplore.find(m => m.id === w.id) || {};
      return { ...base, ...w };
    }).filter(m => !['In Progress', 'In Review', 'Completed'].includes(m.status)),
    ...applications
      .filter(id => !SEED_MY_WORK.some(w => w.id === id))
      .map(id => {
        const base = allExplore.find(m => m.id === id);
        return base && base.status === 'Open'
          ? { ...base, myProgress: 0, myMilestone: 'Awaiting client review', myRole: 'Freelancer', myBid: base.reward }
          : null;
      })
      .filter(Boolean),
  ];

  const totalEarned = myWorkMissions.reduce((s, m) => {
    if (m.escrowReleasedAmount !== undefined) return s + m.escrowReleasedAmount;
    const progress = m.myProgress || 10;
    const bid = m.myBid || m.reward || 0;
    return s + Math.round(bid * (progress / 100));
  }, 0);
  const totalPages = Math.max(1, Math.ceil(exploreFiltered.length / PAGE_SIZE));
  const paginated = exploreFiltered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleApply = useCallback((id) => {
    if (!applications.includes(id)) {
      setApplications(prev => [...prev, id]);
    }
  }, [applications]);

  const handleBookmark = useCallback((id) => {
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  }, []);

  const handleSkillToggle = (s) => setSelectedSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleCreateMission = (newMission) => {
    const mission = {
      ...newMission, id: `user-${Date.now()}`, appliedCount: 0, postedDays: 0, client: 'You',
      clientAvatar: 'https://ui-avatars.com/api/?name=You&background=d4a017&color=0b1121&size=40',
      status: 'Open',
      milestones: [],
      milestoneAmounts: [],
      milestoneStatus: [],
      milestoneReleased: [],
      escrowLocked: false,
      escrowReleasedAmount: 0,
      disputeActive: false,
      proposals: [], submissions: [], reviews: [], isMyPost: true,
    };
    setMyPostMissions(prev => [mission, ...prev]);
    setShowCreateModal(false);
  };

  const openDetail = (mission, role) => {
    setActiveMissionId(mission.id);
    setActiveMissionRole(role);
  };

  const handleUpdateMission = (updated) => {
    const normalized = normalizeMission(updated);
    if (normalized.isMyPost) {
      setMyPostMissions(prev => prev.map(m => m.id === normalized.id ? normalized : m));
    } else {
      setSeedMissions(prev => prev.map(m => m.id === normalized.id ? normalized : m));
    }
  };

  const activeMission = allExplore.find(m => m.id === activeMissionId);

  return (
    <>
      <Topbar searchPlaceholder="Search missions, skills, or clients..." onSearchChange={q => setSearchQuery(q)} />

      {activeMission ? (
        <div className="mt-6">
          <MissionWorkspace
            mission={activeMission}
            role={activeMissionRole}
            isApplied={applications.includes(activeMission.id)}
            isApplying={applyingId === activeMission.id}
            isBookmarked={bookmarks.includes(activeMission.id)}
            onApply={handleApply}
            onBookmark={handleBookmark}
            onBack={() => setActiveMissionId(null)}
            onUpdateMission={handleUpdateMission}
          />
        </div>
      ) : (
        <>
          {/* ── Header ── */}
      <section className="mb-6 mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-brand-dark tracking-tight mb-1.5">D-Lancer</h2>
          <p className="text-gray-400 text-sm">Freelance missions powered by BTS tokens</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-brand-dark text-white rounded-xl font-bold text-sm hover:bg-bts-gold hover:text-brand-dark transition-all shadow-lg shadow-brand-dark/10 shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
          Post a Mission
        </button>
      </section>

      {/* ── Main Tab Navigation ── */}
      <div className="flex bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm gap-1 mb-6 w-fit">
        {MAIN_TABS.map(tab => {
          const count = tab.key === 'in-progress' ? inProgressMissions.length
            : tab.key === 'my-work' ? myWorkMissions.length
            : tab.key === 'my-posts' ? myPostMissions.length
            : tab.key === 'archive' ? archiveMissions.length
            : null;
          return (
            <button
              key={tab.key}
              onClick={() => setMainTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                mainTab === tab.key ? 'bg-brand-dark text-white shadow' : 'text-gray-400 hover:text-brand-dark hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d={tab.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              {tab.label}
              {count != null && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                  mainTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── EXPLORE TAB ── */}
      {mainTab === 'explore' && (
        <div className="space-y-6">

          {/* ── Search + Sort Bar ── */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <input
                type="text"
                value={inlineSearch}
                onChange={e => setInlineSearch(e.target.value)}
                placeholder="Search missions, skills, clients..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-brand-dark placeholder-gray-400 focus:outline-none focus:border-bts-gold focus:ring-2 focus:ring-bts-gold/20 shadow-sm transition-all"
              />
              {inlineSearch && (
                <button onClick={() => setInlineSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                </button>
              )}
            </div>
            {/* Sort */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-9 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-brand-dark focus:outline-none focus:border-bts-gold shadow-sm cursor-pointer transition-all"
              >
                {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
            </div>
            {/* Filter toggle */}
            <button
              onClick={() => setShowFullFilter(p => !p)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold border transition-all shadow-sm shrink-0 ${
                activeFilterCount > 0 ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-dark hover:text-brand-dark'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V19l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
              Filters
              {activeFilterCount > 0 && <span className="bg-bts-gold text-brand-dark text-[10px] px-1.5 py-0.5 rounded-full font-extrabold">{activeFilterCount}</span>}
            </button>
          </div>

          {/* ── Full Filter Drawer ── */}
          {showFullFilter && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-md space-y-5" ref={filterDrawerRef}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Difficulty */}
                <div>
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Difficulty</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['all', 'Intermediate', 'Advanced', 'Expert'].map(d => (
                      <button key={d} onClick={() => setSelectedDifficulty(d)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                          selectedDifficulty === d ? 'bg-brand-dark text-white border-brand-dark' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-brand-dark'
                        }`}>{d === 'all' ? 'Any' : d}</button>
                    ))}
                  </div>
                </div>
                {/* Duration */}
                <div>
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Duration</p>
                  <div className="flex flex-wrap gap-1.5">
                    {DURATION_OPTIONS.map(d => (
                      <button key={d.key} onClick={() => setSelectedDuration(d.key)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                          selectedDuration === d.key ? 'bg-brand-dark text-white border-brand-dark' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-brand-dark'
                        }`}>{d.label}</button>
                    ))}
                  </div>
                </div>
                {/* Skills */}
                <div>
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_SKILLS.map(skill => (
                      <button key={skill} onClick={() => handleSkillToggle(skill)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                          selectedSkills.includes(skill) ? 'bg-brand-dark text-white border-brand-dark' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-brand-dark'
                        }`}>{skill}</button>
                    ))}
                  </div>
                </div>
              </div>
              {activeFilterCount > 0 && (
                <div className="flex justify-end pt-3 border-t border-gray-100">
                  <button
                    onClick={() => { setSelectedDifficulty('all'); setSelectedDuration('all'); setSelectedSkills([]); setSelectedCategory('all'); }}
                    className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Category Pills ── */}
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(cat => {
              const count = catCounts[cat.key] || 0;
              const active = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[12px] font-extrabold whitespace-nowrap transition-all border shrink-0 ${
                    active
                      ? 'bg-brand-dark text-white border-brand-dark shadow-md'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-brand-dark hover:text-brand-dark'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* ── Trending Missions — 1 big + 2 small layout ── */}
          {!effectiveSearch && activeFilterCount === 0 && selectedCategory === 'all' && trendingMissions.length >= 3 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-base">🔥</span>
                <h3 className="text-sm font-extrabold text-brand-dark">Trending Now</h3>
                <span className="text-[10px] font-bold text-gray-400">Most competitive open missions</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Big featured card — col-span-3 */}
                <div className="md:col-span-3">
                  <TrendingFeaturedCard
                    mission={trendingMissions[0]}
                    isApplied={applications.includes(trendingMissions[0].id)}
                    isBookmarked={bookmarks.includes(trendingMissions[0].id)}
                    onBookmark={handleBookmark}
                    onDetails={() => openDetail(trendingMissions[0], 'freelancer')}
                  />
                </div>
                {/* Two small cards stacked — col-span-2 */}
                <div className="md:col-span-2 flex flex-col gap-4">
                  {trendingMissions.slice(1, 3).map(mission => (
                    <TrendingSmallCard
                      key={mission.id}
                      mission={mission}
                      isApplied={applications.includes(mission.id)}
                      isBookmarked={bookmarks.includes(mission.id)}
                      onBookmark={handleBookmark}
                      onDetails={() => openDetail(mission, 'freelancer')}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Results row + active filter chips ── */}
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-[12px] font-bold text-gray-500">
              <span className="text-brand-dark font-extrabold">{exploreFiltered.length}</span> mission{exploreFiltered.length !== 1 ? 's' : ''} found
            </p>
            {selectedCategory !== 'all' && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 text-[11px] font-bold rounded-full">
                {CATEGORIES.find(c => c.key === selectedCategory)?.emoji} {selectedCategory}
                <button onClick={() => setSelectedCategory('all')} className="ml-1 text-gray-400 hover:text-red-500">×</button>
              </span>
            )}
            {selectedDifficulty !== 'all' && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 text-[11px] font-bold rounded-full">
                {selectedDifficulty}
                <button onClick={() => setSelectedDifficulty('all')} className="ml-1 text-gray-400 hover:text-red-500">×</button>
              </span>
            )}
            {selectedDuration !== 'all' && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 text-[11px] font-bold rounded-full">
                {DURATION_OPTIONS.find(d => d.key === selectedDuration)?.label}
                <button onClick={() => setSelectedDuration('all')} className="ml-1 text-gray-400 hover:text-red-500">×</button>
              </span>
            )}
            {selectedSkills.map(s => (
              <span key={s} className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 text-[11px] font-bold rounded-full">
                {s}
                <button onClick={() => handleSkillToggle(s)} className="ml-1 text-gray-400 hover:text-red-500">×</button>
              </span>
            ))}
          </div>

          {/* ── Main Grid: Cards + Sidebar ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
            <div className="lg:col-span-8 space-y-4">
              {exploreFiltered.length === 0 ? (
                <EmptyPlaceholder text="No missions match your filters." />
              ) : (
                <>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {paginated.map(mission => (
                      <ExploreCard
                        key={mission.id}
                        mission={mission}
                        isApplied={applications.includes(mission.id)}
                        isApplying={applyingId === mission.id}
                        isBookmarked={bookmarks.includes(mission.id)}
                        onApply={() => openDetail(mission, 'freelancer')}
                        onBookmark={handleBookmark}
                        onDetails={() => openDetail(mission, 'freelancer')}
                      />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <Pagination page={page} total={totalPages} onChange={setPage} />
                  )}
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-5">
              <EarningsCard totalEarned={totalEarned} myWork={myWorkMissions} />
              <MyWorkProgressCard myWork={inProgressMissions.slice(0, 3)} onDetails={(m) => openDetail(m, m._role || 'freelancer')} />
              <TopSkillsCard />
            </div>
          </div>
        </div>
      )}

      {/* ── IN PROGRESS TAB ── */}
      {mainTab === 'in-progress' && (
        <div className="space-y-5">
          <SectionHeader
            title="Projects In Progress"
            subtitle="Active contracts with locked escrow — removed from open browse once work begins"
          />
          {inProgressMissions.length === 0 ? (
            <EmptyPlaceholder text="No active projects yet. Once a contract is locked, it moves here from Explore." />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {inProgressMissions.map(mission => (
                <InProgressCard
                  key={mission.id}
                  mission={mission}
                  onOpen={() => openDetail(mission, mission._role || (mission.isMyPost ? 'creator' : 'freelancer'))}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MY APPLICATIONS TAB ── */}
      {mainTab === 'my-work' && (
        <div className="space-y-5">
          <SectionHeader title="My Applications" subtitle="Open missions you applied to — awaiting client review or alignment" />
          {myWorkMissions.length === 0 ? (
            <EmptyPlaceholder text="You haven't applied to any missions yet. Explore open missions to get started." />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {myWorkMissions.map(mission => (
                <MyWorkCard
                  key={mission.id}
                  mission={mission}
                  onDetails={() => openDetail(mission, 'freelancer')}
                />
              ))}
            </div>
          )}

          {/* Summary stats */}
          {myWorkMissions.length > 0 && (
            <div className="bg-brand-dark text-white rounded-2xl p-6 mt-4">
              <p className="text-xs font-extrabold uppercase tracking-widest text-white/50 mb-4">Work Summary</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-2xl font-extrabold">{myWorkMissions.length}</p>
                  <p className="text-[11px] text-white/40 font-bold mt-1">Pending Applications</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-2xl font-extrabold text-bts-gold">◈ {totalEarned.toLocaleString()}</p>
                  <p className="text-[11px] text-white/40 font-bold mt-1">Pending Rewards</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-2xl font-extrabold">
                    {Math.round(myWorkMissions.reduce((s, m) => s + (m.myProgress || 0), 0) / Math.max(1, myWorkMissions.length))}%
                  </p>
                  <p className="text-[11px] text-white/40 font-bold mt-1">Avg Progress</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── MY POSTS TAB ── */}
      {mainTab === 'my-posts' && (
        <div className="space-y-5">
          <SectionHeader title="My Posted Missions" subtitle="Missions you created — manage proposals, team, and submissions" />
          {myPostMissions.length === 0 ? (
            <EmptyPlaceholder text="You haven't posted any missions yet. Click 'Post a Mission' to get started." />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {myPostMissions.map(mission => (
                <MyPostCard
                  key={mission.id}
                  mission={mission}
                  onManage={() => openDetail(mission, 'creator')}
                />
              ))}
            </div>
          )}

          {/* Aggregate stats for my posts */}
          {myPostMissions.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {[
                { label: 'Total Posted', value: myPostMissions.length },
                { label: 'Open Proposals', value: myPostMissions.reduce((s, m) => s + (m.proposals || []).filter(p => p.status === 'pending').length, 0) },
                { label: 'Pending Submissions', value: myPostMissions.reduce((s, m) => s + (m.submissions || []).filter(s => s.status === 'pending').length, 0) },
                { label: 'BTS Committed', value: myPostMissions.reduce((s, m) => s + m.reward, 0).toLocaleString() },
              ].map(s => (
                <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-center">
                  <p className="text-xl font-extrabold text-brand-dark">{typeof s.value === 'number' && s.label === 'BTS Committed' ? `◈ ${s.value}` : s.value}</p>
                  <p className="text-[11px] text-gray-400 font-semibold mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── ARCHIVE TAB ── */}
      {mainTab === 'archive' && (
        <div className="space-y-5">
          <SectionHeader title="Mission Archive" subtitle="Past missions you created or participated in" />
          {archiveMissions.length === 0 ? (
            <EmptyPlaceholder text="No archived missions yet." />
          ) : (
            <div className="space-y-3">
              {archiveMissions.map((arc, i) => {
                const base = arc.role === 'freelancer'
                  ? allExplore.find(m => m.id === arc.id) || {}
                  : arc;
                return (
                  <ArchiveCard key={arc.id || i} arc={arc} base={base} />
                );
              })}
            </div>
          )}
        </div>
      )}

          {/* ── Modals ── */}
          {showCreateModal && <CreateMissionModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateMission} />}
        </>
      )}
    </>
  );
}

// ─── Trending Featured Card (big — DLibrary FeaturedCard style) ────────────────────
function TrendingFeaturedCard({ mission, isApplied, isBookmarked, onBookmark, onDetails }) {
  const fillPct = Math.min(100, Math.round((mission.appliedCount / mission.teamSize) * 100));
  const diffConfig = DIFFICULTY_LABEL[mission.difficulty] || { label: mission.difficulty, cls: 'bg-brand-dark/80 text-white' };
  return (
    <div
      onClick={onDetails}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col md:flex-row h-full"
    >
      {/* Image — 2/5 width */}
      <div className="md:w-2/5 relative h-52 md:h-auto overflow-hidden bg-gray-100 shrink-0">
        {mission.thumbnail
          ? <img src={mission.thumbnail} alt={mission.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full bg-gradient-to-br from-brand-dark to-gray-700" />
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3 bg-rose-500/90 backdrop-blur-md text-white px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider">
          🔥 TRENDING #1
        </div>
        <div className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-extrabold backdrop-blur-sm ${diffConfig.cls}`}>
          {diffConfig.label}
        </div>
      </div>
      {/* Content — 3/5 width */}
      <div className="md:w-3/5 p-7 flex flex-col justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${STATUS_COLOR[mission.status] || 'bg-gray-100 text-gray-500 border-gray-200'}`}>{mission.status}</span>
            <span className="bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold">{mission.deadline}d deadline</span>
          </div>
          <h4 className="text-base font-extrabold text-brand-dark leading-snug group-hover:text-bts-gold transition-colors line-clamp-2">
            {mission.title}
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{mission.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {mission.tags.slice(0, 3).map(t => (
              <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-extrabold">{t}</span>
            ))}
          </div>
          {/* Fill bar */}
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Team</span>
              <span className="text-[10px] font-extrabold text-gray-500">{mission.appliedCount}/{mission.teamSize}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-bts-gold to-brand-dark rounded-full" style={{ width: `${fillPct}%` }} />
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
          <div className="flex items-center gap-3">
            <img src={mission.clientAvatar} alt={mission.client} className="w-9 h-9 rounded-full border border-gray-100" />
            <div>
              <p className="text-xs font-bold text-brand-dark leading-tight">{mission.client}</p>
              <p className="text-[10px] text-gray-400">{mission.postedDays === 0 ? 'Just now' : `${mission.postedDays}d ago`}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Reward</p>
              <p className="text-base font-extrabold text-brand-dark"><span className="text-bts-gold">◈</span> {mission.reward.toLocaleString()} <span className="text-[10px] text-gray-400">BTS</span></p>
            </div>
            <button
              onClick={e => { e.stopPropagation(); onBookmark(mission.id); }}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isBookmarked ? 'text-bts-gold bg-yellow-50 border-yellow-200' : 'text-gray-300 border-gray-200 hover:text-bts-gold hover:bg-yellow-50 hover:border-yellow-200'
              }`}
            >
              <svg className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
            <button
              onClick={e => { e.stopPropagation(); onDetails(); }}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer ${
                isApplied ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-brand-dark text-white hover:bg-bts-gold hover:text-brand-dark'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d={isApplied ? 'M5 13l4 4L19 7' : 'M13 7l5 5m0 0l-5 5m5-5H6'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Trending Small Card (compact — DLibrary SmallFeaturedCard style) ──────────────
function TrendingSmallCard({ mission, isApplied, isBookmarked, onBookmark, onDetails }) {
  const fillPct = Math.min(100, Math.round((mission.appliedCount / mission.teamSize) * 100));
  return (
    <div
      onClick={onDetails}
      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-bts-gold/40 transition-all group cursor-pointer flex flex-col gap-4 flex-1"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shrink-0 bg-gray-100">
            {mission.thumbnail
              ? <img src={mission.thumbnail} alt={mission.title} className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-gradient-to-br from-brand-dark to-gray-700" />
            }
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${STATUS_COLOR[mission.status] || 'bg-gray-100 text-gray-500 border-gray-200'}`}>
            {mission.status}
          </span>
        </div>
        <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap">{mission.deadline}d left</span>
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap gap-1 mb-2">
          {mission.tags.slice(0, 2).map(t => (
            <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-extrabold">{t}</span>
          ))}
        </div>
        <h5 className="text-sm font-extrabold text-brand-dark group-hover:text-bts-gold transition-colors line-clamp-2 mb-1.5">{mission.title}</h5>
        <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{mission.description}</p>
      </div>
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <img src={mission.clientAvatar} alt={mission.client} className="w-6 h-6 rounded-full border border-gray-100" />
            <span className="text-[11px] font-bold text-gray-500">{mission.client}</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-extrabold text-brand-dark leading-none">
              <span className="text-bts-gold">◈</span> {mission.reward.toLocaleString()}
            </p>
            <button
              onClick={e => { e.stopPropagation(); onBookmark(mission.id); }}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                isBookmarked ? 'text-bts-gold' : 'text-gray-300 hover:text-bts-gold'
              }`}
            >
              <svg className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[10px] text-gray-400 font-bold">Team</span>
            <span className="text-[10px] font-extrabold text-gray-500">{mission.appliedCount}/{mission.teamSize}</span>
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-bts-gold to-brand-dark rounded-full" style={{ width: `${fillPct}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Explore Mission Card (Freelancer perspective — DLibrary-style thumbnail layout) ──
function ExploreCard({ mission, isApplied, isApplying, isBookmarked, onApply, onBookmark, onDetails }) {
  const isFull = mission.appliedCount >= mission.teamSize && !isApplied;
  const fillPct = Math.min(100, Math.round((mission.appliedCount / mission.teamSize) * 100));
  const diffConfig = DIFFICULTY_LABEL[mission.difficulty] || { label: mission.difficulty, cls: 'bg-brand-dark/80 text-white' };

  return (
    <div
      className={`bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 group flex flex-col cursor-pointer ${
        isApplied ? 'border-emerald-200 ring-1 ring-emerald-50' : 'border-gray-100 hover:border-bts-gold/40'
      }`}
      onClick={onDetails}
    >
      {/* Thumbnail Header */}
      <div className="relative h-32 overflow-hidden bg-gray-100 shrink-0">
        {mission.thumbnail ? (
          <img src={mission.thumbnail} alt={mission.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-dark to-gray-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Top-left: difficulty badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest backdrop-blur-sm ${diffConfig.cls}`}>
            {diffConfig.label}
          </span>
        </div>

        {/* Bottom-left: status badge */}
        <div className="absolute bottom-3 left-3">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
            STATUS_COLOR[mission.status] || 'bg-gray-100 text-gray-500 border-gray-200'
          }`}>{mission.status}</span>
        </div>

        {/* Top-right: bookmark */}
        <button
          onClick={e => { e.stopPropagation(); onBookmark(mission.id); }}
          className={`absolute top-3 right-3 p-1.5 rounded-lg backdrop-blur-sm transition-all ${
            isBookmarked ? 'bg-yellow-400/90 text-white' : 'bg-white/80 text-gray-500 hover:bg-yellow-400/90 hover:text-white'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Client row */}
        <div className="flex items-center gap-2 mb-2.5">
          <img src={mission.clientAvatar} alt={mission.client} className="w-6 h-6 rounded-full border border-gray-100 shrink-0" />
          <span className="text-[11px] font-bold text-gray-500 truncate">{mission.client}</span>
          <span className="text-gray-200">·</span>
          <span className="text-[10px] text-gray-400">{mission.postedDays === 0 ? 'Just now' : `${mission.postedDays}d ago`}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {mission.tags.slice(0, 3).map(t => (
            <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-extrabold">{t}</span>
          ))}
        </div>

        <h3 className="text-sm font-extrabold text-brand-dark leading-snug mb-1.5 group-hover:text-bts-gold transition-colors line-clamp-2">
          {mission.title}
        </h3>
        <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2 mb-4 flex-1">{mission.description}</p>

        {/* Team fill bar */}
        <div className="mb-4">
          <div className="flex justify-between mb-1.5">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Team</span>
            <span className="text-[10px] font-extrabold text-gray-500">{mission.appliedCount}/{mission.teamSize}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFull ? 'bg-gray-300' : 'bg-gradient-to-r from-bts-gold to-brand-dark'
              }`}
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-[11px] text-gray-400 font-semibold mb-4">
          <span>{mission.deadline}d deadline</span>
          <span className="text-gray-200">·</span>
          <span>{(mission.proposals || []).length} proposals</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Reward</p>
            <p className="text-base font-extrabold text-brand-dark">
              <span className="text-bts-gold">◈</span> {mission.reward.toLocaleString()} <span className="text-xs text-gray-400 font-bold">BTS</span>
            </p>
          </div>
          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            {isApplied ? (
              <span className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-extrabold">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                Applied
              </span>
            ) : isFull ? (
              <span className="px-3.5 py-2 bg-gray-100 text-gray-400 border border-gray-200 rounded-xl text-xs font-extrabold">Team Full</span>
            ) : (
              <button
                onClick={e => { e.stopPropagation(); onApply(mission.id); }}
                disabled={isApplying}
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-dark text-white rounded-xl text-xs font-extrabold hover:bg-bts-gold hover:text-brand-dark transition-all shadow-sm disabled:opacity-60"
              >
                {isApplying && <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>}
                {isApplying ? 'Applying…' : 'Apply Now'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── In Progress Card (active contracts) ─────────────────────────────────────
function InProgressCard({ mission, onOpen }) {
  const partner = mission.activeContract || {};
  const isCreator = mission._role === 'creator' || mission.isMyPost;
  const pct = mission.myProgress || Math.round(
    ((mission.milestoneStatus || []).filter(s => s === 'completed').length / Math.max(1, (mission.milestones || []).length)) * 100
  );

  return (
    <div
      onClick={onOpen}
      className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-200 transition-all group flex flex-col cursor-pointer ring-1 ring-blue-50"
    >
      {mission.thumbnail && (
        <div className="relative h-28 overflow-hidden bg-gray-100 shrink-0">
          <img src={mission.thumbnail} alt={mission.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${STATUS_COLOR[mission.status] || 'bg-gray-100 text-gray-500 border-gray-200'}`}>
              {mission.status}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-blue-600 text-white uppercase">
              {isCreator ? 'Client' : 'Freelancer'}
            </span>
          </div>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-sm font-extrabold text-brand-dark leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {mission.title}
        </h3>

        <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-brand-dark flex items-center justify-center text-bts-gold text-xs font-extrabold shrink-0">
            {(isCreator ? (partner.freelancerName || '?') : mission.client).charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
              {isCreator ? 'Working With' : 'Client'}
            </p>
            <p className="text-xs font-extrabold text-brand-dark truncate">
              {isCreator ? `${partner.freelancerName || 'Developer'} · ${partner.freelancerRole || ''}` : mission.client}
            </p>
          </div>
          <p className="text-xs font-extrabold text-brand-dark shrink-0">
            <span className="text-bts-gold">◈</span> {(partner.bid || mission.reward)?.toLocaleString()}
          </p>
        </div>

        <div className="mb-4">
          <div className="flex justify-between mb-1.5">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Milestone Progress</span>
            <span className="text-[10px] font-extrabold text-blue-600">{pct}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-bts-gold to-brand-dark rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-[10px] text-gray-400 mt-1 font-semibold">{mission.myMilestone || (mission.milestones || [])[0] || 'In progress'}</p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
          <p className="text-[10px] text-gray-400 font-bold">
            Escrow: <span className="text-emerald-600 font-extrabold">◈ {(mission.escrowReleasedAmount || 0).toLocaleString()}</span> released
          </p>
          <button
            onClick={e => { e.stopPropagation(); onOpen(); }}
            className="px-4 py-2 bg-brand-dark text-white rounded-xl text-xs font-extrabold hover:bg-bts-gold hover:text-brand-dark transition-all shadow-sm"
          >
            Open Workspace
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── My Work Card (Freelancer managing an active mission) ────────────────────
function MyWorkCard({ mission, onDetails }) {
  const pct = mission.myProgress || 10;
  const diffConfig = DIFFICULTY_LABEL[mission.difficulty] || { label: mission.difficulty, cls: 'bg-brand-dark/80 text-white' };

  return (
    <div
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col cursor-pointer"
      onClick={onDetails}
    >
      {/* Thumbnail */}
      {mission.thumbnail && (
        <div className="relative h-28 overflow-hidden bg-gray-100 shrink-0">
          <img src={mission.thumbnail} alt={mission.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest ${diffConfig.cls}`}>{diffConfig.label}</span>
          </div>
          <div className="absolute bottom-3 left-3">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${STATUS_COLOR[mission.status] || 'bg-gray-100 text-gray-500 border-gray-200'}`}>{mission.status}</span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-blue-600 text-white uppercase">My Work</span>
          </div>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Client row */}
        <div className="flex items-center gap-2 mb-2.5">
          <img src={mission.clientAvatar} alt={mission.client} className="w-6 h-6 rounded-full border border-gray-100 shrink-0" />
          <span className="text-[11px] font-bold text-gray-500 truncate">{mission.client}</span>
          <span className="ml-auto text-[10px] font-extrabold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg">{mission.myRole || 'Freelancer'}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {(mission.tags || []).slice(0, 3).map(t => (
            <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-extrabold">{t}</span>
          ))}
        </div>

        <h3 className="text-sm font-extrabold text-brand-dark leading-snug mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-2">{mission.title}</h3>
        <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2 mb-4 flex-1">{mission.description}</p>

        {/* Progress block */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-[11px] font-extrabold text-brand-dark">{mission.myMilestone || 'In Progress'}</p>
            <span className="text-[10px] font-extrabold text-gray-500">{pct}%</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-bts-gold to-brand-dark rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100" onClick={e => e.stopPropagation()}>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">My Bid</p>
            <p className="text-base font-extrabold text-brand-dark">
              <span className="text-bts-gold">◈</span> {(mission.myBid || mission.reward || 0).toLocaleString()} <span className="text-xs text-gray-400 font-bold">BTS</span>
            </p>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onDetails(); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-dark text-white rounded-xl text-xs font-extrabold hover:bg-bts-gold hover:text-brand-dark transition-all shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
            Submit Work
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── My Post Card (Creator/Client perspective) ───────────────────────────────
function MyPostCard({ mission, onManage }) {
  const pendingProposals = (mission.proposals || []).filter(p => p.status === 'pending').length;
  const pendingSubmissions = (mission.submissions || []).filter(s => s.status === 'pending').length;
  const acceptedCount = (mission.proposals || []).filter(p => p.status === 'accepted').length;
  const fillPct = Math.min(100, Math.round((mission.appliedCount / mission.teamSize) * 100));
  const diffConfig = DIFFICULTY_LABEL[mission.difficulty] || { label: mission.difficulty, cls: 'bg-brand-dark/80 text-white' };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-bts-gold/40 transition-all group flex flex-col">
      {/* Thumbnail */}
      {mission.thumbnail && (
        <div className="relative h-32 overflow-hidden bg-gray-100 shrink-0">
          <img src={mission.thumbnail} alt={mission.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest backdrop-blur-sm ${diffConfig.cls}`}>{diffConfig.label}</span>
          </div>
          <div className="absolute bottom-3 left-3">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${STATUS_COLOR[mission.status] || 'bg-gray-100 text-gray-500 border-gray-200'}`}>{mission.status}</span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-bts-gold text-brand-dark uppercase tracking-widest">My Post</span>
          </div>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {mission.tags.slice(0, 3).map(t => (
            <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-extrabold">{t}</span>
          ))}
        </div>

        <h3 className="text-sm font-extrabold text-brand-dark leading-snug mb-1.5 group-hover:text-bts-gold transition-colors line-clamp-2">{mission.title}</h3>
        <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2 mb-4 flex-1">{mission.description}</p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-gray-100">
          {[
            { label: 'Proposals', value: (mission.proposals || []).length, note: pendingProposals > 0 ? `${pendingProposals} new` : null },
            { label: 'Accepted', value: acceptedCount, note: null },
            { label: 'Submissions', value: (mission.submissions || []).length, note: pendingSubmissions > 0 ? `${pendingSubmissions} pending` : null },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-base font-extrabold text-brand-dark">{s.value}</p>
              <p className="text-[10px] text-gray-400 font-bold">{s.label}</p>
              {s.note && <span className="text-[9px] font-extrabold text-bts-gold block">{s.note}</span>}
            </div>
          ))}
        </div>

        {/* Team fill */}
        <div className="mb-4">
          <div className="flex justify-between mb-1.5">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Team Fill</span>
            <span className="text-[10px] font-extrabold text-gray-500">{mission.appliedCount}/{mission.teamSize}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-bts-gold to-brand-dark rounded-full" style={{ width: `${fillPct}%` }} />
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Budget</p>
            <p className="text-base font-extrabold text-brand-dark">
              <span className="text-bts-gold">◈</span> {mission.reward.toLocaleString()} <span className="text-xs text-gray-400 font-bold">BTS</span>
            </p>
          </div>
          <button onClick={onManage} className="flex items-center gap-2 px-5 py-2 bg-brand-dark text-white rounded-xl text-xs font-extrabold hover:bg-bts-gold hover:text-brand-dark transition-all shadow-sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
            Manage
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Archive Card ────────────────────────────────────────────────────────────
function ArchiveCard({ arc, base }) {
  const isCreator = arc.role === 'creator';
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-gray-200 transition-all">
      <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center shrink-0">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isCreator
            ? <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            : <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          }
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <h4 className="text-sm font-extrabold text-brand-dark truncate">{base.title || arc.title}</h4>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gray-100 text-gray-500">Completed</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold border border-gray-200 text-gray-500">
            {isCreator ? '🧑‍💼 Creator' : '🧑‍💻 Freelancer'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-gray-400 font-semibold flex-wrap mt-1">
          <span>{arc.completedDate}</span>
          {!isCreator && <span className="text-bts-gold font-extrabold">◈ +{arc.earnedBts?.toLocaleString()} BTS earned</span>}
          {isCreator && <span className="font-semibold text-gray-400">◈ {arc.spentBts?.toLocaleString()} BTS · {arc.freelancer}</span>}
          {(base.tags || arc.tags || []).slice(0, 3).map(t => (
            <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gray-100 text-gray-600">{t}</span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {Array.from({ length: 5 }).map((_, j) => (
          <svg key={j} className={`w-3.5 h-3.5 ${j < (arc.myRating || arc.freelancerRating || 5) ? 'text-bts-gold' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </div>
  );
}

// ─── Shared Sidebar Cards ────────────────────────────────────────────────────
function EarningsCard({ totalEarned, myWork }) {
  const pending = myWork.reduce((s, m) => s + (m.myBid || m.reward || 0), 0);
  const paid = Math.max(0, totalEarned - pending);
  return (
    <div className="bg-brand-dark text-white rounded-2xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-5">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-white/50">Earnings</p>
        <span className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded-full">BTS</span>
      </div>
      <p className="text-3xl font-extrabold mb-1">◈ {totalEarned.toLocaleString()}</p>
      <p className="text-[11px] text-white/40 mb-5">Total lifetime</p>
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider mb-1">Paid Out</p>
          <p className="text-sm font-extrabold text-emerald-400">◈ {paid.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider mb-1">Pending</p>
          <p className="text-sm font-extrabold text-bts-gold">◈ {pending.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

function MyWorkProgressCard({ myWork, onDetails }) {
  if (!myWork || myWork.length === 0) return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <p className="text-[11px] font-extrabold uppercase tracking-widest text-brand-dark mb-3">Active Progress</p>
      <p className="text-[11px] text-gray-300 text-center py-3 font-semibold">Apply to missions to track progress.</p>
    </div>
  );
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <p className="text-[11px] font-extrabold uppercase tracking-widest text-brand-dark mb-4">Active Progress</p>
      <div className="space-y-4">
        {myWork.map(m => (
          <button key={m.id} onClick={() => onDetails(m)} className="w-full text-left hover:opacity-80 transition-opacity">
            <div className="flex justify-between items-center mb-1.5">
              <p className="text-[11px] font-bold text-brand-dark truncate max-w-[140px]">{m.title}</p>
              <span className="text-[10px] font-extrabold text-blue-600">{m.myProgress || 10}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${m.myProgress || 10}%` }} />
            </div>
            <p className="text-[10px] text-gray-300 mt-0.5">{m.myMilestone || 'In progress'}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function TopSkillsCard() {
  const skills = [
    { name: 'Web3 / Solidity', jobs: 24, bar: 85 },
    { name: 'AI / ML', jobs: 18, bar: 65 },
    { name: 'Rust', jobs: 12, bar: 45 },
    { name: 'UI/UX Design', jobs: 10, bar: 38 },
    { name: 'Python', jobs: 9, bar: 33 },
  ];
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <p className="text-[11px] font-extrabold uppercase tracking-widest text-brand-dark mb-4">In-Demand Skills</p>
      <div className="space-y-3">
        {skills.map(s => (
          <div key={s.name}>
            <div className="flex justify-between mb-1"><p className="text-[11px] font-bold text-gray-600">{s.name}</p><span className="text-[10px] font-bold text-gray-400">{s.jobs}</span></div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-bts-gold rounded-full" style={{ width: `${s.bar}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-2">
      <h3 className="text-xl font-extrabold text-brand-dark">{title}</h3>
      <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
    </div>
  );
}

function EmptyPlaceholder({ text }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
      <svg className="w-10 h-10 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
      <p className="text-sm font-bold text-gray-400">{text}</p>
    </div>
  );
}

function Pagination({ page, total, onChange }) {
  return (
    <div className="flex items-center justify-center gap-1 pt-2">
      <button onClick={() => onChange(p => Math.max(1, p - 1))} disabled={page === 1}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-brand-dark hover:bg-white border border-gray-200 transition-all disabled:opacity-30">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onChange(p)}
          className={`w-8 h-8 rounded-lg text-xs font-extrabold transition-all ${p === page ? 'bg-brand-dark text-white shadow' : 'text-gray-400 hover:text-brand-dark hover:bg-white border border-gray-200'}`}>
          {p}
        </button>
      ))}
      <button onClick={() => onChange(p => Math.min(total, p + 1))} disabled={page === total}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-brand-dark hover:bg-white border border-gray-200 transition-all disabled:opacity-30">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
      </button>
    </div>
  );
}
