/**
 * enrollmentStorage.js
 * --------------------
 * Manages public session enrollments and private bookings via direct REST API.
 *
 * GET  /api/enrollments            → list user's enrollments
 * POST /api/enrollments            → enroll in a session
 * GET  /api/bookings               → list user's private bookings
 * POST /api/bookings               → create a booking
 */
import { apiGet, apiPost } from './api';
import { getSessionById } from './sessionsStorage';

// ── Enrollment cache ───────────────────────────────────────────────────────────
let _enrollmentCache = (() => {
  try {
    const raw = localStorage.getItem('bts_public_enrollment_records');
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
})();

function _setEnrollmentCache(records) {
  _enrollmentCache = Array.isArray(records) ? records : [];
  try {
    localStorage.setItem('bts_public_enrollment_records', JSON.stringify(_enrollmentCache));
  } catch (_) {}
  window.dispatchEvent(new CustomEvent('bts_enrollments_change', { detail: _enrollmentCache }));
}

// ── Booking cache ──────────────────────────────────────────────────────────────
const DEFAULT_BOOKINGS = [
  {
    id: 'booking-1',
    mentorId: 'elena-volkov',
    mentorName: 'Dr. Elena Volkov',
    mentorAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAW6ZyX8xOjktMDABgbeSoECsYzlAjy7-FJgYKOj6AHXoRIfXnbGHnzSerNy0vBBqilDXnGUkAe9ZcZKJjtl79xszrt_WXjPjPlllqVk4WqEeWnx23dN6RFgL2W_HzkWA11XHgfpI2xg4EyWHj_b7U4g0aulNmsMrg-INtyHa58pBUsF5gPHymRL2zisAV9Y7R3WZqbyQZz8jpLu4asi7f13Epp7ZdmIz62st1kcP94Jm31u_p8Ad5jNgn1hOI0XiH2TWF_nORMLvc',
    date: 3,
    slot: '11:30 AM EST',
    topic: 'Zero Knowledge Proof Architecture Review',
    duration: 2,
    cost: 1500,
    status: 'Confirmed',
  },
];

let _bookingCache = (() => {
  try {
    const raw = localStorage.getItem('bts_private_bookings');
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_BOOKINGS;
  } catch (_) {
    return DEFAULT_BOOKINGS;
  }
})();

function _setBookingCache(bookings) {
  _bookingCache = Array.isArray(bookings) ? bookings : [];
  try {
    localStorage.setItem('bts_private_bookings', JSON.stringify(_bookingCache));
  } catch (_) {}
  window.dispatchEvent(new CustomEvent('bts_private_bookings_change', { detail: _bookingCache }));
}

// ── Public API — Enrollments ───────────────────────────────────────────────────

/** Fetch enrollments from server and refresh cache. */
export async function fetchEnrollmentsFromServer() {
  try {
    const data = await apiGet('/api/enrollments');
    if (Array.isArray(data)) {
      _setEnrollmentCache(data);
    }
  } catch (err) {
    console.warn('[enrollmentStorage] fetchEnrollments failed:', err.message);
  }
  return _enrollmentCache;
}

export function getEnrollmentRecords() {
  return _enrollmentCache;
}

export function getPublicEnrollments() {
  return _enrollmentCache.map((r) => r.sessionId);
}

export function getEnrollmentRecord(sessionId) {
  return _enrollmentCache.find((r) => r.sessionId === sessionId) || null;
}

export function getMyEnrollmentsWithDetails() {
  return _enrollmentCache
    .map((record) => {
      const session = getSessionById(record.sessionId);
      if (!session) return null;
      return { ...record, session };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt));
}

export function isEnrolledInPublic(sessionId) {
  return _enrollmentCache.some((r) => r.sessionId === sessionId);
}

export async function enrollInPublicSession(sessionId) {
  if (isEnrolledInPublic(sessionId)) {
    return getPublicEnrollments();
  }

  const session = getSessionById(sessionId);
  const newRecord = {
    sessionId,
    enrolledAt: new Date().toISOString(),
    sessionType: session?.sessionType || 'standard',
    status: 'confirmed',
  };

  // Optimistic update
  _setEnrollmentCache([..._enrollmentCache, newRecord]);

  // Persist to server
  try {
    await apiPost('/api/enrollments', { sessionId, sessionType: newRecord.sessionType });
  } catch (err) {
    console.warn('[enrollmentStorage] enrollInPublicSession failed:', err.message);
  }

  return getPublicEnrollments();
}

export function cancelEnrollment(sessionId) {
  _setEnrollmentCache(_enrollmentCache.filter((r) => r.sessionId !== sessionId));
  return _enrollmentCache;
}

// ── Public API — Bookings ──────────────────────────────────────────────────────

/** Fetch private bookings from server and refresh cache. */
export async function fetchBookingsFromServer() {
  try {
    const data = await apiGet('/api/bookings');
    if (Array.isArray(data) && data.length > 0) {
      _setBookingCache(data);
    }
  } catch (err) {
    console.warn('[enrollmentStorage] fetchBookings failed:', err.message);
  }
  return _bookingCache;
}

export function getPrivateBookings() {
  return _bookingCache;
}

export async function bookPrivateSession(booking) {
  const newBooking = {
    id: 'booking-' + Date.now(),
    status: 'Pending',
    ...booking,
  };

  // Optimistic update
  _setBookingCache([..._bookingCache, newBooking]);

  try {
    const saved = await apiPost('/api/bookings', newBooking);
    if (saved && saved.id) {
      // Sync server-assigned id
      _setBookingCache(
        _bookingCache.map((b) =>
          b.id === newBooking.id ? { ...newBooking, id: saved.id } : b
        )
      );
      newBooking.id = saved.id;
    }
  } catch (err) {
    console.warn('[enrollmentStorage] bookPrivateSession failed:', err.message);
  }

  return _bookingCache;
}

export function cancelPrivateBooking(bookingId) {
  _setBookingCache(_bookingCache.filter((b) => b.id !== bookingId));
  return _bookingCache;
}

// ── Formatting helper ──────────────────────────────────────────────────────────
export function formatEnrollmentDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}
