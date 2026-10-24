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
      <div className="flex items-center gap-2.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          {title}
        </h1>
        {badge}
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
