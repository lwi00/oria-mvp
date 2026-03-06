"use client";

import { createContext, useContext, useState, useCallback } from "react";

type ToastType = "success" | "error";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toast: () => {},
});

export const useToast = () => useContext(ToastContext);

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 w-[360px] max-w-[90vw]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-lg shadow-card-hover text-sm font-medium backdrop-blur-xl animate-[slideDown_0.3s_ease-out] ${
              t.type === "error"
                ? "bg-red-50/90 text-error-500 border border-red-200"
                : "bg-white/90 text-purple-600 border border-purple-200"
            }`}
          >
            {t.type === "error" ? "✕ " : "✓ "}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
