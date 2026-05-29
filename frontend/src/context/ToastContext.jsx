import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success", duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Portal/Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 transform translate-y-0 animate-fade-in glass-panel ${
              toast.type === "success"
                ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-300"
                : toast.type === "error"
                ? "border-rose-500/30 bg-rose-950/20 text-rose-300"
                : toast.type === "warning"
                ? "border-amber-500/30 bg-amber-950/20 text-amber-300"
                : "border-blue-500/30 bg-blue-950/20 text-blue-300"
            }`}
          >
            {/* Icon */}
            <div className="shrink-0 mt-0.5">
              {toast.type === "success" && <CheckCircle size={18} className="text-emerald-400" />}
              {toast.type === "error" && <XCircle size={18} className="text-rose-400" />}
              {toast.type === "warning" && <AlertTriangle size={18} className="text-amber-400" />}
              {toast.type === "info" && <Info size={18} className="text-blue-400" />}
            </div>

            {/* Content */}
            <div className="flex-1 text-sm font-medium leading-relaxed leading-5">
              {toast.message}
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-0.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
