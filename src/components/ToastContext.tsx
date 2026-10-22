"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import Toast, { type ToastType } from "@/components/Toast";

type ToastItem = {
  id: number;
  type?: ToastType;
  message: string;
};

type ToastContextValue = {
  notify: (t: Omit<ToastItem, "id">) => void;
};

const ToastCtx = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const close = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback((t: Omit<ToastItem, "id">) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...t }]);

    // backup auto close
    window.setTimeout(() => close(id), 4100);
  }, [close]);

  // ✅ important: stable context value (prevents extra re-renders / refetches)
  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastCtx.Provider value={value}>
      {children}

      <div className="fixed bottom-6 right-6 left-6 sm:left-auto z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onClose={() => close(t.id)}
            duration={4000}
          />
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
