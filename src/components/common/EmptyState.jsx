import React from 'react';
import Button from './Button';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 ${className}`}>
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-bee-600 flex items-center justify-center mb-4 ring-8 ring-amber-50/50">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-base sm:text-lg font-bold text-navy-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-slate-500 max-w-md leading-relaxed">{description}</p>
      )}
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button variant="gold" icon={actionIcon} onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
