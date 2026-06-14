import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  getCalendarSessions,
  initCalendarStorage,
  sessionToDate,
} from '../utils/calendarStorage';
import { getMyEnrollmentsWithDetails } from '../utils/enrollmentStorage';

const CATEGORIES = [
  { key: 'sessions', label: 'Sessions', color: 'bg-blue-500', light: 'bg-blue-100' },
  { key: 'learning', label: 'Learning', color: 'bg-indigo-500', light: 'bg-indigo-100' },
  { key: 'missions', label: 'Missions', color: 'bg-emerald-500', light: 'bg-emerald-100' },
  { key: 'library', label: 'Library', color: 'bg-amber-500', light: 'bg-amber-100' },
];

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function buildWeeklyActivity() {
  initCalendarStorage();
  const sessions = getCalendarSessions();
  const enrollments = getMyEnrollmentsWithDetails();
  const weekStart = getWeekStart();

  const days = DAY_LABELS.map((label, index) => {
    const dayDate = new Date(weekStart);
    dayDate.setDate(weekStart.getDate() + index);
    const dateKey = dayDate.toISOString().slice(0, 10);

    const daySessions = sessions.filter(s => s.date === dateKey);
    const sessionCount = daySessions.filter(s =>
      ['workshop', 'private', 'mentorship'].includes(s.type)
    ).length;
    const missionCount = daySessions.filter(s => s.type === 'deadline').length;
    const learningCount = daySessions.filter(s => s.type === 'exam').length
      + (index === 1 || index === 3 ? 1 : 0);
    const libraryCount = index === 0 || index === 4 ? 1 : 0;

    return {
      day: label,
      sessions: sessionCount || (index === 2 ? 1 : 0),
      learning: learningCount + (enrollments.length > 0 && index < 3 ? 1 : 0),
      missions: missionCount,
      library: libraryCount,
    };
  });

  return days;
}

function BarColumn({ data, maxTotal }) {
  const total = data.sessions + data.learning + data.missions + data.library;
  const heightPct = maxTotal > 0 ? (total / maxTotal) * 100 : 0;

  const segments = CATEGORIES.map(cat => ({
    ...cat,
    value: data[cat.key],
  })).filter(s => s.value > 0);

  return (
    <div className="flex flex-col items-center flex-1 min-w-0">
      <div className="w-full h-40 flex flex-col justify-end items-center">
        <div
          className="w-8 sm:w-10 rounded-t-lg overflow-hidden flex flex-col-reverse shadow-sm"
          style={{ height: `${Math.max(heightPct, total > 0 ? 12 : 4)}%` }}
        >
          {segments.map(seg => (
            <div
              key={seg.key}
              className={`${seg.color} w-full`}
              style={{ flex: seg.value }}
              title={`${seg.label}: ${seg.value}`}
            />
          ))}
        </div>
      </div>
      <span className="text-[10px] font-bold text-gray-400 mt-2">{data.day}</span>
      {total > 0 && (
        <span className="text-[9px] font-extrabold text-brand-dark">{total}</span>
      )}
    </div>
  );
}

export default function ActivityOverview() {
  const weeklyData = useMemo(() => buildWeeklyActivity(), []);
  const maxTotal = Math.max(
    ...weeklyData.map(d => d.sessions + d.learning + d.missions + d.library),
    1
  );

  const totals = useMemo(() => {
    const sessions = getCalendarSessions();
    const weekStart = getWeekStart();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const thisWeek = sessions.filter(s => {
      const d = sessionToDate(s);
      return d >= weekStart && d < weekEnd;
    });

    const activityTotal = weeklyData.reduce(
      (sum, d) => sum + d.sessions + d.learning + d.missions + d.library,
      0
    );

    return {
      activities: activityTotal,
      sessions: thisWeek.filter(s =>
        ['workshop', 'private', 'mentorship'].includes(s.type)
      ).length,
      learning: getMyEnrollmentsWithDetails().length,
      deadlines: thisWeek.filter(s => s.type === 'deadline').length,
    };
  }, [weeklyData]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-bts-gold font-bold text-[10px] uppercase tracking-widest mb-1 block">
            Your Progress
          </span>
          <h3 className="font-extrabold text-lg text-brand-dark">Weekly Engagement</h3>
          <p className="text-xs text-gray-400 mt-1">
            Sessions, courses, missions, and library activity — not BTS balance
          </p>
        </div>
        <Link
          to="/calendar"
          className="text-xs font-bold text-bts-gold hover:text-brand-dark transition-colors"
        >
          This Week
        </Link>
      </div>

      <div className="flex items-end gap-2 sm:gap-3 mt-6 mb-4 px-1">
        {weeklyData.map(day => (
          <BarColumn key={day.day} data={day} maxTotal={maxTotal} />
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mb-6 px-1">
        {CATEGORIES.map(cat => (
          <div key={cat.key} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-sm ${cat.color}`} />
            <span className="text-[10px] font-bold text-gray-500">{cat.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-50">
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Activities</p>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-extrabold">{totals.activities}</span>
            <span className="text-[9px] text-green-500 font-bold">this week</span>
          </div>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Sessions</p>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-extrabold">{totals.sessions}</span>
            <span className="text-[9px] text-blue-600 font-bold">scheduled</span>
          </div>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Enrollments</p>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-extrabold">{totals.learning}</span>
            <span className="text-[9px] text-indigo-600 font-bold">active</span>
          </div>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Deadlines</p>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-extrabold">{totals.deadlines}</span>
            <span className="text-[9px] text-red-600 font-bold">this week</span>
          </div>
        </div>
      </div>
    </div>
  );
}
