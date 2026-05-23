"use client";

import type { ReactNode } from "react";
import { X, AlertTriangle } from "lucide-react";

export type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  itemLabel?: string;
  details?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  description,
  itemLabel,
  details,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Center wrapper */}
      <div className="relative h-full w-full flex items-start sm:items-center justify-center p-4 sm:p-6">
        <div
          className="
            relative w-full max-w-sm rounded-2xl
            bg-[color:var(--card-bg)]
            border border-[color:var(--glass-border)]
            shadow-[0_16px_70px_rgba(0,0,0,0.45)]
            ring-1 ring-black/5 dark:ring-white/5
            overflow-hidden
            animate-scaleIn
          "
        >
          {/* Header */}
          <div
            className="px-5 py-4 border-b flex items-start justify-between gap-3"
            style={{ borderColor: "var(--glass-border)" }}
          >
            <div className="flex items-start gap-3">
              <span
                className="
                  mt-0.5 h-9 w-9 rounded-xl
                  flex items-center justify-center
                  bg-[color:var(--danger-soft)]
                  text-[color:var(--danger)]
                  shadow-sm
                "
                aria-hidden="true"
              >
                <AlertTriangle size={18} />
              </span>

              <div>
                <h3 className="text-base font-semibold text-[color:var(--foreground)] leading-snug">
                  {title}
                </h3>
                <p className="text-sm text-[color:var(--muted)] mt-1">
                  {description}
                </p>
              </div>
            </div>

            <button
              onClick={onCancel}
              className="
                p-2 rounded-xl
                text-[color:var(--muted)]
                hover:bg-[color:var(--primary-soft)]
                transition active:scale-95
              "
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          {(itemLabel || details) && (
            <div className="px-5 pt-4">
              <div
                className="
                  rounded-xl border border-[color:var(--glass-border)]
                  bg-[color:var(--primary-soft)]
                  p-3
                "
              >
                {itemLabel && (
                  <div className="text-sm text-[color:var(--foreground)]">
                    <span className="text-[color:var(--muted)]">User</span>
                    <span className="mx-2 text-[color:var(--muted)]">:</span>
                    <span className="font-semibold">{itemLabel}</span>
                  </div>
                )}

                {details && (
                  <div className="mt-2 text-sm text-[color:var(--foreground)] max-h-40 overflow-y-auto pr-1">
                    {details}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div
            className="px-5 py-4 mt-4 border-t flex justify-end gap-2"
            style={{ borderColor: "var(--glass-border)" }}
          >
            <button
              onClick={onCancel}
              className="
                px-4 py-2 rounded-xl
                border border-[color:var(--glass-border)]
                bg-[color:var(--card-bg)]
                text-[color:var(--foreground)] text-sm font-medium
                hover:bg-black/5 dark:hover:bg-white/10
                transition active:scale-95
              "
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="
                px-4 py-2 rounded-xl
                bg-[color:var(--danger)]
                text-white text-sm font-semibold
                shadow-sm
                hover:opacity-95 active:scale-95
                transition
              "
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
