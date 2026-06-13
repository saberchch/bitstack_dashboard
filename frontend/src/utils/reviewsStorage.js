import { getProfile } from './profileStorage';

export const REVIEW_ENTITY_TYPES = {
  MENTOR: 'mentor',
  LIBRARY: 'library',
  SESSION: 'session',
  MISSION: 'mission',
  INSTITUTE: 'institute',
};

const STORAGE_KEY = 'bts_reviews';

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(reviews) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  window.dispatchEvent(new CustomEvent('bts_reviews_change', { detail: reviews }));
}

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

export function getStoredReviews() {
  return readAll();
}

export function getReviewsForEntity(entityType, entityId, seedReviews = []) {
  const stored = readAll().filter(
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
  return readAll().some(
    (r) =>
      r.entityType === entityType &&
      r.entityId === entityId &&
      r.authorId === userId
  );
}

export function addReview({ entityType, entityId, rating, text }) {
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
  };
  const next = [...readAll(), review];
  writeAll(next);
  return review;
}
