const DIFFICULTY_CONFIG = {
  Intermediate: 'bg-gray-100 text-gray-600',
  Advanced: 'bg-brand-dark/80 text-white',
  Expert: 'bg-brand-dark text-bts-gold',
};

export default function DifficultyBadge({ difficulty }) {
  const cls = DIFFICULTY_CONFIG[difficulty] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest ${cls}`}>
      {difficulty}
    </span>
  );
}
