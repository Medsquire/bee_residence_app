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
      bgColor: 'bg-emerald-50',
      buttonVariant: 'success',
      buttonText: 'Confirm Entry Approval',
      defaultNote: 'Authorized for Flat 1204 entry',
      description: `Gate security will permit ${visitor.name} to enter the premises and proceed to Tower A, Flat 1204.`
    },
    Rejected: {
      title: 'Reject Visitor Entry',
      icon: ShieldAlert,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      buttonVariant: 'danger',
      buttonText: 'Confirm Rejection',
      defaultNote: 'Resident denied entry',
      description: `Security will turn away ${visitor.name} at the gate. No access granted.`
    },
    'Leave at Gate': {
      title: 'Instruct Security: Leave at Gate',
      icon: PackageCheck,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      buttonVariant: 'warning',
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
        <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className={`p-2.5 rounded-xl ${config.bgColor} ${config.color} shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-navy-900 text-sm">{visitor.name}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{config.description}</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1">
            Note to Gate Security (Optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={config.defaultNote}
            className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bee-500 focus:border-bee-500"
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
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
