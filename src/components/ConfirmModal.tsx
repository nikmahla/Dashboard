'use client';

import { type ReactNode } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { ui, cn } from '@/lib/ui';

export type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  /** Label prefix for the item, e.g. "Product", "Order", "Customer" */
  entityLabel?: string;
  itemName?: string;
  details?: ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  description,
  entityLabel = 'Item',
  itemName,
  details,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60]"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[color:var(--overlay)] backdrop-blur-sm"
        onClick={onCancel}
        aria-label="Cancel"
      />

      <div className="relative flex h-full w-full items-start justify-center p-4 sm:items-center sm:p-6">
        <div
          className={cn(
            'relative w-full max-w-md animate-scaleIn overflow-hidden',
            ui.radius.lg,
            'border border-[color:var(--border-subtle)] bg-[color:var(--card-bg)]',
            'shadow-[var(--shadow-xl)]'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-b border-[color:var(--border-muted)] px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center',
                    ui.radius.md,
                    'bg-[var(--danger-soft)] text-[color:var(--danger)]'
                  )}
                  aria-hidden
                >
                  <AlertTriangle size={18} />
                </span>
                <div>
                  <h2 id="confirm-title" className={ui.typography.sectionTitle}>
                    {title}
                  </h2>
                  <p id="confirm-desc" className={`mt-1 ${ui.typography.caption}`}>
                    {description}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCancel}
                className={cn(
                  'p-2 text-[color:var(--muted)] transition-colors',
                  ui.radius.md,
                  'hover:bg-[var(--primary-soft)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]'
                )}
                aria-label="Close"
              >
                <X size={18} aria-hidden />
              </button>
            </div>
            <div
              className="mt-4 h-px w-full bg-gradient-to-r from-[color:var(--danger)]/35 via-[color:var(--border-muted)] to-transparent"
              aria-hidden
            />
          </div>

          {(itemName || details) && (
            <div className="px-5 pt-4">
              <div
                className={cn(
                  ui.radius.md,
                  'border border-[color:var(--border-muted)] bg-[var(--primary-soft)] p-3 shadow-[var(--shadow-xs)]'
                )}
              >
                {itemName && (
                  <p className="text-sm text-[color:var(--foreground)]">
                    <span className="text-[color:var(--muted)]">{entityLabel}</span>
                    <span className="mx-2 text-[color:var(--muted)]">·</span>
                    <span className="font-semibold">{itemName}</span>
                  </p>
                )}
                {details && (
                  <div className="mt-2 max-h-40 overflow-y-auto text-sm text-[color:var(--foreground)]">
                    {details}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-[color:var(--border-muted)] px-5 py-4 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className={cn(
                'px-4 py-2 text-sm font-medium text-[color:var(--foreground)] transition-colors',
                ui.radius.md,
                'border border-[color:var(--border-muted)] bg-[color:var(--card-bg)]',
                'hover:bg-[var(--primary-soft)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]'
              )}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={cn(
                'px-4 py-2 text-sm font-semibold text-white transition-opacity',
                ui.radius.md,
                'bg-[color:var(--danger)] hover:opacity-95 active:scale-[0.98]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--danger)]'
              )}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
