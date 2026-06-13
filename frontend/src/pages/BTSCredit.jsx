import { useState } from 'react';
import Topbar from '../components/Topbar';

// ─── Constants ────────────────────────────────────────────────────────────────
const BTS_TO_TND = 1; // 1 BTS = 1 TND

// ─── Mock Data ────────────────────────────────────────────────────────────────
const TRANSACTIONS = [
  {
    id: 'tx1',
    category: 'earned',
    type: 'Mission Payout',
    icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    iconBg: 'bg-emerald-50 text-emerald-700',
    description: 'DeFi Portfolio Dashboard UI — D-Lancer',
    amount: '+880',
    positive: true,
    date: 'Jun 8, 2026',
  },
  {
    id: 'tx2',
    category: 'spent',
    type: 'Session Booking',
    icon: 'M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    iconBg: 'bg-orange-50 text-orange-700',
    description: '1-on-1 Mentoring: Zero Knowledge Proofs',
    amount: '-120',
    positive: false,
    date: 'Jun 7, 2026',
  },
  {
    id: 'tx3',
    category: 'earned',
    type: 'Mentoring Fee',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    iconBg: 'bg-blue-50 text-blue-700',
    description: 'Teaching: Solidity Fundamentals',
    amount: '+300',
    positive: true,
    date: 'Jun 6, 2026',
  },
  {
    id: 'tx4',
    category: 'redeemed',
    type: 'TND Redemption',
    icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z',
    iconBg: 'bg-purple-50 text-purple-700',
    description: 'Converted 500 BTS → 425 TND',
    amount: '-500',
    positive: false,
    date: 'Jun 5, 2026',
  },
  {
    id: 'tx5',
    category: 'earned',
    type: 'Course Enrollment Bonus',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    iconBg: 'bg-indigo-50 text-indigo-700',
    description: 'Referral reward — D-Institute module',
    amount: '+50',
    positive: true,
    date: 'Jun 4, 2026',
  },
  {
    id: 'tx6',
    category: 'spent',
    type: 'D-Institute Access',
    icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z',
    iconBg: 'bg-gray-100 text-gray-500',
    description: 'Premium Institute Module: Smart Contracts',
    amount: '-200',
    positive: false,
    date: 'Jun 3, 2026',
  },
  {
    id: 'tx7',
    category: 'earned',
    type: 'Mission Payout',
    icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    iconBg: 'bg-emerald-50 text-emerald-700',
    description: 'Smart Contract Audit #441',
    amount: '+1,200',
    positive: true,
    date: 'Jun 1, 2026',
  },
];

const EARN_WAYS = [
  {
    title: 'Complete D-Lancer Missions',
    desc: 'Get paid in BTS when a creator approves your work',
    icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    color: 'bg-emerald-50 text-emerald-700',
    rate: 'Full mission budget',
  },
  {
    title: 'Host Mentoring Sessions',
    desc: 'Earn BTS for every session you teach on D-Platform',
    icon: 'M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    color: 'bg-blue-50 text-blue-700',
    rate: 'Per session rate',
  },
  {
    title: 'Refer New Users',
    desc: 'Earn 50 BTS for every user who joins and completes their first activity',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    color: 'bg-orange-50 text-orange-700',
    rate: '50 BTS / referral',
  },
  {
    title: 'Publish D-Institute Content',
    desc: 'Earn a share of enrollment fees for courses or modules you publish',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    color: 'bg-purple-50 text-purple-700',
    rate: '15% of enrollments',
  },
];

