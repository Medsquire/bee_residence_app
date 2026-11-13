import React, { useState } from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import ImagePreviewModal from '../common/ImagePreviewModal';
import { formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useHousehold } from '../../context/HouseholdContext';
import { useToast } from '../../context/ToastContext';
import {
  Clock,
  Calendar,
  Phone,
  CheckCircle2,
  XCircle,
  Star,
  X,
  Camera
} from 'lucide-react';

const STATUS_STEPS = ['Pending', 'Approved', 'Scheduled', 'In Progress', 'Completed'];

export default function ServiceDetailsModal({ ticket, isOpen, onClose }) {
  const { currentUser } = useAuth();
  const { cancelServiceRequest } = useHousehold();
  const { addToast } = useToast();
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  if (!ticket) return null;

  const isCancelled = ticket.status === 'Cancelled';
  const currentStepIndex = STATUS_STEPS.indexOf(ticket.status);

  const urgencyVariants = {
    Urgent: 'danger',
    High: 'primary',
    Normal: 'neutral',
    'Can Wait': 'neutral'
  };

  const handleCancel = () => {
    cancelServiceRequest(ticket.id, currentUser);
    addToast({
      title: 'Service Request Cancelled',
      message: `Ticket ${ticket.id} was marked as Cancelled.`,
      type: 'info'
    });
    onClose();
  };

  return (
    <>
      <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Service Ticket: ${ticket.id}`}
      subtitle={`Created on ${formatDate(ticket.createdAt)}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-3.5 sm:space-y-4">
        {/* Top Summary Banner */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/65 dark:bg-slate-800/75 border border-white/85 dark:border-slate-700/75 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <Badge variant="info" size="sm">
              {ticket.category}
            </Badge>
            <div className="flex items-center gap-1.5">
              <Badge variant={urgencyVariants[ticket.urgency] || 'neutral'} size="sm">
                Urgency: {ticket.urgency}
              </Badge>
              <Badge
                variant={
                  ticket.status === 'Completed'
                    ? 'success'
                    : ticket.status === 'Cancelled'
                    ? 'danger'
                    : 'primary'
                }
                size="sm"
              >
                {ticket.status}
              </Badge>
            </div>
          </div>
          <h4 className="text-sm sm:text-base font-medium text-black dark:text-white">{ticket.title}</h4>
          <p className="text-xs text-black/75 dark:text-slate-300 mt-1 leading-relaxed">{ticket.description}</p>
        </div>

        {/* Attached Photos Gallery if available */}
        {ticket.photos && ticket.photos.length > 0 && (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/65 dark:bg-slate-800/75 border border-white/85 dark:border-slate-700/75 shadow-xs">
            <p className="text-[11px] font-medium text-black/70 dark:text-slate-300 uppercase tracking-wider mb-2.5">
              Attached Photos ({ticket.photos.length})
            </p>
            <div className="flex items-center gap-2.5 flex-wrap">
              {ticket.photos.map((photo, idx) => (
                <div
                  key={idx}
                  className="relative group w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-white/80 dark:border-slate-600 shadow-xs shrink-0 cursor-pointer"
                  onClick={() => setSelectedPhoto(photo)}
                  title="Click to view full photo"
                >
                  <img
                    src={photo}
                    alt={`Attached issue photo ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] text-white font-medium bg-black/60 px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                      View
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lifecycle Visual Timeline */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/65 dark:bg-slate-800/75 border border-white/85 dark:border-slate-700/75 shadow-xs overflow-x-auto no-scrollbar">
          <p className="text-[11px] font-medium text-black/70 dark:text-slate-300 mb-2.5 uppercase tracking-wider">
            Service Request Lifecycle
          </p>

          {!isCancelled ? (
            <div className="relative flex items-center justify-between min-w-[320px] px-2 py-2">
              {/* Connecting line */}
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-blue-100 dark:bg-slate-700 z-0" />
              <div
                className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-blue-600 dark:bg-sky-400 z-0 transition-all duration-300"
                style={{
                  width: `${Math.max(0, (currentStepIndex / (STATUS_STEPS.length - 1)) * 88)}%`
                }}
              />

              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-medium text-xs transition-all ${
                        isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-sky-900/50 shadow-md'
                          : isPassed
                          ? 'bg-blue-800 dark:bg-sky-600 text-white'
                          : 'bg-white/90 dark:bg-slate-900 text-black/45 dark:text-slate-400 border border-blue-100 dark:border-slate-700'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] mt-1.5 font-medium text-center whitespace-nowrap ${
                        isCurrent
                          ? 'text-blue-700 dark:text-sky-300'
                          : isPassed
                          ? 'text-black dark:text-white'
                          : 'text-black/45 dark:text-slate-400'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-rose-50/90 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-700/70 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-200 font-medium">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>This request was cancelled. No technician will be dispatched.</span>
            </div>
          )}
        </div>

        {/* Schedule & Availability comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/65 dark:bg-slate-800/75 border border-white/85 dark:border-slate-700/75 shadow-xs">
            <span className="font-medium text-black/55 dark:text-slate-400 uppercase tracking-wider text-[10px] block mb-1.5">
              Resident Preferred Slot
            </span>
            <div className="flex items-center gap-2 text-black dark:text-white font-medium">
              <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" strokeWidth={1.6} />
              <span>{ticket.preferredDate || 'Flexible'}</span>
            </div>
            <div className="flex items-center gap-2 text-black dark:text-white font-medium mt-1">
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" strokeWidth={1.6} />
              <span>{ticket.preferredTimeSlot}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/65 dark:bg-slate-800/75 border border-white/85 dark:border-slate-700/75 shadow-xs">
            <span className="font-medium text-black/55 dark:text-slate-400 uppercase tracking-wider text-[10px] block mb-1.5">
              Confirmed Appointment
            </span>
            {ticket.confirmedDate ? (
              <>
                <div className="flex items-center gap-2 text-blue-700 dark:text-sky-300 font-medium">
                  <Calendar className="w-3.5 h-3.5" strokeWidth={1.6} />
                  <span>{ticket.confirmedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-700 dark:text-sky-300 font-medium mt-1">
                  <Clock className="w-3.5 h-3.5" strokeWidth={1.6} />
                  <span>{ticket.confirmedTimeSlot}</span>
                </div>
              </>
            ) : (
              <p className="text-black/55 dark:text-slate-400 italic">Pending estate desk confirmation</p>
            )}
          </div>
        </div>

        {/* Technician Card if assigned */}
        {ticket.technician && (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50/75 dark:bg-slate-800/80 border border-blue-200/75 dark:border-slate-700/75">
            <p className="text-[10px] font-medium text-blue-700 dark:text-sky-300 uppercase tracking-wider mb-2">
              Assigned Authorized Technician
            </p>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center font-medium text-sm shadow-xs">
                  {ticket.technician.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h5 className="font-medium text-black dark:text-white text-xs sm:text-sm">
                    {ticket.technician.name}
                  </h5>
                  <p className="text-[11px] text-black/65 dark:text-slate-300">{ticket.technician.agency}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs font-medium text-blue-700 dark:text-sky-300 justify-end">
                  <Star className="w-3.5 h-3.5 fill-current text-sky-500" />
                  <span>{ticket.technician.rating} / 5.0</span>
                </div>
                <a
                  href={`tel:${ticket.technician.phone}`}
                  className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-sky-400 hover:underline"
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
            <p className="text-[11px] font-medium text-black/70 dark:text-slate-300 uppercase tracking-wider mb-2">
              Status History & Activity
            </p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {ticket.history.map((h, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between text-xs p-2.5 rounded-xl bg-white/65 dark:bg-slate-800/75 border border-white/85 dark:border-slate-700/75 shadow-xs"
                >
                  <div>
                    <span className="font-medium text-black dark:text-white">{h.status}:</span>{' '}
                    <span className="text-black/75 dark:text-slate-300">{h.note}</span>
                  </div>
                  <span className="text-[10px] text-black/50 dark:text-slate-400 shrink-0 ml-2">
                    {formatDate(h.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions: Frosted Glass Cards */}
        <div className="pt-3 border-t border-blue-100/70 dark:border-slate-700/70">
          <div className="flex items-center justify-end gap-2.5 p-1.5 rounded-2xl bg-blue-50/45 dark:bg-slate-800/55 backdrop-blur-md border border-white/85 dark:border-slate-700/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            {!['Completed', 'Cancelled'].includes(ticket.status) && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 h-10 px-3.5 rounded-xl bg-white/65 dark:bg-slate-900/55 backdrop-blur-md border border-rose-200/80 dark:border-rose-700/60 text-rose-600 dark:text-rose-300 shadow-[0_6px_16px_-4px_rgba(244,63,94,0.16),inset_0_1px_0_rgba(255,255,255,0.95)] hover:bg-rose-50/90 dark:hover:bg-rose-950/60 text-xs font-medium inline-flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
              >
                <XCircle className="w-4 h-4" strokeWidth={1.7} />
                <span>Cancel Request</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              title="Close"
              className="flex-1 h-10 px-3.5 rounded-xl bg-white/75 dark:bg-slate-800/80 backdrop-blur-md border border-white/90 dark:border-slate-600/70 text-black dark:text-white shadow-xs hover:bg-white dark:hover:bg-slate-700 text-xs font-medium inline-flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" strokeWidth={1.8} />
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>

    {/* Lightbox Preview Modal for attached photos */}
    <ImagePreviewModal
      isOpen={!!selectedPhoto}
      onClose={() => setSelectedPhoto(null)}
      src={selectedPhoto}
      alt="Attached Issue Photo"
      subtitle={ticket.title}
    />
  </>
);
}
