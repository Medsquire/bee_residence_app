import React from 'react';
import { Plus } from 'lucide-react';

/**
 * Compact frosted-glass "+" icon-only button for page headers and empty states.
 */
export default function AddIconButton({ onClick, label = 'Add', className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600/90 via-blue-500/85 to-sky-500/90 dark:from-blue-600/85 dark:to-sky-500/80 backdrop-blur-md border border-white/75 dark:border-sky-300/45 text-white shadow-[0_8px_18px_-4px_rgba(37,99,235,0.32),inset_0_1px_0_rgba(255,255,255,0.65)] flex items-center justify-center hover:from-blue-600 hover:to-sky-500 active:scale-95 transition-all shrink-0 cursor-pointer ${className}`}
    >
      <Plus className="w-4 h-4 sm:w-[18px] sm:h-[18px]" strokeWidth={2} />
    </button>
  );
}

