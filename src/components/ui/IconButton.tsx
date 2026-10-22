'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { ui, cn } from '@/lib/ui';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'default' | 'ghost';
  badge?: number;
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, variant = 'default', badge, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        'relative inline-flex h-10 w-10 shrink-0 items-center justify-center',
        ui.radius.md,
        'text-[color:var(--foreground)] transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variant === 'default' &&
          'border border-[color:var(--glass-border)] bg-[color:var(--card-bg)] shadow-sm hover:bg-[var(--primary-soft)] active:scale-[0.98]',
        variant === 'ghost' && 'hover:bg-[var(--primary-soft)] active:scale-[0.98]',
        className
      )}
      {...props}
    >
      {children}
      {badge != null && badge > 0 && (
        <span
          className={cn(
            'absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center px-1',
            ui.radius.full,
            'text-[10px] font-semibold text-white bg-[color:var(--danger)]'
          )}
          aria-hidden
        >
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  )
);

IconButton.displayName = 'IconButton';

export default IconButton;
