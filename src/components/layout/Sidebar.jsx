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
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHousehold } from '../../context/HouseholdContext';
import beeLogo from '../../assets/bee-property-logo.jpg';

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
          className="fixed inset-0 bg-slate-900/20 dark:bg-slate-950/45 backdrop-blur-sm z-[45] lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-3 bottom-3 left-3 z-50 lg:z-30 w-[272px] max-w-[calc(100vw-24px)] lg:w-[264px] rounded-[28px] glass-sidebar text-black dark:text-white flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? 'translate-x-0 opacity-100'
            : '-translate-x-[calc(100%+24px)] opacity-0 pointer-events-none lg:translate-x-0 lg:opacity-100 lg:pointer-events-auto'
        }`}
      >
        {/* Subtle internal glass refraction glows */}
        <div className="pointer-events-none absolute -top-12 -left-10 w-40 h-40 rounded-full bg-sky-400/20 dark:bg-sky-500/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -right-10 w-36 h-36 rounded-full bg-blue-400/15 dark:bg-indigo-500/15 blur-2xl" />

        {/* Brand Header */}
        <div className="relative p-4 sm:p-5 border-b border-white/55 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/85 dark:bg-slate-900/80 shadow-sm shadow-blue-500/10 border border-white/90 dark:border-white/15 backdrop-blur-md flex items-center justify-center p-1 shrink-0 overflow-hidden">
                <img
                  src={beeLogo}
                  alt="Bee Property Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="leading-tight">
                <span className="block font-medium text-base tracking-tight text-black dark:text-white">
                  Bee Property
                </span>
                <span className="block font-medium text-[10px] tracking-[0.12em] uppercase text-blue-600 dark:text-sky-400 mt-0.5">
                  Resident Portal
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden w-8 h-8 rounded-full bg-white/55 dark:bg-slate-800/60 border border-white/75 dark:border-white/15 text-black dark:text-white flex items-center justify-center hover:bg-white/80 dark:hover:bg-slate-700/70 backdrop-blur-md transition-colors"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>

          {/* Household Info Pill */}
          <div className="mt-4 p-2.5 rounded-2xl bg-white/45 dark:bg-slate-800/45 backdrop-blur-md border border-white/75 dark:border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-white/80 dark:bg-slate-900/75 shadow-xs text-blue-600 dark:text-sky-400 border border-white/90 dark:border-white/15">
              <Building2 className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-black dark:text-white truncate">
                {household.tower} • Flat {household.flatNumber}
              </p>
              <p className="text-[11px] font-normal text-slate-800 dark:text-slate-300 truncate">{household.apartmentName}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="relative flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5">
          <p className="px-3 text-[10px] font-medium uppercase tracking-wider text-blue-600 dark:text-sky-400 mb-2">
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
                  `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-normal transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/90 to-sky-500/85 text-white border border-white/50 shadow-[0_8px_18px_-4px_rgba(37,99,235,0.35),inset_0_1px_0_rgba(255,255,255,0.45)] font-medium backdrop-blur-md'
                      : 'text-black dark:text-slate-100 border border-transparent hover:bg-white/50 dark:hover:bg-white/10 hover:border-white/65 dark:hover:border-white/15 hover:shadow-xs hover:text-blue-700 dark:hover:text-sky-300'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-white' : 'text-slate-800 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-sky-400'
                        }`}
                        strokeWidth={1.5}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium backdrop-blur-xs ${
                          isActive
                            ? 'bg-white/90 text-blue-700 shadow-xs'
                            : 'bg-white/65 dark:bg-slate-800/70 border border-white/75 dark:border-white/15 text-blue-700 dark:text-sky-300'
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
        <div className="relative p-3.5 border-t border-white/55 dark:border-white/10">
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/45 dark:bg-slate-800/45 backdrop-blur-md border border-white/75 dark:border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                alt={currentUser?.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white/80 dark:ring-sky-400/35"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-black dark:text-white truncate">{currentUser?.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-blue-600 dark:text-sky-400 shrink-0" strokeWidth={1.5} />
                  <span className="text-[10px] font-medium text-blue-600 dark:text-sky-400 uppercase">
                    {isHead ? 'Household Head' : 'Member'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-xl bg-white/55 dark:bg-slate-900/50 border border-white/75 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/80 dark:hover:bg-rose-950/50 transition-colors"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
