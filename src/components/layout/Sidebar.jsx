import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  QrCode,
  Wrench,
  Car,
  Bell,
  Users,
  Settings,
  LogOut,
  Building2,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHousehold } from '../../context/HouseholdContext';
import Badge from '../common/Badge';

export default function Sidebar({ isOpen, onClose }) {
  const { currentUser, isHead, logout } = useAuth();
  const {
    household,
    pendingVisitorsCount,
    activeServicesCount,
    activePassesCount,
    unreadNotificationsCount,
    vehiclesCount
  } = useHousehold();

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/visitors',
      label: 'My Visitors',
      icon: UserCheck,
      badge: pendingVisitorsCount > 0 ? { count: pendingVisitorsCount, variant: 'danger' } : null,
    },
    {
      to: '/pre-approved',
      label: 'Pre-Approved Visitors',
      icon: QrCode,
      badge: activePassesCount > 0 ? { count: activePassesCount, variant: 'primary' } : null,
    },
    {
      to: '/services',
      label: 'Home Services',
      icon: Wrench,
      badge: activeServicesCount > 0 ? { count: activeServicesCount, variant: 'warning' } : null,
    },
    {
      to: '/vehicles',
      label: 'My Vehicles',
      icon: Car,
      badge: vehiclesCount > 0 ? { count: vehiclesCount, variant: 'neutral' } : null,
    },
    {
      to: '/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? { count: unreadNotificationsCount, variant: 'danger' } : null,
    },
    {
      to: '/family',
      label: 'Family Members',
      icon: Users,
    },
    {
      to: '/profile',
      label: 'Profile & Settings',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-navy-950/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-navy-900 text-white flex flex-col transition-transform duration-300 ease-in-out border-r border-navy-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-navy-800/80 bg-navy-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-bee-400 to-bee-600 flex items-center justify-center shadow-glow text-navy-950 font-black text-xl tracking-tighter">
              BEE
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">BEE Residence</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-bee-500/20 text-bee-400 px-1.5 py-0.5 rounded">Pro</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Smart Living, Simplified.</p>
            </div>
          </div>

          {/* Household Info Pill */}
          <div className="mt-4 p-2.5 rounded-xl bg-navy-800/80 border border-navy-700/60 flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-navy-900 text-bee-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">
                {household.tower} • Flat {household.flatNumber}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{household.apartmentName}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-bee-500 text-navy-950 font-bold shadow-md shadow-bee-500/20'
                      : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-navy-950' : 'text-slate-400 group-hover:text-bee-400'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-navy-950 text-bee-400'
                            : item.badge.variant === 'danger'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : item.badge.variant === 'warning'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-navy-800 text-slate-300'
                        }`}
                      >
                        {item.badge.count}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="p-3.5 border-t border-navy-800/80 bg-navy-950/60">
          <div className="flex items-center justify-between p-2 rounded-xl bg-navy-800/60 border border-navy-700/50">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                alt={currentUser?.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-bee-500/50"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-bee-400 shrink-0" />
                  <span className="text-[10px] font-semibold text-slate-300 uppercase">
                    {isHead ? 'Household Head' : 'Member'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
