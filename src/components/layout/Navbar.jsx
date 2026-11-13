import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHousehold } from '../../context/HouseholdContext';
import { getTimeAgo } from '../../utils/formatters';
import Badge from '../common/Badge';
import beeLogo from '../../assets/bee-property-logo.jpg';

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead
  } = useHousehold();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={notifRef}
      className={`sticky top-0 relative px-3 sm:px-4 lg:pl-4 lg:pr-5 xl:pl-5 xl:pr-6 pt-2.5 sm:pt-3 pb-1 w-full ${
        showNotifMenu ? 'z-50' : 'z-30'
      }`}
    >
      <header className="relative z-50 glass-floating-header rounded-[22px] px-3 sm:px-4 py-1.5 sm:py-2">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Bee Property Logo & Brand Title */}
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 min-w-0 group"
            aria-label="Bee Property Resident Portal Home"
          >
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm shadow-blue-500/10 border border-blue-100/80 flex items-center justify-center p-1 shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
              <img
                src={beeLogo}
                alt="Bee Property Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0 leading-tight">
              <span className="block font-medium text-[15px] sm:text-base tracking-tight text-black dark:text-white truncate">
                Bee Property
              </span>
              <span className="block font-medium text-[10px] tracking-[0.12em] uppercase text-blue-600 dark:text-sky-400 truncate mt-0.5">
                Resident Portal
              </span>
            </div>
          </Link>

          {/* Right: Frosted Circular Notifications & Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Notifications Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                aria-expanded={showNotifMenu}
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-black dark:text-white bg-white/55 dark:bg-slate-800/60 backdrop-blur-md border border-white/75 dark:border-slate-700 hover:bg-white/85 dark:hover:bg-slate-800 hover:text-blue-600 transition-all shadow-xs"
                aria-label={
                  unreadNotificationsCount > 0
                    ? `Notifications (${unreadNotificationsCount} unread)`
                    : 'Notifications'
                }
              >
                <Bell className="w-[18px] h-[18px]" strokeWidth={1.6} />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
                )}
              </button>
            </div>

            {/* Profile Avatar */}
            <div className="relative">
              <Link
                to="/profile"
                className="flex items-center rounded-full hover:ring-2 hover:ring-blue-400 transition-all"
                title="Profile & Settings"
                aria-label="Profile & Settings"
              >
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name || 'Resident profile'}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white/95 shadow-xs"
                />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Popover rendered outside <header> so backdrop-filter never clips fixed positioning */}
      {showNotifMenu && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/20 dark:bg-slate-950/45 backdrop-blur-[3px] z-40"
            onClick={() => setShowNotifMenu(false)}
          />

          <div className="fixed left-3 right-3 top-[64px] sm:absolute sm:left-auto sm:right-4 lg:right-5 xl:right-6 sm:top-full sm:mt-1.5 sm:w-96 glass-popover rounded-2xl overflow-hidden z-50 animate-in fade-in-50 duration-150">
            <div className="flex items-center justify-between px-4 py-3 bg-white/55 dark:bg-slate-800/55 border-b border-blue-100/80 dark:border-slate-700/80">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-black dark:text-white">Notifications</span>
                {unreadNotificationsCount > 0 && (
                  <Badge variant="primary" size="sm">
                    {unreadNotificationsCount} new
                  </Badge>
                )}
              </div>
              {unreadNotificationsCount > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  className="text-xs font-medium text-blue-600 dark:text-sky-400 hover:text-blue-800 dark:hover:text-sky-300 transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto divide-y divide-blue-100/75 dark:divide-slate-700/70">
              {notifications.slice(0, 5).map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markNotificationRead(n.id);
                    setShowNotifMenu(false);
                    if (n.link) navigate(n.link);
                  }}
                  className={`p-3.5 hover:bg-white/75 dark:hover:bg-slate-800/75 cursor-pointer transition-colors ${
                    !n.isRead ? 'bg-blue-50/70 dark:bg-sky-500/15' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0">
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-sky-400 shrink-0 mt-1" />
                      )}
                      <p className={`text-xs ${!n.isRead ? 'font-semibold text-black dark:text-white' : 'font-medium text-black dark:text-slate-100'}`}>
                        {n.title}
                      </p>
                    </div>
                    <span className="text-[10px] font-normal text-slate-600 dark:text-slate-300 shrink-0">
                      {getTimeAgo(n.timestamp)}
                    </span>
                  </div>
                  <p className={`text-xs font-normal text-slate-700 dark:text-slate-200 mt-1 line-clamp-2 leading-relaxed ${!n.isRead ? 'pl-4' : ''}`}>
                    {n.message}
                  </p>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="p-6 text-center text-xs font-normal text-slate-700 dark:text-slate-200">
                  No notifications right now.
                </div>
              )}
            </div>

            <div className="p-3 bg-white/55 dark:bg-slate-800/55 border-t border-blue-100/80 dark:border-slate-700/80 text-center">
              <Link
                to="/notifications"
                onClick={() => setShowNotifMenu(false)}
                className="text-xs font-medium text-blue-600 dark:text-sky-400 hover:text-blue-800 dark:hover:text-sky-300 inline-flex items-center gap-1"
              >
                <span>View all notifications</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
