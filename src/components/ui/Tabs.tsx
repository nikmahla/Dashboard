'use client';

import { cn } from '@/lib/ui';

export type TabItem = { value: string; label: string; count?: number };

/** Underlined tabs with counters. Keyboard: arrow keys move between tabs. */
export default function Tabs({
  items,
  value,
  onChange,
  label,
}: {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  const move = (dir: 1 | -1) => {
    const i = items.findIndex((t) => t.value === value);
    onChange(items[(i + dir + items.length) % items.length].value);
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex gap-1 overflow-x-auto border-b border-[color:var(--border-default)]"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); move(1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); }
      }}
    >
      {items.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            type="button"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(t.value)}
            className={cn(
              '-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px]',
              active
                ? 'border-[color:var(--primary)] text-[color:var(--foreground)]'
                : 'border-transparent text-[color:var(--muted)] hover:text-[color:var(--foreground)]'
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span
                className={cn(
                  'rounded-md px-1.5 py-0.5 text-xs tabular-nums',
                  active ? 'bg-[var(--primary-soft)] text-[color:var(--primary)]' : 'bg-[var(--surface-hover)] text-[color:var(--muted)]'
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
