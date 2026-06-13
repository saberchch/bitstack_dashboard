export default function PublicSessionsHero({ isAdmin = false, onCreatePremium }) {
  return (
    <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <nav className="flex items-center gap-2 text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">
          <a className="hover:text-bts-gold transition-colors" href="/d-platform">D-Platform</a>
          <span className="material-symbols-outlined !text-[12px]">chevron_right</span>
          <span className="text-bts-gold">Public Sessions</span>
        </nav>
        <h2 className="text-2xl font-extrabold text-brand-dark">Public Sessions</h2>
        <p className="text-sm text-gray-500 mt-1">
          Explore workshops, track your enrollments, and access premium institute sessions.
        </p>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        {isAdmin && (
          <button
            type="button"
            onClick={onCreatePremium}
            className="bg-brand-dark text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-bts-gold hover:text-brand-dark transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined !text-[16px]">add_circle</span>
            Create Premium Session
          </button>
        )}
        <a
          href="/calendar"
          className="bg-white border border-gray-100 text-brand-dark px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined !text-[16px]">calendar_today</span>
          My Schedule
        </a>
      </div>
    </section>
  );
}
