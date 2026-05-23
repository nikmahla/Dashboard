"use client";

import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
};

export default function Modal({ open, title, onClose, icon, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="
          absolute inset-0
          bg-black/50
          backdrop-blur-sm
        "
        onClick={onClose}
      />

      {/* Center wrapper (better spacing on mobile) */}
      <div className="relative h-full w-full flex items-start sm:items-center justify-center p-4 sm:p-6">
        <div
          className="
            relative w-full max-w-lg
            rounded-2xl overflow-hidden
            bg-[color:var(--card-bg)]
            border border-[color:var(--glass-border)]
            shadow-[0_16px_70px_rgba(0,0,0,0.45)]
            ring-1 ring-black/5 dark:ring-white/5
            animate-scaleIn
          "
        >
          {/* Header */}
          <div
            className="
              px-6 py-4
              flex items-start justify-between gap-4
              border-b
              bg-[color:var(--card-bg)]
            "
            style={{ borderColor: "var(--glass-border)" }}
          >
            <div className="flex items-start gap-3">
              {icon && (
                <span
                  className="
                    mt-0.5
                    h-9 w-9 rounded-xl
                    flex items-center justify-center
                    bg-[color:var(--primary-soft)]
                    text-[color:var(--primary)]
                    shadow-sm
                  "
                >
                  {icon}
                </span>
              )}

              <div>
                <h3 className="text-base font-semibold tracking-tight text-[color:var(--foreground)]">
                  {title}
                </h3>

                {/* subtle line (looks more product UI) */}
                <p className="mt-1 text-xs text-[color:var(--muted)]">
                  Manage details carefully. Changes apply immediately.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
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

          {/* Body (better spacing + safe scroll on small screens) */}
          <div className="px-6 py-5 text-sm text-[color:var(--foreground)] max-h-[70vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
