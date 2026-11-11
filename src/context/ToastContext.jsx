import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ message, title, type = 'info', duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, title, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast container floating at top right */}
      <div className="fixed top-4 right-4 sm:top-5 sm:right-5 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100%-2rem)] sm:w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto transform transition-all duration-300 ease-out translate-y-0 opacity-100 flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl shadow-glass border backdrop-blur-xl ${
              toast.type === 'success'
                ? 'bg-white/95 border-blue-200 text-blue-950'
                : toast.type === 'error'
                ? 'bg-rose-50/95 border-rose-200 text-rose-950'
                : toast.type === 'warning'
                ? 'bg-blue-50/95 border-blue-300 text-blue-950'
                : 'bg-white/95 border-blue-200 text-blue-950'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-blue-600" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
            </div>
            <div className="flex-1 text-xs sm:text-sm">
              {toast.title && <p className="font-bold text-blue-950">{toast.title}</p>}
              <p className={toast.title ? 'text-xs mt-0.5 text-slate-600' : 'font-semibold text-slate-700'}>{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 rounded-lg opacity-60 hover:opacity-100 hover:bg-blue-50 text-slate-500 transition-all"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
