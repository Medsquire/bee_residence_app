import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UserCheck, Wrench, Menu } from 'lucide-react';
import { useHousehold } from '../../context/HouseholdContext';

export default function MobileNav({ onOpenMenu }) {
  const { pendingVisitorsCount, activeServicesCount } = useHousehold();

  return (
    <nav className="lg:hidden fixed bottom-3 left-4 right-4 z-40 glass-dock rounded-2xl px-2 py-2 shadow-glass-lg border border-white/95">
      <div className="flex items-center justify-around">
        {/* Dashboard / Home */}
        <NavLink
          to="/dashboard"
          title="Home"
          aria-label="Home"
          className={({ isActive }) =>
            `flex items-center justify-center p-2.5 rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105'
                : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50/60'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
        </NavLink>

        {/* Visitors */}
        <NavLink
          to="/visitors"
          title="Visitors"
          aria-label="Visitors"
          className={({ isActive }) =>
            `relative flex items-center justify-center p-2.5 rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105'
                : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50/60'
            }`
          }
        >
          {({ isActive }) => (
            <div className="relative">
              <UserCheck className="w-5 h-5" />
              {pendingVisitorsCount > 0 && (
                <span
                  className={`absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black ${
                    isActive ? 'bg-white text-blue-700 shadow-xs' : 'bg-blue-600 text-white shadow-xs'
                  }`}
                >
                  {pendingVisitorsCount}
                </span>
              )}
            </div>
          )}
        </NavLink>

        {/* Services */}
        <NavLink
          to="/services"
          title="Services"
          aria-label="Services"
          className={({ isActive }) =>
            `relative flex items-center justify-center p-2.5 rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105'
                : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50/60'
            }`
          }
        >
          {({ isActive }) => (
            <div className="relative">
              <Wrench className="w-5 h-5" />
              {activeServicesCount > 0 && (
                <span
                  className={`absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black ${
                    isActive ? 'bg-white text-blue-700 shadow-xs' : 'bg-blue-600 text-white shadow-xs'
                  }`}
                >
                  {activeServicesCount}
                </span>
              )}
            </div>
          )}
        </NavLink>

        {/* More / Menu Drawer */}
        <button
          type="button"
          onClick={onOpenMenu}
          title="More Options"
          aria-label="More"
          className="flex items-center justify-center p-2.5 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50/60 transition-all duration-200"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}
