import React, { createContext, useContext } from 'react';

const NOOP = () => null;
const TOAST_CONTEXT_VALUE = { addToast: NOOP, removeToast: NOOP };

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  return (
    <ToastContext.Provider value={TOAST_CONTEXT_VALUE}>
      {children}
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
