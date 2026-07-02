import { useNavigate } from 'react-router-dom';

export default function GreetingHero({ onSearch }) {
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="relative overflow-hidden bg-brand-dark rounded-3xl p-8 mb-6">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-bts-gold/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-bts-gold">D-Lancer</span>
          <span className="w-1 h-1 rounded-full bg-bts-gold/40" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-white/40">Workspace</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-1 tracking-tight">
          {greeting}, Builder 👋
        </h1>
        <p className="text-sm text-white/50 mb-6">
          Your professional project collaboration workspace.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-lg">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          <input
            type="text"
            placeholder="Search missions, skills, clients..."
            onChange={e => onSearch?.(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') navigate('/d-lancer/marketplace');
            }}
            className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-2xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-bts-gold/60 focus:bg-white/15 transition-all"
          />
          <button
            onClick={() => navigate('/d-lancer/marketplace')}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-bts-gold text-brand-dark text-[11px] font-extrabold rounded-xl hover:bg-white transition-all"
          >
            Browse
          </button>
        </div>

        {/* Quick stats row */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-6">
          {[
            { label: 'Open Missions', value: '24+' },
            { label: 'Avg. Reward', value: '◈ 2,100' },
            { label: 'Top Skill', value: 'Web3' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-base font-extrabold text-white">{stat.value}</p>
              <p className="text-[10px] text-white/40 font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
