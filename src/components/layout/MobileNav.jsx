import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UserCheck, Wrench, Menu } from 'lucide-react';
import { useHousehold } from '../../context/HouseholdContext';

export default function MobileNav({ onOpenMenu }) {
  const { pendingVisitorsCount, activeServicesCount } = useHousehold();

  return (
    <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-40 glass-dock rounded-2xl px-1.5 py-1.5 shadow-glass-lg border border-white/95">
      <div className="flex items-center justify-around">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 rounded-xl text-[11px] font-bold transition-all duration-200 ${
              isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.03]'
                : 'text-slate-600 hover:text-blue-600'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <LayoutDashboard className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>Home</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/visitors"
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 rounded-xl text-[11px] font-bold transition-all duration-200 ${
              isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.03]'
                : 'text-slate-600 hover:text-blue-600'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <UserCheck className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                {pendingVisitorsCount > 0 && (
                  <span
                    className={`absolute -top-1.5 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-black ${
                      isActive ? 'bg-white text-blue-700' : 'bg-blue-600 text-white shadow-xs'
                    }`}
                  >
                    {pendingVisitorsCount}
                  </span>
                )}
              </div>
              <span>Visitors</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/services"
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 rounded-xl text-[11px] font-bold transition-all duration-200 ${
              isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.03]'
                : 'text-slate-600 hover:text-blue-600'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <Wrench className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                {activeServicesCount > 0 && (
                  <span
                    className={`absolute -top-1.5 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-black ${
                      isActive ? 'bg-white text-blue-700' : 'bg-blue-600 text-white shadow-xs'
                    }`}
                  >
                    {activeServicesCount}
                  </span>
                )}
              </div>
              <span>Services</span>
            </>
          )}
        </NavLink>

        <button
          type="button"
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 rounded-xl text-[11px] font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
        >
          <Menu className="w-4 h-4 text-slate-500" />
          <span>More</span>
        </button>
      </div>
    </nav>
  );
}
