/**
 * useServerHydrate.js
 * -------------------
 * On first mount, fetches fresh data from the backend for each module.
 * Shows a loading splash until the critical profile fetch completes.
 *
 * Each storage utility fetches its own endpoint and updates its own cache.
 * This replaces the old monolithic /api/sync approach.
 */
import { useState, useEffect } from 'react';
import { fetchProfileFromServer } from '../utils/profileStorage';
import { fetchNotificationsFromServer } from '../utils/notificationsStorage';
import { fetchConversationsFromServer } from '../utils/messagesStorage';
import { fetchSessionsFromServer } from '../utils/sessionsStorage';
import { fetchEnrollmentsFromServer, fetchBookingsFromServer } from '../utils/enrollmentStorage';
import { fetchCalendarFromServer } from '../utils/calendarStorage';

export default function useServerHydrate() {
  const [hydrating, setHydrating] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // 1. Health check to detect if Flask backend is available
      let offline = false;
      try {
        const check = await fetch('/api/health');
        if (!check.ok) offline = true;
      } catch (_) {
        offline = true;
      }

      if (offline) {
        localStorage.setItem('bts_offline_mode', 'true');
        window.dispatchEvent(new CustomEvent('bts_offline_mode_change', { detail: true }));
      } else {
        localStorage.setItem('bts_offline_mode', 'false');
        window.dispatchEvent(new CustomEvent('bts_offline_mode_change', { detail: false }));
      }

      const token = localStorage.getItem('bts_auth_token');
      if (!token) {
        // Not logged in — no fetch needed, splash goes away immediately
        if (!cancelled) setHydrating(false);
        return;
      }

      try {
        // Critical (must complete before rendering the app)
        await fetchProfileFromServer();

        // Non-critical — run in parallel after profile loads
        if (!cancelled) {
          Promise.all([
            fetchNotificationsFromServer(),
            fetchConversationsFromServer(),
            fetchSessionsFromServer(),
            fetchEnrollmentsFromServer(),
            fetchBookingsFromServer(),
            fetchCalendarFromServer(),
          ]).catch(() => { /* offline — cached data remains in use */ });
        }
      } catch (_) {
        // If profile fetch fails, still unmount the splash (show stale data)
      }

      if (!cancelled) setHydrating(false);
    })();

    return () => { cancelled = true; };
  }, []);

  return { hydrating };
}
