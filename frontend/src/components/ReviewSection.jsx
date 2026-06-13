import { useState, useEffect, useCallback } from 'react';
import StarRating from './StarRating';
import ReviewList from './ReviewList';
import SubmitReviewModal from './SubmitReviewModal';
import {
  getReviewsForEntity,
  getAggregateRating,
  hasUserReviewed,
} from '../utils/reviewsStorage';
import { checkReviewEligibility } from '../utils/reviewEligibility';
import { getProfile } from '../utils/profileStorage';

export default function ReviewSection({
  entityType,
  entityId,
  entityLabel,
  title = 'Reviews',
  seedReviews = [],
  fallbackRating = 0,
  fallbackCount = 0,
  eligibilityContext = {},
  showSubmit = true,
  showAggregate = true,
  emptyText = 'No reviews yet. Be the first to share your experience.',
  className = '',
  variant = 'card',
}) {
  const [reviews, setReviews] = useState([]);
  const [aggregate, setAggregate] = useState({ rating: fallbackRating, count: fallbackCount });
  const [eligibility, setEligibility] = useState({ eligible: false, reason: '' });
  const [showModal, setShowModal] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  const refresh = useCallback(() => {
    const list = getReviewsForEntity(entityType, entityId, seedReviews);
    const agg = getAggregateRating(
      entityType,
      entityId,
      seedReviews,
      fallbackRating,
      fallbackCount
    );
    const profile = getProfile();
    const reviewed = hasUserReviewed(entityType, entityId, profile.userId);
    const elig = checkReviewEligibility(entityType, entityId, eligibilityContext);

    setReviews(list);
    setAggregate(agg);
    setAlreadyReviewed(reviewed);
    setEligibility(elig);
  }, [entityType, entityId, seedReviews, fallbackRating, fallbackCount, eligibilityContext]);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener('bts_reviews_change', handler);
    return () => window.removeEventListener('bts_reviews_change', handler);
  }, [refresh]);

  const canSubmit = showSubmit && eligibility.eligible && !alreadyReviewed;

  const wrapperClass =
    variant === 'card'
      ? 'bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm'
      : '';

  return (
    <div className={`${wrapperClass} ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-extrabold text-brand-dark flex items-center gap-2">
            <span className="material-symbols-outlined text-bts-gold">rate_review</span>
            {title}
          </h3>
          {showAggregate && aggregate.count > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <StarRating value={Math.round(aggregate.rating)} size="sm" />
              <span className="text-sm font-extrabold text-brand-dark">{aggregate.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400 font-medium">({aggregate.count} review{aggregate.count !== 1 ? 's' : ''})</span>
            </div>
          )}
        </div>

        {canSubmit && (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-brand-dark text-white rounded-xl text-xs font-extrabold hover:bg-bts-gold hover:text-brand-dark transition-all cursor-pointer shrink-0"
          >
            Write a Review
          </button>
        )}
      </div>

      {showSubmit && !canSubmit && !alreadyReviewed && eligibility.reason && (
        <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl">
          <p className="text-[11px] text-amber-800 font-semibold leading-relaxed">
            {eligibility.reason}
          </p>
        </div>
      )}

      {alreadyReviewed && (
        <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl">
          <p className="text-[11px] text-emerald-700 font-semibold">
            Thank you — your review has been submitted.
          </p>
        </div>
      )}

      <ReviewList reviews={reviews} emptyText={emptyText} />

      {showModal && (
        <SubmitReviewModal
          entityType={entityType}
          entityId={entityId}
          entityLabel={entityLabel}
          onClose={() => setShowModal(false)}
          onSubmitted={refresh}
        />
      )}
    </div>
  );
}

export function useEntityRating(entityType, entityId, seedReviews = [], fallbackRating = 0, fallbackCount = 0) {
  const [aggregate, setAggregate] = useState({ rating: fallbackRating, count: fallbackCount });

  useEffect(() => {
    const update = () => {
      setAggregate(getAggregateRating(entityType, entityId, seedReviews, fallbackRating, fallbackCount));
    };
    update();
    window.addEventListener('bts_reviews_change', update);
    return () => window.removeEventListener('bts_reviews_change', update);
  }, [entityType, entityId, seedReviews, fallbackRating, fallbackCount]);

  return aggregate;
}
