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
    'Food Delivery': 'primary',
    Friends: 'info',
    'Service Technician': 'gold',
    Other: 'neutral'
  };

  const statusBadges = {
    Pending: { variant: 'primary', label: 'Pending Approval' },
    Approved: { variant: 'success', label: 'Entry Approved' },
    'Leave at Gate': { variant: 'gold', label: 'Left at Gate' },
    Rejected: { variant: 'danger', label: 'Entry Denied' },
    Completed: { variant: 'neutral', label: 'Completed' }
  };

  const statusInfo = statusBadges[visitor.status] || { variant: 'neutral', label: visitor.status };

  return (
    <div
      className={`glass-card rounded-2xl border transition-all duration-200 overflow-hidden ${
        isPending
          ? 'border-blue-400 ring-2 ring-blue-100/80 shadow-md'
          : 'border-white/80 hover:border-blue-200'
      }`}
    >
      <div className="p-3.5 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          {/* Avatar and basic info */}
          <div className="flex items-start gap-3 sm:gap-3.5 min-w-0">
            <img
              src={visitor.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
              alt={visitor.name}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover ring-2 ring-blue-100 shadow-xs shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h4 className="font-bold text-blue-950 text-sm truncate">{visitor.name}</h4>
                <Badge variant={categoryVariants[visitor.category] || 'neutral'} size="sm">
                  {visitor.category}
                </Badge>
              </div>

              <p className="text-xs text-slate-500 mt-0.5 truncate">
                {visitor.purpose || visitor.company || 'Visitor to Flat 1204'}
              </p>

              <div className="flex items-center gap-2.5 sm:gap-3 mt-2 text-[11px] text-slate-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-500" />
                  {getTimeAgo(visitor.arrivedAt)}
                </span>
                {visitor.vehicleNumber && visitor.vehicleNumber !== 'None (Walk-in)' && (
                  <span className="flex items-center gap-1 font-mono font-bold text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                    <Car className="w-3 h-3 text-blue-500" />
                    {visitor.vehicleNumber}
                  </span>
                )}
                <span className="hidden sm:flex items-center gap-1">
                  <Shield className="w-3 h-3 text-blue-500" />
                  {visitor.gateNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="shrink-0">
            <Badge variant={statusInfo.variant} size="md">
              {isPending && <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-ping"></span>}
              {statusInfo.label}
            </Badge>
          </div>
        </div>

        {/* Parcel/Item Note if applicable */}
        {visitor.itemsToLeave && isPending && (
          <div className="mt-3 p-2 rounded-xl bg-blue-50/80 border border-blue-200/80 flex items-center gap-2 text-xs text-blue-950">
            <Package className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Items to drop: <strong>{visitor.itemsToLeave}</strong></span>
          </div>
        )}

        {/* Decision audit info for already-processed records */}
        {!isPending && (
          <div className="mt-3 p-2.5 rounded-xl bg-blue-50/40 border border-blue-100/60 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5 min-w-0 pr-2">
              {visitor.status === 'Approved' ? (
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              ) : visitor.status === 'Rejected' ? (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <PackageCheck className="w-4 h-4 text-sky-600 shrink-0" />
              )}
              <span className="truncate">
                Decided by <strong className="text-blue-950">{visitor.decisionBy || 'Resident'}</strong>
                {visitor.decidedAt && ` • ${formatDate(visitor.decidedAt)}`}
              </span>
            </div>
            <button
              onClick={() => onInspect(visitor)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline shrink-0"
            >
              Details
            </button>
          </div>
        )}
      </div>

      {/* Action footer for pending visitors - Mobile Friendly Responsive Buttons */}
      {isPending && (
        <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-blue-50/50 border-t border-blue-100/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          <button
            onClick={() => onInspect(visitor)}
            className="text-xs font-bold text-slate-600 hover:text-blue-600 inline-flex items-center justify-center gap-1 py-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>

          <div className="grid grid-cols-3 gap-1.5 sm:flex sm:items-center sm:gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={Check}
              onClick={() => onDecision(visitor, 'Approved')}
              className="text-xs px-2 sm:px-3 py-1.5"
            >
              Approve
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={Package}
              onClick={() => onDecision(visitor, 'Leave at Gate')}
              className="text-xs px-2 sm:px-3 py-1.5"
            >
              At Gate
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={X}
              onClick={() => onDecision(visitor, 'Rejected')}
              className="text-xs px-2 sm:px-3 py-1.5"
            >
              Reject
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
