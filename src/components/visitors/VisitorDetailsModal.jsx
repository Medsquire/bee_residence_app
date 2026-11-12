import React, { useState } from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import ImagePreviewModal from '../common/ImagePreviewModal';
import { formatDate } from '../../utils/formatters';
import {
  Phone,
  Car,
  Shield,
  Clock,
  Package,
  Check,
  X
} from 'lucide-react';

export default function VisitorDetailsModal({ visitor, isOpen, onClose, onActionClick }) {
  const [isImageOpen, setIsImageOpen] = useState(false);

  if (!visitor) return null;

  const photoUrl =
    visitor.photo ||
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';

  const statusVariants = {
    Pending: 'primary',
    Approved: 'success',
    'Leave at Gate': 'gold',
    Rejected: 'danger',
    Completed: 'neutral'
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Visitor Details" maxWidth="max-w-lg">
        <div className="space-y-3">
          {/* Visitor Profile Header */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/55 dark:bg-slate-900/50 backdrop-blur-md border border-white/85 dark:border-slate-700/75">
            <button
              type="button"
              onClick={() => setIsImageOpen(true)}
              title="View Full Photo"
              aria-label={`View full photo of ${visitor.name}`}
              className="rounded-xl overflow-hidden ring-2 ring-white/90 dark:ring-slate-700 shadow-xs shrink-0 cursor-zoom-in hover:opacity-90 active:scale-95 transition-all"
            >
              <img
                src={photoUrl}
                alt={visitor.name}
                className="w-12 h-12 sm:w-14 sm:h-14 object-cover block"
              />
            </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-semibold text-black dark:text-white text-sm sm:text-base truncate">{visitor.name}</h4>
              <Badge variant={statusVariants[visitor.status] || 'neutral'}>
                {visitor.status}
              </Badge>
            </div>
            <p className="text-xs font-medium text-blue-600 dark:text-sky-400 mt-0.5">{visitor.category}</p>
            {visitor.company && (
              <p className="text-xs text-black/75 dark:text-slate-300 font-normal truncate">{visitor.company}</p>
            )}
          </div>
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-white/55 dark:bg-slate-900/45 backdrop-blur-md border border-white/80 dark:border-slate-700/70">
            <div className="flex items-center gap-1.5 text-black/65 dark:text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" strokeWidth={1.6} />
              <span className="text-[11px] font-medium">Arrival Time</span>
            </div>
            <p className="font-medium text-black dark:text-white truncate">{formatDate(visitor.arrivedAt)}</p>
          </div>

          <div className="p-2.5 rounded-xl bg-white/55 dark:bg-slate-900/45 backdrop-blur-md border border-white/80 dark:border-slate-700/70">
            <div className="flex items-center gap-1.5 text-black/65 dark:text-slate-400 mb-1">
              <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" strokeWidth={1.6} />
              <span className="text-[11px] font-medium">Contact</span>
            </div>
            <p className="font-medium text-black dark:text-white truncate">{visitor.phone || 'Not provided'}</p>
          </div>

          <div className="p-2.5 rounded-xl bg-white/55 dark:bg-slate-900/45 backdrop-blur-md border border-white/80 dark:border-slate-700/70">
            <div className="flex items-center gap-1.5 text-black/65 dark:text-slate-400 mb-1">
              <Car className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" strokeWidth={1.6} />
              <span className="text-[11px] font-medium">Transport</span>
            </div>
            <p className="font-mono font-medium text-black dark:text-white truncate">{visitor.vehicleNumber || 'Walk-in'}</p>
          </div>

          <div className="p-2.5 rounded-xl bg-white/55 dark:bg-slate-900/45 backdrop-blur-md border border-white/80 dark:border-slate-700/70">
            <div className="flex items-center gap-1.5 text-black/65 dark:text-slate-400 mb-1">
              <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" strokeWidth={1.6} />
              <span className="text-[11px] font-medium">Gate</span>
            </div>
            <p className="font-medium text-black dark:text-white truncate">{visitor.gateNumber || 'Gate 1'}</p>
          </div>
        </div>

        {/* Purpose */}
        <div className="p-3 rounded-xl bg-white/55 dark:bg-slate-900/45 backdrop-blur-md border border-white/80 dark:border-slate-700/70 text-xs">
          <p className="text-[11px] font-medium text-black/65 dark:text-slate-400 mb-0.5">Visit Purpose / Guard Notes</p>
          <p className="text-black dark:text-white font-normal leading-relaxed">
            {visitor.purpose || 'Standard flat visitor delivery/check-in.'}
          </p>
        </div>

        {/* Parcel Note */}
        {visitor.itemsToLeave && (
          <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/35 backdrop-blur-md border border-blue-200/70 dark:border-sky-700/50 text-xs">
            <div className="flex items-center gap-2 text-blue-700 dark:text-sky-400 font-medium mb-0.5">
              <Package className="w-3.5 h-3.5" strokeWidth={1.6} />
              <span>Parcel / Package</span>
            </div>
            <p className="text-black dark:text-white">{visitor.itemsToLeave}</p>
          </div>
        )}

        {/* Frosted Glass Icon-Only Action Bar */}
        {visitor.status === 'Pending' && onActionClick && (
          <div className="pt-2.5 border-t border-blue-200/55 dark:border-slate-700/70">
            <div className="grid grid-cols-2 gap-2.5 p-1.5 rounded-2xl bg-blue-50/45 dark:bg-slate-800/55 backdrop-blur-md border border-white/85 dark:border-slate-700/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <button
                type="button"
                onClick={() => onActionClick('Rejected')}
                title="Reject Entry"
                aria-label="Reject Entry"
                className="h-11 rounded-xl bg-white/65 dark:bg-slate-900/55 backdrop-blur-md border border-rose-200/80 dark:border-rose-700/60 text-rose-600 dark:text-rose-300 shadow-[0_6px_16px_-4px_rgba(244,63,94,0.16),inset_0_1px_0_rgba(255,255,255,0.95)] hover:bg-rose-50/90 dark:hover:bg-rose-950/60 hover:border-rose-300 inline-flex items-center justify-center active:scale-[0.98] transition-all"
              >
                <X className="w-5 h-5" strokeWidth={1.9} />
              </button>

              <button
                type="button"
                onClick={() => onActionClick('Approved')}
                title="Approve Entry"
                aria-label="Approve Entry"
                className="h-11 rounded-xl bg-gradient-to-br from-blue-600/85 via-blue-500/80 to-sky-500/85 dark:from-blue-600/85 dark:to-sky-500/80 backdrop-blur-md border border-white/75 dark:border-sky-300/45 text-white shadow-[0_8px_20px_-4px_rgba(37,99,235,0.35),inset_0_1px_0_rgba(255,255,255,0.65)] hover:from-blue-600 hover:to-sky-500 inline-flex items-center justify-center active:scale-[0.98] transition-all"
              >
                <Check className="w-5 h-5" strokeWidth={2.2} />
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>

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