const SPEND_WAYS = [
  { label: 'Book a session on D-Platform', icon: '📅', cost: '50–200 BTS / session' },
  { label: 'Enroll in D-Institute courses', icon: '🎓', cost: '100–500 BTS / module' },
  { label: 'Post a Mission on D-Lancer', icon: '📋', cost: 'Custom mission budget' },
  { label: 'Unlock premium reports & analytics', icon: '📊', cost: '30 BTS / report' },
  { label: 'Priority support access', icon: '⚡', cost: '10 BTS / month' },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BTSCredit() {
  const [activeSection, setActiveSection] = useState('overview');
  const [txFilter, setTxFilter] = useState('all');

  // Redemption form state
  const [redeemAmount, setRedeemAmount] = useState('');
  const [redeemIBAN, setRedeemIBAN] = useState('');
  const [redeemSubmitted, setRedeemSubmitted] = useState(false);

  // Top-up form state
  const [topupAmount, setTopupAmount] = useState('');
  const [topupMethod, setTopupMethod] = useState(''); // 'bank' | 'flouci'
  const [topupBankRef, setTopupBankRef] = useState('');
  const [topupFlouciPhone, setTopupFlouciPhone] = useState('');
  const [topupStep, setTopupStep] = useState(1); // 1 = amount, 2 = method, 3 = form, 4 = success
  const topupTND = topupAmount ? (parseFloat(topupAmount) * BTS_TO_TND).toFixed(2) : '—';

  const balance = 2610;
  const tndValue = (balance * BTS_TO_TND).toFixed(2);
  const redeemTND = redeemAmount ? (parseFloat(redeemAmount) * BTS_TO_TND).toFixed(2) : '—';
  const minRedeem = 100;

  const filteredTxs =
    txFilter === 'all'
      ? TRANSACTIONS
      : TRANSACTIONS.filter(t => t.category === txFilter);

  const handleRedeem = (e) => {
    e.preventDefault();
    if (parseFloat(redeemAmount) >= minRedeem) setRedeemSubmitted(true);
  };

  return (
    <>
      <Topbar searchPlaceholder="Search transactions..." />

      {/* ── Page Header ── */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-brand-dark tracking-tight mb-1">BTS Credit</h2>
          <p className="text-gray-400 text-sm">Your Bitstacks platform currency — earn, spend &amp; redeem</p>
        </div>
        <div className="flex bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm gap-1">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'topup', label: 'Top Up' },
            { key: 'earn', label: 'How to Earn' },
            { key: 'redeem', label: 'Redeem to TND' },
            { key: 'history', label: 'History' },
          ].map(s => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeSection === s.key
                ? 'bg-brand-dark text-white shadow'
                : 'text-gray-400 hover:text-brand-dark hover:bg-gray-50'
                }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════ OVERVIEW ══════════════ */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Hero balance + quick info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Balance card */}
            <div
              className="lg:col-span-7 relative overflow-hidden rounded-3xl p-8 flex flex-col justify-between min-h-[240px]"
              style={{ background: 'linear-gradient(135deg, #0b1121 0%, #151b2c 55%, #1e2d4a 100%)' }}
            >
              <div
                className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, #d4a017, transparent 70%)', transform: 'translate(30%,-30%)' }}
              />
              <div className="z-10">
                <p className="text-[11px] font-extrabold text-white/40 uppercase tracking-[0.2em] mb-3">Available Balance</p>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-5xl font-extrabold text-white leading-none">
                    <span className="text-bts-gold">◈</span> {balance.toLocaleString()}
                  </span>
                  <span className="text-bts-gold text-xl font-bold">BTS</span>
                </div>
                <p className="text-white/30 font-semibold text-sm">≈ {parseFloat(tndValue).toLocaleString()} TND</p>
                <p className="text-white/20 text-[10px] mt-1 font-semibold">Rate: 1 BTS = {BTS_TO_TND} TND (fixed platform rate)</p>
              </div>
              <div className="flex flex-wrap gap-3 mt-6 z-10">
                <button
                  onClick={() => { setTopupStep(1); setTopupMethod(''); setTopupAmount(''); setActiveSection('topup'); }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white font-extrabold rounded-xl text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                  </svg>
                  Top Up BTS
                </button>
                <button
                  onClick={() => setActiveSection('redeem')}
                  className="flex items-center gap-2 px-6 py-2.5 bg-bts-gold text-brand-dark font-extrabold rounded-xl text-sm hover:bg-yellow-400 transition-all shadow-lg shadow-bts-gold/20"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                  Redeem to TND
                </button>
                <button
                  onClick={() => setActiveSection('history')}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white/10 text-white font-extrabold rounded-xl text-sm border border-white/15 hover:bg-white/20 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                  View History
                </button>
              </div>
            </div>

            {/* Info cards */}
            <div className="lg:col-span-5 grid grid-rows-3 gap-4">
              {[
                {
                  label: 'Earned this month',
                  value: '+2,430 BTS',
                  sub: 'Missions + Mentoring + Bonuses',
                  icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
                  bg: 'bg-emerald-50 text-emerald-700',
                },
                {
                  label: 'Spent this month',
                  value: '-320 BTS',
                  sub: 'Sessions, modules & features',
                  icon: 'M19 14l-7 7m0 0l-7-7m7 7V3',
                  bg: 'bg-orange-50 text-orange-700',
                },
                {
                  label: 'Total redeemed',
                  value: '500 BTS → 425 TND',
                  sub: 'Last redemption: Jun 5, 2026',
                  icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z',
                  bg: 'bg-purple-50 text-purple-700',
                },
              ].map(s => (
                <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d={s.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
                    <p className="text-sm font-extrabold text-brand-dark">{s.value}</p>
                    <p className="text-[10px] text-gray-400 truncate">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What is BTS — explainer */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-brand-dark mb-4">What is BTS?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  emoji: '🏦',
                  title: 'Platform Currency',
                  desc: 'BTS is the internal currency of Bitstacks. It is used exclusively within the platform to pay for services, sessions, and missions.',
                },
                {
                  emoji: '🔒',
                  title: 'Fixed Rate',
                  desc: `1 BTS is always worth ${BTS_TO_TND} TND. There is no market price or volatility — BTS is a stable utility token tied to the Tunisian Dinar.`,
                },
                {
                  emoji: '💸',
                  title: 'Redeemable',
                  desc: 'When you want real money, request a TND payout. Funds are transferred to your Tunisian bank account within 5 business days.',
                },
              ].map(item => (
                <div key={item.title} className="bg-gray-50 rounded-xl p-4">
                  <div className="text-2xl mb-2">{item.emoji}</div>
                  <p className="text-xs font-extrabold text-brand-dark mb-1">{item.title}</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Where you spend BTS */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-brand-dark mb-4">Where you can spend BTS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SPEND_WAYS.map(item => (
                <div key={item.label} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3.5">
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-brand-dark">{item.label}</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{item.cost}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent transactions */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-brand-dark">Recent Transactions</h3>
              <button
                onClick={() => setActiveSection('history')}
                className="text-xs font-bold text-bts-gold hover:underline flex items-center gap-1"
              >
                View all
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {TRANSACTIONS.slice(0, 4).map(tx => (
                <TxRow key={tx.id} tx={tx} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ TOP UP ══════════════ */}
      {activeSection === 'topup' && (
        <div className="max-w-2xl space-y-5">

          {/* ── Step 4: Success ── */}
          {topupStep === 4 && (
            <div className="bg-white border border-emerald-100 rounded-2xl p-10 text-center shadow-sm space-y-4 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="text-lg font-extrabold text-brand-dark">Top-Up Request Registered!</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Your request to purchase <strong className="text-brand-dark">◈ {topupAmount} BTS</strong> ({topupTND} TND) via{' '}
                <strong className="text-brand-dark">{topupMethod === 'bank' ? 'Bank Wire Transfer' : 'Flouci'}</strong> has been received.
              </p>
              {topupMethod === 'bank' ? (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-800 text-left space-y-1.5 max-w-md mx-auto">
                  <p className="font-extrabold">🏦 Next Step: Complete your bank wire transfer</p>
                  <p className="text-blue-600 leading-relaxed">Transfer <strong>{topupTND} TND</strong> to our platform bank account. Include your reference code in the transfer note. Once we confirm the payment, your BTS will be credited within <strong>1–3 business days</strong>.</p>
                </div>
              ) : (
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-xs text-purple-800 text-left space-y-1.5 max-w-md mx-auto">
                  <p className="font-extrabold">📱 Next Step: Confirm payment in Flouci</p>
                  <p className="text-purple-600 leading-relaxed">Open the Flouci app and approve the payment request of <strong>{topupTND} TND</strong> sent to your phone. Once approved, your BTS will be credited <strong>instantly</strong>.</p>
                </div>
              )}
              <button
                onClick={() => { setTopupStep(1); setTopupMethod(''); setTopupAmount(''); setTopupBankRef(''); setTopupFlouciPhone(''); }}
                className="mt-2 px-6 py-2.5 bg-brand-dark text-white rounded-xl text-sm font-extrabold hover:bg-bts-gold hover:text-brand-dark transition-all"
              >
                Make Another Top-Up
              </button>
            </div>
          )}

          {topupStep < 4 && (
            <>
              {/* Progress indicator */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Top-Up Progress</p>
                  <p className="text-[10px] font-bold text-gray-400">Step {topupStep} of 3</p>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3].map(s => (
                    <div
                      key={s}
                      className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${s <= topupStep ? 'bg-emerald-500' : 'bg-gray-100'
                        }`}
                    />
                  ))}
                </div>
              </div>

              {/* ── Step 1: Choose Amount ── */}
              {topupStep === 1 && (
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5 animate-fadeIn">
                  <div>
                    <h3 className="text-sm font-extrabold text-brand-dark mb-1">Choose Top-Up Amount</h3>
                    <p className="text-xs text-gray-400 font-semibold">Select a preset or enter a custom BTS amount to purchase</p>
                  </div>

                  {/* Preset chips */}
                  <div className="grid grid-cols-4 gap-3">
                    {[100, 250, 500, 1000].map(amt => (
                      <button
                        key={amt}
                        onClick={() => setTopupAmount(String(amt))}
                        className={`py-3.5 rounded-xl text-center border transition-all ${topupAmount === String(amt)
                          ? 'bg-brand-dark text-white border-brand-dark shadow-md'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-brand-dark hover:bg-gray-100'
                          }`}
                      >
                        <p className="text-sm font-extrabold">◈ {amt.toLocaleString()}</p>
                        <p className={`text-[10px] mt-0.5 font-semibold ${topupAmount === String(amt) ? 'text-white/50' : 'text-gray-400'}`}>
                          {(amt * BTS_TO_TND).toFixed(2)} TND
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* Custom input */}
                  <div>
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase block mb-1.5">Or enter a custom amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-bts-gold font-extrabold text-sm">◈</span>
                      <input
                        type="number"
                        min="10"
                        value={topupAmount}
                        onChange={e => setTopupAmount(e.target.value)}
                        placeholder="Enter BTS amount (min. 10)"
                        className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-brand-dark outline-none focus:border-bts-gold focus:ring-2 focus:ring-bts-gold/15 transition-all"
                      />
                    </div>
                  </div>

                  {/* Cost preview */}
                  {topupAmount && parseFloat(topupAmount) >= 10 && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-emerald-700 uppercase">You will pay</p>
                        <p className="text-xl font-extrabold text-emerald-700 mt-0.5">{topupTND} TND</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-bold">You will receive</p>
                        <p className="text-lg font-extrabold text-bts-gold">◈ {parseFloat(topupAmount).toLocaleString()} BTS</p>
                      </div>
                    </div>
                  )}

                  <button
                    disabled={!topupAmount || parseFloat(topupAmount) < 10}
                    onClick={() => setTopupStep(2)}
                    className="w-full py-3 bg-brand-dark text-white font-extrabold rounded-xl text-sm hover:bg-bts-gold hover:text-brand-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue → Choose Payment Method
                  </button>
                </div>
              )}

              {/* ── Step 2: Payment Method ── */}
              {topupStep === 2 && (
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-brand-dark mb-1">Choose Payment Method</h3>
                      <p className="text-xs text-gray-400 font-semibold">Select how you want to pay for ◈ {parseFloat(topupAmount).toLocaleString()} BTS ({topupTND} TND)</p>
                    </div>
                    <button onClick={() => setTopupStep(1)} className="text-xs font-bold text-gray-400 hover:text-brand-dark transition-colors flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                      Change amount
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Bank Wire */}
                    <button
                      onClick={() => { setTopupMethod('bank'); setTopupStep(3); }}
                      className={`text-left p-5 rounded-2xl border-2 transition-all hover:shadow-md hover:scale-[1.01] active:scale-100 ${topupMethod === 'bank' ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100 bg-white hover:border-blue-200'
                        }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl shrink-0">
                          🏦
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-brand-dark">Bank Wire Transfer</p>
                          <p className="text-[10px] text-gray-400 font-semibold">Virement bancaire</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                          <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                          Processing: 1–3 business days
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                          <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                          Verified via bank reference code
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                          <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                          No fees — direct bank-to-platform
                        </div>
                      </div>
                    </button>

                    {/* Flouci */}
                    <button
                      onClick={() => { setTopupMethod('flouci'); setTopupStep(3); }}
                      className={`text-left p-5 rounded-2xl border-2 transition-all hover:shadow-md hover:scale-[1.01] active:scale-100 ${topupMethod === 'flouci' ? 'border-purple-500 bg-purple-50/30' : 'border-gray-100 bg-white hover:border-purple-200'
                        }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-2xl shrink-0">
                          📱
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-brand-dark">Flouci</p>
                          <p className="text-[10px] text-gray-400 font-semibold">Mobile payment (flouci.app)</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                          <svg className="w-3.5 h-3.5 text-purple-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                          Instant confirmation
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                          <svg className="w-3.5 h-3.5 text-purple-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                          Pay from your Flouci wallet
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                          <svg className="w-3.5 h-3.5 text-purple-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                          Secured by Flouci
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 3: Payment Details Form ── */}
              {topupStep === 3 && topupMethod === 'bank' && (
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-brand-dark mb-1 flex items-center gap-2">
                        <span className="text-lg">🏦</span> Bank Wire Transfer Details
                      </h3>
                      <p className="text-xs text-gray-400 font-semibold">Transfer {topupTND} TND to our platform account</p>
                    </div>
                    <button onClick={() => setTopupStep(2)} className="text-xs font-bold text-gray-400 hover:text-brand-dark transition-colors flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                      Change method
                    </button>
                  </div>

                  {/* Platform Bank Info */}
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 space-y-3">
                    <p className="text-[10px] font-extrabold text-blue-800 uppercase tracking-widest mb-2">Transfer to this account</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Bank Name</p>
                        <p className="text-xs font-extrabold text-brand-dark">Banque Internationale Arabe de Tunisie (BIAT)</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Account Holder</p>
                        <p className="text-xs font-extrabold text-brand-dark">Bitstacks Technologies SARL</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">RIB / IBAN</p>
                        <p className="text-xs font-extrabold text-brand-dark font-mono">TN59 0804 1000 0001 2345 6789</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Amount to Transfer</p>
                        <p className="text-xs font-extrabold text-emerald-700">{topupTND} TND</p>
                      </div>
                    </div>
                  </div>

                  {/* Warning */}
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-amber-800 leading-relaxed font-semibold">
                    <span className="text-sm shrink-0">⚠️</span>
                    <div>
                      <strong className="font-extrabold text-amber-950 block mb-0.5">Important</strong>
                      You must include your <strong>reference code</strong> in the wire transfer note/motif. Without it, we cannot match your payment to your account.
                    </div>
                  </div>

                  {/* Bank Reference Input */}
                  <div>
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase block mb-1.5">
                      Your Bank Reference / Transfer Note
                    </label>
                    <input
                      type="text"
                      value={topupBankRef}
                      onChange={e => setTopupBankRef(e.target.value)}
                      placeholder="e.g. TOPUP-JOHNDOE-20260611"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-brand-dark outline-none focus:border-bts-gold focus:ring-2 focus:ring-bts-gold/15 transition-all font-mono"
                      required
                    />
                    <p className="text-[10px] text-gray-400 mt-1">This code will be auto-generated after submission. Copy it and paste it in your bank transfer note.</p>
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">You pay</p>
                      <p className="text-lg font-extrabold text-brand-dark">{topupTND} TND</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">You receive</p>
                      <p className="text-lg font-extrabold text-bts-gold">◈ {parseFloat(topupAmount).toLocaleString()} BTS</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setTopupStep(4)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-sm transition-all shadow-md"
                  >
                    I Have Completed the Wire Transfer
                  </button>
                  <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                    Once we verify your transfer, the BTS will be credited to your account within 1–3 business days.
                  </p>
                </div>
              )}

              {topupStep === 3 && topupMethod === 'flouci' && (
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-brand-dark mb-1 flex items-center gap-2">
                        <span className="text-lg">📱</span> Flouci Payment
                      </h3>
                      <p className="text-xs text-gray-400 font-semibold">Pay {topupTND} TND using your Flouci mobile wallet</p>
                    </div>
                    <button onClick={() => setTopupStep(2)} className="text-xs font-bold text-gray-400 hover:text-brand-dark transition-colors flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                      Change method
                    </button>
                  </div>

                  {/* Flouci Explainer */}
                  <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-5 space-y-3">
                    <p className="text-[10px] font-extrabold text-purple-800 uppercase tracking-widest mb-2">How it works</p>
                    <ol className="space-y-2.5">
                      {[
                        'Enter your Flouci-linked phone number below',
                        'We send a payment request of ' + topupTND + ' TND to your Flouci account',
                        'Open the Flouci app on your phone and approve the payment',
                        'Your BTS balance is credited instantly after confirmation',
                      ].map((step, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 bg-purple-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                          <p className="text-xs text-gray-600 font-semibold leading-relaxed">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase block mb-1.5">
                      Your Flouci Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">+216</span>
                      <input
                        type="tel"
                        value={topupFlouciPhone}
                        onChange={e => setTopupFlouciPhone(e.target.value)}
                        placeholder="XX XXX XXX"
                        maxLength={8}
                        className="w-full pl-16 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-brand-dark outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/15 transition-all font-mono tracking-wider"
                        required
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Must be the same number linked to your Flouci account</p>
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">You pay</p>
                      <p className="text-lg font-extrabold text-brand-dark">{topupTND} TND</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">You receive</p>
                      <p className="text-lg font-extrabold text-bts-gold">◈ {parseFloat(topupAmount).toLocaleString()} BTS</p>
                    </div>
                  </div>

                  <button
                    disabled={!topupFlouciPhone || topupFlouciPhone.length < 8}
                    onClick={() => setTopupStep(4)}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-sm transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Send Flouci Payment Request
                  </button>
                  <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                    You will receive a push notification from Flouci. Approve it to complete the top-up.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ══════════════ HOW TO EARN ══════════════ */}
      {activeSection === 'earn' && (
        <div className="space-y-6">
          {/* Summary banner */}
          <div
            className="rounded-2xl p-6 text-white relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0b1121, #1e2d4a)' }}
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-10 blur-3xl"
              style={{ background: 'radial-gradient(circle at 80% 50%, #d4a017, transparent 60%)' }}
            />
            <p className="text-[11px] font-extrabold text-white/40 uppercase tracking-widest mb-2 z-10 relative">
              Your earning potential
            </p>
            <h3 className="text-2xl font-extrabold z-10 relative">
              <span className="text-bts-gold">◈</span> Earn BTS by contributing to the platform
            </h3>
            <p className="text-sm text-white/50 mt-1 z-10 relative">
              Every service you provide or content you create turns into redeemable BTS credit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {EARN_WAYS.map(way => (
              <div key={way.title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${way.color}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d={way.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-extrabold text-brand-dark mb-1">{way.title}</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed mb-3">{way.desc}</p>
                  <span className="inline-block bg-bts-gold/10 text-bts-gold border border-bts-gold/20 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    {way.rate}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Rate reference */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Platform Exchange Rate</p>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="text-center">
                <p className="text-2xl font-extrabold text-bts-gold">◈ 1 BTS</p>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Bitstacks Token</p>
              </div>
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <div className="text-center">
                <p className="text-2xl font-extrabold text-brand-dark">{BTS_TO_TND} TND</p>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Tunisian Dinar</p>
              </div>
              <p className="text-[11px] text-gray-400 ml-auto max-w-xs text-right leading-relaxed">
                Rate is fixed by Bitstacks and does not fluctuate. Redemptions are processed within 5 business days.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ REDEEM TO TND ══════════════ */}
      {activeSection === 'redeem' && (
        <div className="max-w-2xl space-y-5">
          {redeemSubmitted ? (
            <div className="bg-white border border-emerald-100 rounded-2xl p-10 text-center shadow-sm space-y-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="text-lg font-extrabold text-brand-dark">Redemption Request Submitted!</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Your request to convert <strong className="text-brand-dark">◈ {redeemAmount} BTS</strong> to{' '}
                <strong className="text-brand-dark">{redeemTND} TND</strong> has been received.
                Funds will arrive in your bank account within <strong className="text-brand-dark">5 business days</strong>.
              </p>
              <button
                onClick={() => { setRedeemSubmitted(false); setRedeemAmount(''); setRedeemIBAN(''); }}
                className="mt-2 px-6 py-2.5 bg-brand-dark text-white rounded-xl text-sm font-extrabold hover:bg-bts-gold hover:text-brand-dark transition-all"
              >
                Make Another Request
              </button>
            </div>
          ) : (
            <>
              {/* Explainer */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-extrabold text-brand-dark mb-3">How TND Redemption Works</h3>
                <ol className="space-y-3">
                  {[
                    'Enter the amount of BTS you want to convert (minimum 100 BTS)',
                    'Confirm your Tunisian bank IBAN',
                    'Submit the request — our team reviews it within 24h',
                    'Funds arrive in your bank account within 5 business days',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-brand-dark text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-xs text-gray-600 font-semibold leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Form */}
              <form onSubmit={handleRedeem} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5">
                <h3 className="text-sm font-extrabold text-brand-dark">Request a Redemption</h3>

                {/* Available balance */}
                <div className="bg-bts-gold/5 border border-bts-gold/20 rounded-xl p-4 flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-500">Available BTS</p>
                  <p className="text-lg font-extrabold text-bts-gold">◈ {balance.toLocaleString()} BTS</p>
                </div>

                {/* Amount */}
                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase block mb-1.5">
                    Amount to Redeem (BTS)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-bts-gold font-extrabold text-sm">◈</span>
                    <input
                      type="number"
                      min={minRedeem}
                      max={balance}
                      value={redeemAmount}
                      onChange={e => setRedeemAmount(e.target.value)}
                      placeholder={`Min. ${minRedeem} BTS`}
                      className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-brand-dark outline-none focus:border-bts-gold focus:ring-2 focus:ring-bts-gold/15 transition-all"
                      required
                    />
                  </div>
                  {redeemAmount && parseFloat(redeemAmount) < minRedeem && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1">Minimum redemption is {minRedeem} BTS</p>
                  )}
                </div>

                {/* TND Preview */}
                {redeemAmount && parseFloat(redeemAmount) >= minRedeem && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-emerald-700 uppercase">You will receive</p>
                      <p className="text-xl font-extrabold text-emerald-700 mt-0.5">{redeemTND} TND</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold">Rate</p>
                      <p className="text-xs font-extrabold text-gray-500">1 BTS = {BTS_TO_TND} TND</p>
                    </div>
                  </div>
                )}

                {/* IBAN */}
                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase block mb-1.5">
                    Tunisian Bank IBAN
                  </label>
                  <input
                    type="text"
                    value={redeemIBAN}
                    onChange={e => setRedeemIBAN(e.target.value)}
                    placeholder="TN59 1234 5678 9012 3456 7890"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-brand-dark outline-none focus:border-bts-gold focus:ring-2 focus:ring-bts-gold/15 transition-all font-mono"
                    required
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Must be a valid Tunisian bank account (TN country code)</p>
                </div>

                <button
                  type="submit"
                  disabled={!redeemAmount || parseFloat(redeemAmount) < minRedeem || !redeemIBAN}
                  className="w-full py-3 bg-brand-dark text-white font-extrabold rounded-xl text-sm hover:bg-bts-gold hover:text-brand-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit Redemption Request
                </button>

                <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                  Bitstacks does not charge a redemption fee. Processing takes up to 5 business days. For issues contact support@bitstacks.tn
                </p>
              </form>
            </>
          )}
        </div>
      )}

      {/* ══════════════ HISTORY ══════════════ */}
      {activeSection === 'history' && (
        <div className="space-y-5">
          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { key: 'all', label: 'All' },
              { key: 'earned', label: 'Earned' },
              { key: 'spent', label: 'Spent' },
              { key: 'redeemed', label: 'Redeemed' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setTxFilter(f.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${txFilter === f.key
                  ? 'bg-brand-dark text-white border-brand-dark'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-brand-dark'
                  }`}
              >
                {f.label}
              </button>
            ))}
            <button className="ml-auto flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-xl hover:border-bts-gold transition-all">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              Export CSV
            </button>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50">
                  {['Type', 'Description', 'Amount', 'Category', 'Date'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTxs.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tx.iconBg}`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d={tx.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          </svg>
                        </div>
                        <span className="text-sm font-extrabold text-brand-dark whitespace-nowrap">{tx.type}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500 font-semibold max-w-[200px] truncate">{tx.description}</td>
                    <td className={`px-5 py-4 text-sm font-extrabold whitespace-nowrap ${tx.positive ? 'text-emerald-600' : 'text-brand-dark'}`}>
                      {tx.amount} <span className="text-[10px] text-gray-400 font-bold">BTS</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg border ${tx.category === 'earned'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : tx.category === 'redeemed'
                          ? 'bg-purple-50 text-purple-700 border-purple-100'
                          : 'bg-orange-50 text-orange-700 border-orange-100'
                        }`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[11px] text-gray-400 font-semibold whitespace-nowrap">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 border-t border-gray-50 text-center">
              <p className="text-[11px] text-gray-400">Showing {filteredTxs.length} of {TRANSACTIONS.length} transactions</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Shared TX Row ─────────────────────────────────────────────────────────
function TxRow({ tx }) {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tx.iconBg}`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d={tx.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-extrabold text-brand-dark">{tx.type}</p>
        <p className="text-[10px] text-gray-400 truncate">{tx.description}</p>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-sm font-extrabold ${tx.positive ? 'text-emerald-600' : 'text-brand-dark'}`}>
          {tx.amount} <span className="text-[10px] text-gray-400">BTS</span>
        </p>
        <p className="text-[10px] text-gray-400">{tx.date}</p>
      </div>
      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-lg border shrink-0 ${tx.category === 'earned'
        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
        : tx.category === 'redeemed'
          ? 'bg-purple-50 text-purple-700 border-purple-100'
          : 'bg-orange-50 text-orange-700 border-orange-100'
        }`}>
        {tx.category}
      </span>
    </div>
  );
}
