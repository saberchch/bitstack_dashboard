import { useState } from 'react';
import StarRating from './StarRating';
import { addReview } from '../utils/reviewsStorage';

export default function SubmitReviewModal({
  entityType,
  entityId,
  entityLabel,
  onClose,
  onSubmitted,
}) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating < 1) {
      setError('Please select a star rating.');
      return;
    }
    if (text.trim().length < 10) {
      setError('Please write at least 10 characters.');
      return;
    }
    setSubmitting(true);
    const review = addReview({ entityType, entityId, rating, text });
    onSubmitted?.(review);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-extrabold text-brand-dark">Leave a Review</h3>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Share your experience with {entityLabel}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-2">
              Your Rating
            </label>
            <StarRating value={rating} readOnly={false} onChange={setRating} size="lg" />
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-2">
              Your Feedback
            </label>
            <textarea
              value={text}
              onChange={(e) => { setText(e.target.value); setError(''); }}
              rows={4}
              placeholder="What did you learn or appreciate? Be specific so others can benefit."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-bts-gold/30 focus:border-bts-gold resize-none font-medium"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-600 font-semibold">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-brand-dark text-white text-sm font-extrabold hover:bg-bts-gold hover:text-brand-dark transition-all cursor-pointer disabled:opacity-60"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
