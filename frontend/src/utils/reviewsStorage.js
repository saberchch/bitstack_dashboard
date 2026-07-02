/**
 * reviewsStorage.js
 * -----------------
 * Manages reviews via direct REST API calls.
 *
 * GET  /api/reviews?targetId=xxx  → list reviews for an entity
 * POST /api/reviews               → create a review
 *
 * Reviews are also cached locally for synchronous aggregate reads.
 */
import { apiGet, apiPost } from './api';
import { getProfile } from './profileStorage';

export const REVIEW_ENTITY_TYPES = {
  MENTOR:    'mentor',
  LIBRARY:   'library',
  SESSION:   'session',
  MISSION:   'mission',
  INSTITUTE: 'institute',
};

const STORAGE_KEY = 'bts_reviews';

// ── Module-level cache ─────────────────────────────────────────────────────────
let _cache = (() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
})();

function _setCache(reviews) {
  _cache = Array.isArray(reviews) ? reviews : [];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_cache));
  } catch (_) {}
  window.dispatchEvent(new CustomEvent('bts_reviews_change', { detail: _cache }));
}

// ── Public API ────────────────────────────────────────────────────────────────

export function normalizeSeedReview(entry, entityType, entityId) {
  return {
    id: `seed-${entityType}-${entityId}-${entry.authorName || entry.name || entry.author}`,
    entityType,
    entityId,
    authorId: 'seed',
    authorName: entry.authorName || entry.name || entry.author || 'Anonymous',
    rating: entry.rating,
    text: entry.text,
    createdAt: entry.createdAt || null,
    isSeed: true,
  };
}

/** Synchronous read of ALL cached reviews. */
export function getStoredReviews() {
  return _cache;
}

/**
 * Fetch reviews for a specific entity from the server.
 * Merges with cached reviews and updates the cache.
 */
export async function fetchReviewsForEntity(entityType, entityId) {
  try {
    const data = await apiGet(`/api/reviews?targetId=${encodeURIComponent(entityId)}`);
    if (Array.isArray(data)) {
      // Merge: replace any existing stored reviews for this entity
      const others = _cache.filter(r => !(r.entityType === entityType && r.entityId === entityId));
      _setCache([...others, ...data]);
    }
  } catch (err) {
    console.warn('[reviewsStorage] fetchReviewsForEntity failed:', err.message);
  }
}

export function getReviewsForEntity(entityType, entityId, seedReviews = []) {
  const stored = _cache.filter(
    (r) => r.entityType === entityType && r.entityId === entityId
  );
  const seeds = seedReviews.map((r) => normalizeSeedReview(r, entityType, entityId));
  return [...seeds, ...stored].sort((a, b) => {
    if (!a.createdAt) return 1;
    if (!b.createdAt) return -1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}

export function getAggregateRating(entityType, entityId, seedReviews = [], fallbackRating = 0, fallbackCount = 0) {
  const reviews = getReviewsForEntity(entityType, entityId, seedReviews);
  if (reviews.length === 0) {
    return { rating: fallbackRating, count: fallbackCount || 0 };
  }
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return {
    rating: Math.round((sum / reviews.length) * 10) / 10,
    count: reviews.length,
  };
}

export function hasUserReviewed(entityType, entityId, userId) {
  if (!userId) return false;
  return _cache.some(
    (r) =>
      r.entityType === entityType &&
      r.entityId === entityId &&
      r.authorId === userId
  );
}

/**
 * Add a review: optimistic local update + POST to server.
 */
export async function addReview({ entityType, entityId, rating, text }) {
  const profile = getProfile();
  const review = {
    id: `review-${Date.now()}`,
    entityType,
    entityId,
    authorId: profile.userId,
    authorName: profile.name,
    rating: Math.min(5, Math.max(1, rating)),
    text: text.trim(),
    createdAt: new Date().toISOString(),
    isSeed: false,
    // Fields the backend expects:
    targetId: entityId,
    targetType: entityType,
  };

  // Optimistic update
  _setCache([..._cache, review]);

  try {
    const saved = await apiPost('/api/reviews', review);
    if (saved && saved.id) {
      _setCache(_cache.map(r => r.id === review.id ? { ...review, ...saved } : r));
    }
  } catch (err) {
    console.warn('[reviewsStorage] addReview failed:', err.message);
  }

  return review;
}
