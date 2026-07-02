/**
 * notificationsStorage.js
 * -----------------------
 * Manages notifications via direct REST API calls.
 *
 * GET   /api/notifications            → list all
 * PATCH /api/notifications/:id/read   → mark one as read
 *
 * Local cache keeps notifications in memory so synchronous reads are instant.
 */
import { apiGet, apiPatch, apiPost } from './api';

// ── Module-level cache ─────────────────────────────────────────────────────────
let _cache = (() => {
  try {
    const raw = localStorage.getItem('bts_notifications');
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
})();

function _setCache(notifications) {
  _cache = Array.isArray(notifications) ? notifications : [];
  try {
    localStorage.setItem('bts_notifications', JSON.stringify(_cache));
  } catch (_) {}
  window.dispatchEvent(new Event('bts_notifications_change'));
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Synchronous read from the in-memory cache.
 */
export function getNotifications() {
  return _cache;
}

/**
 * Fetch notifications from the server and refresh the cache.
 * Call from a useEffect on mount.
 */
export async function fetchNotificationsFromServer() {
  try {
    const data = await apiGet('/api/notifications');
    if (Array.isArray(data)) {
      _setCache(data);
    }
  } catch (err) {
    console.warn('[notificationsStorage] fetch failed:', err.message);
  }
  return _cache;
}

/**
 * Add a notification (optimistic — creates locally + POSTs to server).
 */
export async function addNotification({ category, title, description, route }) {
  const newNotification = {
    id: `n-${Date.now()}`,
    category,
    title,
    description,
    ts: 'Just now',
    read: false,
    route: route || '/notifications',
  };

  // Optimistic local update
  _setCache([newNotification, ..._cache]);

  // Persist to server (best-effort)
  try {
    const saved = await apiPost('/api/notifications', newNotification);
    if (saved && saved.id) {
      // Replace the optimistic entry with the server-assigned one
      _setCache(_cache.map(n => n.id === newNotification.id ? { ...newNotification, ...saved } : n));
    }
  } catch (err) {
    console.warn('[notificationsStorage] addNotification server call failed:', err.message);
  }

  return newNotification;
}

/**
 * Mark a single notification as read.
 */
export async function markAsRead(id) {
  _setCache(_cache.map(n => n.id === id ? { ...n, read: true } : n));
  try {
    await apiPatch(`/api/notifications/${id}/read`);
  } catch (err) {
    console.warn('[notificationsStorage] markAsRead failed:', err.message);
  }
}

/**
 * Mark all notifications as read (local only — no bulk endpoint on server).
 */
export function markAllAsRead() {
  _setCache(_cache.map(n => ({ ...n, read: true })));
}

/**
 * Delete a notification (local only — filters out of cache).
 */
export function deleteNotification(id) {
  _setCache(_cache.filter(n => n.id !== id));
}

/**
 * Clear all notifications from local cache.
 */
export function clearAllNotifications() {
  _setCache([]);
}

/**
 * Synchronous cache write used by other storage modules to inject notifications
 * without waiting for a full server round-trip.
 */
export function saveNotifications(notifications) {
  _setCache(notifications);
}
