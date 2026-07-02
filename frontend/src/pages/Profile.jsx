import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import { getProfile, updateProfile, fetchProfileFromServer } from '../utils/profileStorage';

/* ─── helpers ─────────────────────────────────────────────────────────────── */
const EDUCATION_LEVELS = [
  "High School",
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD / Doctorate",
  "Self-taught / Bootcamp",
  "Other",
];

const DEGREE_OPTIONS = [
  "Bachelor's Degree",
  "Master's Degree",
  "PhD / Doctorate",
  "Professional Certification",
  "Associate's Degree",
  "Self-taught / Industry",
];

const YEARS_OPTIONS = ["1–2 years", "3–5 years", "6–10 years", "10+ years"];

const AVAILABILITY_OPTIONS = [
  { id: 'Available',    dot: 'bg-emerald-500 animate-pulse' },
  { id: 'Busy',         dot: 'bg-amber-400' },
  { id: 'On Vacation',  dot: 'bg-rose-500' },
];

function getCompletion(p) {
  const base = [p.name, p.email, p.phone, p.avatar].filter(Boolean).length * 10;
  const role  = p.profileType === 'Mentor'
    ? [p.bio, p.professionalTitle, p.expertise, p.institution, p.highestDegree].filter(Boolean).length * 10
    : [p.bio, p.educationLevel].filter(Boolean).length * 15;
  return Math.min(base + role, 100);
}

