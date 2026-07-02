export default function MarketplaceCategoryPills({ categories, selected, counts, onSelect }) {
  return (
    <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
      {categories.map(cat => {
        const count = counts[cat.key] || 0;
        const active = selected === cat.key;
        return (
          <button
            key={cat.key}
            onClick={() => onSelect(cat.key)}
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
            }`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
