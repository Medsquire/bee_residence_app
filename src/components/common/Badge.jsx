import React from 'react';

export default function Badge({ children, variant = 'neutral', size = 'md', className = '' }) {
  const variantStyles = {
    neutral: 'bg-white/90 dark:bg-slate-800 text-black dark:text-white border-slate-200/90 dark:border-slate-700 shadow-xs backdrop-blur-xs',
    primary: 'bg-blue-50/90 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 border-blue-200/80 dark:border-sky-700/60 font-medium shadow-xs backdrop-blur-xs',
    gold: 'bg-sky-50/90 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-200/80 dark:border-sky-700/60 font-medium shadow-xs backdrop-blur-xs',
    success: 'bg-emerald-50/90 dark:bg-emerald-950/55 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-700/60 font-normal shadow-xs',
    warning: 'bg-blue-100/80 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700/60 font-medium shadow-xs',
    danger: 'bg-rose-50/90 dark:bg-rose-950/55 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-700/60 font-normal shadow-xs',
    info: 'bg-sky-50/90 dark:bg-sky-950/55 text-sky-700 dark:text-sky-300 border-sky-200/80 dark:border-sky-700/60 font-normal shadow-xs',
    purple: 'bg-indigo-50/90 dark:bg-indigo-950/55 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-700/60 font-normal shadow-xs'
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-normal rounded-full border ${variantStyles[variant] || variantStyles.neutral} ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {children}
    </span>
  );
}
