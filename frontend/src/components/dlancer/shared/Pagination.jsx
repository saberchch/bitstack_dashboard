export default function Pagination({ page, total, onChange }) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1 pt-4">
      <button
        onClick={() => onChange(p => Math.max(1, p - 1))}
        disabled={page === 1}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-brand-dark hover:bg-white border border-gray-200 transition-all disabled:opacity-30"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-8 h-8 rounded-lg text-xs font-extrabold transition-all ${
            p === page
              ? 'bg-brand-dark text-white shadow'
              : 'text-gray-400 hover:text-brand-dark hover:bg-white border border-gray-200'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(p => Math.min(total, p + 1))}
        disabled={page === total}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-brand-dark hover:bg-white border border-gray-200 transition-all disabled:opacity-30"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </button>
    </div>
  );
}
