import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UserCheck, QrCode, Wrench, Menu } from 'lucide-react';
import { useHousehold } from '../../context/HouseholdContext';

export default function MobileNav({ onOpenMenu }) {
  const { pendingVisitorsCount, activeServicesCount } = useHousehold();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[11px] font-semibold transition-colors ${
              isActive ? 'text-bee-600 font-bold' : 'text-slate-500 hover:text-navy-900'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/visitors"
          className={({ isActive }) =>
            `relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[11px] font-semibold transition-colors ${
              isActive ? 'text-bee-600 font-bold' : 'text-slate-500 hover:text-navy-900'
            }`
          }
        >
          <div className="relative">
            <UserCheck className="w-5 h-5" />
            {pendingVisitorsCount > 0 && (
              <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                {pendingVisitorsCount}
              </span>
            )}
          </div>
          <span>Visitors</span>
        </NavLink>

        <NavLink
          to="/pre-approved"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[11px] font-semibold transition-colors ${
              isActive ? 'text-bee-600 font-bold' : 'text-slate-500 hover:text-navy-900'
            }`
          }
        >
          <QrCode className="w-5 h-5" />
          <span>Passes</span>
        </NavLink>

        <NavLink
          to="/services"
          className={({ isActive }) =>
            `relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[11px] font-semibold transition-colors ${
              isActive ? 'text-bee-600 font-bold' : 'text-slate-500 hover:text-navy-900'
            }`
          }
        >
          <div className="relative">
            <Wrench className="w-5 h-5" />
            {activeServicesCount > 0 && (
              <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white">
                {activeServicesCount}
              </span>
            )}
          </div>
          <span>Services</span>
        </NavLink>

        <button
          type="button"
          onClick={onOpenMenu}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[11px] font-semibold text-slate-500 hover:text-navy-900"
        >
          <Menu className="w-5 h-5" />
          <span>More</span>
        </button>
      </div>
    </nav>
  );
}
