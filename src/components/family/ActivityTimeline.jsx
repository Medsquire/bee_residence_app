import React from 'react';
import { getTimeAgo } from '../../utils/formatters';
import {
  UserCheck,
  UserX,
  Wrench,
  Ticket,
  Car,
  UserPlus,
  UserMinus,
  Activity,
  CheckCircle,
  Package
} from 'lucide-react';

const ICON_MAP = {
  'user-check': UserCheck,
  'user-x': UserX,
  'wrench': Wrench,
  'ticket': Ticket,
  'car': Car,
  'user-plus': UserPlus,
  'user-minus': UserMinus,
  'package': Package,
  'shield-check': UserCheck,
  'activity': Activity
};

export default function ActivityTimeline({ logs }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 glass-card rounded-2xl border border-blue-100">
        No household activity recorded yet.
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-4 sm:p-6 shadow-xs">
      <h3 className="text-xs font-black text-blue-950 uppercase tracking-wider mb-4">
        Household Activity Audit Trail
      </h3>

      <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-100">
        {logs.map((log) => {
          const IconComponent = ICON_MAP[log.icon] || Activity;

          return (
            <div key={log.id} className="relative flex items-start justify-between gap-3 text-xs">
              {/* Dot icon */}
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white border-2 border-blue-500 text-blue-600 flex items-center justify-center ring-4 ring-white shadow-xs">
                <IconComponent className="w-2.5 h-2.5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-slate-800 font-medium leading-relaxed">
                  <strong className="text-blue-950 font-bold">{log.actorName}</strong>{' '}
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 uppercase">
                    {log.actorRole === 'HEAD' ? 'Head' : 'Member'}
                  </span>{' '}
                  {log.action}
                </p>
              </div>

              <span className="text-[11px] text-slate-400 shrink-0 whitespace-nowrap">
                {getTimeAgo(log.timestamp)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
