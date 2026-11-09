'use client';

import { RANGES } from '@/lib/dashboard-summary';
import { useRange } from '@/context/RangeContext';
import { cn } from '@/lib/ui';

/** Segmented control: changes the period for every number and chart on the page. */
export default function RangeSelect() {
  const { days, setDays } = useRange();
  return (
    <div role="radiogroup" aria-label="Time period" className="inline-flex rounded-lg border border-[color:var(--border-strong)] bg-[color:var(--card-bg)] p-0.5">
      {RANGES.map((d) => {
        const active = d === days;
        return (
          <button
            key={d}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setDays(d)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-1',
              active
                ? 'bg-[color:var(--primary)] text-[color:var(--primary-contrast)]'
                : 'text-[color:var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[color:var(--foreground)]'
            )}
          >
            {d} days
          </button>
        );
      })}
    </div>
  );
}
