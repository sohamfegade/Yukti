import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
  error: <XCircle className="w-5 h-5 text-red-400" />,
  warning: <AlertCircle className="w-5 h-5 text-amber-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />
};

const bgColors = {
  success: 'bg-emerald-950/80 border-emerald-800',
  error: 'bg-red-950/80 border-red-800',
  warning: 'bg-amber-950/80 border-amber-800',
  info: 'bg-blue-950/80 border-blue-800'
};

const Toast: React.FC<ToastProps> = ({ id, type, title, message, duration = 5000, onClose }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <div className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg backdrop-blur-md ${bgColors[type]} transition-all duration-300 transform translate-y-0 opacity-100`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {icons[type]}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-slate-100">{title}</p>
            {message && <p className="mt-1 text-sm text-slate-300">{message}</p>}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className="inline-flex rounded-md text-slate-400 hover:text-slate-300 focus:outline-none"
              onClick={() => onClose(id)}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
