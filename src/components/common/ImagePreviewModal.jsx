import React, { useEffect } from 'react';
import { X } from 'lucide-react';

function getFullImageUrl(src) {
  if (!src) return '';
  if (src.includes('images.unsplash.com')) {
    return src.replace(/([?&])w=\d+/, '$1w=1200');
  }
  return src;
}

/**
 * Frosted glass lightbox modal for viewing a clicked thumbnail image in full size.
 */
export default function ImagePreviewModal({ isOpen, onClose, src, alt = 'Image Preview', subtitle }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !src) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6">
      {/* Blurred backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/55 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Frosted Glass Image Frame */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={alt}
        className="relative z-10 w-full max-w-md sm:max-w-lg rounded-3xl glass-modal p-2.5 sm:p-3 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with caption & close icon */}
        <div className="flex items-center justify-between gap-3 px-2 pb-2 pt-0.5">
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-black dark:text-white truncate">{alt}</h4>
            {subtitle && (
              <p className="text-[11px] font-normal text-blue-600 dark:text-sky-400 truncate">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close"
            aria-label="Close image preview"
            className="w-8 h-8 rounded-xl bg-white/70 dark:bg-slate-900/65 backdrop-blur-md border border-white/85 dark:border-slate-700 text-black dark:text-white hover:text-rose-600 dark:hover:text-rose-400 inline-flex items-center justify-center shrink-0 active:scale-95 transition-all"
          >
            <X className="w-4 h-4" strokeWidth={1.8} />
          </button>
        </div>

        {/* Full image container */}
        <div className="rounded-2xl overflow-hidden bg-slate-950/10 dark:bg-slate-950/50 border border-white/60 dark:border-slate-700/70 flex items-center justify-center">
          <img
            src={getFullImageUrl(src)}
            alt={alt}
            className="w-full max-h-[72vh] object-contain"
          />
        </div>
      </div>
    </div>
  );
}

