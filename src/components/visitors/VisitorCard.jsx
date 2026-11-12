import React, { useState } from 'react';
import ImagePreviewModal from '../common/ImagePreviewModal';
import { getTimeAgo, formatDate } from '../../utils/formatters';
import {
  Clock,
  Car,
  Shield,
  CheckCircle2,
  XCircle,
  PackageCheck,
  Eye,
  Check,
  X,
  ChevronRight
} from 'lucide-react';

export default function VisitorCard({ visitor, onInspect, onDecision }) {
  const [isImageOpen, setIsImageOpen] = useState(false);
  const isPending = visitor.status === 'Pending';
  const photoUrl =
    visitor.photo ||
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';

  const statusMeta = {
    Pending: {
      label: 'Pending',
      pill: 'bg-blue-50/95 dark:bg-blue-950/70 text-blue-700 dark:text-sky-300 border-blue-200/80 dark:border-blue-800/60'
    },
    Approved: {
      label: 'Approved',
      pill: 'bg-emerald-50/90 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60'
    },
    'Leave at Gate': {
      label: 'At Gate',
      pill: 'bg-sky-50/90 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200/80 dark:border-sky-800/60'
    },
    Rejected: {
      label: 'Denied',
      pill: 'bg-rose-50/90 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60'
    },
    Completed: {
      label: 'Completed',
      pill: 'bg-white/85 dark:bg-slate-800 text-black dark:text-slate-200 border-blue-100/80 dark:border-slate-700'
    }
  };

  const statusInfo = statusMeta[visitor.status] || {
    label: visitor.status,
    pill: 'bg-white/85 dark:bg-slate-800 text-black dark:text-white border-blue-100/80 dark:border-slate-700'
  };

  return (
    <>
      <div
        className={`rounded-2xl transition-all duration-200 overflow-hidden ${
          isPending ? 'glass-stat-blue' : 'glass-stat-white'
        }`}
      >
        <div className="p-3 sm:p-3.5">
          <div className="flex items-start gap-2.5 sm:gap-3">
            {/* Avatar */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsImageOpen(true);
              }}
              title="View Full Photo"
              aria-label={`View full photo of ${visitor.name}`}
              className="rounded-xl overflow-hidden ring-1 ring-white/95 dark:ring-slate-700 shadow-xs shrink-0 cursor-zoom-in hover:opacity-90 active:scale-95 transition-all"
            >
              <img
                src={photoUrl}
                alt={visitor.name}
                className="w-10 h-10 sm:w-11 sm:h-11 object-cover block"
              />
            </button>

          {/* Main Classified Info */}
          <div className="flex-1 min-w-0">
            {/* Title & Compact Status Pill */}
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-medium text-black dark:text-white text-[13px] sm:text-sm leading-snug truncate min-w-0">
                {visitor.name}
              </h4>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium shrink-0 ${statusInfo.pill}`}
              >
                {isPending && (
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-sky-400 animate-pulse" />
                )}
                <span>{statusInfo.label}</span>
              </span>
            </div>

            {/* Category + Time + Gate */}
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-normal text-black dark:text-slate-200 flex-wrap">
              <span className="text-[10px] font-medium text-blue-700 dark:text-sky-300 bg-white/85 dark:bg-slate-800/80 px-1.5 py-[1px] rounded-md border border-blue-200/70 dark:border-slate-700">
                {visitor.category}
              </span>
              <span className="text-blue-400 dark:text-slate-500">•</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-600 dark:text-sky-400" strokeWidth={1.5} />
                {getTimeAgo(visitor.arrivedAt)}
              </span>
              {visitor.gateNumber && (
                <>
                  <span className="hidden sm:inline text-blue-400 dark:text-slate-500">•</span>
                  <span className="hidden sm:inline-flex items-center gap-1">
                    <Shield className="w-3 h-3 text-blue-600 dark:text-sky-400" strokeWidth={1.5} />
                    {visitor.gateNumber}
                  </span>
                </>
              )}
            </div>

            {/* Compact Vehicle Chip */}
            {visitor.vehicleNumber && visitor.vehicleNumber !== 'None (Walk-in)' && (
              <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10.5px] font-mono font-normal text-black dark:text-white bg-white/80 dark:bg-slate-800/80 px-2 py-0.5 rounded-lg border border-blue-100/90 dark:border-slate-700">
                  <Car className="w-3 h-3 text-blue-600 dark:text-sky-400" strokeWidth={1.5} />
                  {visitor.vehicleNumber}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Frosted Glass Icon-Only Action Bar */}
      {isPending ? (
        <div className="px-3 sm:px-3.5 pb-3 pt-0.5">
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-white/45 dark:bg-slate-900/45 backdrop-blur-md border border-white/80 dark:border-slate-700/70 shadow-xs">
            <button
              type="button"
              onClick={() => onInspect(visitor)}
              title="View Details"
              aria-label="View Details"
              className="h-8 rounded-xl bg-white/75 dark:bg-slate-800/75 border border-blue-100/80 dark:border-slate-700 text-black dark:text-white hover:text-blue-600 dark:hover:text-sky-400 hover:bg-white inline-flex items-center justify-center active:scale-[0.97] transition-all"
            >
              <Eye className="w-4 h-4" strokeWidth={1.6} />
            </button>

            <button
              type="button"
              onClick={() => onDecision(visitor, 'Approved')}
              title="Approve Entry"
              aria-label="Approve Entry"
              className="h-8 rounded-xl bg-gradient-to-r from-blue-600/90 to-sky-500/90 border border-blue-400/40 text-white shadow-xs shadow-blue-500/20 hover:from-blue-600 hover:to-sky-500 inline-flex items-center justify-center active:scale-[0.97] transition-all"
            >
              <Check className="w-4 h-4" strokeWidth={2} />
            </button>

            <button
              type="button"
              onClick={() => onDecision(visitor, 'Rejected')}
              title="Reject Entry"
              aria-label="Reject Entry"
              className="h-8 rounded-xl bg-rose-50/75 dark:bg-rose-950/45 border border-rose-200/75 dark:border-rose-800/60 text-rose-600 dark:text-rose-300 hover:bg-rose-600 hover:text-white hover:border-rose-600 inline-flex items-center justify-center active:scale-[0.97] transition-all"
            >
              <X className="w-4 h-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      ) : (
        <div className="px-3 sm:px-3.5 py-2 bg-white/40 dark:bg-slate-900/35 border-t border-blue-100/60 dark:border-slate-700/70 flex items-center justify-between text-[11px] font-normal text-black dark:text-slate-200">
          <div className="flex items-center gap-1.5 min-w-0 pr-2">
            {visitor.status === 'Approved' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400 shrink-0" strokeWidth={1.5} />
            ) : visitor.status === 'Rejected' ? (
              <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" strokeWidth={1.5} />
            ) : (
              <PackageCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" strokeWidth={1.5} />
            )}
            <span className="truncate">
              Decided by <span className="font-medium text-black dark:text-white">{visitor.decisionBy || 'Resident'}</span>
              {visitor.decidedAt && ` • ${formatDate(visitor.decidedAt)}`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onInspect(visitor)}
            className="text-[11px] font-medium text-blue-600 dark:text-sky-400 hover:text-blue-800 inline-flex items-center gap-0.5 shrink-0"
          >
            <span>Details</span>
            <ChevronRight className="w-3 h-3" strokeWidth={1.6} />
          </button>
        </div>
      )}
    </div>

    <ImagePreviewModal
      isOpen={isImageOpen}
      onClose={() => setIsImageOpen(false)}
      src={photoUrl}
      alt={visitor.name}
      subtitle={visitor.category}
    />
  </>
  );
}
