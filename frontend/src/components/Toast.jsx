import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none no-print">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-lg border text-sm backdrop-blur-md shadow-elevated-card animate-slide-up transition-all duration-300"
            style={{
              backgroundColor: 'rgba(19, 25, 35, 0.95)',
              borderColor:
                toast.type === 'success'
                  ? 'rgba(74, 222, 128, 0.25)'
                  : toast.type === 'error'
                  ? 'rgba(248, 113, 113, 0.25)'
                  : 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-accent-sage shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-accent-rose shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-accent-cyan shrink-0" />}
              <span className="text-slate-200 text-xs font-medium leading-relaxed">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
