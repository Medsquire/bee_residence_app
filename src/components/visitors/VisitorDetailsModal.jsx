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
  HelpCircle
} from 'lucide-react';

export default function VisitorDetailsModal({ visitor, isOpen, onClose, onActionClick }) {
  if (!visitor) return null;

  const statusVariants = {
    Pending: 'warning',
    Approved: 'success',
    Rejected: 'danger',
    Completed: 'neutral'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Visitor Entry Details" maxWidth="max-w-lg">
      <div className="space-y-5">
        {/* Visitor Profile Header */}
        <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <img
            src={visitor.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
            alt={visitor.name}
            className="w-16 h-16 rounded-xl object-cover ring-2 ring-white shadow-sm shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-bold text-navy-900 text-base truncate">{visitor.name}</h4>
              <Badge variant={statusVariants[visitor.status] || 'neutral'}>
                {visitor.status}
              </Badge>
            </div>
            <p className="text-xs font-semibold text-bee-700 mt-0.5">{visitor.category}</p>
            {visitor.company && (
              <p className="text-xs text-slate-500 font-medium">{visitor.company}</p>
            )}
          </div>
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5 text-bee-600" />
              <span className="font-semibold text-slate-600">Arrival Time</span>
            </div>
            <p className="font-bold text-navy-900">{formatDate(visitor.arrivedAt)}</p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Phone className="w-3.5 h-3.5 text-bee-600" />
              <span className="font-semibold text-slate-600">Visitor Contact</span>
            </div>
            <p className="font-bold text-navy-900">{visitor.phone || 'Not provided'}</p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Car className="w-3.5 h-3.5 text-bee-600" />
              <span className="font-semibold text-slate-600">Vehicle Number</span>
            </div>
            <p className="font-mono font-bold text-navy-900">{visitor.vehicleNumber || 'None (Pedestrian)'}</p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Shield className="w-3.5 h-3.5 text-bee-600" />
              <span className="font-semibold text-slate-600">Gate & Guard</span>
            </div>
            <p className="font-bold text-navy-900">{visitor.gateNumber}</p>
            <p className="text-[11px] text-slate-500 truncate">{visitor.guardName}</p>
          </div>
        </div>

        {/* Purpose & Items */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div>
            <span className="font-semibold text-slate-500">Visit Purpose:</span>
            <p className="text-slate-800 font-medium mt-0.5">{visitor.purpose || 'General Visit'}</p>
          </div>
          {visitor.itemsToLeave && (
            <div className="pt-2 border-t border-slate-200/80">
              <span className="font-semibold text-slate-500">Parcels / Items:</span>
              <p className="text-slate-800 font-medium mt-0.5 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-amber-600" />
                {visitor.itemsToLeave}
              </p>
            </div>
          )}
        </div>

        {/* Decision Status Record */}
        {visitor.status !== 'Pending' && (
          <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              {visitor.status === 'Approved' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : visitor.status === 'Rejected' ? (
                <XCircle className="w-4 h-4 text-rose-600" />
              ) : (
                <Package className="w-4 h-4 text-amber-600" />
              )}
              <span>Decision: {visitor.status}</span>
            </div>
            <p className="text-slate-600 mt-1">
              Authorized by <strong className="text-navy-900">{visitor.decisionBy || 'Household Member'}</strong> on{' '}
              {formatDate(visitor.decidedAt)}.
            </p>
            {visitor.decisionNote && (
              <p className="text-slate-500 italic mt-1 bg-white p-2 rounded-lg border border-slate-200">
                "{visitor.decisionNote}"
              </p>
            )}
          </div>
        )}

        {/* Actions if Pending */}
        {visitor.status === 'Pending' && (
          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100">
            <Button
              variant="success"
              className="flex-1"
              onClick={() => {
                onClose();
                onActionClick('Approved');
              }}
            >
              Approve Entry
            </Button>
            <Button
              variant="warning"
              className="flex-1"
              onClick={() => {
                onClose();
                onActionClick('Leave at Gate');
              }}
            >
              Leave at Gate
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => {
                onClose();
                onActionClick('Rejected');
              }}
            >
              Reject Entry
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
