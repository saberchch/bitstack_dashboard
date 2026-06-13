import { getSessionById } from './sessionsStorage';

const LEGACY_KEY = 'bts_public_enrollments';
const RECORDS_KEY = 'bts_public_enrollment_records';

function migrateLegacyEnrollments() {
  const legacy = localStorage.getItem(LEGACY_KEY);
  if (!legacy) return;

  try {
    const parsed = JSON.parse(legacy);
    if (!Array.isArray(parsed) || parsed.length === 0) return;

    const existing = readRecords();
    const existingIds = new Set(existing.map((r) => r.sessionId));

    const migrated = parsed
      .filter((id) => typeof id === 'string' && !existingIds.has(id))
      .map((sessionId) => ({
        sessionId,
        enrolledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        sessionType: getSessionById(sessionId)?.sessionType || 'standard',
        status: 'confirmed',
      }));

    if (migrated.length > 0) {
      writeRecords([...existing, ...migrated]);
    }
  } catch {
    // ignore corrupt legacy data
  }
}

function readRecords() {
  migrateLegacyEnrollments();
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    if (!raw) {
      const defaultRecords = [
        {
          sessionId: 'smart-contract-auditing',
          enrolledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          sessionType: 'standard',
          status: 'confirmed',
        },
      ];
      localStorage.setItem(RECORDS_KEY, JSON.stringify(defaultRecords));
      return defaultRecords;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeRecords(records) {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  window.dispatchEvent(new CustomEvent('bts_enrollments_change', { detail: records }));
}

export function getEnrollmentRecords() {
  return readRecords();
}

export function getPublicEnrollments() {
  return readRecords().map((r) => r.sessionId);
}

export function getEnrollmentRecord(sessionId) {
  return readRecords().find((r) => r.sessionId === sessionId) || null;
}

export function getMyEnrollmentsWithDetails() {
  return readRecords()
    .map((record) => {
      const session = getSessionById(record.sessionId);
      if (!session) return null;
      return { ...record, session };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt));
}

export function enrollInPublicSession(sessionId) {
  const records = readRecords();
  if (records.some((r) => r.sessionId === sessionId)) {
    return records.map((r) => r.sessionId);
  }

  const session = getSessionById(sessionId);
  const next = [
    ...records,
    {
      sessionId,
      enrolledAt: new Date().toISOString(),
      sessionType: session?.sessionType || 'standard',
      status: 'confirmed',
      bookedSlot: session?.sessionType === 'premium_private' ? null : undefined,
    },
  ];
  writeRecords(next);
  return next.map((r) => r.sessionId);
}

export function isEnrolledInPublic(sessionId) {
  return readRecords().some((r) => r.sessionId === sessionId);
}

export function cancelEnrollment(sessionId) {
  const next = readRecords().filter((r) => r.sessionId !== sessionId);
  writeRecords(next);
  return next;
}

export function getPrivateBookings() {
  const data = localStorage.getItem('bts_private_bookings');
  if (!data) {
    const defaultBookings = [
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
    localStorage.setItem('bts_private_bookings', JSON.stringify(defaultBookings));
    return defaultBookings;
  }
  return JSON.parse(data);
}

export function bookPrivateSession(booking) {
  const bookings = getPrivateBookings();
  const newBooking = {
    id: 'booking-' + Date.now(),
    status: 'Confirmed',
    ...booking,
  };
  bookings.push(newBooking);
  localStorage.setItem('bts_private_bookings', JSON.stringify(bookings));
  return bookings;
}

export function cancelPrivateBooking(bookingId) {
  const bookings = getPrivateBookings();
  const updatedBookings = bookings.filter((b) => b.id !== bookingId);
  localStorage.setItem('bts_private_bookings', JSON.stringify(updatedBookings));
  return updatedBookings;
}

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
