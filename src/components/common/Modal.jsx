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
        className="fixed inset-0 bg-blue-950/25 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
        <div
          className={`w-full ${maxWidth} transform overflow-hidden rounded-3xl glass-modal text-left align-middle shadow-glass-lg transition-all border border-white/95 my-4 sm:my-8`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showClose) && (
            <div className="flex items-center justify-between border-b border-blue-100/70 px-5 sm:px-6 py-4 bg-blue-50/50">
              <div className="pr-4 min-w-0">
                {title && <h3 className="text-base sm:text-lg font-bold text-blue-950 truncate">{title}</h3>}
                {subtitle && <p className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p>}
              </div>
              {showClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors shrink-0"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="px-5 sm:px-6 py-5 max-h-[calc(88vh-120px)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
