import React from 'react';
import { Plus } from 'lucide-react';
import Button from './Button';
import AddIconButton from './AddIconButton';

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
    <div className={`flex flex-col items-center justify-center p-6 sm:p-10 text-center glass-stat-white rounded-3xl border border-dashed border-blue-200/80 dark:border-slate-700/70 ${className}`}>
      {Icon && (
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50/90 dark:bg-slate-800/90 text-blue-600 dark:text-sky-400 flex items-center justify-center mb-3.5 ring-6 ring-blue-50/60 dark:ring-slate-800/40 shadow-xs">
          <Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.6} />
        </div>
      )}
      <h3 className="text-sm sm:text-base font-medium text-black dark:text-white">{title}</h3>
      {description && (
        <p className="mt-1 text-xs sm:text-sm text-black/65 dark:text-slate-300 max-w-md leading-relaxed">
          {description}
        </p>
      )}
      {onAction && (actionLabel || actionIcon) && (
        <div className="mt-4">
          {actionIcon === Plus ? (
            <AddIconButton onClick={onAction} label={actionLabel || 'Add'} />
          ) : (
            <Button variant="primary" icon={actionIcon} onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
