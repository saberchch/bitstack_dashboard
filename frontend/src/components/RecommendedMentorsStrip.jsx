/**
 * RecommendedMentorsStrip.jsx
 * ---------------------------
 * Recommends mentors by matching against the current user's profile.
 * Scoring algorithm:
 *   +3 per skill that matches a user topic interest (case-insensitive, partial)
 *   +2 if mentor's skill level matches user's skill level tier
 *   +1 per module that matches a topic interest
 *   +0.5 × mentor.rating  (quality tiebreaker)
 *   Multiplied by verification bonus (×1.1 if verified)
 *
 * Falls back to top-3 by rating if the user has no profile data yet.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mentors } from '../data/mentors';
import { getProfile } from '../utils/profileStorage';

// ── Skill-level tier mapping ───────────────────────────────────────────────────
// Maps user skill level to mentor "level" field so we surface the right depth
const TIER_MAP = {
  Beginner:     ['Beginner', 'Intermediate'],
  Intermediate: ['Intermediate', 'Expert'],
  Advanced:     ['Expert'],
  Expert:       ['Expert'],
};

// ── Scoring ────────────────────────────────────────────────────────────────────
function scoreMentor(mentor, topicInterests, skillLevel) {
  let score = 0;

  const topics = (topicInterests || []).map(t => t.toLowerCase());

  // Topic-skill overlap
  (mentor.skills || []).forEach(skill => {
    const sl = skill.toLowerCase();
    if (topics.some(t => sl.includes(t) || t.includes(sl))) score += 3;
  });

  // Module overlap
  (mentor.modules || []).forEach(mod => {
    const ml = mod.toLowerCase();
    if (topics.some(t => ml.includes(t) || t.includes(ml))) score += 1;
  });

  // Role keyword overlap
  if (mentor.role) {
    const role = mentor.role.toLowerCase();
    if (topics.some(t => role.includes(t))) score += 1;
  }

  // Skill level match
  const preferredLevels = TIER_MAP[skillLevel] || [];
  if (preferredLevels.includes(mentor.level)) score += 2;

  // Quality tiebreaker
  score += (mentor.rating || 0) * 0.5;

  // Verified bonus
  if (mentor.verified) score *= 1.1;

  return score;
}

function getRecommendedMentors(count = 3) {
  const profile = getProfile();
  const { topicInterests, skillLevel } = profile;
  const hasPreferences = topicInterests?.length > 0;

  const scored = mentors
    .filter(m => m.verified !== false)
    .map(m => ({ mentor: m, score: scoreMentor(m, topicInterests, skillLevel) }));

  if (!hasPreferences) {
    // No interests yet — show top-rated (original behaviour)
    return scored
      .sort((a, b) => b.mentor.rating - a.mentor.rating)
      .slice(0, count)
      .map(x => x.mentor);
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(x => x.mentor);
}

// ── Components ─────────────────────────────────────────────────────────────────
const CARD_CLASS =
  'flex flex-col h-full min-h-[148px] bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm';

function MatchBadge({ score, hasPreferences }) {
  if (!hasPreferences || score < 4) return null;
  const pct = Math.min(100, Math.round((score / 15) * 100));
  return (
    <span
      className="text-[9px] font-extrabold bg-yellow-50 text-bts-gold border border-yellow-100 px-1.5 py-0.5 rounded-full leading-none"
      title={`${pct}% match`}
    >
      {pct}% match
    </span>
  );
}

function MentorRow({ mentor, score, hasPreferences }) {
  const specialty = mentor.skills?.[0] || mentor.role?.split('&')[0]?.trim() || 'Mentor';

  return (
    <Link
      to={`/mentor/${mentor.id}`}
      className="group flex items-center gap-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <img
        src={mentor.avatar}
        alt={mentor.name}
        className="w-8 h-8 rounded-full border border-gray-100 object-cover group-hover:border-bts-gold/30 transition-colors shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 flex-wrap">
          <p className="text-xs font-bold text-brand-dark truncate">{mentor.name}</p>
          <MatchBadge score={score} hasPreferences={hasPreferences} />
        </div>
        <p className="text-[10px] text-gray-400 truncate">{specialty}</p>
      </div>
      <div className="flex items-center gap-0.5 text-[10px] font-bold text-bts-gold shrink-0">
        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        {mentor.rating.toFixed(1)}
      </div>
    </Link>
  );
}

export default function RecommendedMentorsStrip() {
  const [recs, setRecs] = useState(() => {
    const profile = getProfile();
    const scored = mentors
      .filter(m => m.verified !== false)
      .map(m => ({
        mentor: m,
        score: scoreMentor(m, profile.topicInterests, profile.skillLevel),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    return scored;
  });
  const [hasPreferences, setHasPreferences] = useState(
    () => (getProfile().topicInterests || []).length > 0
  );

  // Re-compute whenever the profile changes (user updates interests in Settings)
  useEffect(() => {
    const refresh = () => {
      const profile = getProfile();
      const hp = (profile.topicInterests || []).length > 0;
      setHasPreferences(hp);
      const scored = mentors
        .filter(m => m.verified !== false)
        .map(m => ({
          mentor: m,
          score: scoreMentor(m, profile.topicInterests, profile.skillLevel),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
      setRecs(scored);
    };
    window.addEventListener('bts_profile_change', refresh);
    return () => window.removeEventListener('bts_profile_change', refresh);
  }, []);

  return (
    <div className={CARD_CLASS} data-purpose="recommended-mentors-strip">
      <div className="flex items-center justify-between mb-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-extrabold text-bts-gold uppercase tracking-wider">
            Recommended Mentors
          </span>
          {hasPreferences && (
            <span className="text-[9px] text-gray-400 font-medium leading-none">
              Based on your interests
            </span>
          )}
        </div>
        <Link
          to="/expert-mentors"
          className="text-[10px] font-bold text-brand-dark border border-gray-200 px-3 py-1 rounded-lg hover:bg-bts-gold/10 hover:border-bts-gold/30 transition-colors whitespace-nowrap"
        >
          View all
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center divide-y divide-gray-50">
        {recs.map(({ mentor, score }) => (
          <MentorRow
            key={mentor.id}
            mentor={mentor}
            score={score}
            hasPreferences={hasPreferences}
          />
        ))}
      </div>
    </div>
  );
}
