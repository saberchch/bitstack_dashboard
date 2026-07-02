/**
 * profileStorage.js
 * -----------------
 * Manages the user profile via direct REST API calls.
 *
 * GET  /api/profile  → fetch current user profile
 * PUT  /api/profile  → save profile changes
 *
 * Local cache: the last-fetched profile is kept in a module-level variable
 * so synchronous reads (getProfile) work without waiting for a network round-trip.
 * The cache is refreshed on every successful server read.
 */
import { apiGet, apiPut } from './api';

const DEFAULT_PROFILE = {
  name: '',
  email: '',
  phone: '',
  role: 'Member',
  profileType: 'Student', // "Student" | "Mentor" | "Freelancer"
  verificationStatus: 'New User',
  avatar: '',
  bio: '',
  skillLevel: 'Beginner',
  topicInterests: [],
  linkedin: '',
  github: '',
  website: '',
  userId: '',
  platformRole: 'member', // "admin" | "member"
  balance: 0,
};

// ── Module-level in-memory cache ──────────────────────────────────────────────
// Seeded immediately from localStorage on module load so components that call
// getProfile() synchronously get a usable value before the first API response.
let _profileCache = (() => {
  try {
    const raw = localStorage.getItem('bts_user_profile');
    return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : { ...DEFAULT_PROFILE };
  } catch (_) {
    return { ...DEFAULT_PROFILE };
  }
})();

function _setCache(profile) {
  _profileCache = { ...DEFAULT_PROFILE, ..._profileCache, ...profile };
  // Mirror into localStorage so offline reads stay fresh
  try {
    localStorage.setItem('bts_user_profile', JSON.stringify(_profileCache));
  } catch (_) {}
  window.dispatchEvent(new CustomEvent('bts_profile_change', { detail: _profileCache }));
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Synchronous read from the in-memory cache.
 * Always returns a valid profile object (never null).
 */
export function getProfile() {
  return _profileCache;
}

export function isPlatformAdmin() {
  return getProfile().platformRole === 'admin';
}

/**
 * Fetch the profile from the server and refresh the cache.
 * Components should call this inside useEffect on mount.
 * @returns {Promise<object>} The refreshed profile.
 */
export async function fetchProfileFromServer() {
  try {
    const profile = await apiGet('/api/profile');
    if (profile && typeof profile === 'object') {
      _setCache(profile);
      return _profileCache;
    }
  } catch (err) {
    console.warn('[profileStorage] fetchProfileFromServer failed:', err.message);
  }
  return _profileCache;
}

/**
 * Persist profile changes to the server, then update the local cache.
 * @param {object} updatedFields  Partial profile fields to merge.
 * @returns {Promise<object>}     The saved profile from the server.
 */
export async function updateProfile(updatedFields) {
  const next = { ..._profileCache, ...updatedFields };
  // Optimistically update cache so UI is instant
  _setCache(next);
  try {
    const saved = await apiPut('/api/profile', next);
    if (saved && typeof saved === 'object') {
      _setCache(saved);
    }
  } catch (err) {
    console.warn('[profileStorage] updateProfile failed:', err.message);
  }
  return _profileCache;
}

/**
 * Synchronous balance helper kept for compatibility with balanceStorage.js.
 * Balance is stored on the profile object.
 */
export function getBalance() {
  return Number(_profileCache.balance) || 0;
}
