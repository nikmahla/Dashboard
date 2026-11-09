'use client';

import { useMemo, type ReactNode } from 'react';
import KpiChart from '@/components/KpiChart';
import { kpiColors, cn, type KpiColor } from '@/lib/ui';

type KpiCardProps = {
  label: string;
  value: number;
  icon: ReactNode;
  trend?: number[];
  /** Set false when there is no real history to draw. */
  showTrend?: boolean;
  color?: KpiColor;
  /** Text shown instead of the plain number, e.g. "$12,400". */
  valueText?: string;
  /** Small line under the number when there is no delta. */
  note?: string;
  /** Change versus the previous period. `tone` says whether that change is good or bad. */
  delta?: { pct: number | null; tone: 'good' | 'bad' | 'flat'; caption: string };
};

function buildFallbackTrend(base: number, points = 8): number[] {
  const out: number[] = [];
  const scale = Math.max(1, Math.round(Math.abs(base) / 50));

  for (let i = 0; i < points; i++) {
    const jitter = (Math.sin(i * 1.3) + 0.3) * scale;
    out.push(Math.max(0, Math.round(base - scale * 3 + jitter)));
  }

  return out;
}

const deltaTone = {
  good: 'text-[color:var(--success)]',
  bad: 'text-[color:var(--danger)]',
  flat: 'text-[color:var(--muted)]',
} as const;

export default function KpiCard({
  label,
  value,
  icon,
  trend,
  showTrend = true,
  color = 'purple',
  valueText,
  note,
  delta,
}: KpiCardProps) {
  const palette = kpiColors[color];
  const chartData = useMemo(
    () => (trend?.length ? trend : buildFallbackTrend(value)),
    [trend, value]
  );
  const shown = valueText ?? value.toLocaleString();

  return (
    <article aria-label={`${label}: ${shown}`} className="flex flex-col gap-5 p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-[color:var(--muted)]">
        <span className={cn('flex h-5 w-5 items-center justify-center', color === 'orange' ? 'text-[color:var(--warning)]' : 'text-[color:var(--muted)]')} aria-hidden>
          {icon}
        </span>
        {label}
      </div>

      <div>
        <div className="flex items-end justify-between gap-3">
          <p className={cn('text-3xl font-semibold leading-none tracking-tight tabular-nums', palette.value)}>
            {shown}
          </p>
          {showTrend && (
            <div className="h-9 w-24 shrink-0" aria-hidden>
              <KpiChart data={chartData} color={color} />
            </div>
          )}
        </div>
        <p className={cn('mt-2 min-h-4 text-xs font-medium', delta ? deltaTone[delta.tone] : 'text-[color:var(--muted)]')}>
          {delta ? (
            <>
              {delta.pct === null ? '—' : `${delta.pct > 0 ? '+' : ''}${delta.pct}%`}{' '}
              <span className="font-normal text-[color:var(--muted)]">{delta.caption}</span>
            </>
          ) : (
            <span className="font-normal">{note}</span>
          )}
        </p>
      </div>
    </article>
  );
}
