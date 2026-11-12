import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UserCheck, Wrench, Menu } from 'lucide-react';
import { useHousehold } from '../../context/HouseholdContext';

export default function MobileNav({ onOpenMenu }) {
  const { pendingVisitorsCount, activeServicesCount } = useHousehold();

  return (
    <nav className="lg:hidden fixed bottom-3 left-4 right-4 z-40 glass-dock rounded-[22px] px-2.5 py-2">
      <div className="flex items-center justify-around">
        {/* Dashboard / Home */}
        <NavLink
          to="/dashboard"
          title="Home"
          aria-label="Home"
          className={({ isActive }) =>
            `flex items-center justify-center p-2.5 rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-blue-600/95 text-white shadow-md shadow-blue-500/25 scale-105'
                : 'text-black dark:text-white drop-shadow-[0_1px_1px_rgba(255,255,255,0.65)] dark:drop-shadow-none hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-500/10'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" strokeWidth={1.8} />
        </NavLink>

        {/* Visitors */}
        <NavLink
          to="/visitors"
          title="Visitors"
          aria-label="Visitors"
          className={({ isActive }) =>
            `relative flex items-center justify-center p-2.5 rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-blue-600/95 text-white shadow-md shadow-blue-500/25 scale-105'
                : 'text-black dark:text-white drop-shadow-[0_1px_1px_rgba(255,255,255,0.65)] dark:drop-shadow-none hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-500/10'
            }`
          }
        >
          {({ isActive }) => (
            <div className="relative">
              <UserCheck className="w-5 h-5" strokeWidth={1.8} />
              {pendingVisitorsCount > 0 && (
                <span
                  className={`absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-medium ${
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
                ? 'bg-blue-600/95 text-white shadow-md shadow-blue-500/25 scale-105'
                : 'text-black dark:text-white drop-shadow-[0_1px_1px_rgba(255,255,255,0.65)] dark:drop-shadow-none hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-500/10'
            }`
          }
        >
          {({ isActive }) => (
            <div className="relative">
              <Wrench className="w-5 h-5" strokeWidth={1.8} />
              {activeServicesCount > 0 && (
                <span
                  className={`absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-medium ${
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
          className="flex items-center justify-center p-2.5 rounded-xl text-black dark:text-white drop-shadow-[0_1px_1px_rgba(255,255,255,0.65)] dark:drop-shadow-none hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-500/10 transition-all duration-200"
        >
          <Menu className="w-5 h-5" strokeWidth={1.8} />
        </button>
      </div>
    </nav>
  );
}
