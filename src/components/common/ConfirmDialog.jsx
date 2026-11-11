import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'warning' | 'primary'
  loading = false
}) {
  const icons = {
    danger: <AlertCircle className="w-6 h-6 text-rose-600" />,
    warning: <AlertTriangle className="w-6 h-6 text-blue-600" />,
    primary: <Info className="w-6 h-6 text-blue-600" />
  };

  const buttonVariants = {
    danger: 'danger',
    warning: 'primary',
    primary: 'primary'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div className="shrink-0 p-3 rounded-2xl bg-blue-50/80 border border-blue-100">
          {icons[variant] || icons.danger}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-bold text-blue-950">{title}</h4>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2.5 pt-3 border-t border-blue-100/70">
        <Button variant="secondary" size="md" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          variant={buttonVariants[variant] || 'danger'}
          size="md"
          onClick={onConfirm}
          loading={loading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
