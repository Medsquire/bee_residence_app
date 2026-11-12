import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 focus:ring-blue-500 shadow-md shadow-blue-500/20 border border-blue-400/30',
    gold: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md shadow-blue-500/20',
    secondary: 'bg-white/90 dark:bg-slate-800 backdrop-blur-md text-black dark:text-white border border-blue-200/90 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 hover:border-blue-300 focus:ring-blue-300 shadow-xs',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-sm',
    warning: 'bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-500 shadow-sm',
    ghost: 'bg-transparent text-slate-600 hover:bg-blue-50/80 hover:text-blue-700 focus:ring-blue-200',
    outline: 'border border-blue-300 text-blue-700 hover:bg-blue-50/80 focus:ring-blue-300'
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[34px]',
    md: 'text-sm px-4 py-2 gap-2 min-h-[42px]',
    lg: 'text-base px-5 py-2.5 gap-2.5 min-h-[46px]'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`}
      {...props}
    >
      {loading && (
        <Loader2 className="animate-spin -ml-1 mr-1 h-4 w-4 text-current shrink-0" strokeWidth={1.6} />
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" strokeWidth={1.6} />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" strokeWidth={1.6} />}
    </button>
  );
}
