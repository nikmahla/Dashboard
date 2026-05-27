'use client';

import { type ReactNode } from 'react';
import { X } from 'lucide-react';
import { ui, cn } from '@/lib/ui';

export type ModalProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
};

const sizeClass = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export default function Modal({
  open,
  title,
  subtitle,
  onClose,
  icon,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[color:var(--overlay)] backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close dialog"
      />

      <div className="relative flex h-full w-full items-start justify-center p-4 sm:items-center sm:p-6">
        <div
          className={cn(
            'relative w-full animate-scaleIn overflow-hidden',
            ui.radius.lg,
            'border border-[color:var(--glass-border)] bg-[color:var(--card-bg)]',
            'shadow-[0_16px_70px_rgba(0,0,0,0.25)] ring-1 ring-black/5 dark:ring-white/5',
            sizeClass[size]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-b border-[color:var(--glass-border)] px-5 py-4 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                {icon && (
                  <span
                    className={cn(
                      'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center',
                      ui.radius.md,
                      'bg-[var(--primary-soft)] text-[color:var(--primary)]'
                    )}
                    aria-hidden
                  >
                    {icon}
                  </span>
                )}
                <div className="min-w-0">
                  <h2
                    id="modal-title"
                    className={ui.typography.sectionTitle}
                  >
                    {title}
                  </h2>
                  {subtitle && (
                    <p className={`mt-1 ${ui.typography.caption}`}>{subtitle}</p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className={cn(
                  'shrink-0 p-2 text-[color:var(--muted)] transition-colors',
                  ui.radius.md,
                  'hover:bg-[var(--primary-soft)] hover:text-[color:var(--foreground)]',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]'
                )}
                aria-label="Close"
              >
                <X size={18} aria-hidden />
              </button>
            </div>

            <div
              className="mt-4 h-px w-full bg-gradient-to-r from-[color:var(--primary)]/40 via-[color:var(--glass-border)] to-transparent"
              aria-hidden
            />
          </div>

          <div className="max-h-[min(70vh,520px)] overflow-y-auto px-5 py-5 text-sm text-[color:var(--foreground)] sm:px-6">
            {children}
          </div>

          {footer && (
            <div className="border-t border-[color:var(--glass-border)] px-5 py-4 sm:px-6">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
