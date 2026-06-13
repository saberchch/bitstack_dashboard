import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import ReviewSection, { useEntityRating } from '../components/ReviewSection';
import { REVIEW_ENTITY_TYPES } from '../utils/reviewsStorage';

// ─── Seed Data ──────────────────────────────────────────────────────────────

const CATEGORIES = [
  { key: 'all', label: 'All', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { key: 'fintech', label: 'Fintech', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { key: 'smart-contracts', label: 'Smart Contracts', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  { key: 'ui-ux', label: 'UI/UX Design', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { key: 'ai-ethics', label: 'AI Ethics', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  { key: 'big-data', label: 'Big Data', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
  { key: 'cybersecurity', label: 'Cybersecurity', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
];

const TYPE_LABELS = {
  whitepaper: { label: 'WHITEPAPER', color: 'bg-purple-100 text-purple-700' },
  template: { label: 'TEMPLATE', color: 'bg-amber-100 text-amber-700' },
  course: { label: 'COURSE', color: 'bg-blue-100 text-blue-700' },
  book: { label: 'BOOK', color: 'bg-emerald-100 text-emerald-700' },
  dataset: { label: 'DATASET', color: 'bg-rose-100 text-rose-700' },
};

const SEED_RESOURCES = [
  {
    id: 'solidity-security-gas',
    title: 'Mastering Solidity Security & Gas Optimization',
    description: 'A comprehensive guide to writing secure smart contracts and optimizing gas usage on EVM-compatible chains. Covers reentrancy, overflow, front-running, and inline assembly.',
    author: 'Dr. Julian Drax',
    authorRole: 'Ethereum Foundation',
    authorAvatar: 'https://ui-avatars.com/api/?name=Julian+Drax&background=0b1121&color=d4a017&size=40',
    category: 'smart-contracts',
    type: 'book',
    price: 45,
    size: '14.8 MB',
    rating: 4.9,
    reviews: 142,
    downloads: 3120,
    featured: true,
    tags: ['Solidity', 'Security', 'Gas Optimization'],
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop',
    difficulty: 'Advanced',
    fileType: 'PDF / EPUB',
  },
  {
    id: 'defi-architecture-systems',
    title: 'DeFi Protocol Architecture: A Systems Engineering Approach',
    description: 'A systems engineering approach to designing secure, scalable, and capital-efficient decentralized finance protocols. Analyze AMMs, lending pools, and cross-chain bridges.',
    author: 'Alice Merton',
    authorRole: 'Lead Architect, Nexus',
    authorAvatar: 'https://ui-avatars.com/api/?name=Alice+Merton&background=db2777&color=ffffff&size=40',
    category: 'fintech',
    type: 'course',
    price: 120,
    size: '4.8 GB',
    rating: 4.8,
    reviews: 95,
    downloads: 1840,
    featured: true,
    tags: ['DeFi', 'System Design', 'Fintech'],
    thumbnail: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=250&fit=crop',
    difficulty: 'Intermediate',
    fileType: 'HD Video (MP4)',
  },
  {
    id: 'zk-rollup-framework',
    title: 'The ZK-Rollup Implementation Framework (Standard v1.2)',
    description: 'A complete boilerplate and framework for implementing zero-knowledge rollups. Includes circuit templates, prover components, and integration scripts.',
    author: 'Bitstacks Core',
    authorRole: 'Verified Resource',
    authorAvatar: 'https://ui-avatars.com/api/?name=Bitstacks&background=312e81&color=a5b4fc&size=40',
    category: 'smart-contracts',
    type: 'template',
    price: 15,
    size: '85 MB',
    rating: 5.0,
    reviews: 312,
    downloads: 6400,
    featured: false,
    tags: ['ZK-Rollups', 'Boilerplate', 'Rust'],
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop',
    difficulty: 'Beginner',
    fileType: 'GitHub Repository',
  },
  {
    id: 'ai-ethics-governance',
    title: 'Multi-Agent AI Ethics in Decentralized Governance',
    description: 'An academic whitepaper exploring the moral, ethical, and governance structures required for deploying multi-agent AI networks inside decentralized autonomous organizations (DAOs).',
    author: 'Sarah Williams',
    authorRole: 'Ethicist, Bitstacks Inst.',
    authorAvatar: 'https://ui-avatars.com/api/?name=Sarah+Williams&background=0d9488&color=ffffff&size=40',
    category: 'ai-ethics',
    type: 'whitepaper',
    price: 0,
    size: '3.1 MB',
    rating: 4.7,
    reviews: 88,
    downloads: 2900,
    featured: false,
    tags: ['AI Ethics', 'Governance', 'DAO'],
    thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=250&fit=crop',
    difficulty: 'Advanced',
    fileType: 'PDF / EPUB',
  },
  {
    id: 'ui-design-web3',
    title: 'Advanced UI Design Systems for Web3 dApps',
    description: 'A comprehensive masterclass on crafting user-friendly, clean, and highly functional user interfaces for decentralized applications. Includes a dark-mode components package.',
    author: 'Marcus Kane',
    authorRole: 'Lead Designer, Bitstacks',
    authorAvatar: 'https://ui-avatars.com/api/?name=Marcus+Kane&background=7c3aed&color=ffffff&size=40',
    category: 'ui-ux',
    type: 'course',
    price: 85,
    size: '12.4 GB',
    rating: 4.8,
    reviews: 205,
    downloads: 1420,
    featured: true,
    tags: ['UI/UX', 'Figma', 'Web3'],
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
    difficulty: 'Intermediate',
    fileType: 'Figma / Design Files',
  },
  {
    id: 'formal-verification-defi',
    title: 'Formal Verification of Complex DeFi Transactions',
    description: 'Mathematical and logical verification methods to prove the correctness and security of complicated decentralized finance transaction flows and flash-loan vectors.',
    author: 'Dr. Robert Lang',
    authorRole: 'Oxford Crypto Lab',
    authorAvatar: 'https://ui-avatars.com/api/?name=Robert+Lang&background=1d4ed8&color=ffffff&size=40',
    category: 'cybersecurity',
    type: 'whitepaper',
    price: 200,
    size: '8.2 MB',
    rating: 4.9,
    reviews: 76,
    downloads: 890,
    featured: false,
    tags: ['Formal Verification', 'DeFi', 'Security'],
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop',
    difficulty: 'Expert',
    fileType: 'GitHub Repository',
  },
  {
    id: 'dac-future-bitstacks',
    title: 'Decentralized Autonomous Curriculums: The Future of Bitstacks',
    description: 'An in-depth analysis of how smart contracts can automate academic credit verification and peer-to-peer resource sharing in a trustless ecosystem.',
    author: 'Dr. Alistair Smith',
    authorRole: 'Lead Researcher',
    authorAvatar: 'https://ui-avatars.com/api/?name=Alistair+Smith&background=0b1121&color=d4a017&size=40',
    category: 'smart-contracts',
    type: 'whitepaper',
    price: 25,
    size: '4.2 MB',
    rating: 4.9,
    reviews: 128,
    downloads: 2340,
    featured: false,
    tags: ['Smart Contracts', 'DAO', 'Academic'],
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop',
    difficulty: 'Advanced',
    fileType: 'PDF / EPUB',
  },
  {
    id: 'web3-ui-design-system',
    title: 'Web3 UI/UX Design System v2.0',
    description: 'A complete Figma design system for dApps, including wallet components, transaction states, and dark-mode tokens.',
    author: 'Chloe Martinez',
    authorRole: 'Lead Designer',
    authorAvatar: 'https://ui-avatars.com/api/?name=Chloe+M&background=db2777&color=ffffff&size=40',
    category: 'ui-ux',
    type: 'template',
    price: 120,
    size: '320 MB',
    rating: 4.8,
    reviews: 89,
    downloads: 1780,
    featured: false,
    tags: ['UI/UX', 'Figma', 'Web3'],
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
    difficulty: 'Intermediate',
    fileType: 'Figma / Design Files',
  },
  {
    id: 'solidity-security-handbook',
    title: 'Solidity Security Handbook 2024',
    description: 'Comprehensive guide covering all known Solidity vulnerabilities, attack vectors, and best practices for secure smart contract development.',
    author: 'Hamid Rashidi',
    authorRole: 'ZK Engineer',
    authorAvatar: 'https://ui-avatars.com/api/?name=Hamid+R&background=312e81&color=a5b4fc&size=40',
    category: 'cybersecurity',
    type: 'book',
    price: 75,
    size: '12.5 MB',
    rating: 5.0,
    reviews: 211,
    downloads: 4500,
    featured: false,
    tags: ['Security', 'Solidity', 'Smart Contracts'],
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop',
    difficulty: 'Advanced',
    fileType: 'PDF / EPUB',
  },
  {
    id: 'nft-market-dataset',
    title: 'NFT Market Historical Dataset Q1–Q4 2024',
    description: 'Cleaned, normalized dataset of 2M+ NFT transactions across Ethereum, Solana, and Polygon. Ideal for ML model training.',
    author: 'DataLabs DAO',
    authorRole: 'Research Collective',
    authorAvatar: 'https://ui-avatars.com/api/?name=DataLabs&background=059669&color=ffffff&size=40',
    category: 'big-data',
    type: 'dataset',
    price: 50,
    size: '1.2 GB',
    rating: 4.5,
    reviews: 67,
    downloads: 1320,
    featured: false,
    tags: ['Big Data', 'NFT', 'ML'],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
    difficulty: 'Advanced',
    fileType: 'GitHub Repository',
  },
  {
    id: 'nextjs-web3-starter',
    title: 'Next.js Web3 Starter Kit',
    description: 'Production-ready boilerplate with RainbowKit wallet connection, wagmi hooks, TailwindCSS, and pre-built DeFi UI components.',
    author: 'BlockWave Inc.',
    authorRole: 'Dev Collective',
    authorAvatar: 'https://ui-avatars.com/api/?name=BlockWave&background=d4a017&color=0b1121&size=40',
    category: 'ui-ux',
    type: 'template',
    price: 89,
    size: '45 MB',
    rating: 4.9,
    reviews: 412,
    downloads: 7800,
    featured: false,
    tags: ['React', 'Web3', 'Template'],
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop',
    difficulty: 'Beginner',
    fileType: 'GitHub Repository',
  },
  {
    id: 'tokenomics-design-guide',
    title: 'Tokenomics Design: From Theory to Launch',
    description: 'Comprehensive guide covering emission schedules, staking mechanics, governance models, vesting strategies, and economic security.',
    author: 'Marco Vitali',
    authorRole: 'DeFi Strategist',
    authorAvatar: 'https://ui-avatars.com/api/?name=Marco+V&background=1d4ed8&color=ffffff&size=40',
    category: 'fintech',
    type: 'book',
    price: 45,
    size: '8.7 MB',
    rating: 4.8,
    reviews: 193,
    downloads: 2100,
    featured: false,
    tags: ['Fintech', 'Tokenomics', 'Strategy'],
    thumbnail: 'https://images.unsplash.com/photo-1642790551116-18e4f4a0e3dc?w=400&h=250&fit=crop',
    difficulty: 'Intermediate',
    fileType: 'PDF / EPUB',
  },
];

const RECENT_ACTIVITY = [
  { id: 'r1', name: 'Solidity Audit Checklist', type: 'PDF Document', date: 'Oct 24, 2023', action: 'download', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z', iconBg: 'bg-red-100 text-red-600' },
  { id: 'r2', name: 'DeFi Protocol Architecture', type: 'MP4 Video', date: 'Oct 21, 2023', action: 'play', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', iconBg: 'bg-blue-100 text-blue-600' },
  { id: 'r3', name: 'Next.js Web3 Starter Kit', type: 'ZIP Archive', date: 'Oct 18, 2023', action: 'download', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', iconBg: 'bg-amber-100 text-amber-600' },
  { id: 'r4', name: 'Tokenomics Design Guide', type: 'PDF Document', date: 'Oct 15, 2023', action: 'download', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z', iconBg: 'bg-emerald-100 text-emerald-600' },
];

const SORT_OPTIONS = ['Most Recent', 'Most Popular', 'Price: Low to High', 'Price: High to Low'];

// ─── Main Component ──────────────────────────────────────────────────────────

export default function DLibrary() {
  const [activeCategory, setActiveCategory] = useState('all'); // Controls the 'Topic' dropdown selection
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'browse' | 'saved' | 'my-uploads' | 'guide'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Most Recent');
  const [activeType, setActiveType] = useState('all'); // Controls the 'Category' format dropdown selection
  const [selectedDifficulties, setSelectedDifficulties] = useState(['Intermediate']);
  const [selectedFileTypes, setSelectedFileTypes] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [currentPage, setCurrentPage] = useState(1);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(null);
  const [savedIds, setSavedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bts_library_saved') || '[]'); } catch { return []; }
  });
  const [purchasedIds, setPurchasedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bts_library_purchased') || '[]'); } catch { return []; }
  });
  const [uploadedResources, setUploadedResources] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bts_library_uploads') || '[]'); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem('bts_library_saved', JSON.stringify(savedIds)); }, [savedIds]);
  useEffect(() => { localStorage.setItem('bts_library_purchased', JSON.stringify(purchasedIds)); }, [purchasedIds]);
  useEffect(() => { localStorage.setItem('bts_library_uploads', JSON.stringify(uploadedResources)); }, [uploadedResources]);

  // Reset to page 1 when any search, sorting or filtering changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeType, searchQuery, sortBy, selectedDifficulties, selectedFileTypes]);

  const allResources = [...SEED_RESOURCES, ...uploadedResources];

  const filtered = allResources.filter(r => {
    const q = searchQuery.toLowerCase();
    const matchQ = !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
      || r.tags.some(t => t.toLowerCase().includes(q)) || r.author.toLowerCase().includes(q);
    const matchCat = activeCategory === 'all' || r.category === activeCategory;
    const matchType = activeType === 'all' || r.type === activeType;
    const matchDiff = selectedDifficulties.length === 0 || selectedDifficulties.includes(r.difficulty || 'Intermediate');
    const matchFile = selectedFileTypes.length === 0 || selectedFileTypes.includes(r.fileType || 'PDF / EPUB');
    return matchQ && matchCat && matchType && matchDiff && matchFile;
  }).sort((a, b) => {
    if (sortBy === 'Highest Rated') return b.rating - a.rating;
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    if (sortBy === 'Most Recent' || sortBy === 'Newest') return b.id.localeCompare(a.id);
    return b.downloads - a.downloads; // Most Popular
  });

  const featuredResources = allResources.filter(r => r.featured);
  const savedResources = allResources.filter(r => savedIds.includes(r.id));

  // Pagination calculation
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedResources = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSave = (id) => setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handlePurchase = (resource) => {
    if (!purchasedIds.includes(resource.id)) {
      setPurchasedIds(prev => [...prev, resource.id]);
    }
    setShowResourceModal(null);
  };

  const handleUpload = (newResource) => {
    const resource = {
      ...newResource,
      id: `upload-${Date.now()}`,
      author: 'You',
      authorRole: 'Contributor',
      authorAvatar: 'https://ui-avatars.com/api/?name=You&background=d4a017&color=0b1121&size=40',
      rating: 0,
      reviews: 0,
      downloads: 0,
      featured: false,
      thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop',
    };
    setUploadedResources(prev => [resource, ...prev]);
    setShowUploadModal(false);
    setActiveTab('my-uploads');
  };

  const handleDifficultyToggle = (diff) => {
    setSelectedDifficulties(prev =>
      prev.includes(diff) ? prev.filter(x => x !== diff) : [...prev, diff]
    );
  };

  const handleFileTypeToggle = (format) => {
    setSelectedFileTypes(prev =>
      prev.includes(format) ? prev.filter(x => x !== format) : [...prev, format]
    );
  };

  const handleClearFilters = () => {
    setActiveCategory('all');
    setActiveType('all');
    setSearchQuery('');
    setSortBy('Most Recent');
    setSelectedDifficulties([]);
    setSelectedFileTypes([]);
    setCurrentPage(1);
  };

  const MAIN_TABS = [
    { key: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { key: 'browse', label: 'Browse', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { key: 'saved', label: 'Saved', icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z', count: savedIds.length },
    { key: 'my-uploads', label: 'My Uploads', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12', count: uploadedResources.length },
    { key: 'guide', label: 'Submission Guide', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  ];

  const goToBrowse = (category = null) => {
    if (category) setActiveCategory(category);
    setActiveTab('browse');
  };

  return (
    <>
      <Topbar
        searchPlaceholder="Search academic resources, whitepapers, templates..."
        onSearchChange={q => {
          setSearchQuery(q);
          if (q.trim()) setActiveTab('browse');
        }}
      />

      {/* ── Page Header ── */}
      <section className="mb-6 mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-brand-dark tracking-tight mb-1.5">D-Library</h2>
          <p className="text-gray-400 text-sm">Decentralized academic repository powered by BTS tokens</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-brand-dark text-white rounded-xl font-bold text-sm hover:bg-bts-gold hover:text-brand-dark transition-all shadow-lg shadow-brand-dark/10 shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          Submit Resource
        </button>
      </section>

      {/* ── Main Tab Navigation ── */}
      <div className="flex bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm gap-1 mb-6 flex-wrap">
        {MAIN_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              if (tab.key !== 'browse') handleClearFilters();
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.key ? 'bg-brand-dark text-white shadow' : 'text-gray-400 hover:text-brand-dark hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d={tab.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            {tab.label}
            {tab.count != null && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ══════════════ OVERVIEW TAB ══════════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">

          {/* Hero Banner */}
          <section className="relative rounded-2xl overflow-hidden bg-brand-dark p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 min-h-[200px]">
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #d4a017 1px, transparent 0)', backgroundSize: '28px 28px' }}
            />
            <div className="relative z-10 max-w-2xl space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-bts-gold">Intellectual Hub</span>
              <h3 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                Access Verified Academic <br />
                <span className="text-bts-gold">Resources & Templates</span>
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
                A decentralized repository of verified academic papers, tech templates, and premium courses curated for the Bitstacks scholar community.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => goToBrowse()}
                  className="px-5 py-2.5 bg-bts-gold text-brand-dark rounded-xl font-bold text-sm flex items-center gap-2 hover:brightness-110 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                  Browse All Resources
                </button>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-5 py-2.5 bg-white/10 text-white border border-white/20 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-white/20 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                  Submit Resource
                </button>
              </div>
            </div>
            <div className="relative z-10 hidden md:flex items-center justify-center">
              <div className="w-48 h-48 bg-bts-gold/10 rounded-full blur-3xl absolute" />
              <svg className="w-40 h-40 text-bts-gold/20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </section>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Resources', value: allResources.length, icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', color: 'text-blue-500' },
              { label: 'My Submissions', value: uploadedResources.length, icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12', color: 'text-bts-gold' },
              { label: 'Saved Resources', value: savedIds.length, icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z', color: 'text-purple-500' },
              { label: 'Total Downloads', value: purchasedIds.length + 48, icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4', color: 'text-emerald-500' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm group hover:border-bts-gold/40 hover:shadow-md transition-all">
                <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">{s.label}</p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-extrabold text-brand-dark">{s.value}</p>
                  <svg className={`w-6 h-6 ${s.color} opacity-60 group-hover:opacity-100 transition-opacity`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d={s.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Popular Categories */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-brand-dark">Popular Categories</h3>
              <button onClick={() => goToBrowse()} className="text-xs font-bold text-secondary hover:underline">View All →</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { key: 'smart-contracts', label: 'Smart Contracts', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', color: 'from-purple-500/10 to-purple-500/5', iconColor: 'text-purple-600', borderColor: 'border-purple-100 hover:border-purple-300' },
                { key: 'fintech', label: 'DeFi / Fintech', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'from-emerald-500/10 to-emerald-500/5', iconColor: 'text-emerald-600', borderColor: 'border-emerald-100 hover:border-emerald-300' },
                { key: 'ui-ux', label: 'UI/UX Design', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'from-pink-500/10 to-pink-500/5', iconColor: 'text-pink-600', borderColor: 'border-pink-100 hover:border-pink-300' },
                { key: 'ai-ethics', label: 'AI Ethics', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', color: 'from-amber-500/10 to-amber-500/5', iconColor: 'text-amber-600', borderColor: 'border-amber-100 hover:border-amber-300' },
                { key: 'big-data', label: 'Big Data', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4', color: 'from-blue-500/10 to-blue-500/5', iconColor: 'text-blue-600', borderColor: 'border-blue-100 hover:border-blue-300' },
                { key: 'cybersecurity', label: 'Cybersecurity', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', color: 'from-red-500/10 to-red-500/5', iconColor: 'text-red-600', borderColor: 'border-red-100 hover:border-red-300' },
              ].map(cat => {
                const count = allResources.filter(r => r.category === cat.key).length;
                return (
                  <button
                    key={cat.key}
                    onClick={() => goToBrowse(cat.key)}
                    className={`bg-gradient-to-br ${cat.color} border ${cat.borderColor} rounded-2xl p-4 flex flex-col items-center gap-3 hover:shadow-md transition-all group cursor-pointer`}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center ${cat.iconColor}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d={cat.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-extrabold text-brand-dark leading-tight">{cat.label}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{count} resource{count !== 1 ? 's' : ''}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Trending Resources */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-brand-dark flex items-center gap-2">
                <svg className="w-5 h-5 text-bts-gold" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Trending Resources
              </h3>
              <button onClick={() => goToBrowse()} className="text-xs font-bold text-secondary hover:underline">Browse All →</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                {featuredResources[0] && (
                  <FeaturedCard
                    resource={featuredResources[0]}
                    isSaved={savedIds.includes(featuredResources[0].id)}
                    isPurchased={purchasedIds.includes(featuredResources[0].id)}
                    onSave={handleSave}
                    onOpen={setShowResourceModal}
                  />
                )}
              </div>
              <div className="flex flex-col gap-5">
                {featuredResources.slice(1, 3).map(r => (
                  <SmallFeaturedCard
                    key={r.id}
                    resource={r}
                    isSaved={savedIds.includes(r.id)}
                    onSave={handleSave}
                    onOpen={setShowResourceModal}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Most Popular Row */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-brand-dark">Most Downloaded</h3>
              <button onClick={() => goToBrowse()} className="text-xs font-bold text-secondary hover:underline">See More →</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...allResources].sort((a,b) => b.downloads - a.downloads).slice(0,3).map(r => (
                <div
                  key={r.id}
                  onClick={() => setShowResourceModal(r)}
                  className="bg-white border border-gray-100 rounded-2xl p-4 flex items-start gap-4 hover:shadow-md hover:border-bts-gold/30 transition-all cursor-pointer group"
                >
                  <img src={r.thumbnail} alt={r.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${TYPE_LABELS[r.type]?.color || 'bg-gray-100 text-gray-500'}`}>{TYPE_LABELS[r.type]?.label}</span>
                    <p className="text-sm font-extrabold text-brand-dark mt-1 leading-tight line-clamp-2">{r.title}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                        {r.downloads.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-bts-gold font-bold flex items-center gap-0.5">
                        ★ {r.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom: My Submissions + Activity History */}
          <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 border-t border-gray-100 pt-6">

            {/* My Submissions */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-extrabold text-brand-dark">My Submissions</h3>
                <button onClick={() => setActiveTab('my-uploads')} className="text-xs font-bold text-secondary hover:underline">View All</button>
              </div>
              {uploadedResources.length === 0 ? (
                <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-8 text-center">
                  <svg className="w-10 h-10 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                  <p className="text-sm font-bold text-gray-400 mb-2">No submissions yet</p>
                  <p className="text-xs text-gray-300 mb-4">Share your knowledge and earn BTS rewards.</p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-4 py-2 bg-brand-dark text-white rounded-xl font-bold text-xs hover:bg-bts-gold hover:text-brand-dark transition-all cursor-pointer"
                  >
                    Submit Your First Resource
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {uploadedResources.slice(0, 3).map(r => (
                    <div key={r.id} className="bg-white border border-gray-100 rounded-xl p-3.5 flex items-center gap-3 hover:shadow-sm transition-all">
                      <img src={r.thumbnail} alt={r.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-extrabold text-brand-dark truncate">{r.title}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{r.fileType} · {r.price > 0 ? `◈ ${r.price} BTS` : 'Free'}</p>
                      </div>
                      <span className="text-[9px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold shrink-0">Live</span>
                    </div>
                  ))}
                  {uploadedResources.length > 3 && (
                    <button onClick={() => setActiveTab('my-uploads')} className="w-full text-xs font-bold text-gray-400 hover:text-brand-dark py-2 hover:bg-gray-50 rounded-xl transition-all">
                      +{uploadedResources.length - 3} more submissions
                    </button>
                  )}
                  <div className="bg-brand-dark rounded-xl p-4 text-white">
                    <p className="text-xs font-extrabold text-bts-gold mb-1">Estimated Earnings</p>
                    <p className="text-2xl font-extrabold">◈ {uploadedResources.length * 15}</p>
                    <p className="text-[10px] text-gray-400 mt-1">From {uploadedResources.length} published resources</p>
                  </div>
                </div>
              )}
            </div>

            {/* Activity History */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-extrabold text-brand-dark">Activity History</h3>
                <span className="text-[10px] bg-gray-100 text-gray-500 font-bold px-2.5 py-1 rounded-full">Last 30 days</span>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Resource</th>
                      <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 hidden md:table-cell">Type</th>
                      <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 hidden md:table-cell">Date</th>
                      <th className="px-5 py-3 text-right text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_ACTIVITY.map((item, i) => (
                      <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${i < RECENT_ACTIVITY.length - 1 ? 'border-b border-gray-50' : ''}`}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.iconBg}`}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </svg>
                            </div>
                            <span className="text-xs font-bold text-brand-dark leading-tight">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-400 font-semibold hidden md:table-cell">{item.type}</td>
                        <td className="px-5 py-3.5 text-xs text-gray-400 font-semibold hidden md:table-cell">{item.date}</td>
                        <td className="px-5 py-3.5 text-right">
                          <span className={`text-[9px] px-2 py-1 rounded-full font-extrabold ${
                            item.action === 'download' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                          }`}>
                            {item.action === 'download' ? 'Downloaded' : 'Played'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {savedIds.length > 0 && savedIds.slice(0, 2).map((id, i) => {
                      const res = allResources.find(r => r.id === id);
                      if (!res) return null;
                      return (
                        <tr key={`saved-${id}`} className={`hover:bg-gray-50 transition-colors ${i < savedIds.length - 1 ? 'border-b border-gray-50' : ''}`}>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-amber-100 text-amber-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                </svg>
                              </div>
                              <span className="text-xs font-bold text-brand-dark leading-tight">{res.title}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-gray-400 font-semibold hidden md:table-cell">{res.fileType}</td>
                          <td className="px-5 py-3.5 text-xs text-gray-400 font-semibold hidden md:table-cell">Recently</td>
                          <td className="px-5 py-3.5 text-right">
                            <span className="text-[9px] px-2 py-1 rounded-full font-extrabold bg-amber-50 text-amber-700">Saved</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

        </div>
      )}

      {/* ══════════════ BROWSE TAB ══════════════ */}
      {activeTab === 'browse' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Featured Trending Section (only shown when filters are reset to default) */}
          {featuredResources.length > 0 && !searchQuery && activeCategory === 'all' && activeType === 'all' && selectedDifficulties.length === 1 && selectedDifficulties[0] === 'Intermediate' && selectedFileTypes.length === 0 && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-extrabold text-brand-dark flex items-center gap-2">
                  <svg className="w-5 h-5 text-bts-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Trending Resources
                </h3>
              </div>

              {/* Featured Large + Side */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Big featured card */}
                <div className="lg:col-span-2">
                  <FeaturedCard
                    resource={featuredResources[0]}
                    isSaved={savedIds.includes(featuredResources[0].id)}
                    isPurchased={purchasedIds.includes(featuredResources[0].id)}
                    onSave={handleSave}
                    onOpen={setShowResourceModal}
                  />
                </div>
                {/* Side cards */}
                <div className="flex flex-col gap-5">
                  {featuredResources.slice(1, 3).map(r => (
                    <SmallFeaturedCard
                      key={r.id}
                      resource={r}
                      isSaved={savedIds.includes(r.id)}
                      onSave={handleSave}
                      onOpen={setShowResourceModal}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Discovery & Search Section */}
          <section className="space-y-6">
            <div>
              <span className="text-xs font-extrabold text-secondary-container uppercase tracking-widest mb-1.5 block">Knowledge Hub</span>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-extrabold text-brand-dark tracking-tight leading-tight">Discovery & Search</h3>
                  <p className="text-gray-400 text-xs mt-1">Access peer-reviewed whitepapers, elite templates, and comprehensive technical courses curated for the decentralized future.</p>
                </div>
                
                {/* Layout Toggle Buttons */}
                <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm shrink-0 w-fit self-end">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-gray-100 text-brand-dark' : 'text-gray-400 hover:text-brand-dark hover:bg-gray-50'}`}
                    title="Grid view"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-gray-100 text-brand-dark' : 'text-gray-400 hover:text-brand-dark hover:bg-gray-50'}`}
                    title="List view"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Advanced Filter Bar */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
              {/* Input Search Box */}
              <div className="relative w-full lg:flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </span>
                <input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-container/20 focus:border-secondary-container transition-all text-xs font-semibold" 
                  placeholder="Search resources, authors, or topics..." 
                  type="text"
                />
              </div>

              {/* Dropdown Selects */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
                <select 
                  value={activeType}
                  onChange={(e) => setActiveType(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-xs font-bold text-gray-500 focus:outline-none focus:ring-1 focus:ring-secondary-container cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="whitepaper">Whitepapers</option>
                  <option value="book">eBooks</option>
                  <option value="template">Templates</option>
                  <option value="course">Video Courses</option>
                </select>

                <select 
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-xs font-bold text-gray-500 focus:outline-none focus:ring-1 focus:ring-secondary-container cursor-pointer"
                >
                  <option value="all">All Topics</option>
                  <option value="smart-contracts">Smart Contracts</option>
                  <option value="fintech">DeFi</option>
                  <option value="ui-ux">UI/UX Design</option>
                  <option value="ai-ethics">AI Ethics</option>
                  <option value="big-data">Big Data</option>
                  <option value="cybersecurity">Cybersecurity</option>
                </select>

                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-xs font-bold text-gray-500 focus:outline-none focus:ring-1 focus:ring-secondary-container cursor-pointer"
                >
                  <option value="Most Recent">Most Recent</option>
                  <option value="Most Popular">Most Popular</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                </select>

                <div className="flex items-center justify-center">
                  <button 
                    onClick={handleClearFilters}
                    className="text-xs font-extrabold text-secondary-container hover:underline px-4 cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar + Results Layout */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Sidebar Filters */}
              <aside className="w-full lg:w-64 space-y-8 shrink-0">
                {/* Difficulty Filter */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-dark mb-4 border-b border-gray-100 pb-2">Difficulty</h4>
                  <div className="space-y-3">
                    {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(diff => (
                      <label key={diff} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox"
                          checked={selectedDifficulties.includes(diff)}
                          onChange={() => handleDifficultyToggle(diff)}
                          className="rounded border-gray-200 text-secondary-container focus:ring-secondary-container w-4 h-4 cursor-pointer"
                        />
                        <span className={`text-xs font-bold transition-colors ${selectedDifficulties.includes(diff) ? 'text-brand-dark font-extrabold' : 'text-gray-400 group-hover:text-brand-dark'}`}>
                          {diff}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* File Type Filter */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-dark mb-4 border-b border-gray-100 pb-2">File Type</h4>
                  <div className="space-y-3">
                    {['PDF / EPUB', 'HD Video (MP4)', 'Figma / Design Files', 'GitHub Repository'].map(format => (
                      <label key={format} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox"
                          checked={selectedFileTypes.includes(format)}
                          onChange={() => handleFileTypeToggle(format)}
                          className="rounded border-gray-200 text-secondary-container focus:ring-secondary-container w-4 h-4 cursor-pointer"
                        />
                        <span className={`text-xs font-bold transition-colors ${selectedFileTypes.includes(format) ? 'text-brand-dark font-extrabold' : 'text-gray-400 group-hover:text-brand-dark'}`}>
                          {format}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Upgrade Promo */}
                <div className="p-6 bg-brand-dark text-white rounded-2xl relative overflow-hidden group shadow-lg">
                  <div className="relative z-10">
                    <p className="font-extrabold text-base text-white mb-1">Upgrade to Pro</p>
                    <p className="text-gray-400 text-xs mb-4 leading-relaxed">Get unlimited access to all courses and premium technical resources.</p>
                    <button className="w-full py-2.5 bg-secondary-container text-on-secondary-fixed font-extrabold rounded-xl text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-secondary-container/20 cursor-pointer">
                      Upgrade Now
                    </button>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                </div>
              </aside>

              {/* Resource Results Area */}
              <div className="flex-1 space-y-6 w-full">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-gray-400">{filtered.length} resources found</p>
                </div>

                {paginatedResources.length === 0 ? (
                  <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center shadow-sm">
                    <svg className="w-12 h-12 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                    <p className="text-sm font-bold text-gray-400 mb-2">No resources found. Try different filters.</p>
                    <button onClick={handleClearFilters} className="text-xs font-bold text-secondary-container hover:underline cursor-pointer">Reset Filters</button>
                  </div>
                ) : (
                  <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" : "flex flex-col gap-4"}>
                    {paginatedResources.map(r => (
                      viewMode === 'grid' ? (
                        <ResourceCard
                          key={r.id}
                          resource={r}
                          isSaved={savedIds.includes(r.id)}
                          isPurchased={purchasedIds.includes(r.id)}
                          onSave={handleSave}
                          onOpen={setShowResourceModal}
                        />
                      ) : (
                        <ResourceListCard
                          key={r.id}
                          resource={r}
                          isSaved={savedIds.includes(r.id)}
                          isPurchased={purchasedIds.includes(r.id)}
                          onSave={handleSave}
                          onOpen={setShowResourceModal}
                        />
                      )
                    ))}
                  </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-1.5 pt-4">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={`w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${currentPage === 1 ? 'opacity-40 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50 bg-white'}`}
                      title="Previous page"
                    >
                      <svg className="w-4 h-4 text-brand-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </button>
                    
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs transition-colors cursor-pointer ${currentPage === page ? 'bg-brand-dark text-white shadow' : 'bg-white border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-brand-dark'}`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={`w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50 bg-white'}`}
                      title="Next page"
                    >
                      <svg className="w-4 h-4 text-brand-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Bottom Section: Recent Activity + Contribute */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-extrabold text-brand-dark mb-4">Recent Activity</h3>
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Resource</th>
                      <th className="px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 hidden md:table-cell">Type</th>
                      <th className="px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 hidden md:table-cell">Date</th>
                      <th className="px-5 py-3.5 text-right text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_ACTIVITY.map((item, i) => (
                      <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${i < RECENT_ACTIVITY.length - 1 ? 'border-b border-gray-50' : ''}`}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.iconBg}`}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </svg>
                            </div>
                            <span className="text-sm font-bold text-brand-dark">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-xs text-gray-400 font-semibold hidden md:table-cell">{item.type}</td>
                        <td className="px-5 py-4 text-xs text-gray-400 font-semibold hidden md:table-cell">{item.date}</td>
                        <td className="px-5 py-4 text-right">
                          <button className="p-2 rounded-lg text-gray-400 hover:text-bts-gold hover:bg-yellow-50 transition-all cursor-pointer">
                            {item.action === 'download' ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </svg>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Contribution Module */}
            <div>
              <h3 className="text-lg font-extrabold text-brand-dark mb-4">Contribution</h3>
              <div className="bg-brand-dark text-white rounded-2xl p-7 flex flex-col gap-5 relative overflow-hidden shadow-lg">
                <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-bts-gold/10 rounded-full blur-3xl pointer-events-none" />
                <div className="space-y-1.5">
                  <h4 className="text-base font-extrabold">Share Your Knowledge</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Verified scholars and mentors can earn BTS by contributing high-quality academic resources to the ecosystem.
                  </p>
                </div>
                <ul className="space-y-2.5">
                  {[
                    'Earn BTS rewards per download',
                    'Mint your content as Academic NFTs',
                    'Build your Bitstacks reputation',
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-xs font-semibold text-gray-300">
                      <svg className="w-4 h-4 text-bts-gold shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="w-full py-3 bg-bts-gold text-brand-dark rounded-xl font-extrabold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 mt-1 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                  Start Uploading
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ══════════════ SAVED TAB ══════════════ */}
      {activeTab === 'saved' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-brand-dark">Saved Resources</h3>
              <p className="text-xs text-gray-400 mt-0.5">{savedResources.length} resource{savedResources.length !== 1 ? 's' : ''} bookmarked</p>
            </div>
          </div>
          {savedResources.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center shadow-sm">
              <svg className="w-12 h-12 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <p className="text-sm font-bold text-gray-400 mb-2">No saved resources yet.</p>
              <p className="text-xs text-gray-300">Browse the library and bookmark resources you want to revisit.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {savedResources.map(r => (
                <ResourceCard
                  key={r.id}
                  resource={r}
                  isSaved={true}
                  isPurchased={purchasedIds.includes(r.id)}
                  onSave={handleSave}
                  onOpen={setShowResourceModal}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════ MY UPLOADS TAB ══════════════ */}
      {activeTab === 'my-uploads' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-brand-dark">My Uploaded Resources</h3>
              <p className="text-xs text-gray-400 mt-0.5">{uploadedResources.length} resource{uploadedResources.length !== 1 ? 's' : ''} published</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-dark text-white rounded-xl font-bold text-sm hover:bg-bts-gold hover:text-brand-dark transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              Upload New
            </button>
          </div>
          {uploadedResources.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center shadow-sm">
              <svg className="w-12 h-12 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <p className="text-sm font-bold text-gray-400 mb-2">No uploads yet.</p>
              <p className="text-xs text-gray-300 mb-4">Share your knowledge and earn BTS rewards per download.</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-5 py-2.5 bg-brand-dark text-white rounded-xl font-bold text-sm hover:bg-bts-gold hover:text-brand-dark transition-all cursor-pointer"
              >
                Submit Your First Resource
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {uploadedResources.map(r => (
                <ResourceCard
                  key={r.id}
                  resource={r}
                  isSaved={savedIds.includes(r.id)}
                  isPurchased={true}
                  onSave={handleSave}
                  onOpen={setShowResourceModal}
                  isOwn
                />
              ))}
            </div>
          )}

          {/* Earnings Summary */}
          {uploadedResources.length > 0 && (
            <div className="bg-brand-dark text-white rounded-2xl p-6 shadow-md">
              <p className="text-xs font-extrabold uppercase tracking-widest text-white/50 mb-4">Contribution Summary</p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Published', value: uploadedResources.length },
                  { label: 'Estimated Earnings', value: `◈ ${uploadedResources.length * 15}` },
                  { label: 'Avg Rating', value: '—' },
                ].map(s => (
                  <div key={s.label} className="bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-xl font-extrabold text-bts-gold">{s.value}</p>
                    <p className="text-[10px] text-white/40 font-bold mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════ SUBMISSION GUIDE TAB ══════════════ */}
      {activeTab === 'guide' && (
        <div className="space-y-8 animate-fadeIn">

          {/* Guide Header Banner */}
          <section className="relative rounded-2xl overflow-hidden bg-brand-dark p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #d4a017 1px, transparent 0)', backgroundSize: '28px 28px' }} />
            <div className="relative z-10 max-w-xl space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-bts-gold">Step-by-Step</span>
              <h3 className="text-3xl font-extrabold text-white leading-tight">Submission Guide</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Everything you need to know to prepare, format, price, and publish your academic resources to the D-Library ecosystem.
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-bts-gold text-brand-dark rounded-xl font-bold text-sm hover:brightness-110 transition-all mt-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                Submit a Resource Now
              </button>
            </div>
            <div className="relative z-10 hidden md:flex items-center justify-center">
              <div className="w-36 h-36 bg-bts-gold/10 rounded-full blur-3xl absolute" />
              <span className="material-symbols-outlined text-bts-gold/30" style={{ fontSize: '120px' }}>auto_stories</span>
            </div>
          </section>

          {/* Process Steps */}
          <section>
            <h3 className="text-lg font-extrabold text-brand-dark mb-5">The 4-Step Submission Process</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { step: 1, title: 'Resource Info', desc: 'Enter your title, write a detailed description, and select the subject topic and difficulty level.', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', color: 'bg-blue-50 text-blue-600 border-blue-100' },
                { step: 2, title: 'Content Upload', desc: 'Drag and drop your file or browse to select it. Supported: PDF, EPUB, MP4, ZIP, Figma files.', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12', color: 'bg-purple-50 text-purple-600 border-purple-100' },
                { step: 3, title: 'Set Pricing', desc: 'Choose Premium (BTS token price) or Open Access (free, earns 2.5x reputation faster).', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-amber-50 text-amber-600 border-amber-100' },
                { step: 4, title: 'Review & Publish', desc: 'Double-check all metadata, confirm compliance policies, and click Publish Resource to go live instantly.', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
              ].map(({ step, title, desc, icon, color }) => (
                <div key={step} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${color}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d={icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest">Step {step}</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-brand-dark mb-2">{title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Content Format Requirements */}
          <section>
            <h3 className="text-lg font-extrabold text-brand-dark mb-5">Content Format Requirements</h3>
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Resource Type</th>
                    <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Accepted Formats</th>
                    <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 hidden md:table-cell">Requirements</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type: 'Whitepapers / eBooks', badge: 'bg-purple-100 text-purple-700', formats: '.pdf, .epub', reqs: 'Selectable text, table of contents, valid citations', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
                    { type: 'Video Courses', badge: 'bg-blue-100 text-blue-700', formats: '.mp4, .mov, .mkv', reqs: 'HD 720p+, clear audio, max 500MB per file', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
                    { type: 'Code Templates', badge: 'bg-amber-100 text-amber-700', formats: '.zip, .tar.gz', reqs: 'README.md required, structured folders, unit tests', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
                    { type: 'Design Kits', badge: 'bg-pink-100 text-pink-700', formats: '.fig, .sketch, .zip', reqs: 'Layer groups, global tokens, responsive grids', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
                    { type: 'Datasets', badge: 'bg-emerald-100 text-emerald-700', formats: '.csv, .json, .parquet', reqs: 'Column docs, data dictionary, no PII included', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
                  ].map((row, i, arr) => (
                    <tr key={row.type} className={`hover:bg-gray-50 transition-colors ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${row.badge}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d={row.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </svg>
                          </div>
                          <span className="text-xs font-extrabold text-brand-dark">{row.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-[11px] bg-gray-100 text-secondary px-2 py-0.5 rounded-lg font-bold">{row.formats}</code>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400 font-semibold hidden md:table-cell">{row.reqs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Pricing Tiers + Policies Side-by-Side */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Pricing Tiers */}
            <div>
              <h3 className="text-lg font-extrabold text-brand-dark mb-5">Pricing Tiers</h3>
              <div className="space-y-4">
                <div className="bg-white border-2 border-bts-gold/40 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-bts-gold">Premium Tier</span>
                      <h4 className="text-base font-extrabold text-brand-dark mt-0.5">BTS Monetization</h4>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-bts-gold/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-bts-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {['Set your own BTS token price (min. 5 BTS)', 'Buyers purchase access to download', 'Earn secondary yields from the network pool', 'Highly rated resources gain editorial spotlights'].map(item => (
                      <li key={item} className="flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-4 h-4 text-bts-gold shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">Open Access</span>
                      <h4 className="text-base font-extrabold text-brand-dark mt-0.5">Public Good</h4>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {['Free for all Bitstacks community members', 'Earns a green "Public Good" badge', '2.5× faster reputation score accumulation', 'Unlocks governance voting weight sooner'].map(item => (
                      <li key={item} className="flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Policies */}
            <div>
              <h3 className="text-lg font-extrabold text-brand-dark mb-5">Compliance Policies</h3>
              <div className="space-y-4">
                <div className="p-5 bg-yellow-50 border border-yellow-200 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                    <h4 className="text-sm font-extrabold text-amber-800">AI Disclosure Required</h4>
                  </div>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Any resource created primarily using Generative AI (text, code, or images) must state <strong>"AI-Generated Content Disclosed"</strong> at the top of the description. Failure to disclose results in a <strong>permanent publishing ban</strong>.
                  </p>
                </div>
                <div className="p-5 bg-red-50 border border-red-200 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                    <h4 className="text-sm font-extrabold text-red-800">Copyright Clearance</h4>
                  </div>
                  <p className="text-xs text-red-700 leading-relaxed">
                    You must hold the intellectual property or appropriate open-source license for all codebases, UI assets, and textbooks submitted. Third-party materials require explicit permission.
                  </p>
                </div>
                <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                    <h4 className="text-sm font-extrabold text-blue-800">Peer Review Process</h4>
                  </div>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    All submissions undergo randomized peer review by verified scholars. Resources with 3+ positive reviews earn the <strong>Verified</strong> badge, increasing their discovery ranking significantly.
                  </p>
                </div>
                <div className="p-5 bg-white border border-gray-100 rounded-2xl">
                  <h4 className="text-xs font-extrabold text-brand-dark mb-3 uppercase tracking-widest">Categorization Tips</h4>
                  <ul className="space-y-2">
                    {[
                      { label: 'Smart Contracts', tip: 'Solidity, Vyper, Rust, ZK circuits, audit reports' },
                      { label: 'DeFi / Fintech', tip: 'AMM architecture, staking, tokenomics, lending' },
                      { label: 'UI/UX Design', tip: 'dApp wireframes, user flows, component libraries' },
                      { label: 'AI Ethics', tip: 'Algorithmic fairness, model audits, decentralized AI' },
                    ].map(({ label, tip }) => (
                      <li key={label} className="flex items-start gap-2 text-xs">
                        <span className="font-extrabold text-brand-dark shrink-0 w-28">{label}</span>
                        <span className="text-gray-400">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="bg-brand-dark rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-extrabold text-white">Ready to contribute?</h3>
              <p className="text-gray-400 text-sm mt-1">Start the 4-step wizard and publish your resource in under 5 minutes.</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-8 py-3 bg-bts-gold text-brand-dark rounded-xl font-extrabold text-sm hover:brightness-110 transition-all shadow-lg shrink-0 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              Submit Resource
            </button>
          </div>

        </div>
      )}

      {/* ── Modals ── */}
      {showResourceModal && (
        <ResourceDetailModal
          resource={showResourceModal}
          isSaved={savedIds.includes(showResourceModal.id)}
          isPurchased={purchasedIds.includes(showResourceModal.id)}
          purchasedIds={purchasedIds}
          onSave={handleSave}
          onPurchase={handlePurchase}
          onClose={() => setShowResourceModal(null)}
        />
      )}
      {showUploadModal && (
        <UploadModal onClose={() => setShowUploadModal(false)} onUpload={handleUpload} />
      )}
    </>
  );
}

// ─── Featured Large Card ─────────────────────────────────────────────────────
function FeaturedCard({ resource, isSaved, isPurchased, onSave, onOpen }) {
  return (
    <div
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col md:flex-row h-full"
      onClick={() => onOpen(resource)}
    >
      <div className="md:w-2/5 relative h-48 md:h-auto overflow-hidden bg-gray-100 shrink-0">
        <img
          src={resource.thumbnail}
          alt={resource.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-brand-dark/80 backdrop-blur-md text-white px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider">
          TRENDING
        </div>
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${TYPE_LABELS[resource.type]?.color}`}>
          {TYPE_LABELS[resource.type]?.label}
        </div>
      </div>
      <div className="md:w-3/5 p-7 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            <span className="bg-brand-dark/80 backdrop-blur-md text-white px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest">{resource.difficulty || 'Intermediate'}</span>
            <span className="bg-secondary-container text-on-secondary-fixed px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest">{resource.fileType || 'PDF / EPUB'}</span>
          </div>
          <h4 className="text-base font-extrabold text-brand-dark leading-snug group-hover:text-bts-gold transition-colors line-clamp-2">
            {resource.title}
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{resource.description}</p>
        </div>
        <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
          <div className="flex items-center gap-3">
            <img src={resource.authorAvatar} alt={resource.author} className="w-8 h-8 rounded-full border border-gray-100" />
            <div>
              <p className="text-xs font-bold text-brand-dark leading-tight">{resource.author}</p>
              <p className="text-[10px] text-gray-400">{resource.authorRole}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-bold">{resource.price === 0 ? 'FREE' : 'Price'}</p>
              {resource.price > 0 && <p className="text-base font-extrabold text-brand-dark"><span className="text-bts-gold">◈</span> {resource.price} <span className="text-[10px] text-gray-400">BTS</span></p>}
            </div>
            <button
              onClick={e => { e.stopPropagation(); onSave(resource.id); }}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${isSaved ? 'text-bts-gold bg-yellow-50 border-yellow-200' : 'text-gray-300 border-gray-200 hover:text-bts-gold hover:bg-yellow-50 hover:border-yellow-200'}`}
            >
              <svg className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
            <button
              onClick={e => { e.stopPropagation(); onOpen(resource); }}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer ${isPurchased ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-brand-dark text-white hover:bg-bts-gold hover:text-brand-dark'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d={isPurchased ? 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' : 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Small Featured Card ─────────────────────────────────────────────────────
function SmallFeaturedCard({ resource, isSaved, onSave, onOpen }) {
  return (
    <div
      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-bts-gold/40 transition-all group cursor-pointer flex flex-col gap-4"
      onClick={() => onOpen(resource)}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 overflow-hidden border border-gray-100 shrink-0">
            <img src={resource.thumbnail} alt="" className="w-full h-full object-cover" />
          </div>
          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold ${TYPE_LABELS[resource.type]?.color}`}>
            {TYPE_LABELS[resource.type]?.label}
          </span>
        </div>
        <span className="text-[10px] text-gray-400 font-bold">{resource.size}</span>
      </div>
      <div className="flex-1">
        <h5 className="text-sm font-extrabold text-brand-dark group-hover:text-bts-gold transition-colors line-clamp-2 mb-1.5">{resource.title}</h5>
        <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{resource.description}</p>
      </div>
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <span className="text-[11px] font-bold text-gray-500">{resource.rating}</span>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-extrabold text-brand-dark leading-none">
            {resource.price === 0 ? <span className="text-emerald-600">FREE</span> : <><span className="text-bts-gold">◈</span> {resource.price}</>}
          </p>
          <button
            onClick={e => { e.stopPropagation(); onSave(resource.id); }}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${isSaved ? 'text-bts-gold' : 'text-gray-300 hover:text-bts-gold'}`}
          >
            <svg className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Resource Card ───────────────────────────────────────────────────────────
function ResourceCard({ resource, isSaved, isPurchased, onSave, onOpen, isOwn }) {
  return (
    <div
      className={`bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 group cursor-pointer flex flex-col ${
        isPurchased ? 'border-emerald-200 ring-1 ring-emerald-50' : 'border-gray-100 hover:border-bts-gold/40'
      }`}
      onClick={() => onOpen(resource)}
    >
      {/* Thumbnail */}
      <div className="relative h-36 overflow-hidden bg-gray-100 shrink-0">
        <img src={resource.thumbnail} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        {/* Mockup badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <span className="bg-brand-dark/85 backdrop-blur-md text-white px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest leading-none">
            {resource.difficulty || 'Intermediate'}
          </span>
          <span className="bg-secondary-container text-on-secondary-fixed px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest leading-none">
            {resource.fileType || 'PDF / EPUB'}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold ${TYPE_LABELS[resource.type]?.color}`}>
            {TYPE_LABELS[resource.type]?.label}
          </span>
          {isPurchased && (
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
              {isOwn ? 'PUBLISHED' : 'OWNED'}
            </span>
          )}
        </div>
        <button
          onClick={e => { e.stopPropagation(); onSave(resource.id); }}
          className={`absolute top-3 right-3 p-1.5 rounded-lg backdrop-blur-sm transition-all cursor-pointer ${
            isSaved ? 'bg-yellow-400/90 text-white' : 'bg-white/80 text-gray-500 hover:bg-yellow-400/90 hover:text-white'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {resource.tags.slice(0, 3).map(t => (
            <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-extrabold">{t}</span>
          ))}
        </div>
        <h5 className="text-sm font-extrabold text-brand-dark leading-snug mb-1.5 group-hover:text-bts-gold transition-colors line-clamp-2 flex-1">
          {resource.title}
        </h5>
        <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2 mb-4">{resource.description}</p>

        {/* Author + Stats */}
        <div className="flex items-center gap-2 mb-4 mt-auto">
          <img src={resource.authorAvatar} alt={resource.author} className="w-6 h-6 rounded-full border border-gray-100" />
          <span className="text-[11px] font-bold text-gray-500 truncate max-w-[80px]">{resource.author}</span>
          <span className="text-gray-200">·</span>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="text-[11px] font-bold text-gray-500">{resource.rating > 0 ? resource.rating : '—'}</span>
          </div>
          <span className="text-gray-200">·</span>
          <span className="text-[10px] text-gray-400 truncate">{resource.downloads.toLocaleString()} dl</span>
        </div>

        {/* Price + Action */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-55 mt-auto">
          <div>
            {resource.price === 0 ? (
              <span className="text-sm font-extrabold text-emerald-600">FREE</span>
            ) : (
              <p className="text-base font-extrabold text-brand-dark">
                <span className="text-bts-gold">◈</span> {resource.price} <span className="text-[10px] text-gray-400 font-bold">BTS</span>
              </p>
            )}
          </div>
          <button
            onClick={e => { e.stopPropagation(); onOpen(resource); }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all shadow-sm cursor-pointer ${
              isPurchased
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-brand-dark text-white hover:bg-bts-gold hover:text-brand-dark'
            }`}
          >
            {isPurchased ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                Download
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                {resource.price === 0 ? 'Get Free' : 'Purchase'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Resource List Card (Horizontal Layout) ──────────────────────────────────
function ResourceListCard({ resource, isSaved, isPurchased, onSave, onOpen, isOwn }) {
  return (
    <div
      className={`bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 group cursor-pointer flex flex-col sm:flex-row items-stretch p-4 gap-5 ${
        isPurchased ? 'border-emerald-200 ring-1 ring-emerald-50' : 'border-gray-100 hover:border-bts-gold/40'
      }`}
      onClick={() => onOpen(resource)}
    >
      <div className="w-full sm:w-44 h-32 shrink-0 rounded-xl overflow-hidden bg-gray-100 relative">
        <img src={resource.thumbnail} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-extrabold ${TYPE_LABELS[resource.type]?.color}`}>
            {TYPE_LABELS[resource.type]?.label}
          </span>
        </div>
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="bg-brand-dark/85 backdrop-blur-md text-white px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest leading-none">
              {resource.difficulty || 'Intermediate'}
            </span>
            <span className="bg-secondary-container text-on-secondary-fixed px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest leading-none">
              {resource.fileType || 'PDF / EPUB'}
            </span>
            {isPurchased && (
              <span className="px-2 py-0.5 rounded-lg text-[9px] font-extrabold bg-emerald-100 text-emerald-700 leading-none">
                {isOwn ? 'PUBLISHED' : 'OWNED'}
              </span>
            )}
          </div>
          <h5 className="text-base font-extrabold text-brand-dark leading-snug group-hover:text-bts-gold transition-colors line-clamp-1">
            {resource.title}
          </h5>
          <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2 mt-1">{resource.description}</p>
        </div>
        
        <div className="flex items-center gap-4 mt-3 flex-wrap">
          <div className="flex items-center gap-2">
            <img src={resource.authorAvatar} alt={resource.author} className="w-6 h-6 rounded-full border border-gray-100" />
            <span className="text-[11px] font-bold text-gray-500">{resource.author}</span>
          </div>
          <span className="text-gray-200">·</span>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="text-[11px] font-bold text-gray-500">{resource.rating > 0 ? resource.rating : '—'}</span>
          </div>
          <span className="text-gray-200">·</span>
          <span className="text-[10px] text-gray-400">{resource.downloads.toLocaleString()} dl</span>
        </div>
      </div>

      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 w-full sm:w-auto shrink-0 border-t sm:border-t-0 sm:border-l border-gray-50 pt-3 sm:pt-0 sm:pl-5">
        <div className="text-left sm:text-right">
          {resource.price === 0 ? (
            <span className="text-sm font-extrabold text-emerald-600">FREE</span>
          ) : (
            <p className="text-base font-extrabold text-brand-dark leading-none">
              <span className="text-bts-gold">◈</span> {resource.price} <span className="text-[10px] text-gray-400 font-bold">BTS</span>
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={e => { e.stopPropagation(); onSave(resource.id); }}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isSaved ? 'text-bts-gold bg-yellow-50 border-yellow-200' : 'text-gray-300 border-gray-200 hover:text-bts-gold hover:bg-yellow-50 hover:border-yellow-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
          <button
            onClick={e => { e.stopPropagation(); onOpen(resource); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-sm cursor-pointer ${
              isPurchased
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-brand-dark text-white hover:bg-bts-gold hover:text-brand-dark'
            }`}
          >
            {isPurchased ? 'Download' : 'Purchase'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Resource Detail Modal ───────────────────────────────────────────────────
function ResourceDetailModal({ resource, isSaved, isPurchased, onSave, onPurchase, onClose, purchasedIds = [] }) {
  const ratingAggregate = useEntityRating(
    REVIEW_ENTITY_TYPES.LIBRARY,
    resource.id,
    [],
    resource.rating,
    resource.reviews
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header image */}
        <div className="relative h-48 bg-gray-100 overflow-hidden shrink-0">
          <img src={resource.thumbnail} alt={resource.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:text-brand-dark transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
          <div className="absolute bottom-4 left-5 flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${TYPE_LABELS[resource.type]?.color}`}>
              {TYPE_LABELS[resource.type]?.label}
            </span>
            <span className="bg-brand-dark/85 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest">
              {resource.difficulty || 'Intermediate'}
            </span>
            <span className="bg-secondary-container text-on-secondary-fixed px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest">
              {resource.fileType || 'PDF / EPUB'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-7 space-y-5">
          <div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {resource.tags.map(t => (
                <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-extrabold">{t}</span>
              ))}
            </div>
            <h2 className="text-xl font-extrabold text-brand-dark leading-snug">{resource.title}</h2>
          </div>

          {/* Author */}
          <div className="flex items-center gap-3 py-3 border-y border-gray-100 flex-wrap">
            <img src={resource.authorAvatar} alt={resource.author} className="w-10 h-10 rounded-full border border-gray-100" />
            <div>
              <p className="text-sm font-extrabold text-brand-dark">{resource.author}</p>
              <p className="text-xs text-gray-400">{resource.authorRole}</p>
            </div>
            <div className="ml-auto flex items-center gap-4 text-center mt-2 sm:mt-0">
              <div>
                <p className="text-sm font-extrabold text-brand-dark flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  {ratingAggregate.rating > 0 ? ratingAggregate.rating.toFixed(1) : '—'}
                </p>
                <p className="text-[10px] text-gray-400">{ratingAggregate.count} reviews</p>
              </div>
              <div>
                <p className="text-sm font-extrabold text-brand-dark">{resource.downloads.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">downloads</p>
              </div>
              <div>
                <p className="text-sm font-extrabold text-brand-dark">{resource.size}</p>
                <p className="text-[10px] text-gray-400">file size</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed">{resource.description}</p>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onSave(resource.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                isSaved ? 'bg-yellow-50 text-bts-gold border-yellow-200' : 'bg-white text-gray-500 border-gray-200 hover:border-bts-gold hover:text-bts-gold'
              }`}
            >
              <svg className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              {isSaved ? 'Saved' : 'Save'}
            </button>

            {isPurchased ? (
              <button className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-extrabold text-sm hover:bg-emerald-600 transition-all cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                Download Resource
              </button>
            ) : (
              <button
                onClick={() => onPurchase(resource)}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-dark text-white rounded-xl font-extrabold text-sm hover:bg-bts-gold hover:text-brand-dark transition-all shadow-lg cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                {resource.price === 0 ? 'Get Free' : `Purchase · ◈ ${resource.price} BTS`}
              </button>
            )}
          </div>

          <ReviewSection
            entityType={REVIEW_ENTITY_TYPES.LIBRARY}
            entityId={resource.id}
            entityLabel={resource.title}
            title="Resource Reviews"
            fallbackRating={resource.rating}
            fallbackCount={resource.reviews}
            eligibilityContext={{ purchasedIds }}
            variant="plain"
            className="pt-2 border-t border-gray-100"
            emptyText="No peer reviews yet for this resource."
          />
        </div>
      </div>
    </div>
  );
}

// ─── Upload Modal ────────────────────────────────────────────────────────────
function UploadModal({ onClose, onUpload }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'whitepaper',
    category: 'smart-contracts',
    price: 0,
    size: '',
    tags: '',
    difficulty: 'Intermediate',
    fileType: 'PDF / EPUB',
    fileName: '',
  });
  const [pricingOption, setPricingOption] = useState('premium'); // 'premium' | 'free'
  const [errors, setErrors] = useState({});
  const [dragOver, setDragOver] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      setForm(f => ({
        ...f,
        fileName: file.name,
        size: sizeStr,
        fileType: getFormatFromFile(file.name),
        type: getResourceTypeFromFile(file.name),
      }));
      setErrors(prev => ({ ...prev, file: null }));
    }
  };

  const getFormatFromFile = (name) => {
    const ext = name.split('.').pop().toLowerCase();
    if (ext === 'pdf' || ext === 'epub') return 'PDF / EPUB';
    if (ext === 'mp4' || ext === 'avi' || ext === 'mov') return 'HD Video (MP4)';
    if (ext === 'fig') return 'Figma / Design Files';
    return 'GitHub Repository';
  };

  const getResourceTypeFromFile = (name) => {
    const ext = name.split('.').pop().toLowerCase();
    if (ext === 'pdf') return 'whitepaper';
    if (ext === 'epub') return 'book';
    if (ext === 'mp4' || ext === 'avi') return 'course';
    if (ext === 'fig') return 'template';
    return 'dataset';
  };

  const handleNext = () => {
    const errs = {};
    if (step === 1) {
      if (!form.title.trim()) errs.title = 'Title is required';
      if (!form.description.trim()) errs.description = 'Description is required';
      if (Object.keys(errs).length) {
        setErrors(errs);
        return;
      }
      setErrors({});
      setStep(2);
    } else if (step === 2) {
      if (!form.fileName) {
        errs.file = 'Please upload a resource file to proceed';
        setErrors(errs);
        return;
      }
      setErrors({});
      setStep(3);
    } else if (step === 3) {
      if (pricingOption === 'premium' && (form.price <= 0 || isNaN(form.price))) {
        errs.price = 'Please enter a valid price greater than 0';
        setErrors(errs);
        return;
      }
      setErrors({});
      setStep(4);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalPrice = pricingOption === 'free' ? 0 : Number(form.price);
    onUpload({
      ...form,
      price: finalPrice,
      tags: form.tags
        ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [TYPE_LABELS[form.type]?.label || 'Resource'],
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      setForm(f => ({
        ...f,
        fileName: file.name,
        size: sizeStr,
        fileType: getFormatFromFile(file.name),
        type: getResourceTypeFromFile(file.name),
      }));
      setErrors(prev => ({ ...prev, file: null }));
    }
  };

  const selectedCategoryLabel = CATEGORIES.find(c => c.key === form.category)?.label || form.category;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-7">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-extrabold text-brand-dark">Submit Resource</h2>
              <p className="text-xs text-gray-400 mt-0.5">Share your knowledge and earn BTS rewards</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
          </div>

          {/* Progress Stepper */}
          <div className="mb-8 max-w-2xl mx-auto relative px-4">
            <div className="flex items-center justify-between relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center gap-1.5 bg-white px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step >= 1 ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-400 border border-gray-200'
                }`}>1</div>
                <span className={`text-[10px] font-bold ${step >= 1 ? 'text-secondary font-extrabold' : 'text-gray-400'}`}>Resource Info</span>
              </div>
              {/* Step 2 */}
              <div className="flex flex-col items-center gap-1.5 bg-white px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step >= 2 ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-400 border border-gray-200'
                }`}>2</div>
                <span className={`text-[10px] font-bold ${step >= 2 ? 'text-secondary font-extrabold' : 'text-gray-400'}`}>Upload File</span>
              </div>
              {/* Step 3 */}
              <div className="flex flex-col items-center gap-1.5 bg-white px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step >= 3 ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-400 border border-gray-200'
                }`}>3</div>
                <span className={`text-[10px] font-bold ${step >= 3 ? 'text-secondary font-extrabold' : 'text-gray-400'}`}>Set Pricing</span>
              </div>
              {/* Step 4 */}
              <div className="flex flex-col items-center gap-1.5 bg-white px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step >= 4 ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-400 border border-gray-200'
                }`}>4</div>
                <span className={`text-[10px] font-bold ${step >= 4 ? 'text-secondary font-extrabold' : 'text-gray-400'}`}>Review</span>
              </div>
            </div>
            {/* Stepper lines */}
            <div className="absolute top-4 left-4 right-4 h-[2px] bg-gray-100 -z-0" />
            <div className="absolute top-4 left-4 h-[2px] bg-secondary -z-0 transition-all duration-300" style={{ width: `${((step - 1) / 3) * 94}%` }} />
          </div>

          {/* Form Content + Info Sidebar Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Wizard Form */}
            <div className="lg:col-span-8 space-y-6 bg-gray-50/40 p-6 rounded-2xl border border-gray-100">
              {step === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-2 mb-2 text-secondary">
                    <span className="material-symbols-outlined text-[20px]">info</span>
                    <h3 className="text-sm font-extrabold text-brand-dark uppercase tracking-wider">General Information</h3>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider">Resource Title</label>
                    <input
                      value={form.title}
                      onChange={e => set('title', e.target.value)}
                      placeholder="e.g. Advanced Cryptographic Protocols for Web3"
                      className={`w-full px-4 py-2.5 bg-white border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all ${errors.title ? 'border-red-400' : 'border-gray-200'}`}
                      type="text"
                    />
                    {errors.title && <p className="text-[10px] text-red-500 font-bold">{errors.title}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider">Resource Description</label>
                    <textarea
                      value={form.description}
                      onChange={e => set('description', e.target.value)}
                      placeholder="Describe the contents, key learning outcomes, and prerequisites..."
                      className={`w-full px-4 py-2.5 bg-white border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all resize-none ${errors.description ? 'border-red-400' : 'border-gray-200'}`}
                      rows="4"
                    />
                    {errors.description && <p className="text-[10px] text-red-500 font-bold">{errors.description}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider">Category</label>
                      <select
                        value={form.category}
                        onChange={e => set('category', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all cursor-pointer"
                      >
                        {CATEGORIES.filter(c => c.key !== 'all').map(c => (
                          <option key={c.key} value={c.key}>{c.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider">Difficulty</label>
                      <select
                        value={form.difficulty}
                        onChange={e => set('difficulty', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all cursor-pointer"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider">Topic Tags (comma-separated)</label>
                    <input
                      value={form.tags}
                      onChange={e => set('tags', e.target.value)}
                      placeholder="e.g. Solidity, Security, Gas Optimization"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                      type="text"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-2 mb-2 text-secondary">
                    <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
                    <h3 className="text-sm font-extrabold text-brand-dark uppercase tracking-wider">Content Upload</h3>
                  </div>

                  <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('wizard-file-input').click()}
                    className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer group text-center ${
                      dragOver 
                        ? 'border-secondary bg-secondary/5' 
                        : 'border-gray-200 bg-white hover:border-secondary hover:bg-secondary/5'
                    }`}
                  >
                    <input 
                      type="file" 
                      id="wizard-file-input" 
                      className="hidden" 
                      onChange={handleFileSelect} 
                    />
                    <span className="material-symbols-outlined text-4xl text-gray-300 group-hover:text-secondary mb-3">upload_file</span>
                    <p className="text-xs font-extrabold text-brand-dark">Drag & drop your files here, or <span className="text-secondary">browse</span></p>
                    <p className="text-[10px] text-gray-400 mt-1">Accepts PDF, ZIP, MP4, or FIG (Max 500MB)</p>
                    <button 
                      type="button" 
                      className="mt-4 px-4 py-1.5 border border-brand-dark hover:bg-brand-dark hover:text-white rounded-xl text-[10px] font-extrabold transition-all cursor-pointer"
                    >
                      Browse Files
                    </button>
                  </div>
                  {errors.file && <p className="text-[10px] text-red-500 font-bold text-center">{errors.file}</p>}

                  {form.fileName && (
                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm animate-fadeIn">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-secondary text-2xl">
                          {form.fileType === 'HD Video (MP4)' ? 'video_library' : form.fileType === 'Figma / Design Files' ? 'design_services' : 'picture_as_pdf'}
                        </span>
                        <div>
                          <p className="font-extrabold text-xs text-brand-dark truncate max-w-[250px]">{form.fileName}</p>
                          <p className="text-[10px] text-gray-400 font-semibold">{form.size} • Uploaded Successfully</p>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setForm(f => ({ ...f, fileName: '', size: '' }))}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="flex items-center gap-2 mb-2 text-secondary">
                    <span className="material-symbols-outlined text-[20px]">payments</span>
                    <h3 className="text-sm font-extrabold text-brand-dark uppercase tracking-wider">Set Access & Pricing</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Premium */}
                    <label 
                      onClick={() => setPricingOption('premium')}
                      className={`relative flex flex-col p-5 border rounded-2xl cursor-pointer hover:border-secondary transition-all ${
                        pricingOption === 'premium' 
                          ? 'border-secondary bg-secondary/5 ring-1 ring-secondary/10' 
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-extrabold text-brand-dark">Premium</span>
                        <input 
                          type="radio" 
                          name="pricing" 
                          checked={pricingOption === 'premium'}
                          onChange={() => {}}
                          className="text-secondary focus:ring-secondary h-4 w-4" 
                        />
                      </div>
                      <p className="text-gray-400 text-[10px] mb-4">Set a custom BTS token price for full access.</p>
                      
                      {pricingOption === 'premium' && (
                        <div className="mt-auto flex items-center gap-2 animate-fadeIn">
                          <input 
                            type="number"
                            min="1"
                            value={form.price || ''}
                            onChange={e => set('price', e.target.value)}
                            placeholder="e.g. 50" 
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-brand-dark focus:outline-none focus:ring-1 focus:ring-secondary"
                          />
                          <span className="text-[10px] font-extrabold text-gray-500">BTS</span>
                        </div>
                      )}
                    </label>

                    {/* Open Access */}
                    <label 
                      onClick={() => setPricingOption('free')}
                      className={`relative flex flex-col p-5 border rounded-2xl cursor-pointer hover:border-secondary transition-all ${
                        pricingOption === 'free' 
                          ? 'border-secondary bg-secondary/5 ring-1 ring-secondary/10' 
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-extrabold text-brand-dark">Open Access</span>
                        <input 
                          type="radio" 
                          name="pricing" 
                          checked={pricingOption === 'free'}
                          onChange={() => {}}
                          className="text-secondary focus:ring-secondary h-4 w-4" 
                        />
                      </div>
                      <p className="text-gray-400 text-[10px] mb-4">Make this resource free for the entire community.</p>
                      
                      <div className="mt-auto">
                        <span className="inline-flex items-center px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[9px] font-extrabold uppercase tracking-wider leading-none">
                          Public Good
                        </span>
                      </div>
                    </label>
                  </div>
                  {errors.price && <p className="text-[10px] text-red-500 font-bold">{errors.price}</p>}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-2 mb-2 text-secondary">
                    <span className="material-symbols-outlined text-[20px]">rate_review</span>
                    <h3 className="text-sm font-extrabold text-brand-dark uppercase tracking-wider">Review & Submit</h3>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-sm text-xs">
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Title</span>
                      <span className="font-extrabold text-brand-dark text-right max-w-[200px] truncate">{form.title}</span>
                    </div>

                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Category / Topic</span>
                      <span className="font-extrabold text-brand-dark">{selectedCategoryLabel}</span>
                    </div>

                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Difficulty</span>
                      <span className="font-extrabold text-brand-dark">{form.difficulty}</span>
                    </div>

                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">File Attachment</span>
                      <span className="font-extrabold text-brand-dark text-right max-w-[200px] truncate">{form.fileName} ({form.size})</span>
                    </div>

                    <div className="flex justify-between pb-1">
                      <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Access Pricing</span>
                      <span className="font-extrabold text-brand-dark">
                        {pricingOption === 'free' ? (
                          <span className="text-emerald-600">Free Open Access</span>
                        ) : (
                          <span>◈ {form.price} BTS</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Action Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                  className="px-5 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-100 hover:text-brand-dark transition-all cursor-pointer"
                >
                  {step === 1 ? 'Cancel' : 'Back'}
                </button>

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-brand-dark text-white rounded-xl text-xs font-extrabold hover:bg-bts-gold hover:text-brand-dark transition-all shadow-md cursor-pointer"
                  >
                    Continue
                  </button>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-secondary text-white rounded-xl text-xs font-extrabold hover:opacity-90 transition-all shadow-md cursor-pointer"
                    >
                      Publish Resource
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right: Informational Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              {(step === 1 || step === 2) ? (
                <div className="bg-brand-dark text-white rounded-2xl p-6 relative overflow-hidden shadow-lg animate-fadeIn">
                  <div className="absolute top-0 right-0 w-24 h-24 opacity-10 transform translate-x-4 -translate-y-4">
                    <span className="material-symbols-outlined text-[80px] text-white">school</span>
                  </div>
                  <div className="relative z-10 space-y-4">
                    <div>
                      <h4 className="font-extrabold text-sm text-bts-gold">Share Your Knowledge</h4>
                      <p className="text-gray-400 text-[11px] leading-relaxed mt-1">
                        Contributing high-quality academic resources strengthens the Bitstacks ecosystem. Peer-verified submissions earn higher reputation and increased token yields.
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 text-bts-gold">
                          <span className="material-symbols-outlined text-base">payments</span>
                        </div>
                        <div>
                          <p className="font-extrabold text-xs text-white">Earn BTS Tokens</p>
                          <p className="text-[10px] text-gray-400 leading-tight">Monetize your research and materials.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 text-bts-gold">
                          <span className="material-symbols-outlined text-base">verified</span>
                        </div>
                        <div>
                          <p className="font-extrabold text-xs text-white">Build Reputation</p>
                          <p className="text-[10px] text-gray-400 leading-tight">Unlock governance voting weights.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 text-bts-gold">
                          <span className="material-symbols-outlined text-base">rate_review</span>
                        </div>
                        <div>
                          <p className="font-extrabold text-xs text-white">Peer Review</p>
                          <p className="text-[10px] text-gray-400 leading-tight">Get feedback from industry experts.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4 animate-fadeIn text-xs">
                  <h5 className="font-extrabold text-secondary uppercase tracking-widest text-[10px]">Submission Policy</h5>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                      <span className="text-gray-500 font-semibold leading-tight">Cite all original authors and datasets.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                      <span className="text-gray-500 font-semibold leading-tight">Ensure PDF accessibility for screen readers.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                      <span className="text-gray-500 font-semibold leading-tight">Clear copyright for third-party media.</span>
                    </li>
                  </ul>

                  <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 mt-4">
                    <div className="flex items-center gap-1.5 mb-1 text-red-800">
                      <span className="material-symbols-outlined text-base">warning</span>
                      <span className="font-extrabold text-[10px] uppercase tracking-wider">AI Policy</span>
                    </div>
                    <p className="text-[10px] text-red-700/80 leading-snug">
                      AI-generated content must be explicitly disclosed in the description. Failure to do so may result in permanent exclusion from the D-Library.
                    </p>
                  </div>
                </div>
              )}

              {/* Quick Help Guide Link */}
              <div 
                onClick={() => setShowGuide(true)}
                className="p-4 rounded-2xl border border-dashed border-gray-200 bg-white hover:bg-gray-50 transition-colors flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-base">auto_stories</span>
                </div>
                <div>
                  <p className="font-extrabold text-xs text-brand-dark">Submission Guide</p>
                  <p className="text-[10px] text-gray-400 font-semibold">Learn how to maximize your yield.</p>
                </div>
                <span className="material-symbols-outlined ml-auto text-gray-400 group-hover:translate-x-0.5 transition-transform text-sm">arrow_forward</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setShowGuide(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div 
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[80vh] overflow-y-auto p-7 space-y-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">auto_stories</span>
                <h3 className="text-lg font-extrabold text-brand-dark">Submission Guide</h3>
              </div>
              <button 
                onClick={() => setShowGuide(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-gray-500">
              <section className="space-y-2">
                <h4 className="font-extrabold text-brand-dark text-sm border-b border-gray-50 pb-1">1. Preparing Content & Formats</h4>
                <p>Ensure resources meet the following guidelines:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Whitepapers / Books:</strong> PDF/EPUB. Clean layout, citations, and selectable text.</li>
                  <li><strong>Technical Courses:</strong> MP4 video. Clear HD screen recordings. Max 500MB.</li>
                  <li><strong>Code Templates:</strong> ZIP archive containing structured files, tests, and a README setup guide.</li>
                  <li><strong>UI Kits:</strong> Figma design files (.fig) with structured tokens and layers.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="font-extrabold text-brand-dark text-sm border-b border-gray-50 pb-1">2. Pricing Tiers & Yields</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Premium Tier:</strong> Specify token price in BTS. Buyers purchase access. Earn reputation yields based on popularity.</li>
                  <li><strong>Open Access (Free):</strong> Renders as a green "Public Good" badge. Earns Reputation score 2.5x faster to unlock governance weight.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="font-extrabold text-brand-dark text-sm border-b border-gray-50 pb-1">3. Strict Academic Policies</h4>
                <div className="p-3 bg-yellow-50 border border-yellow-150 rounded-xl space-y-1">
                  <p className="font-extrabold text-secondary flex items-center gap-1"><span className="material-symbols-outlined text-sm">warning</span> AI Disclosure Required</p>
                  <p className="text-[10px]">AI-generated text or assets must be explicitly disclosed in the description. Failing to disclose AI usage results in permanent ban.</p>
                </div>
                <div className="p-3 bg-red-55 border border-red-100 rounded-xl space-y-1">
                  <p className="font-extrabold text-red-800 flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> Copyright Clearance</p>
                  <p className="text-[10px]">You must own or have proper open-source distribution rights for all templates, code bases, and media files published.</p>
                </div>
              </section>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setShowGuide(false)}
                className="px-6 py-2 bg-brand-dark text-white rounded-xl text-xs font-bold hover:bg-bts-gold hover:text-brand-dark transition-all cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
