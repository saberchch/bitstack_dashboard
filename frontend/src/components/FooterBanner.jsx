import { Link } from 'react-router-dom';

export default function FooterBanner() {
  const shortcuts = [
    { name: "Dashboard", path: "/", icon: "dashboard", desc: "System Overview" },
    { name: "Private Mentors", path: "/expert-mentors", icon: "school", desc: "Expert Matchmaker" },
    { name: "Digital Library", path: "/d-library", icon: "menu_book", desc: "Resource Library" },
    { name: "Freelance Hub", path: "/d-lancer", icon: "work", desc: "Missions & Gigs" }
  ];

  return (
    <footer className="mt-12 border-t border-gray-100 py-8 flex flex-col lg:flex-row items-center justify-between gap-6" data-purpose="footer-banner">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center shrink-0 border border-yellow-100">
          <svg fill="none" height="24" stroke="#d4a017" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
        </div>
        <div>
          <span className="text-sm font-black text-brand-dark uppercase tracking-wider">BitStacks Portal</span>
          <p className="text-xs text-gray-400 font-bold leading-tight mt-0.5">Fast navigation shortcuts</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {shortcuts.map((s) => (
          <Link 
            key={s.path}
            to={s.path}
            className="flex items-center gap-3.5 bg-gray-50 hover:bg-yellow-50/40 border border-gray-100 hover:border-bts-gold/30 px-5 py-3 rounded-2xl transition-all group shadow-sm hover:shadow-md"
          >
            <span className="material-symbols-outlined !text-[22px] text-gray-400 group-hover:text-bts-gold transition-colors">{s.icon}</span>
            <div className="text-left leading-tight">
              <span className="text-xs font-black text-brand-dark block group-hover:text-bts-gold transition-colors">{s.name}</span>
              <span className="text-[10px] text-gray-400 font-bold block mt-0.5">{s.desc}</span>
            </div>
          </Link>
        ))}
      </div>
    </footer>
  );
}


