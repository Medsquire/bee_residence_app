import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { ShieldCheck, ShieldAlert, PackageCheck } from 'lucide-react';

export default function VisitorDecisionModal({
  isOpen,
  onClose,
  visitor,
  decision, // 'Approved' | 'Rejected' | 'Leave at Gate'
  onConfirm
}) {
  const [note, setNote] = useState('');

  if (!visitor || !decision) return null;

  const decisionConfig = {
    Approved: {
      title: 'Approve Visitor Entry',
      icon: ShieldCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-200',
      buttonVariant: 'success',
      buttonText: 'Confirm Entry Approval',
      defaultNote: 'Authorized for Flat 1204 entry',
      description: `Gate security will permit ${visitor.name} to enter the premises and proceed to Tower A, Flat 1204.`
    },
    Rejected: {
      title: 'Reject Visitor Entry',
      icon: ShieldAlert,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50 border-rose-200',
      buttonVariant: 'danger',
      buttonText: 'Confirm Rejection',
      defaultNote: 'Resident denied entry',
      description: `Security will turn away ${visitor.name} at the gate. No access granted.`
    },
    'Leave at Gate': {
      title: 'Instruct Security: Leave at Gate',
      icon: PackageCheck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
      buttonVariant: 'primary',
      buttonText: 'Instruct Gate Security',
      defaultNote: 'Please keep packages at Tower A lobby desk',
      description: `Security will accept ${visitor.itemsToLeave || 'parcels'} at the lobby/gate. Delivery person will not go upstairs.`
    }
  };

  const config = decisionConfig[decision] || decisionConfig.Approved;
  const Icon = config.icon;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(visitor.id, decision, note || config.defaultNote);
    setNote('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={config.title} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/80 border border-blue-100 shadow-xs">
          <div className={`p-2.5 rounded-xl ${config.bgColor} ${config.color} shrink-0 border`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h4 className="font-bold text-blue-950 text-sm">{visitor.name}</h4>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{config.description}</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-blue-950 mb-1">
            Note to Gate Security (Optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={config.defaultNote}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm glass-input rounded-xl focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-blue-100">
          <Button variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant={config.buttonVariant} size="md" type="submit">
            {config.buttonText}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
