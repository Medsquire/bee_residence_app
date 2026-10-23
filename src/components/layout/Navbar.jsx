import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  UserCheck,
  Wrench,
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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Society label */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-700">
              {household.apartmentName}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-bold text-navy-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              {household.tower} - {household.flatNumber}
            </span>
          </div>
        </div>

        {/* Right: Actions, Simulation, Role Switcher, Notifications, Profile */}
        <div className="flex items-center gap-2.5">
          {/* Simulate Gate Arrival Quick Button */}
          <button
            type="button"
            onClick={handleSimulateVisitor}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 hover:border-amber-300 transition-all shadow-xs active:scale-95"
            title="Simulate a new courier or guest arriving at the gate"
          >
            <Sparkles className="w-3.5 h-3.5 text-bee-600 fill-bee-500" />
            <span>Simulate Gate Visitor</span>
          </button>

          {/* Quick Role Switcher (PRD Requirement: Demonstrating Household Head vs Member shared state) */}
          <div className="relative" ref={userRef}>
            <button
              type="button"
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 transition-colors"
              title="Switch user to test Head vs Member role permissions"
            >
              <Shield className="w-3.5 h-3.5 text-bee-600" />
              <span className="hidden sm:inline font-semibold">Role:</span>
              <span className="font-bold text-navy-900">
                {currentUser?.name?.split(' ')[0]} ({isHead ? 'Head' : 'Member'})
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showRoleSwitcher && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Demo Household Personas
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Switch user to verify shared visitor decisions & permissions
                  </p>
                </div>
                <div className="p-1 space-y-1">
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
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors ${
                        currentUser?.id === user.id
                          ? 'bg-bee-50 text-bee-950 font-bold border border-bee-200'
                          : 'hover:bg-slate-50 text-slate-700 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-navy-900">{user.name}</p>
                          <p className="text-[10px] text-slate-500">
                            {user.role === 'HEAD' ? 'Household Head' : 'Family Member'} ({user.relationship})
                          </p>
                        </div>
                      </div>
                      {currentUser?.id === user.id && (
                        <Check className="w-4 h-4 text-bee-600" />
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
              className="relative p-2 rounded-xl text-slate-600 hover:text-navy-900 hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-navy-900">Notifications</span>
                    {unreadNotificationsCount > 0 && (
                      <Badge variant="danger" size="sm">
                        {unreadNotificationsCount} new
                      </Badge>
                    )}
                  </div>
                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs font-semibold text-bee-700 hover:text-bee-800"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        setShowNotifMenu(false);
                        if (n.link) navigate(n.link);
                      }}
                      className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                        !n.isRead ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-xs ${!n.isRead ? 'font-bold text-navy-900' : 'font-medium text-slate-700'}`}>
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

                <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                  <Link
                    to="/notifications"
                    onClick={() => setShowNotifMenu(false)}
                    className="text-xs font-bold text-navy-900 hover:text-bee-600 inline-flex items-center gap-1"
                  >
                    <span>View all notifications</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <Link
              to="/profile"
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-bee-400 transition-all"
              title="Profile & Settings"
            >
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
