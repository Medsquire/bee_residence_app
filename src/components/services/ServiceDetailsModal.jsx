import React from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useHousehold } from '../../context/HouseholdContext';
import { useToast } from '../../context/ToastContext';
import {
  Wrench,
  Clock,
  Calendar,
  UserCheck,
  Phone,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Star,
  Building
} from 'lucide-react';

const STATUS_STEPS = ['Pending', 'Approved', 'Scheduled', 'In Progress', 'Completed'];

export default function ServiceDetailsModal({ ticket, isOpen, onClose }) {
  const { currentUser } = useAuth();
  const { cancelServiceRequest, advanceServiceStatus } = useHousehold();
  const { addToast } = useToast();

  if (!ticket) return null;

  const isCancelled = ticket.status === 'Cancelled';
  const currentStepIndex = STATUS_STEPS.indexOf(ticket.status);

  const urgencyVariants = {
    Urgent: 'danger',
    High: 'warning',
    Normal: 'neutral',
    'Can Wait': 'neutral'
  };

  const handleCancel = () => {
    if (window.confirm(`Are you sure you want to cancel ticket ${ticket.id}?`)) {
      cancelServiceRequest(ticket.id, currentUser);
      addToast({
        title: 'Service Request Cancelled',
        message: `Ticket ${ticket.id} was marked as Cancelled.`,
        type: 'info'
      });
      onClose();
    }
  };

  const handleSimulateNextStep = () => {
    advanceServiceStatus(ticket.id);
    addToast({
      title: 'Technician Status Advanced',
      message: `Simulated next milestone for ${ticket.id}.`,
      type: 'success'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Service Ticket: ${ticket.id}`}
      subtitle={`Created on ${formatDate(ticket.createdAt)}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Top Summary Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-bee-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {ticket.category}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant={urgencyVariants[ticket.urgency] || 'neutral'} size="sm">
                Urgency: {ticket.urgency}
              </Badge>
              <Badge
                variant={
                  ticket.status === 'Completed'
                    ? 'success'
                    : ticket.status === 'Cancelled'
                    ? 'danger'
                    : 'warning'
                }
                size="md"
              >
                {ticket.status}
              </Badge>
            </div>
          </div>
          <h4 className="text-base font-bold text-navy-900">{ticket.title}</h4>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ticket.description}</p>
        </div>

        {/* Lifecycle Visual Timeline */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-navy-900 mb-3 uppercase tracking-wider">
            Service Request Lifecycle
          </p>

          {!isCancelled ? (
            <div className="relative flex items-center justify-between">
              {/* Connecting line */}
              <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
              <div
                className="absolute left-4 top-1/2 -translate-y-1/2 h-0.5 bg-bee-500 z-0 transition-all duration-300"
                style={{
                  width: `${Math.max(0, (currentStepIndex / (STATUS_STEPS.length - 1)) * 92)}%`
                }}
              />

              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isCurrent
                          ? 'bg-bee-500 text-navy-950 ring-4 ring-bee-100 shadow-md'
                          : isPassed
                          ? 'bg-navy-900 text-white'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] mt-1.5 font-semibold text-center whitespace-nowrap ${
                        isCurrent ? 'text-bee-700 font-bold' : isPassed ? 'text-navy-900' : 'text-slate-400'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 font-semibold">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>This request was cancelled. No technician will be dispatched.</span>
            </div>
          )}
        </div>

        {/* Schedule & Availability comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
              Resident Preferred Slot
            </span>
            <div className="flex items-center gap-2 text-slate-800 font-medium">
              <Calendar className="w-3.5 h-3.5 text-bee-600" />
              <span>{ticket.preferredDate || 'Flexible'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-medium mt-1">
              <Clock className="w-3.5 h-3.5 text-bee-600" />
              <span>{ticket.preferredTimeSlot}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
              Confirmed Appointment
            </span>
            {ticket.confirmedDate ? (
              <>
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{ticket.confirmedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700 font-bold mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{ticket.confirmedTimeSlot}</span>
                </div>
              </>
            ) : (
              <p className="text-slate-400 italic">Pending estate desk confirmation</p>
            )}
          </div>
        </div>

        {/* Technician Card if assigned */}
        {ticket.technician && (
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <p className="text-[10px] font-bold text-amber-900 uppercase tracking-wider mb-2">
              Assigned Authorized Technician
            </p>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center font-bold text-sm">
                  {ticket.technician.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h5 className="font-bold text-navy-900 text-xs sm:text-sm">
                    {ticket.technician.name}
                  </h5>
                  <p className="text-[11px] text-slate-500">{ticket.technician.agency}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs font-bold text-amber-700">
                  <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                  <span>{ticket.technician.rating} / 5.0</span>
                </div>
                <a
                  href={`tel:${ticket.technician.phone}`}
                  className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-navy-900 hover:text-bee-600"
                >
                  <Phone className="w-3 h-3" />
                  <span>{ticket.technician.phone}</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Audit Trail History */}
        {ticket.history && ticket.history.length > 0 && (
          <div>
            <p className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
              Status History & Activity
            </p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {ticket.history.map((h, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div>
                    <span className="font-bold text-navy-900">{h.status}:</span>{' '}
                    <span className="text-slate-600">{h.note}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                    {formatDate(h.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-4 border-t border-slate-100">
          {/* Demo simulation shortcut */}
          {!['Completed', 'Cancelled'].includes(ticket.status) && (
            <button
              type="button"
              onClick={handleSimulateNextStep}
              className="text-xs font-bold text-bee-700 hover:text-bee-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors"
            >
              Simulate Next Status Step
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {!['Completed', 'Cancelled'].includes(ticket.status) && (
              <Button variant="danger" size="md" onClick={handleCancel}>
                Cancel Request
              </Button>
            )}
            <Button variant="secondary" size="md" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
