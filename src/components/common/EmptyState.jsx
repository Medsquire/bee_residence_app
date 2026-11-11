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
    <div className={`flex flex-col items-center justify-center p-6 sm:p-12 text-center glass-card rounded-3xl border border-dashed border-blue-200 ${className}`}>
      {Icon && (
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 ring-8 ring-blue-50/60 shadow-xs">
          <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
      )}
      <h3 className="text-base sm:text-lg font-bold text-blue-950">{title}</h3>
      {description && (
        <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">{description}</p>
      )}
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="primary" icon={actionIcon} onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
