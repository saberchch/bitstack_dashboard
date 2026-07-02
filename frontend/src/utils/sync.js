/**
 * sync.js  –  STUB (legacy compatibility shim)
 * =============================================
 *
 * The old localStorage-shim + IndexedDB + /api/sync architecture has been
 * replaced with conventional direct REST API calls in each storage utility.
 *
 * This file is kept as a no-op stub so that any remaining imports of
 * `scheduleSync`, `hydrateFromServer`, `clearAllLocalData`, etc. compile
 * without errors while the codebase is fully migrated.
 *
 * ALL functions here are intentional no-ops.
 * Remove this file once all imports have been updated.
 */

/** No-op: sync is now handled by each storage module's own API calls. */
export function scheduleSync(_key) {
  // intentional no-op
}

/** No-op: hydration is now done per-module in useEffect hooks. */
export async function hydrateFromServer() {
  // intentional no-op
}

/** No-op: individual storage modules no longer use a shared memory store. */
export async function initStorage() {
  // intentional no-op
}

/** No-op. */
export async function flushAll() {
  // intentional no-op
}

/** No-op. */
export async function loadFromServer(_key) {
  return null;
}

/**
 * Clear auth token and reload to log out.
 * Kept functional because Sidebar and AuthPage still call this.
 */
export async function clearAllLocalData() {
  localStorage.removeItem('bts_auth_token');
  localStorage.removeItem('bts_user_profile');
  localStorage.removeItem('bts_conversations');
  localStorage.removeItem('bts_notifications');
  localStorage.removeItem('bts_public_enrollment_records');
  localStorage.removeItem('bts_private_bookings');
  localStorage.removeItem('bts_premium_public_sessions');
  localStorage.removeItem('bts_reviews');
  localStorage.removeItem('bts_calendar_events');
}

/** SYNCABLE_KEYS kept for any remaining imports. */
export const SYNCABLE_KEYS = new Set([]);
