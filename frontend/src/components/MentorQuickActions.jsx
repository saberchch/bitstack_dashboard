import { Link } from 'react-router-dom';

const ACTIONS = [
  {
    id: 'create-session',
    label: 'Create Session',
    desc: 'Publish a new premium workshop',
    to: '/d-platform',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    ),
    color: 'bg-yellow-50 text-bts-gold border-yellow-100 hover:bg-yellow-100 hover:border-bts-gold/30',
  },
  {
    id: 'manage-calendar',
    label: 'Set Availability',
    desc: 'Manage your schedule & slots',
    to: '/mentor/availability',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    ),
    color: 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 hover:border-blue-300',
  },
  {
    id: 'student-messages',
    label: 'Student Messages',
    desc: 'Respond to student inquiries',
    to: '/messages',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    ),
    color: 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100 hover:border-indigo-300',
  },
  {
    id: 'update-profile',
    label: 'Update Profile',
    desc: 'Edit your mentor bio & skills',
    to: '/profile',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    ),
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 hover:border-emerald-300',
  },
];

export default function MentorQuickActions() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
      <div className="mb-4">
        <span className="text-[10px] font-extrabold text-bts-gold uppercase tracking-widest block mb-0.5">
          Tools
        </span>
        <h3 className="font-extrabold text-lg text-brand-dark">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map((action) => (
          <Link
            key={action.id}
            to={action.to}
            className={`flex flex-col gap-2 p-4 rounded-xl border transition-all group ${action.color}`}
          >
            <div className="shrink-0">{action.icon}</div>
            <div>
              <p className="text-xs font-extrabold leading-tight">{action.label}</p>
              <p className="text-[9px] opacity-70 mt-0.5 leading-tight">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
