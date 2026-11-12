import React from 'react';

export default function PageHeader({
  title,
  subtitle,
  badge,
  action,
  inlineAction,
  children
}) {
  return (
    <div className="glass-greeting-card rounded-2xl sm:rounded-3xl px-3.5 py-2.5 sm:px-5 sm:py-3.5 relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-blue-400/15 dark:bg-blue-500/20 blur-2xl pointer-events-none"
      />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3">
        <div className="flex items-center justify-between gap-2.5 flex-1 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
              <h1 className="text-lg sm:text-xl md:text-2xl font-medium text-black dark:text-white tracking-tight truncate">
                {title}
              </h1>
              {badge}
            </div>
            {subtitle && (
              <p className="text-xs sm:text-sm text-black/75 dark:text-slate-300 mt-0.5 font-normal">{subtitle}</p>
            )}
          </div>
          {inlineAction && (
            <div className="shrink-0">
              {inlineAction}
            </div>
          )}
        </div>
        {(action || children) && (
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-wrap">
            {action}
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
