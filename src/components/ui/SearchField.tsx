'use client';

import { Search } from 'lucide-react';
import { ui, cn } from '@/lib/ui';

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
};

export default function SearchField({
  value,
  onChange,
  placeholder = 'Search…',
  className,
  id,
}: SearchFieldProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2',
        ui.radius.md,
        'border border-[color:var(--glass-border)] bg-[color:var(--card-bg)]',
        'px-3 py-2',
        ui.shadow.sm,
        'focus-within:border-[color:var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary-soft)]',
        'transition-[border-color,box-shadow]',
        className
      )}
    >
      <Search size={16} className="shrink-0 text-[color:var(--muted)]" aria-hidden />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full min-w-0 bg-transparent text-sm text-[color:var(--foreground)] outline-none',
          'placeholder:text-[color:var(--muted)]'
        )}
        aria-label={placeholder}
      />
    </div>
  );
}
