import React from 'react';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/formatters';
import {
  Wrench,
  Clock,
  Calendar,
  AlertTriangle,
  UserCheck,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export default function ServiceCard({ ticket, onInspect }) {
  const urgencyVariants = {
    Urgent: 'danger',
    High: 'primary',
    Normal: 'neutral',
    'Can Wait': 'neutral'
  };

  const statusVariants = {
    Pending: 'primary',
    Approved: 'info',
    Scheduled: 'gold',
    'In Progress': 'primary',
    Completed: 'success',
    Cancelled: 'danger'
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs">
      <div>
        {/* Header badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              {ticket.id}
            </span>
            <span className="text-xs font-bold text-blue-950 bg-white/80 px-2 py-0.5 rounded-md border border-blue-100">
              {ticket.category}
            </span>
          </div>
          <Badge variant={statusVariants[ticket.status] || 'neutral'}>
            {ticket.status}
          </Badge>
        </div>

        {/* Title & description */}
        <h4 className="font-bold text-blue-950 text-sm sm:text-base leading-snug line-clamp-1">
          {ticket.title}
        </h4>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {ticket.description}
        </p>

        {/* Details snippet */}
        <div className="mt-4 pt-3 border-t border-blue-100/70 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Urgency:</span>
            <Badge variant={urgencyVariants[ticket.urgency] || 'neutral'} size="sm">
              {ticket.urgency}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Preferred Slot:</span>
            <span className="font-semibold text-blue-950">
              {ticket.preferredDate} ({ticket.preferredTimeSlot.split(' ')[0]})
            </span>
          </div>

          {ticket.technician && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Technician:</span>
              <span className="font-bold text-blue-950 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                {ticket.technician.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Inspect Button */}
      <div className="mt-4 pt-3 border-t border-blue-100/70 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Logged {formatDate(ticket.createdAt, false)}
        </span>
        <button
          type="button"
          onClick={() => onInspect(ticket)}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span>Inspect Booking</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
