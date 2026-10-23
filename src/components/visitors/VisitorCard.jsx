import React from 'react';
import Badge from '../common/Badge';
import Button from '../common/Button';
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
  Package
} from 'lucide-react';

export default function VisitorCard({ visitor, onInspect, onDecision }) {
  const isPending = visitor.status === 'Pending';

  const categoryVariants = {
    Courier: 'purple',
    'Food Delivery': 'warning',
    Friends: 'info',
    'Service Technician': 'gold',
    Other: 'neutral'
  };

  const statusBadges = {
    Pending: { variant: 'warning', label: 'Pending Approval' },
    Approved: { variant: 'success', label: 'Entry Approved' },
    Rejected: { variant: 'danger', label: 'Entry Denied' },
    Completed: { variant: 'neutral', label: 'Completed' }
  };

  const statusInfo = statusBadges[visitor.status] || { variant: 'neutral', label: visitor.status };

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
        isPending
          ? 'border-amber-300 ring-2 ring-amber-100 shadow-md'
          : 'border-slate-200 hover:border-slate-300 shadow-xs'
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          {/* Avatar and basic info */}
          <div className="flex items-start gap-3.5 min-w-0">
            <img
              src={visitor.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
              alt={visitor.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-navy-900 text-sm truncate">{visitor.name}</h4>
                <Badge variant={categoryVariants[visitor.category] || 'neutral'} size="sm">
                  {visitor.category}
                </Badge>
              </div>

              <p className="text-xs text-slate-500 mt-0.5 truncate">
                {visitor.purpose || visitor.company || 'Visitor to Flat 1204'}
              </p>

              <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {getTimeAgo(visitor.arrivedAt)}
                </span>
                {visitor.vehicleNumber && visitor.vehicleNumber !== 'None (Walk-in)' && (
                  <span className="flex items-center gap-1 font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                    <Car className="w-3 h-3 text-slate-400" />
                    {visitor.vehicleNumber}
                  </span>
                )}
                <span className="hidden sm:flex items-center gap-1">
                  <Shield className="w-3 h-3 text-slate-400" />
                  {visitor.gateNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="shrink-0">
            <Badge variant={statusInfo.variant} size="md">
              {isPending && <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping"></span>}
              {statusInfo.label}
            </Badge>
          </div>
        </div>

        {/* Parcel/Item Note if applicable */}
        {visitor.itemsToLeave && isPending && (
          <div className="mt-3.5 p-2 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-center gap-2 text-xs text-amber-900">
            <Package className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Items to drop: <strong>{visitor.itemsToLeave}</strong></span>
          </div>
        )}

        {/* Decision audit info for already-processed records */}
        {!isPending && (
          <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              {visitor.status === 'Approved' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : visitor.status === 'Rejected' ? (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <PackageCheck className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span className="truncate">
                Decided by <strong className="text-slate-800">{visitor.decisionBy || 'Resident'}</strong>
                {visitor.decidedAt && ` • ${formatDate(visitor.decidedAt)}`}
              </span>
            </div>
            <button
              onClick={() => onInspect(visitor)}
              className="text-xs font-semibold text-navy-800 hover:text-bee-600 hover:underline shrink-0"
            >
              Details
            </button>
          </div>
        )}
      </div>

      {/* Action footer for pending visitors */}
      {isPending && (
        <div className="px-4 py-3 bg-slate-50/90 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => onInspect(visitor)}
            className="text-xs font-bold text-slate-600 hover:text-navy-900 inline-flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>

          <div className="flex items-center gap-2">
            <Button
              variant="warning"
              size="sm"
              icon={Package}
              onClick={() => onDecision(visitor, 'Leave at Gate')}
            >
              Leave at Gate
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={X}
              onClick={() => onDecision(visitor, 'Rejected')}
            >
              Reject
            </Button>
            <Button
              variant="success"
              size="sm"
              icon={Check}
              onClick={() => onDecision(visitor, 'Approved')}
            >
              Approve Entry
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
