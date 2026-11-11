import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Check,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Shield,
  Building,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHousehold } from '../../context/HouseholdContext';
import { useToast } from '../../context/ToastContext';
import { getTimeAgo } from '../../utils/formatters';
import Badge from '../common/Badge';

export default function Navbar({ onOpenSidebar }) {
  const navigate = useNavigate();
  const { currentUser, isHead, switchUser, availableUsers, logout } = useAuth();
  const {
    household,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    simulateIncomingVisitor
  } = useHousehold();
  const { addToast } = useToast();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const notifRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifMenu(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserMenu(false);
        setShowRoleSwitcher(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSimulateVisitor = () => {
    const visitor = simulateIncomingVisitor();
    addToast({
      title: 'Gate Arrival Simulated!',
      message: `${visitor.name} just arrived at ${visitor.gateNumber}. Pending resident approval.`,
      type: 'info'
    });
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-white/80 px-3.5 sm:px-6 py-2.5 sm:py-3 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger & Society label */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-700 bg-white/80 border border-blue-100 hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-xs"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Society badge */}
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-800 hidden md:inline">
              {household.apartmentName}
            </span>
            <span className="text-slate-300 hidden md:inline">•</span>
            <span className="text-xs font-black text-blue-700 bg-blue-50/90 px-2.5 py-1 rounded-lg border border-blue-200/80 shadow-xs">
              {household.tower} - {household.flatNumber}
            </span>
          </div>
        </div>

        {/* Right: Actions, Simulation, Role Switcher, Notifications, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Quick Simulate Gate Arrival */}
          <button
            type="button"
            onClick={handleSimulateVisitor}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100/80 hover:border-blue-300 transition-all shadow-xs active:scale-95"
            title="Simulate a new courier or guest arriving at the gate"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Simulate Visitor</span>
          </button>

          {/* Role Switcher */}
          <div className="relative" ref={userRef}>
            <button
              type="button"
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white/80 hover:bg-blue-50/80 border border-blue-100 text-slate-800 transition-all shadow-xs"
              title="Switch user persona to test Head vs Member permissions"
            >
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden md:inline text-slate-500 font-medium">Role:</span>
              <span className="font-bold text-blue-900 truncate max-w-[80px] sm:max-w-none">
                {currentUser?.name?.split(' ')[0]} ({isHead ? 'Head' : 'Member'})
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleSwitcher && (
              <div className="absolute right-0 mt-2 w-72 glass-modal rounded-2xl p-2 z-50 animate-in fade-in-50 duration-150">
                <div className="px-3 py-2 border-b border-blue-100/80">
                  <p className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">
                    Household Personas
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Switch between Head & Family Member
                  </p>
                </div>
                <div className="p-1 space-y-1 mt-1">
                  {availableUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        switchUser(user.id);
                        setShowRoleSwitcher(false);
                        addToast({
                          title: `Switched Persona to ${user.name}`,
                          message: `Logged in as ${user.role === 'HEAD' ? 'Household Head' : 'Household Member'}.`,
                          type: 'info'
                        });
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-all ${
                        currentUser?.id === user.id
                          ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                          : 'hover:bg-blue-50/70 text-slate-700 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className={`w-7 h-7 rounded-full object-cover ring-2 ${
                            currentUser?.id === user.id ? 'ring-white/80' : 'ring-blue-100'
                          }`}
                        />
                        <div>
                          <p className={currentUser?.id === user.id ? 'text-white' : 'text-slate-900 font-bold'}>
                            {user.name}
                          </p>
                          <p className={`text-[10px] ${currentUser?.id === user.id ? 'text-blue-100' : 'text-slate-400'}`}>
                            {user.role === 'HEAD' ? 'Household Head' : 'Family Member'} ({user.relationship})
                          </p>
                        </div>
                      </div>
                      {currentUser?.id === user.id && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-xl text-slate-700 bg-white/80 border border-blue-100/80 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-xs"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-white shadow-xs">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-modal rounded-2xl overflow-hidden z-50 animate-in fade-in-50 duration-150">
                <div className="flex items-center justify-between px-4 py-3 bg-blue-50/60 border-b border-blue-100/80">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-blue-950">Notifications</span>
                    {unreadNotificationsCount > 0 && (
                      <Badge variant="primary" size="sm">
                        {unreadNotificationsCount} new
                      </Badge>
                    )}
                  </div>
                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-blue-50/60">
                  {notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        setShowNotifMenu(false);
                        if (n.link) navigate(n.link);
                      }}
                      className={`p-3.5 hover:bg-blue-50/50 cursor-pointer transition-colors ${
                        !n.isRead ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-xs ${!n.isRead ? 'font-bold text-blue-950' : 'font-medium text-slate-700'}`}>
                          {n.title}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {getTimeAgo(n.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications right now.
                    </div>
                  )}
                </div>

                <div className="p-2.5 bg-blue-50/40 border-t border-blue-100/80 text-center">
                  <Link
                    to="/notifications"
                    onClick={() => setShowNotifMenu(false)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                  >
                    <span>View all notifications</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar */}
          <div className="relative">
            <Link
              to="/profile"
              className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-blue-400 transition-all"
              title="Profile & Settings"
            >
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-xs"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
