import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHousehold } from '../context/HouseholdContext';
import { useToast } from '../context/ToastContext';
import VisitorCard from '../components/visitors/VisitorCard';
import VisitorDetailsModal from '../components/visitors/VisitorDetailsModal';
import { submitVisitorDecision } from '../utils/visitorActions';
import { getTimeGreeting } from '../utils/formatters';
import {
  UserCheck,
  Wrench,
  QrCode,
  Car,
  Users,
  Bell,
  ArrowRight,
  ChevronRight,
  Building2,
  Home
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    household,
    members,
    visitors,
    pendingVisitorsCount,
    activeServicesCount,
    activePassesCount,
    vehiclesCount,
    unreadNotificationsCount,
    decideVisitor
  } = useHousehold();
  const { addToast } = useToast();

  // Modals state
  const [activeVisitorDetails, setActiveVisitorDetails] = useState(null);

  const handleDecisionClick = (visitor, decision) => {
    submitVisitorDecision({
      visitor,
      decision,
      currentUser,
      decideVisitor,
      addToast
    });
  };

  const recentVisitors = visitors.slice(0, 3);

  const overviewCards = [
    {
      id: 'visitors',
      label: 'Pending Visitors',
      value: pendingVisitorsCount,
      icon: UserCheck,
      to: '/visitors',
      variant: 'white',
      hasPulse: pendingVisitorsCount > 0
    },
    {
      id: 'services',
      label: 'Active Services',
      value: activeServicesCount,
      icon: Wrench,
      to: '/services',
      variant: 'blue'
    },
    {
      id: 'passes',
      label: 'Upcoming Passes',
      value: activePassesCount,
      icon: QrCode,
      to: '/visitors?tab=pre-approved',
      variant: 'white'
    },
    {
      id: 'vehicles',
      label: 'Vehicles',
      value: vehiclesCount,
      icon: Car,
      to: '/vehicles',
      variant: 'blue'
    },
    {
      id: 'family',
      label: 'Family Members',
      value: members.length,
      icon: Users,
      to: '/family',
      variant: 'white'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      value: unreadNotificationsCount,
      icon: Bell,
      to: '/notifications',
      variant: 'blue',
      hasPulse: unreadNotificationsCount > 0
    }
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Top Greeting & Flat Card */}
      <div className="glass-greeting-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-blue-400/15 dark:bg-blue-500/20 blur-2xl pointer-events-none"
        />

        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-normal text-black dark:text-white tracking-tight truncate">
              {getTimeGreeting()},{' '}
              <span className="text-blue-600 dark:text-sky-400 font-medium">
                {currentUser?.name?.split(' ')[0]}
              </span>
            </h2>
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs sm:text-sm font-normal text-black dark:text-white bg-blue-50/90 dark:bg-slate-800/90 px-3 py-1 rounded-full border border-blue-200/80 dark:border-slate-700">
              <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400 shrink-0" strokeWidth={1.6} />
              <span>
                {household.tower} • Flat {household.flatNumber}
              </span>
            </p>
          </div>

          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-md shadow-blue-500/20 flex items-center justify-center shrink-0">
            <Home className="w-5 h-5" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* 6 Compact White & Blue Glassmorphism Cards (3 per row) */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
        {overviewCards.map((card) => {
          const Icon = card.icon;
          const isBlueCard = card.variant === 'blue';

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => navigate(card.to)}
              className={`relative overflow-hidden rounded-2xl p-2 sm:p-3.5 text-left flex flex-col justify-between cursor-pointer group hover:-translate-y-0.5 active:scale-[0.98] ${
                isBlueCard ? 'glass-stat-blue' : 'glass-stat-white'
              }`}
            >
              {/* Subtle glass ambient glow */}
              <div
                className={`absolute -top-8 -right-8 w-20 h-20 rounded-full blur-2xl pointer-events-none transition-colors duration-300 ${
                  isBlueCard
                    ? 'bg-blue-400/20 group-hover:bg-blue-400/30'
                    : 'bg-sky-300/20 group-hover:bg-blue-400/25'
                }`}
              />

              {/* Top row: Slim icon chip + live indicator & arrow */}
              <div className="relative z-10 w-full flex items-center justify-between mb-2 sm:mb-2.5">
                <div
                  className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
                    isBlueCard
                      ? 'bg-white/95 dark:bg-slate-800 text-blue-600 dark:text-sky-400 border border-blue-100 dark:border-slate-700 shadow-sm shadow-blue-500/10'
                      : 'bg-gradient-to-br from-blue-600 to-sky-500 text-white border border-blue-400/30 shadow-sm shadow-blue-500/20'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />
                </div>

                <div className="flex items-center gap-1">
                  {card.hasPulse && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
                    </span>
                  )}
                  <ChevronRight
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all"
                    strokeWidth={1.6}
                  />
                </div>
              </div>

              {/* Count & Title */}
              <div className="relative z-10 min-w-0">
                <p className="text-lg sm:text-[22px] font-normal text-black dark:text-white tracking-tight leading-none tabular-nums">
                  {card.value}
                </p>
                <p className="text-[11px] sm:text-xs font-normal text-black dark:text-white mt-1 sm:mt-1.5 leading-snug line-clamp-2">
                  {card.label}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Recent Visitor Activity */}
      <div className="glass-stat-white rounded-2xl p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-sm sm:text-base font-medium text-black dark:text-white">Recent Visitor Activity</h3>
          <Link
            to="/visitors"
            className="text-xs font-medium text-blue-600 dark:text-sky-400 hover:text-blue-800 inline-flex items-center gap-1 transition-colors shrink-0"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {recentVisitors.map((visitor) => (
            <VisitorCard
              key={visitor.id}
              visitor={visitor}
              onInspect={(v) => setActiveVisitorDetails(v)}
              onDecision={handleDecisionClick}
            />
          ))}

          {recentVisitors.length === 0 && (
            <p className="text-xs text-slate-800 dark:text-slate-200 text-center py-6 col-span-full">
              No recent visitor logs.
            </p>
          )}
        </div>
      </div>

      {/* Modal Dialogs */}
      <VisitorDetailsModal
        isOpen={!!activeVisitorDetails}
        visitor={activeVisitorDetails}
        onClose={() => setActiveVisitorDetails(null)}
        onActionClick={(dec) => {
          const v = activeVisitorDetails;
          setActiveVisitorDetails(null);
          handleDecisionClick(v, dec);
        }}
      />
    </div>
  );
}
