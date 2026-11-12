import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
  showClose = true
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-[6px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
        <div
          className={`w-full ${maxWidth} transform overflow-hidden rounded-3xl glass-modal text-left align-middle transition-all my-4 sm:my-8`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showClose) && (
            <div className="flex items-center justify-between border-b border-white/55 dark:border-slate-700/60 px-4 sm:px-6 py-3 sm:py-3.5 bg-white/25 dark:bg-slate-800/30">
              <div className="pr-4 min-w-0">
                {title && <h3 className="text-base sm:text-lg font-medium text-black dark:text-white truncate">{title}</h3>}
                {subtitle && <p className="text-xs text-black/75 dark:text-slate-300 mt-0.5 truncate">{subtitle}</p>}
              </div>
              {showClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl p-1.5 sm:p-2 text-black/70 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 transition-colors shrink-0"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" strokeWidth={1.6} />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="px-4 sm:px-6 py-3.5 sm:py-4 max-h-[calc(88vh-96px)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
