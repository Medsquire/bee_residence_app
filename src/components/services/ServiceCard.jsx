import React from 'react';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/formatters';
import {
  Wrench,
  Clock,
  Calendar,
  UserCheck,
  Eye,
  Droplets,
  Zap,
  Wind,
  Wifi,
  Paintbrush,
  Bug,
  Sparkles,
  Tv,
  Hammer,
  Snowflake,
  Building2,
  Waves
} from 'lucide-react';

const CATEGORY_ICONS = {
  'Apartment Issues': Building2,
  Plumbing: Droplets,
  'Electrical Repairs': Zap,
  'Water Pump and Motor': Waves,
  Cleaning: Sparkles,
  Sanitation: Sparkles,
  'Air Conditioning': Wind,
  'Washing Machine': Waves,
  Television: Tv,
  'Wi-Fi and Internet': Wifi,
  Carpentry: Hammer,
  Painting: Paintbrush,
  'Pest Control': Bug,
  Refrigerator: Snowflake,
  'Other Maintenance': Wrench
};

const URGENCY_VARIANTS = {
  Urgent: 'danger',
  High: 'primary',
  Normal: 'neutral',
  'Can Wait': 'neutral'
};

const STATUS_VARIANTS = {
  Pending: 'primary',
  Approved: 'info',
  Scheduled: 'gold',
  'In Progress': 'primary',
  Completed: 'success',
  Cancelled: 'danger'
};

/**
 * Slim classified frosted-glass card for maintenance & home service requests.
 */
export default function ServiceCard({ ticket, onInspect }) {
  const CategoryIcon = CATEGORY_ICONS[ticket.category] || Wrench;
  const slotWindow = (ticket.preferredTimeSlot || '').split(' ')[0];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onInspect(ticket)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onInspect(ticket);
        }
      }}
      className="relative overflow-hidden glass-stat-white rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between gap-2.5 cursor-pointer group hover:-translate-y-0.5 active:scale-[0.99] transition-all"
    >
      {/* Subtle glass highlight orb matching VisitorCard/Dashboard aesthetic */}
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-sky-300/20 dark:bg-sky-400/10 blur-2xl pointer-events-none group-hover:bg-blue-400/25 transition-colors duration-300" />

      <div className="relative z-10 flex items-start gap-2.5 sm:gap-3">
        {/* Category Icon Tile */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl shrink-0 bg-gradient-to-br from-blue-500/15 to-sky-400/20 dark:from-blue-500/25 dark:to-sky-500/20 border border-blue-200/70 dark:border-sky-400/30 text-blue-600 dark:text-sky-300 flex items-center justify-center shadow-xs">
          <CategoryIcon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.6} />
        </div>

        {/* Header content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-black dark:text-white text-[13px] sm:text-sm leading-snug line-clamp-1">
              {ticket.title}
            </h4>
            <Badge
              variant={STATUS_VARIANTS[ticket.status] || 'neutral'}
              size="sm"
              className="shrink-0"
            >
              {ticket.status}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap mt-1 text-[11px]">
            <Badge variant="info" size="sm">
              {ticket.category}
            </Badge>
            <span className="text-black/35 dark:text-slate-500">•</span>
            <span className="font-mono font-medium text-black/65 dark:text-slate-300">
              {ticket.id}
            </span>
          </div>
        </div>
      </div>

      {/* Classified inline glass pills */}
      <div className="relative z-10 flex items-center gap-1.5 flex-wrap">
        <Badge variant={URGENCY_VARIANTS[ticket.urgency] || 'neutral'} size="sm">
          {ticket.urgency}
        </Badge>

        {ticket.preferredDate && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/70 dark:bg-slate-800/80 border border-white/85 dark:border-slate-700/75 text-[11px] font-medium text-black dark:text-white shadow-2xs">
            <Calendar className="w-3 h-3 text-blue-600 dark:text-sky-400 shrink-0" strokeWidth={1.6} />
            <span>
              {ticket.preferredDate}
              {slotWindow ? ` · ${slotWindow}` : ''}
            </span>
          </span>
        )}

        {ticket.technician && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/70 dark:bg-slate-800/80 border border-white/85 dark:border-slate-700/75 text-[11px] font-medium text-black dark:text-white shadow-2xs truncate max-w-full">
            <UserCheck className="w-3 h-3 text-blue-600 dark:text-sky-400 shrink-0" strokeWidth={1.6} />
            <span className="truncate">{ticket.technician.name}</span>
          </span>
        )}
      </div>

      {/* Slim frosted footer */}
      <div className="relative z-10 pt-2 border-t border-white/65 dark:border-slate-700/60 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 text-[11px] font-normal text-black/65 dark:text-slate-300">
          <Clock className="w-3 h-3 text-blue-500 dark:text-sky-400 shrink-0" strokeWidth={1.5} />
          <span>{formatDate(ticket.createdAt, false)}</span>
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onInspect(ticket);
          }}
          title="Inspect Service Request"
          aria-label="Inspect Service Request"
          className="h-7 px-3 rounded-xl bg-white/75 dark:bg-slate-800/80 backdrop-blur-md border border-white/90 dark:border-slate-600/70 text-black dark:text-white shadow-xs flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" strokeWidth={1.7} />
        </button>
      </div>
    </div>
  );
}
