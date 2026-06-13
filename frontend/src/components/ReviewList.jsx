import StarRating from './StarRating';

function formatDate(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return null;
  }
}

export default function ReviewList({ reviews = [], emptyText = 'No reviews yet.' }) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 px-4 bg-gray-50 border border-gray-100 rounded-xl">
        <p className="text-xs text-gray-400 font-semibold">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <div key={r.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2 gap-2">
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-brand-dark truncate">{r.authorName}</p>
              {formatDate(r.createdAt) && (
                <p className="text-[10px] text-gray-400 font-medium">{formatDate(r.createdAt)}</p>
              )}
            </div>
            <StarRating value={r.rating} size="sm" />
          </div>
          <p className="text-xs text-gray-500 leading-relaxed font-semibold">"{r.text}"</p>
        </div>
      ))}
    </div>
  );
}
