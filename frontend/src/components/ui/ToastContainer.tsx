import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import Toast, { type ToastProps, type ToastType } from './Toast';

interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let nextId = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Omit<ToastProps, 'onClose'>[]>([]);

  const showToast = useCallback((type: ToastType, title: string, message?: string, duration = 5000) => {
    const id = `toast-${nextId++}`;
    setToasts(prev => [...prev, { id, type, title, message, duration }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div 
        aria-live="assertive" 
        className="pointer-events-none fixed inset-0 z-[100] flex flex-col items-end px-4 py-6 sm:items-end sm:p-6 gap-2"
      >
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
