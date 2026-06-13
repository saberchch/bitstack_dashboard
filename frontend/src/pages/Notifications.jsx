import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications
} from '../utils/notificationsStorage';

const CATEGORY_TABS = [
  { key: 'all', label: 'All Alerts', colorClass: 'border-yellow-400 text-brand-dark' },
  { key: 'mentorship', label: 'Mentorship', colorClass: 'border-blue-500 text-blue-600' },
  { key: 'dlancer', label: 'D-Lancer Bids', colorClass: 'border-purple-500 text-purple-600' },
  { key: 'disputes', label: 'Disputes & Help', colorClass: 'border-rose-500 text-rose-600' },
  { key: 'platform', label: 'System Updates', colorClass: 'border-emerald-500 text-emerald-600' },
];

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Reload notifications from localStorage when storage updates
  const loadNotifications = () => {
    setNotifications(getNotifications());
  };

  useEffect(() => {
    loadNotifications();
    window.addEventListener('bts_notifications_change', loadNotifications);
    return () => window.removeEventListener('bts_notifications_change', loadNotifications);
  }, []);

  // Handlers
  const handleMarkRead = (e, id) => {
    e.stopPropagation(); // Avoid triggering route redirect on card click
    markAsRead(id);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation(); // Avoid triggering route redirect on card click
    deleteNotification(id);
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all notification alerts?')) {
      clearAllNotifications();
    }
  };

  const handleCardClick = (n) => {
    // Automatically mark read when clicking to view details
    if (!n.read) {
      markAsRead(n.id);
    }
    navigate(n.route);
  };

  // Filter lists based on tab category and search term
  const filteredNotifications = notifications.filter((n) => {
    const matchesTab = activeTab === 'all' || n.category === activeTab;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Get style configs for category pills
  const getCategoryStyles = (category) => {
    switch (category) {
      case 'mentorship':
        return {
          bg: 'bg-blue-50/70 border-blue-100/50',
          text: 'text-blue-700',
          icon: '🎓',
          label: 'Mentorship',
        };
      case 'dlancer':
        return {
          bg: 'bg-purple-50/70 border-purple-100/50',
          text: 'text-purple-700',
          icon: '💼',
          label: 'Freelance',
        };
      case 'disputes':
        return {
          bg: 'bg-rose-50/70 border-rose-100/50',
          text: 'text-rose-700',
          icon: '⚖️',
          label: 'Arbitration',
        };
      case 'platform':
        return {
          bg: 'bg-emerald-50/70 border-emerald-100/50',
          text: 'text-emerald-700',
          icon: '🪙',
          label: 'System',
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-100',
          text: 'text-gray-600',
          icon: '🔔',
          label: 'Alert',
        };
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex-1 flex flex-col min-h-screen pb-12">
      {/* Search Input synced directly into search state */}
      <Topbar 
        searchPlaceholder="Search notifications..." 
        onSearchChange={(query) => setSearchQuery(query)} 
      />

      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6 animate-fadeIn flex-1">
        
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50 pb-5">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-brand-dark leading-tight flex items-center gap-2">
              Notifications Center
              {unreadCount > 0 && (
                <span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full border border-yellow-200">
                  {unreadCount} New
                </span>
              )}
            </h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Manage your private session requests, freelance bids, and resolution logs
            </p>
          </div>

          {notifications.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0}
                className="px-4 py-2 bg-gray-50 border border-gray-100 hover:border-yellow-200 text-gray-600 hover:text-[#d4a017] rounded-xl text-xs font-extrabold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark all as read
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-rose-50 border border-rose-100 hover:bg-rose-100 hover:border-rose-200 text-rose-600 rounded-xl text-xs font-extrabold transition-all"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Tab & Search Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          {/* Tab Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {CATEGORY_TABS.map((tab) => {
              const count = tab.key === 'all' 
                ? notifications.length 
                : notifications.filter(n => n.category === tab.key).length;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'bg-brand-dark text-white border-brand-dark shadow-sm'
                      : 'bg-gray-50/50 border-gray-100 text-gray-500 hover:bg-gray-100/50 hover:text-brand-dark'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.key ? 'bg-white/25 text-white' : 'bg-gray-200/60 text-gray-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notification Feed */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-20 bg-gray-50/30 border border-dashed border-gray-200 rounded-2xl">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
            <p className="text-sm font-extrabold text-brand-dark">No Notifications Found</p>
            <p className="text-xs text-gray-400 mt-1 font-semibold max-w-sm mx-auto leading-relaxed">
              {searchQuery ? `No alerts match your search query: "${searchQuery}"` : 'All caught up! You will receive updates about your active contracts and sessions here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((n) => {
              const styles = getCategoryStyles(n.category);
              return (
                <div
                  key={n.id}
                  onClick={() => handleCardClick(n)}
                  className={`flex items-start gap-4 p-4 border rounded-2xl cursor-pointer hover:shadow-md hover:scale-[1.005] active:scale-[1] transition-all duration-200 ${
                    n.read 
                      ? 'bg-white border-gray-100/70 opacity-75' 
                      : 'bg-yellow-50/10 border-yellow-500/20 shadow-sm'
                  }`}
                >
                  {/* Category Pill Icon */}
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 text-lg shadow-sm ${styles.bg}`}>
                    {styles.icon}
                  </div>

                  {/* Body Contents */}
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-sm font-extrabold truncate ${n.read ? 'text-brand-dark' : 'text-brand-dark font-black'}`}>
                        {n.title}
                      </h3>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shrink-0" />
                      )}
                      <span className={`text-[9px] font-extrabold uppercase border px-2 py-0.5 rounded-full shrink-0 ${styles.bg} ${styles.text}`}>
                        {styles.label}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                      {n.description}
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-[10px] text-gray-400 font-bold uppercase">
                      <span>{n.ts}</span>
                      <span>•</span>
                      <span className="text-[#d4a017] hover:underline flex items-center gap-0.5">
                        View Details
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center gap-1.5 shrink-0 self-center">
                    {!n.read && (
                      <button
                        onClick={(e) => handleMarkRead(e, n.id)}
                        title="Mark as Read"
                        className="p-1.5 hover:bg-emerald-50 border border-gray-100 hover:border-emerald-200 text-gray-400 hover:text-emerald-600 rounded-xl transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDelete(e, n.id)}
                      title="Delete Notification"
                      className="p-1.5 hover:bg-rose-50 border border-gray-100 hover:border-rose-200 text-gray-400 hover:text-rose-600 rounded-xl transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