/* ─── reusable sub-components ─────────────────────────────────────────────── */
function SectionCard({ title, sub, onEdit, editing, onSave, onCancel, children }) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-gray-50 pb-3">
        <div>
          <h4 className="text-xs font-black text-brand-dark uppercase tracking-wider">{title}</h4>
          {sub && <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">{sub}</p>}
        </div>
        {onEdit && !editing && (
          <button onClick={onEdit} className="text-[11px] font-bold text-bts-gold hover:underline cursor-pointer">Edit</button>
        )}
        {editing && (
          <div className="flex items-center gap-2">
            <button onClick={onSave}   className="text-[11px] font-bold text-emerald-600 hover:underline cursor-pointer">Save</button>
            <button onClick={onCancel} className="text-[11px] font-bold text-gray-400 hover:underline cursor-pointer">Cancel</button>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-400">{label}</label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-10 bg-gray-50 border border-gray-150 text-brand-dark placeholder-gray-350 rounded-xl px-3 text-xs focus:outline-none focus:border-bts-gold focus:bg-white transition-all"
    />
  );
}

function SelectInput({ value, onChange, options }) {
  return (
    <select
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      className="w-full h-10 bg-gray-50 border border-gray-150 text-brand-dark rounded-xl px-3 text-xs focus:outline-none focus:border-bts-gold appearance-none"
    >
      <option value="" disabled>Select…</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

/* ─── main component ──────────────────────────────────────────────────────── */
export default function Profile() {
  const [profile, setProfile]   = useState(() => getProfile());
  const [draft,   setDraft]     = useState({});
  const [editing, setEditing]   = useState(null);
  const [copiedLink, setCopied] = useState(false);

  const isMentor  = profile.profileType === 'Mentor';
  const isStudent = !isMentor;

  useEffect(() => {
    fetchProfileFromServer().then(p => setProfile(p));
    const handler = () => setProfile(getProfile());
    window.addEventListener('bts_profile_change', handler);
    return () => window.removeEventListener('bts_profile_change', handler);
  }, []);

  const startEdit  = (section) => { setDraft({ ...profile }); setEditing(section); };
  const cancelEdit = ()        => { setDraft({}); setEditing(null); };
  const saveEdit   = async ()  => {
    const updated = await updateProfile(draft);
    setProfile(updated);
    setEditing(null);
    setDraft({});
  };
  const set = (key) => (val) => setDraft(d => ({ ...d, [key]: val }));

  const copyLink = () => {
    navigator.clipboard.writeText(`https://bitstacks.io/u/${profile.userId || 'user'}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const completion = getCompletion(profile);

  return (
    <div className="flex-1 flex flex-col min-h-screen pb-16 space-y-6">
      <Topbar searchPlaceholder="Search profile…" />

      {/* ── HEADER CARD ── */}
      <section className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="h-28 bg-gradient-to-br from-amber-50 via-yellow-50/60 to-gray-50 border-b border-gray-100 relative">
          <div className="absolute top-0 right-0 w-64 h-full bg-bts-gold/10 rounded-full blur-[60px] pointer-events-none" />
        </div>

        <div className="px-6 pb-5 pt-0 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-10 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="w-20 h-20 rounded-3xl border-4 border-white overflow-hidden shadow-md bg-gray-100 shrink-0">
              <img
                src={profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'U')}&size=150&background=f5f5f5&color=1a1a1a`}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1 pt-2 sm:pt-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-extrabold text-brand-dark tracking-tight">{profile.name || 'Your Name'}</h2>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wide border ${
                  profile.verificationStatus === 'Verified Scholar'
                    ? 'bg-bts-gold/10 text-brand-dark border-bts-gold/25'
                    : 'bg-gray-100 text-gray-500 border-gray-200'
                }`}>
                  {profile.verificationStatus || 'New User'}
                </span>
              </div>

              <p className="text-xs font-bold text-gray-500">
                {isMentor ? (profile.professionalTitle || 'Mentor') : (profile.educationLevel || 'Student')}
              </p>

              <div className="flex items-center gap-1 pt-0.5 flex-wrap">
                {AVAILABILITY_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => updateProfile({ availability: opt.id }).then(p => setProfile(p))}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      profile.availability === opt.id
                        ? 'bg-gray-100 border-gray-200 text-brand-dark'
                        : 'border-transparent text-gray-400 hover:text-gray-500'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full shrink-0 ${opt.dot}`} />
                    {opt.id}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={copyLink}
              className="px-4 py-2 bg-brand-dark text-white rounded-xl font-extrabold text-xs hover:bg-bts-gold hover:text-brand-dark transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              {copiedLink ? '✓ Copied' : '🔗 Share'}
            </button>
          </div>
        </div>

        <div className="border-t border-gray-100 px-6 py-3 bg-gray-50/40 flex items-center gap-4">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap">Profile Strength</span>
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-bts-gold to-brand-dark rounded-full transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
          <span className="text-xs font-black text-brand-dark w-8 text-right">{completion}%</span>
        </div>
      </section>

      {/* ── 2-COLUMN BODY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* LEFT COLUMN */}
        <div className="space-y-5">

          {/* Contact Info */}
          <SectionCard
            title="Contact Information"
            sub="Registered account details"
            onEdit={() => startEdit('contact')}
            editing={editing === 'contact'}
            onSave={saveEdit}
            onCancel={cancelEdit}
          >
            {editing === 'contact' ? (
              <div className="space-y-3">
                <Field label="Full Name">
                  <TextInput value={draft.name} onChange={set('name')} placeholder="John Doe" />
                </Field>
                <Field label="Email Address">
                  <TextInput value={draft.email} onChange={set('email')} placeholder="name@example.com" type="email" />
                </Field>
                <Field label="Phone Number">
                  <TextInput value={draft.phone} onChange={set('phone')} placeholder="+1 234 567 890" type="tel" />
                </Field>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-7 h-7 rounded-xl bg-brand-dark flex items-center justify-center text-white text-[9px] font-black shrink-0">@</div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Email</p>
                    <p className="text-xs font-extrabold text-brand-dark truncate">{profile.email || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-7 h-7 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-[9px] shrink-0">📞</div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Phone</p>
                    <p className="text-xs font-extrabold text-brand-dark">{profile.phone || '—'}</p>
                  </div>
                </div>
              </div>
            )}
          </SectionCard>

          {/* Account Status */}
          <SectionCard title="Account Status" sub="Role & verification level">
            <div className="space-y-0">
              {[
                { label: 'Role',         value: profile.profileType || 'Member' },
                { label: 'Verification', value: profile.verificationStatus || 'New User', badge: true },
                { label: 'User ID',      value: profile.userId || '—', mono: true },
              ].map(({ label, value, badge, mono }, i, arr) => (
                <div key={label} className={`flex items-center justify-between py-2.5 ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                  {badge ? (
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase border ${
                      value === 'Verified Scholar'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}>{value}</span>
                  ) : (
                    <p className={`text-xs font-extrabold text-brand-dark ${mono ? 'font-mono text-[10px]' : ''}`}>{value}</p>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Student: Education */}
          {isStudent && (
            <SectionCard
              title="Education"
              sub="Provided at registration"
              onEdit={() => startEdit('academic')}
              editing={editing === 'academic'}
              onSave={saveEdit}
              onCancel={cancelEdit}
            >
              {editing === 'academic' ? (
                <div className="space-y-3">
                  <Field label="Level of Education">
                    <SelectInput value={draft.educationLevel} onChange={set('educationLevel')} options={EDUCATION_LEVELS} />
                  </Field>
                  <Field label="Age">
                    <TextInput value={draft.age} onChange={set('age')} placeholder="22" type="number" />
                  </Field>
                </div>
              ) : (
                <div>
                  {[
                    { label: 'Education Level', value: profile.educationLevel },
                    { label: 'Age',             value: profile.age },
                  ].map(({ label, value }, i, arr) => (
                    <div key={label} className={`flex items-center justify-between py-2.5 ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                      <p className="text-xs font-extrabold text-brand-dark">{value || '—'}</p>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          )}

          {/* Mentor: Quick Stats */}
          {isMentor && (
            <SectionCard title="Mentor Stats" sub="Application summary">
              {[
                { label: 'Experience',     value: profile.yearsExperience },
                { label: 'Highest Degree', value: profile.highestDegree },
                { label: 'Institution',    value: profile.institution },
              ].map(({ label, value }, i, arr) => (
                <div key={label} className={`flex items-center justify-between py-2.5 ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                  <p className="text-xs font-extrabold text-brand-dark truncate max-w-[140px] text-right">{value || '—'}</p>
                </div>
              ))}
            </SectionCard>
          )}

        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-5">

          {/* Bio */}
          <SectionCard
            title={isMentor ? 'Bio & Teaching Philosophy' : 'About Me'}
            sub="Written during registration"
            onEdit={() => startEdit('bio')}
            editing={editing === 'bio'}
            onSave={saveEdit}
            onCancel={cancelEdit}
          >
            {editing === 'bio' ? (
              <textarea
                value={draft.bio ?? ''}
                onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))}
                rows={5}
                placeholder={isMentor
                  ? 'Tell students about your background and how you like to teach…'
                  : 'Write a short introduction about yourself…'}
                className="w-full p-3 bg-gray-50 border border-gray-150 rounded-xl text-xs focus:outline-none focus:border-bts-gold resize-none"
              />
            ) : (
              <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line min-h-[40px]">
                {profile.bio || <em className="text-gray-350 not-italic">No bio written yet — click Edit to add one.</em>}
              </p>
            )}
          </SectionCard>

          {/* Mentor: Professional Info */}
          {isMentor && (
            <SectionCard
              title="Professional Information"
              sub="Expertise provided during application"
              onEdit={() => startEdit('professional')}
              editing={editing === 'professional'}
              onSave={saveEdit}
              onCancel={cancelEdit}
            >
              {editing === 'professional' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Professional Title">
                    <TextInput value={draft.professionalTitle} onChange={set('professionalTitle')} placeholder="e.g. Senior Blockchain Engineer" />
                  </Field>
                  <Field label="Area of Expertise">
                    <TextInput value={draft.expertise} onChange={set('expertise')} placeholder="e.g. DeFi, Smart Contracts, Web3" />
                  </Field>
                  <Field label="Institution / Company">
                    <TextInput value={draft.institution} onChange={set('institution')} placeholder="e.g. MIT, Google, Coinbase" />
                  </Field>
                  <Field label="Years of Experience">
                    <SelectInput value={draft.yearsExperience} onChange={set('yearsExperience')} options={YEARS_OPTIONS} />
                  </Field>
                  <Field label="Highest Degree">
                    <SelectInput value={draft.highestDegree} onChange={set('highestDegree')} options={DEGREE_OPTIONS} />
                  </Field>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Professional Title',  value: profile.professionalTitle },
                    { label: 'Area of Expertise',   value: profile.expertise },
                    { label: 'Institution',         value: profile.institution },
                    { label: 'Years of Experience', value: profile.yearsExperience },
                    { label: 'Highest Degree',      value: profile.highestDegree },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 border border-gray-100 rounded-2xl p-3">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                      <p className="text-xs font-extrabold text-brand-dark">{value || '—'}</p>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          )}

          {/* Mentor: Documents */}
          {isMentor && (
            <SectionCard
              title="Credentials & Documents"
              sub="Uploaded during mentor application"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* CV */}
                <div className="border border-gray-100 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center text-[9px] font-black shrink-0">PDF</div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">CV / Resume</p>
                      <p className="text-xs font-extrabold text-brand-dark truncate">{profile.cvFile?.name || 'Not uploaded'}</p>
                      {profile.cvFile?.size && <p className="text-[9px] text-gray-400">{profile.cvFile.size}</p>}
                    </div>
                  </div>
                  <label className="relative block cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={e => {
                        const f = e.target.files?.[0];
                        if (f) updateProfile({ cvFile: { name: f.name, size: `${(f.size / 1048576).toFixed(1)} MB` } }).then(p => setProfile(p));
                      }}
                    />
                    <span className="block text-center py-2 bg-white border border-gray-200 hover:border-bts-gold rounded-xl text-[10px] font-bold text-gray-600 transition-all">
                      {profile.cvFile?.name ? 'Replace CV' : 'Upload CV'}
                    </span>
                  </label>
                </div>

                {/* Degree Document */}
                <div className="border border-gray-100 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center text-base shrink-0">🎓</div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Degree Certificate</p>
                      <p className="text-xs font-extrabold text-brand-dark truncate">{profile.degreeDoc?.name || 'Not uploaded'}</p>
                      {profile.degreeDoc?.size && <p className="text-[9px] text-gray-400">{profile.degreeDoc.size}</p>}
                    </div>
                  </div>
                  <label className="relative block cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={e => {
                        const f = e.target.files?.[0];
                        if (f) updateProfile({ degreeDoc: { name: f.name, size: `${(f.size / 1048576).toFixed(1)} MB` } }).then(p => setProfile(p));
                      }}
                    />
                    <span className="block text-center py-2 bg-white border border-gray-200 hover:border-bts-gold rounded-xl text-[10px] font-bold text-gray-600 transition-all">
                      {profile.degreeDoc?.name ? 'Replace Document' : 'Upload Document'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Additional Certifications */}
              <div className="border border-gray-100 rounded-2xl p-4 space-y-3">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Additional Certifications</p>
                {(profile.certificationDocs || []).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.certificationDocs.map((c, i) => (
                      <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-brand-dark">
                        🏅 {c.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No additional certifications uploaded.</p>
                )}
                <label className="relative block cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={e => {
                      const files = Array.from(e.target.files || []).map(f => ({
                        name: f.name, size: `${(f.size / 1048576).toFixed(1)} MB`
                      }));
                      if (files.length) {
                        const existing = profile.certificationDocs || [];
                        updateProfile({ certificationDocs: [...existing, ...files] }).then(p => setProfile(p));
                      }
                    }}
                  />
                  <span className="block text-center py-2 bg-white border border-dashed border-gray-200 hover:border-bts-gold rounded-xl text-[10px] font-bold text-gray-600 transition-all">
                    + Add Certifications
                  </span>
                </label>
              </div>
            </SectionCard>
          )}

          {/* Student: Topic Interests */}
          {isStudent && (
            <SectionCard
              title="Learning Interests"
              sub="Topics you're exploring on Bitstack"
              onEdit={() => startEdit('interests')}
              editing={editing === 'interests'}
              onSave={saveEdit}
              onCancel={cancelEdit}
            >
              {editing === 'interests' ? (
                <div className="flex flex-wrap">
                  {['Smart Contracts', 'DeFi (Fintech)', 'UI/UX Design', 'AI Ethics', 'Big Data / Cybersecurity', 'Blockchain Fundamentals', 'Web3 Development', 'NFT & Digital Assets'].map(topic => {
                    const active = (draft.topicInterests || []).includes(topic);
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => {
                          const curr = draft.topicInterests || [];
                          setDraft(d => ({
                            ...d,
                            topicInterests: active ? curr.filter(t => t !== topic) : [...curr, topic]
                          }));
                        }}
                        className={`mr-2 mb-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          active
                            ? 'bg-bts-gold/10 border-bts-gold/30 text-brand-dark'
                            : 'bg-gray-50 border-gray-150 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        {topic}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(profile.topicInterests || []).length === 0
                    ? <p className="text-xs text-gray-400 italic">No interests selected yet — click Edit to add some.</p>
                    : (profile.topicInterests || []).map(t => (
                        <span key={t} className="px-3 py-1.5 bg-bts-gold/5 border border-bts-gold/15 rounded-xl text-xs font-bold text-brand-dark">
                          {t}
                        </span>
                      ))
                  }
                </div>
              )}
            </SectionCard>
          )}

        </div>
      </div>
    </div>
  );
}
