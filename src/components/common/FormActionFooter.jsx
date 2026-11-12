import React from 'react';
import { X, Check, Loader2 } from 'lucide-react';

/**
 * Shared frosted-glass icon-only Cancel / Submit action footer for form modals.
 */
export default function FormActionFooter({
  onCancel,
  submitting = false,
  cancelLabel = 'Cancel',
  submitLabel = 'Submit'
}) {
  return (
    <div className="pt-3 border-t border-blue-100/70 dark:border-slate-700/70">
      <div className="grid grid-cols-2 gap-2.5 p-1.5 rounded-2xl bg-blue-50/45 dark:bg-slate-800/55 backdrop-blur-md border border-white/85 dark:border-slate-700/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          title={cancelLabel}
          aria-label={cancelLabel}
          className="h-11 rounded-xl bg-white/65 dark:bg-slate-900/55 backdrop-blur-md border border-rose-200/80 dark:border-rose-700/60 text-rose-600 dark:text-rose-300 shadow-[0_6px_16px_-4px_rgba(244,63,94,0.16),inset_0_1px_0_rgba(255,255,255,0.95)] hover:bg-rose-50/90 dark:hover:bg-rose-950/60 hover:border-rose-300 inline-flex items-center justify-center active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
        >
          <X className="w-5 h-5" strokeWidth={1.9} />
        </button>

        <button
          type="submit"
          disabled={submitting}
          title={submitLabel}
          aria-label={submitLabel}
          className="h-11 rounded-xl bg-gradient-to-br from-blue-600/85 via-blue-500/80 to-sky-500/85 dark:from-blue-600/85 dark:to-sky-500/80 backdrop-blur-md border border-white/75 dark:border-sky-300/45 text-white shadow-[0_8px_20px_-4px_rgba(37,99,235,0.35),inset_0_1px_0_rgba(255,255,255,0.65)] hover:from-blue-600 hover:to-sky-500 inline-flex items-center justify-center active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
        >
          {submitting ? (
            <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />
          ) : (
            <Check className="w-5 h-5" strokeWidth={2.2} />
          )}
        </button>
      </div>
    </div>
  );
}

