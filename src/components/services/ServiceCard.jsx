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
    High: 'warning',
    Normal: 'neutral',
    'Can Wait': 'neutral'
  };

  const statusVariants = {
    Pending: 'warning',
    Approved: 'info',
    Scheduled: 'gold',
    'In Progress': 'primary',
    Completed: 'success',
    Cancelled: 'danger'
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-card transition-all duration-200 p-5 flex flex-col justify-between">
      <div>
        {/* Header badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              {ticket.id}
            </span>
            <span className="text-xs font-bold text-navy-800 bg-navy-50 px-2 py-0.5 rounded-md border border-navy-100">
              {ticket.category}
            </span>
          </div>
          <Badge variant={statusVariants[ticket.status] || 'neutral'}>
            {ticket.status}
          </Badge>
        </div>

        {/* Title & description */}
        <h4 className="font-bold text-navy-900 text-sm sm:text-base leading-snug line-clamp-1">
          {ticket.title}
        </h4>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {ticket.description}
        </p>

        {/* Details snippet */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Urgency:</span>
            <Badge variant={urgencyVariants[ticket.urgency] || 'neutral'} size="sm">
              {ticket.urgency}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Preferred Slot:</span>
            <span className="font-semibold text-slate-800">
              {ticket.preferredDate} ({ticket.preferredTimeSlot.split(' ')[0]})
            </span>
          </div>

          {ticket.technician && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Technician:</span>
              <span className="font-bold text-navy-900 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-bee-600" />
                {ticket.technician.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Inspect Button */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Logged {formatDate(ticket.createdAt, false)}
        </span>
        <button
          type="button"
          onClick={() => onInspect(ticket)}
          className="inline-flex items-center gap-1 text-xs font-bold text-navy-900 hover:text-bee-600 transition-colors"
        >
          <span>Inspect Booking</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
