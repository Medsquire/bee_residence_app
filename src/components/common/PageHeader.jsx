import React from 'react';

export default function PageHeader({
  title,
  subtitle,
  badge,
  action,
  children
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-blue-950 tracking-tight">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">{subtitle}</p>
        )}
      </div>
      {(action || children) && (
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-wrap">
          {action}
          {children}
        </div>
      )}
    </div>
  );
}
