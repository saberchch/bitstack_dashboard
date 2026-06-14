import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  SESSION_TYPES,
  CALENDAR_SYNC_EVENT,
  getCalendarSessions,
  initCalendarStorage,
  getUpcomingSessions,
  getUrgentDeadlines,
  formatSessionDate,
  formatSessionTime,
  getRelativeLabel,
  isUrgentSession,
} from '../utils/calendarStorage';

const CARD_CLASS =
  'flex flex-col h-full min-h-[148px] bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm';

export default function UpcomingEvents() {
  const [sessions, setSessions] = useState(() => {
    initCalendarStorage();
    return getCalendarSessions();
  });

  useEffect(() => {
    const refresh = () => setSessions(getCalendarSessions());
    window.addEventListener(CALENDAR_SYNC_EVENT, refresh);
    return () => window.removeEventListener(CALENDAR_SYNC_EVENT, refresh);
  }, []);

  const urgentDeadlines = getUrgentDeadlines(sessions);
  const upcoming = getUpcomingSessions(sessions);
  const nextEvent = upcoming[0] ?? null;
  const moreCount = Math.max(upcoming.length - 1, 0);

  if (!nextEvent) {
    return (
      <section className={CARD_CLASS} data-purpose="upcoming-events-compact">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-extrabold text-bts-gold uppercase tracking-wider">
            Next up
          </span>
          <Link
            to="/calendar"
            className="text-[10px] font-bold text-brand-dark border border-gray-200 px-3 py-1 rounded-lg hover:bg-bts-gold/10 transition-colors"
          >
            Open Calendar
          </Link>
        </div>
        <div className="flex-1 flex items-center gap-3 text-gray-400">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          <p className="text-xs font-semibold">No upcoming events</p>
        </div>
      </section>
    );
  }

  const { month, day } = formatSessionDate(nextEvent);
  const typeConfig = SESSION_TYPES[nextEvent.type] || SESSION_TYPES.workshop;
  const relative = getRelativeLabel(nextEvent);
  const urgent = isUrgentSession(nextEvent);
  const isDeadline = nextEvent.type === 'deadline';

  return (
    <section
      className={`${CARD_CLASS} ${urgent && isDeadline ? 'border-red-100' : ''}`}
      data-purpose="upcoming-events-compact"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-extrabold text-bts-gold uppercase tracking-wider">
          Next up
        </span>
        <Link
          to="/calendar"
          className="text-[10px] font-bold text-brand-dark border border-gray-200 px-3 py-1 rounded-lg hover:bg-bts-gold/10 hover:border-bts-gold/30 transition-colors whitespace-nowrap"
        >
          {moreCount > 0 ? `View all (${upcoming.length})` : 'View calendar'}
        </Link>
      </div>

      {urgentDeadlines.length > 0 && (
        <p className="text-[10px] font-bold text-red-600 mb-2 truncate">
          Deadline: {urgentDeadlines[0].title}
        </p>
      )}

      <div className="flex-1 flex items-center gap-3 min-h-0">
        <div className={`rounded-lg px-2.5 py-1.5 text-center border shrink-0 ${
          isDeadline ? 'border-red-100 bg-red-50' : 'border-gray-100 bg-gray-50'
        }`}>
          <p className="text-[8px] font-bold text-gray-400 uppercase leading-none">{month}</p>
          <p className={`text-sm font-extrabold leading-tight ${isDeadline ? 'text-red-600' : 'text-brand-dark'}`}>
            {day}
          </p>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-brand-dark truncate">{nextEvent.title}</p>
          <p className="text-[10px] text-gray-400 truncate mt-0.5">
            {formatSessionTime(nextEvent.time)}
            {nextEvent.duration ? ` · ${nextEvent.duration}` : ''}
          </p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {relative && (
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                urgent ? 'bg-red-100 text-red-700' : 'bg-bts-gold/10 text-bts-gold'
              }`}>
                {relative}
              </span>
            )}
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${typeConfig.badge}`}>
              {typeConfig.label}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
