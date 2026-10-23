import React from 'react';

export default function PageHeader({
  title,
  subtitle,
  badge,
  action,
  children
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-500 max-w-2xl">{subtitle}</p>
        )}
      </div>
      {(action || children) && (
        <div className="flex items-center gap-2.5 shrink-0">
          {action}
          {children}
        </div>
      )}
    </div>
  );
}
