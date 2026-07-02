/**
 * api.js  –  BitStack Dashboard  –  Shared REST API Helper
 * =========================================================
 *
 * Provides thin wrappers around fetch() that:
 *  - Always read the JWT token from localStorage and inject it as Authorization
 *  - Throw a descriptive error on non-OK responses
 *  - Handle 401 by clearing the session and reloading to the login page
 *  - Automatically fall back to Offline/Mock Mode if the backend is down
 */

const TOKEN_KEY = 'bts_auth_token';

/** Read the stored JWT — plain localStorage, no shim needed. */
function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/** Build Authorization headers, merging any extras the caller passes. */
function authHeaders(extra = {}) {
  const headers = { 'Content-Type': 'application/json', ...extra };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

/** Handle a 401: wipe the token and redirect to login page. */
function handleUnauthorized() {
  localStorage.removeItem(TOKEN_KEY);
  // Hard reload so App.jsx detects the missing token and shows AuthPage.
  window.location.reload();
}

/** Mock Handler for client-side Offline Mock Mode */
function handleMockRequest(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : null;

  console.log(`[Offline Mock API] ${method} ${path}`, body);

  // Helper: Get or initialize localStorage item
  const getStorageItem = (key, defaultValue) => {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    try {
      return JSON.parse(data);
    } catch (_) {
      return defaultValue;
    }
  };

  const setStorageItem = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  // 1. Auth Mock Endpoints
  if (path === '/api/auth/login') {
    const email = body?.email || 'bob@bitstacks.io';
    const isMentor = email.includes('mentor') || email.includes('alice');
    const name = isMentor ? 'Alice Mentor' : 'Bob Student';
    const role = isMentor ? 'Mentor' : 'Student';
    const userId = isMentor ? 'BTS-9921-A9E' : 'BTS-8839-E4A';

    const userProfile = {
      name,
      email,
      phone: '',
      role: isMentor ? 'Verified Mentor' : 'Premium Member',
      profileType: role,
      verificationStatus: isMentor ? 'Verified' : 'New User',
      avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=d4a017&color=0b1121&size=100`,
      bio: isMentor ? 'Lead developer and systems auditor.' : 'Aspiring smart contract developer.',
      skillLevel: isMentor ? 'Expert' : 'Beginner',
      topicInterests: isMentor ? ['DeFi', 'Security'] : ['Solidity', 'Frontend'],
      linkedin: '',
      github: '',
      website: '',
      userId,
      platformRole: isMentor ? 'admin' : 'member',
      balance: isMentor ? 2500 : 1000,
    };

    setStorageItem('bts_user_profile', userProfile);
    localStorage.setItem(TOKEN_KEY, 'mock-jwt-token');

    // Notify listeners that profile changed
    window.dispatchEvent(new CustomEvent('bts_profile_change', { detail: userProfile }));

    return {
      token: 'mock-jwt-token',
      user: {
        userId,
        email,
        name,
        role,
      }
    };
  }

  if (path === '/api/auth/register') {
    const name = body?.name || 'New User';
    const email = body?.email || 'new@bitstacks.io';
    const role = body?.role || 'Student';
    const userId = `BTS-${Math.floor(1000 + Math.random() * 9000)}-MOCK`;

    const userProfile = {
      name,
      email,
      phone: '',
      role: role === 'Mentor' ? 'Verified Mentor' : 'Premium Member',
      profileType: role,
      verificationStatus: 'New User',
      avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=d4a017&color=0b1121&size=100`,
      bio: '',
      skillLevel: 'Beginner',
      topicInterests: [],
      linkedin: '',
      github: '',
      website: '',
      userId,
      platformRole: 'member',
      balance: role === 'Mentor' ? 2500 : 1000,
    };

    setStorageItem('bts_user_profile', userProfile);
    localStorage.setItem(TOKEN_KEY, 'mock-jwt-token');

    window.dispatchEvent(new CustomEvent('bts_profile_change', { detail: userProfile }));

    return {
      token: 'mock-jwt-token',
      user: {
        userId,
        email,
        name,
        role,
      }
    };
  }

  // 2. Profile Mock Endpoints
  if (path === '/api/profile') {
    if (method === 'PUT') {
      setStorageItem('bts_user_profile', body);
      window.dispatchEvent(new CustomEvent('bts_profile_change', { detail: body }));
      return body;
    }
    return getStorageItem('bts_user_profile', {
      name: 'Bob Student',
      email: 'bob@bitstacks.io',
      phone: '',
      role: 'Premium Member',
      profileType: 'Student',
      verificationStatus: 'New User',
      avatar: 'https://ui-avatars.com/api/?name=Bob+Student&background=d4a017&color=0b1121&size=100',
      bio: '',
      skillLevel: 'Beginner',
      topicInterests: [],
      linkedin: '',
      github: '',
      website: '',
      userId: 'BTS-8839-E4A',
      platformRole: 'member',
      balance: 1000,
    });
  }

  // 3. Bookings Mock Endpoints
  if (path === '/api/bookings') {
    const defaultBookings = [
      {
        id: 'bk-1',
        studentName: 'Bob Student',
        studentAvatar: 'https://ui-avatars.com/api/?name=Bob+Student&background=e0e7ff&color=4338ca',
        topic: 'Solidity Gas Optimization',
        date: '15',
        slot: '10:00 AM - 11:00 AM',
        duration: 1,
        cost: 80,
        status: 'Pending',
      },
      {
        id: 'bk-2',
        studentName: 'Charlie Brown',
        studentAvatar: 'https://ui-avatars.com/api/?name=Charlie+Brown&background=fef3c7&color=d97706',
        topic: 'Introduction to DeFi AMMs',
        date: '18',
        slot: '2:00 PM - 3:00 PM',
        duration: 1,
        cost: 80,
        status: 'Confirmed',
      }
    ];
    return getStorageItem('bts_private_bookings', defaultBookings);
  }

  if (path.startsWith('/api/bookings/')) {
    const bookingId = path.split('/').pop();
    const bookings = getStorageItem('bts_private_bookings', []);
    const updated = bookings.map(b => b.id === bookingId ? { ...b, ...body } : b);
    setStorageItem('bts_private_bookings', updated);
    return updated.find(b => b.id === bookingId) || { id: bookingId, ...body };
  }

  // 4. Attendance Mock Endpoints
  if (path.startsWith('/api/attendance/')) {
    const sessionId = path.split('/').pop();
    const storageKey = `bts_attendance_${sessionId}`;
    if (method === 'POST') {
      const attendances = body?.attendances || [];
      setStorageItem(storageKey, attendances);
      return { status: 'success' };
    }
    const defaultRoster = [
      { studentId: 'std-1', studentName: 'Bob Student', studentAvatar: 'https://ui-avatars.com/api/?name=Bob+Student&background=e0e7ff&color=4338ca', attended: true },
      { studentId: 'std-2', studentName: 'Alice Springs', studentAvatar: 'https://ui-avatars.com/api/?name=Alice+Springs&background=fce7f3&color=db2777', attended: false },
      { studentId: 'std-3', studentName: 'Dave Miller', studentAvatar: 'https://ui-avatars.com/api/?name=Dave+Miller&background=dcfce7&color=15803d', attended: true },
    ];
    return getStorageItem(storageKey, defaultRoster);
  }

  // 5. Availability Mock Endpoints
  if (path === '/api/availability') {
    const defaultSlots = [
      { id: 'av-1', dayOfWeek: 0, startTime: '9:00 AM', endTime: '10:00 AM', isActive: true },
      { id: 'av-2', dayOfWeek: 2, startTime: '2:00 PM', endTime: '3:00 PM', isActive: true },
      { id: 'av-3', dayOfWeek: 4, startTime: '4:00 PM', endTime: '5:00 PM', isActive: false },
    ];
    if (method === 'POST') {
      const slots = getStorageItem('bts_mentor_availability', defaultSlots);
      const newSlot = {
        id: `slot-${Date.now()}`,
        dayOfWeek: Number(body.dayOfWeek),
        startTime: body.startTime,
        endTime: body.endTime,
        isActive: true
      };
      slots.push(newSlot);
      setStorageItem('bts_mentor_availability', slots);
      return newSlot;
    }
    return getStorageItem('bts_mentor_availability', defaultSlots);
  }

  if (path.startsWith('/api/availability/') && path.endsWith('/toggle')) {
    const slotId = path.split('/')[3];
    const slots = getStorageItem('bts_mentor_availability', []);
    const updated = slots.map(s => s.id === slotId ? { ...s, isActive: !s.isActive } : s);
    setStorageItem('bts_mentor_availability', updated);
    return updated.find(s => s.id === slotId) || { id: slotId, isActive: true };
  }

  if (path.startsWith('/api/availability/')) {
    const slotId = path.split('/').pop();
    if (method === 'DELETE') {
      const slots = getStorageItem('bts_mentor_availability', []);
      const filtered = slots.filter(s => s.id !== slotId);
      setStorageItem('bts_mentor_availability', filtered);
      return { deleted: true };
    }
  }

  // 6. Generic Passthrough Fallbacks for reviews, calendar, messages, etc.
  if (path === '/api/calendar') {
    if (method === 'POST') {
      const events = getStorageItem('bts_calendar_events', []);
      events.push(body);
      setStorageItem('bts_calendar_events', events);
      window.dispatchEvent(new CustomEvent('bts_calendar_events_change'));
      return body;
    }
    return getStorageItem('bts_calendar_events', []);
  }

  if (path.startsWith('/api/reviews')) {
    if (method === 'POST') {
      const reviews = getStorageItem('bts_reviews', []);
      reviews.push(body);
      setStorageItem('bts_reviews', reviews);
      window.dispatchEvent(new CustomEvent('bts_reviews_change'));
      return body;
    }
    return getStorageItem('bts_reviews', []);
  }

  if (path.startsWith('/api/conversations')) {
    return getStorageItem('bts_conversations', []);
  }

  if (path === '/api/notifications') {
    return getStorageItem('bts_notifications', []);
  }

  if (path === '/api/sessions') {
    return getStorageItem('bts_premium_public_sessions', []);
  }

  // Fallback default
  return { status: 'success' };
}

/**
 * Core fetch wrapper.
 * @param {string} path          - e.g. '/api/profile'
 * @param {RequestInit} options  - fetch options (method, body, etc.)
 * @returns {Promise<any>}       - Parsed JSON response
 */
async function apiFetch(path, options = {}) {
  const isOffline = localStorage.getItem('bts_offline_mode') === 'true';
  if (isOffline) {
    // Delay slightly to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 200));
    return handleMockRequest(path, options);
  }

  try {
    const res = await fetch(path, {
      ...options,
      headers: authHeaders(options.headers || {}),
    });

    if (res.status === 401) {
      handleUnauthorized();
      // Return a never-resolving promise so callers don't continue.
      return new Promise(() => {});
    }

    if (!res.ok) {
      let message = `API error ${res.status}`;
      try {
        const body = await res.json();
        message = body.error || body.message || message;
      } catch (_) {}
      throw new Error(message);
    }

    // 204 No Content — nothing to parse
    if (res.status === 204) return null;

    return res.json();
  } catch (err) {
    console.warn(`[API] Connection to ${path} failed. Switching to Offline Mock Mode:`, err.message);
    localStorage.setItem('bts_offline_mode', 'true');
    window.dispatchEvent(new CustomEvent('bts_offline_mode_change', { detail: true }));
    // Instantly fall back to mock handler
    return handleMockRequest(path, options);
  }
}

/** GET /path */
export function apiGet(path) {
  return apiFetch(path, { method: 'GET' });
}

/** POST /path with JSON body */
export function apiPost(path, data) {
  return apiFetch(path, {
    method: 'POST',
    body: JSON.stringify(data ?? {}),
  });
}

/** PUT /path with JSON body */
export function apiPut(path, data) {
  return apiFetch(path, {
    method: 'PUT',
    body: JSON.stringify(data ?? {}),
  });
}

/** PATCH /path with JSON body */
export function apiPatch(path, data) {
  return apiFetch(path, {
    method: 'PATCH',
    body: JSON.stringify(data ?? {}),
  });
}

/** DELETE /path */
export function apiDelete(path) {
  return apiFetch(path, { method: 'DELETE' });
}

/**
 * Clear all client-side auth state on logout.
 * Removes the token from localStorage and reloads.
 */
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  window.location.reload();
}
