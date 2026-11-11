import React from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatDate, formatTime } from '../../utils/formatters';
import {
  User,
  Phone,
  Car,
  Shield,
  Clock,
  Package,
  Building,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Check,
  X
} from 'lucide-react';

export default function VisitorDetailsModal({ visitor, isOpen, onClose, onActionClick }) {
  if (!visitor) return null;

  const statusVariants = {
    Pending: 'primary',
    Approved: 'success',
    'Leave at Gate': 'gold',
    Rejected: 'danger',
    Completed: 'neutral'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Visitor Entry Details" maxWidth="max-w-lg">
      <div className="space-y-4 sm:space-y-5">
        {/* Visitor Profile Header */}
        <div className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
          <img
            src={visitor.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
            alt={visitor.name}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover ring-2 ring-white shadow-xs shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-bold text-blue-950 text-sm sm:text-base truncate">{visitor.name}</h4>
              <Badge variant={statusVariants[visitor.status] || 'neutral'}>
                {visitor.status}
              </Badge>
            </div>
            <p className="text-xs font-bold text-blue-600 mt-0.5">{visitor.category}</p>
            {visitor.company && (
              <p className="text-xs text-slate-500 font-medium">{visitor.company}</p>
            )}
          </div>
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/80 border border-blue-100 shadow-xs">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-semibold text-slate-600">Arrival Time</span>
            </div>
            <p className="font-bold text-blue-950">{formatDate(visitor.arrivedAt)}</p>
          </div>

          <div className="p-3 rounded-xl bg-white/80 border border-blue-100 shadow-xs">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-semibold text-slate-600">Visitor Contact</span>
            </div>
            <p className="font-bold text-blue-950">{visitor.phone || 'Not provided'}</p>
          </div>

          <div className="p-3 rounded-xl bg-white/80 border border-blue-100 shadow-xs">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Car className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-semibold text-slate-600">Vehicle / Transport</span>
            </div>
            <p className="font-bold text-blue-950">{visitor.vehicleNumber || 'Walk-in'}</p>
          </div>

          <div className="p-3 rounded-xl bg-white/80 border border-blue-100 shadow-xs">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-semibold text-slate-600">Check-in Point</span>
            </div>
            <p className="font-bold text-blue-950">{visitor.gateNumber || 'Gate 1'}</p>
          </div>
        </div>

        {/* Purpose */}
        <div className="p-3.5 rounded-xl bg-white/80 border border-blue-100 shadow-xs text-xs">
          <p className="font-bold text-slate-500 mb-1">Visit Purpose / Guard Notes</p>
          <p className="text-blue-950 font-medium leading-relaxed">
            {visitor.purpose || 'Standard flat visitor delivery/check-in.'}
          </p>
        </div>

        {/* Parcel Note */}
        {visitor.itemsToLeave && (
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs">
            <div className="flex items-center gap-2 text-blue-900 font-bold mb-0.5">
              <Package className="w-4 h-4 text-blue-600" />
              <span>Parcel / Package Instruction</span>
            </div>
            <p className="text-blue-950">{visitor.itemsToLeave}</p>
          </div>
        )}

        {/* Actions for Pending Visitor */}
        {visitor.status === 'Pending' && onActionClick && (
          <div className="pt-2 border-t border-blue-100 flex flex-col sm:flex-row items-center justify-end gap-2">
            <Button
              variant="danger"
              size="md"
              icon={X}
              onClick={() => onActionClick('Rejected')}
              className="w-full sm:w-auto"
            >
              Reject Entry
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={Package}
              onClick={() => onActionClick('Leave at Gate')}
              className="w-full sm:w-auto"
            >
              Leave at Gate
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={Check}
              onClick={() => onActionClick('Approved')}
              className="w-full sm:w-auto"
            >
              Approve Entry
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
