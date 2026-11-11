import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  Wrench,
  Car,
  Bell,
  Users,
  Settings,
  LogOut,
  Building2,
  ShieldCheck,
  ChevronRight,
  Hexagon,
  X
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
      badge: pendingVisitorsCount > 0 ? { count: pendingVisitorsCount, variant: 'primary' } : null,
    },
    {
      to: '/services',
      label: 'Services',
      icon: Wrench,
      badge: activeServicesCount > 0 ? { count: activeServicesCount, variant: 'primary' } : null,
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
      badge: unreadNotificationsCount > 0 ? { count: unreadNotificationsCount, variant: 'primary' } : null,
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
          className="fixed inset-0 bg-blue-950/25 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-white/85 backdrop-blur-2xl text-slate-800 flex flex-col transition-transform duration-300 ease-in-out border-r border-white/90 shadow-2xl lg:shadow-soft ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-blue-100/70 bg-gradient-to-b from-blue-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-500/25 text-white font-black text-xl tracking-tight border border-white/50">
                B
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-blue-950">
                    BEE Residence
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-200">
                    Pro
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Smart Living, Simplified.</p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Household Info Pill */}
          <div className="mt-4 p-2.5 rounded-xl bg-blue-50/70 border border-blue-100/90 flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white shadow-xs text-blue-600 border border-blue-100">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-blue-950 truncate">
                {household.tower} • Flat {household.flatNumber}
              </p>
              <p className="text-[11px] text-slate-500 truncate">{household.apartmentName}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5">
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-blue-600 mb-2">
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
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-600 hover:bg-blue-50/80 hover:text-blue-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-white text-blue-700 shadow-xs'
                            : 'bg-blue-100 text-blue-700'
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
        <div className="p-3.5 border-t border-blue-100/70 bg-gradient-to-t from-blue-50/50 to-transparent">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/80 border border-blue-100/80 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                alt={currentUser?.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-200"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-blue-950 truncate">{currentUser?.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-blue-600 shrink-0" />
                  <span className="text-[10px] font-bold text-blue-600 uppercase">
                    {isHead ? 'Household Head' : 'Member'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
