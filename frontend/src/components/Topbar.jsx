import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getNotifications } from '../utils/notificationsStorage';
import { getProfile } from '../utils/profileStorage';

export default function Topbar({ searchPlaceholder = "Search anything...", onSearchChange }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [profile, setProfile] = useState(getProfile());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const updateCount = () => {
      const list = getNotifications();
      setUnreadCount(list.filter(n => !n.read).length);
    };
    updateCount();
    window.addEventListener('bts_notifications_change', updateCount);

    const handleProfileChange = (e) => {
      setProfile(e.detail || getProfile());
    };
    window.addEventListener('bts_profile_change', handleProfileChange);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('bts_notifications_change', updateCount);
      window.removeEventListener('bts_profile_change', handleProfileChange);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between mb-8 animate-fadeIn" data-purpose="top-header">
      {/* Search Bar */}
      <div className="relative w-1/3">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
        </span>
        <input
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400"
          placeholder={searchPlaceholder}
          type="text"
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>
      {/* User Stats & Profile */}
      <div className="flex items-center gap-6">
        {/* Balance Widget */}
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-50">
          <div className="bg-yellow-50 p-1.5 rounded-lg">
            <svg fill="none" height="20" stroke="#d4a017" strokeWidth="2" viewBox="0 0 24 24" width="20"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase leading-none">BTS Balance</p>
            <p className="text-sm font-extrabold text-brand-dark">2,450.75 <span className="text-[10px] text-gray-400">BTS</span></p>
          </div>
        </div>
        {/* Notification Bell */}
        <Link to="/notifications" className="relative p-2 bg-white rounded-xl shadow-sm border border-gray-50 text-gray-400 cursor-pointer hover:text-[#d4a017] transition-colors block">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-yellow-400 text-white text-[9px] flex items-center justify-center rounded-full border-2 border-white">{unreadCount}</span>
          )}
        </Link>
        {/* User Profile Dropdown Trigger */}
        <div ref={dropdownRef} className="relative">
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 cursor-pointer group hover:opacity-95 transition-opacity select-none"
          >
            <img alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-yellow-100 group-hover:border-yellow-400 transition-colors object-cover" src={profile.avatar} />
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold leading-none mb-0.5 text-brand-dark group-hover:text-yellow-600 transition-colors">{profile.name}</p>
                {profile.verificationStatus === 'Verified Scholar' && (
                  <span className="text-[10px]" title="Verified Scholar"></span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 font-semibold">{profile.profileType || 'Scholar'} · <span className="text-yellow-600 font-bold">{profile.role}</span></p>
            </div>
            <svg className={`w-4 h-4 text-gray-400 group-hover:text-yellow-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          </div>

          {/* Polished Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-3 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl p-1.5 z-50 space-y-0.5 animate-fadeIn">
              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-extrabold text-gray-600 hover:text-yellow-600 hover:bg-yellow-50/40 transition-all"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                My Profile
              </Link>

              <Link
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-extrabold text-gray-600 hover:text-yellow-600 hover:bg-yellow-50/40 transition-all"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                Settings
              </Link>

              <div className="border-t border-gray-100 my-1" />

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  alert("Logging out from Bitstacks platform...");
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-extrabold text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all text-left cursor-pointer"
              >
                <svg className="w-4 h-4 text-rose-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
