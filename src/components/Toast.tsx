"use client";

import { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

type ToastProps = {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
};

export default function Toast({
  message,
  type = "success",
  onClose,
  duration = 4000,
}: ToastProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timeoutId);
  }, [onClose, duration]);

  const base = "px-4 py-2 rounded shadow-md text-sm text-white";
  const variant =
    type === "error"
      ? "bg-[var(--support-b)]"
      : type === "success"
      ? "bg-[var(--teal)]"
      : "bg-[var(--primary-2)]";

  return <div className={`${base} ${variant}`}>{message}</div>;
}
