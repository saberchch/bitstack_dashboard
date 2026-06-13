export default function PublicSessionsPagination() {
  return (
    <div className="mt-16 flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs font-bold text-gray-400">Showing 5 of 42 sessions</p>
        <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="bg-bts-gold h-full w-[12%]"></div>
        </div>
      </div>
      <nav className="flex items-center gap-2">
        <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <span className="material-symbols-outlined !text-[18px]">chevron_left</span>
        </button>
        <button className="w-10 h-10 bg-bts-gold text-white rounded-xl font-bold text-xs shadow-sm">1</button>
        <button className="w-10 h-10 border border-gray-200 rounded-xl font-bold text-gray-400 hover:bg-gray-50 hover:text-brand-dark transition-all text-xs">2</button>
        <button className="w-10 h-10 border border-gray-200 rounded-xl font-bold text-gray-400 hover:bg-gray-50 hover:text-brand-dark transition-all text-xs">3</button>
        <span className="px-2 text-gray-300 text-xs font-bold">...</span>
        <button className="w-10 h-10 border border-gray-200 rounded-xl font-bold text-gray-400 hover:bg-gray-50 hover:text-brand-dark transition-all text-xs">12</button>
        <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <span className="material-symbols-outlined !text-[18px]">chevron_right</span>
        </button>
      </nav>
    </div>
  );
}
