import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { getNotifications } from '../utils/notificationsStorage';

export default function Sidebar() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const list = getNotifications();
      setUnreadCount(list.filter(n => !n.read).length);
    };
    updateCount();
    window.addEventListener('bts_notifications_change', updateCount);
    return () => window.removeEventListener('bts_notifications_change', updateCount);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-custom text-sm font-semibold transition-colors ${isActive ? 'sidebar-active' : 'text-gray-500 hover:bg-gray-50'
    }`;

  return (
    <aside className="w-56 bg-white border-r border-gray-100 flex flex-col fixed h-full z-20" data-purpose="sidebar">
      {/* Logo Section */}
      <div className="p-6 mb-4">
        <div className="flex items-center gap-2">
          <svg fill="none" height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2L4 8L16 14L28 8L16 2Z" stroke="#d4a017" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            <path d="M4 16L16 22L28 16" stroke="#d4a017" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            <path d="M4 24L16 30L28 24" stroke="#d4a017" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          </svg>
          <div className="leading-tight">
            <h1 className="text-xl font-extrabold tracking-tighter">BITSTACKS</h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Blockchain Tech</p>
          </div>
        </div>
      </div>
      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-1" data-purpose="primary-navigation">
        <NavLink to="/" end className={navLinkClass}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          Dashboard
        </NavLink>
        <NavLink to="/d-platform" className={navLinkClass}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          d-Platform
        </NavLink>
        <NavLink to="/d-institute" className={navLinkClass}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          d-Institute
        </NavLink>
        <NavLink to="/d-lancer" className={navLinkClass}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          d-Lancer
        </NavLink>
        <NavLink to="/d-library" className={navLinkClass}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          d-Library
        </NavLink>
        <NavLink to="/bts-credit" className={navLinkClass}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          BTS Credit
        </NavLink>
        {/* Separator */}
        <div className="py-4">
          <div className="border-t border-gray-100"></div>
        </div>
        <NavLink to="/messages" className={({ isActive }) =>
          `flex items-center justify-between px-4 py-3 rounded-custom text-sm font-semibold transition-colors ${isActive ? 'sidebar-active' : 'text-gray-500 hover:bg-gray-50'}`
        }>
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            Messages
          </div>
          <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">5</span>
        </NavLink>
        <NavLink to="/notifications" className={({ isActive }) =>
          `flex items-center justify-between px-4 py-3 rounded-custom text-sm font-semibold transition-colors ${isActive ? 'sidebar-active' : 'text-gray-500 hover:bg-gray-50'
          }`
        }>
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            Notifications
          </div>
          {unreadCount > 0 && (
            <span className="bg-yellow-400 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{unreadCount}</span>
          )}
        </NavLink>
        <NavLink to="/calendar" className={navLinkClass}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          Calendar
        </NavLink>
        {/* Bottom Actions */}
        <div className="pt-8 space-y-1">
          <NavLink to="/profile" className={navLinkClass}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            Profile
          </NavLink>
          <a className="flex items-center gap-3 px-4 py-3 rounded-custom text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors" href="#">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            Logout
          </a>
        </div>
      </nav>
    </aside>
  );
}
