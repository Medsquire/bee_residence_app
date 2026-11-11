import React from 'react';

export default function Badge({ children, variant = 'neutral', size = 'md', className = '' }) {
  const variantStyles = {
    neutral: 'bg-white/80 text-slate-700 border-slate-200/90 shadow-xs backdrop-blur-xs',
    primary: 'bg-blue-50/90 text-blue-700 border-blue-200 font-bold shadow-xs backdrop-blur-xs',
    gold: 'bg-sky-50/90 text-sky-800 border-sky-200 font-bold shadow-xs backdrop-blur-xs',
    success: 'bg-emerald-50/90 text-emerald-700 border-emerald-200 font-semibold shadow-xs',
    warning: 'bg-blue-100/80 text-blue-900 border-blue-300 font-bold shadow-xs',
    danger: 'bg-rose-50/90 text-rose-700 border-rose-200 font-semibold shadow-xs',
    info: 'bg-sky-50/90 text-sky-700 border-sky-200 font-semibold shadow-xs',
    purple: 'bg-indigo-50/90 text-indigo-700 border-indigo-200 font-semibold shadow-xs'
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${variantStyles[variant] || variantStyles.neutral} ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {children}
    </span>
  );
}
